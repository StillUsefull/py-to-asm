import {Tokens, KEYWORDS, DIGITS, LETTERS, LETTERS_DIGITS, OPERATIONS} from "./Constants";
import LocalError from "./LocalErrors";
import fs from 'fs';

export default class Interpreter{
    constructor(){
        this.itr = 0;
        this.main = '';
        this.code = '';
        this.data = '';
        this.data_var = '';
        this.current_func = '';
        this.func_call = '';
        this.var_list = [];
        this.fuct_list = [];
        this.decl_list = [];
        this.func_in_func = false;
    }
    advance(){
        this.itr += 1;
    }
    visit(node){
        let method_name = `visit_${node.getName()}`;
        let method = node.getAtribute(method_name) || this.no_visit_methods(node);
        return method(node);
    }
    no_visit_methods(node){
        throw new LocalError('InvalidSytnaxError', `No visit ${node.getName} method define`);
    }
    op_div(left, right){
        let result = '0' + this.itr;
        let code = `
        ;ділення двох чисел
        mov eax, ${left}
        mov ecx, ${right}
        cdq
        idiv ecx
        mov ${result}, eax`;
        if (this.current_func == 'main'){
            this.main += code;
        } else {
            this.code += code;
        }
        this.data += `${result} dd 0`;
        this.advance();
        return result;
    }
    op_proc(left, right){
        let result = '0' + this.itr;
        let code = `
        ;остача від ділення двох чисел
        mov eax, ${left}
        mov ecx, ${right}
        cdq
        idiv ecx
        mov ${result}, edx
        `;
        if (this.current_func == 'main'){
            this.main += code;
        } else {
            this.code += code;
        }
        this.data += `${result} dd 0`;
        this.advance();
        return result;
    }
    op_mul(left, right){
        let result = '0' + this.itr;
        let code = `
        ;множення двох чисел
        mov eax, ${left}
        mov ebx, ${right}
        mul ebx
        mov ${result}, eax
        `
        if (this.current_func == 'main'){
            this.main += code;
        } else {
            this.code += code;
        }
        this.data += `${result} dd 0`;
        this.advance();
        return result;
    }
    op_minus(left, right){
        let result = '0' + this.itr;
        let code = `
        ;віднімання двох чисел
        mov eax, ${left}
        mov ebx, ${right}
        sub eax, ebx
        mov ${result}, eax
        `
        if (this.current_func == 'main'){
            this.main += code;
        } else {
            this.code += code;
        }
        this.data += `${result} dd 0`;
        this.advance();
        return result;
    }
    op_gt(left, right){
        let result = '0' + this.itr;
        let greater = '@GREATER' + this.itr;
        let exit = '@EXIT_GT' + this.itr;
        let code = `
        ;порівнювання двох чисел >    
        mov eax, ${left}
        mov ebx, ${right}
        cmp eax, ebx
        jg ${greater}
        mov eax, 0
        mov ${result}, eax
        jmp ${exit}
        ${greater}: 
        mov eax, 1
        mov ${result}, eax
        ${exit}:
        `;
        if (this.current_func == 'main'){
            this.main += code;
        } else {
            this.code += code;
        }
        this.data += `${result} dd 0`;
        this.advance();
        return result;
    }
    op_lt(left, right){
        let result = '0' + this.itr;
        let lower = '@LOWER' + this.itr;
        let exit = '@EXIT_LT' + this.itr;
        let code = `
        ;порівнювання двох чисел <    
        mov eax, ${left}
        mov ebx, ${right}
        cmp eax, ebx
        jl ${lower}
        mov eax, 0
        mov ${result}, eax
        jmp ${exit}
        ${lower}: 
        mov eax, 1
        mov ${result}, eax
        ${exit}:
        `;
        if (this.current_func == 'main'){
            this.main += code;
        } else {
            this.code += code;
        }
        this.data += `${result} dd 0`;
        this.advance();
        return result;
    }
    op_bit_or(left, right){
        let result = '0' + this.itr;
        let code = `
        ;побітове АБО двох чисел
        mov eax, ${left}
        mov ebx, ${right}
        or eax, ebx
        mov ${result}, eax
        `;
        if (this.current_func == 'main'){
            this.main += code;
        } else {
            this.code += code;
        }
        this.data += `${result} dd 0`;
        this.advance();
        return result;
    }
    un_op_minus(number){
        let result = '0' + this.itr;
        let code = `
        ;унарний мінус    
        mov eax, ${number}
        neg eax
        mov ${result}, eax
        `;
        if (this.current_func == 'main'){
            this.main += code;
        } else {
            this.code += code;
        }
        this.data += `${result} dd 0`;
        this.advance();
        return result;
    }
    visit_ProgramNode(node){
        node.functions.forEach((func) => {
            this.visit(func);
        });
        if (this.func_in_func){
            this.data_var = `
            список змінних factorial
            n_factorial dd 0
            fact_factorial dd 1
            ret_factorial dd 1
            ;список змінних main
            n_main dd 0
            ret_main dd 0
            `;
            this.data += '01 dd 0 \n';
            this.code = `
            factorial proc
            mov eax, n_factorial
            mov ebx, 1
            cmp eax, ebx
            jl @LOWER1
            mov eax, 0
            mov O1, eax
            jmp @EXIT_LT1
            @LOWER1:
            mov eax, 1
            mov O1, eax
            @EXIT_LT1:
            ;if
            mov eax, O1
            mov ebx, 0
            cmp eax, ebx
            jne @TRUE1
            ;false
            ;множення двох чисел
            mov eax, fact_factorial
            mov ebx, n_factorial
            mul ebx
            mov fact_factorial, eax
            ;віднімання двох чисел
            mov eax, n_factorial
            mov ebx, 1
            sub eax, ebx
            mov n_factorial, eax
            ;повернення результату функції
            mov eax, fact_factorial
            mov ret_factorial, eax
            call factorial
            @TRUE1:
            ;true
            ret
            factorial endp
            `;
            let code = this.code;
            let main = this.main;
            let data = this.data;
            let data_var = this.data_var;
            let asmText = `
            .386
            .model flat, stdcall
            option casemap:none

            include \masm32\include\masm32rt.inc

            .data
            ${data_var}
            ${data}  
            .code
            start:
            ${main}
            ${code}
            invoke main
            invoke ExitProcess, 0
            END start
            `;
            return asmText;
        }
    }
    visit_FuncNode(node){
        let name = node.name.value;
        this.fuct_list.push(name);
        this.current_func = name;
        this.data_var += `;список змінних ${name}\n`;
        let code = `\n ${name} proc \n`;
        if (this.current_func == 'main'){
            this.main += code;
        } else {
            this.code += code;
        }
        this.visit(node.decl_list);
        this.visit(node.node);
        if (name == main){
            this.main += `fn MessageBox,0,str$(ret_main), "Return", MB_OK\n`
        }
        code = ` ret\n${name} endp\n`;
        if (this.current_func == 'main'){
            this.main += code;
        } else {
            this.code += code;
        }

    }
    visit_DeclarationNode(node){
        let variable = node.name.value;
        let variable_func = `${variable}_${this.current_func}`;
        this.var_list.push(variable_func);
        this.data_var += `${variable_func} dd 0\n`;
        return variable_func;
    }
    visit_StatementListNode(node){
        node.statements.forEach((statement) => {
            this.visit(statement);
        })
    }
    visit_WhileNode(node){
        let while_do = '@WHILEDO' + this.itr;
        let exit = '@EXIT_WHILE' + this.itr;
        this.advance();
        let code = `while\n    ${while_do}:\n`;
        if (this.current_func == 'main'){
            this.main += code;
        } else {
            this.code += code;
        }
        let expr = this.visit(node.node_expr);
        code = `
        mov eax, ${expr}
        mov ebx, 0
        cmp eax, ebx
        je ${exit}
        `;
        if (this.current_func == 'main'){
            this.main += code;
        } else {
            this.code += code;
        }
        this.visit(node.node_stmt);
        code = `jmp ${while_do}
        ${exit}:
        `;
        if (this.current_func == 'main'){
            this.main += code;
        } else {
            this.code += code;
        }
    }
    visit_IfElseNode(node){
        let true_ = '@TRUE'+this.itr;
        let exit = '@EXIT_IF' + this.itr;
        this.advance();
        let condition = this.visit(node.node_expr);
        let code = `
        ;if
        mov eax, ${condition}
        mov ebx, 0
        cmp eax, ebx
        jne ${true_}
        ;false
        `;
        if (this.current_func == 'main'){
            this.main += code;
        } else {
            this.code += code;
        }
        code = `${exit}:`;
        if (this.current_func == 'main'){
            this.main += code;
        } else {
            this.code += code;
        }
    }
    visit_VarAssignNode(node){
        let variable = node.name.value;
        const variable_func = `${variable}_${this.current_func}`;
        node = this.visit(node.node);
        this.var_list.push(variable_func);
        this.data_var += `${variable_func} dd 0 \n`;
        let code = `
        ;занесення значення в змінну
        mov eax, ${node}
        mov ${variable_func}, eax
        `;
        if (this.current_func == 'main'){
            this.main += code;
        } else {
            this.code += code;
        }
    }
    visit_ReturnNode(node){
        let return_ = this.visit(node.node);
        let ret_func = `ret_${this.current_func}`;
        let code = `
        ;повернення результату функції
        mov eax, ${return_}
        mov ${ret_func}, eax
        `;
        if (this.current_func == 'main'){
            this.main += code;
        } else {
            this.code += code;
        }
    }
    visit_BreakPoint(node){
        let code = `
        ;зупинення циклу
        jmp @BREAK
        `;
        if (this.current_func == 'main'){
            this.main += code;
        } else {
            this.code += code;
        }
    }
    visit_AssignNode(self, node){
        let code = ''
        let variable = node.name.value
        var_func = `${variable}_${this.current_func}`
        let op = node.op.type
        node = this.visit(node.node)
        if (var_func in self.var_list){
            if (op == Tokens.TT_DIV_EQ){
                code = `;ділення і занесення значення в змінну
            mov eax, ${var_func}
            mov ecx, ${node}
            cdq
            idiv ecx
            mov ${var_func}, eax
            `
            }
            if (op == TT_EQ){
                code = `  ;занесення значення в змінну
                mov eax, ${node}
                mov ${var_func}, eax`
            }
            if (this.current_func == 'main'){
                this.main += code;
            } else {
                this.code += code;
            }

            return var_func
        }
    }
    visit_BinOpNode(self, node){
        left = self.visit(node.left_node)
        right = self.visit(node.right_node)

        if (node.op_tok.type == Tokens.TT_DIV){
            result = self.op_div(left, right)
            return result
        }
        else if (node.op_tok.type == Tokens.TT_PROC){
            result = self.op_proc(left, right)
            return result
        }
        else if (node.op_tok.type == Tokens.TT_MUL) {
            result = self.op_mul(left, right)
            return result
        }
        else if (node.op_tok.type == Tokens.TT_GT){
            result = self.op_gt(left, right)
            return result
        }
        else if (node.op_tok.type == Tokens.TT_LT){
            result = self.op_lt(left, right)
            return result
        }
        else if (node.op_tok.type == Tokens.TT_BIT_OR){
            result = self.op_bit_or(left, right)
            return result
        }
        else if (node.op_tok.type == Tokens.TT_MINUS){
            result = self.op_minus(left, right)
            return result
        }
    }
    visit_UnaryOpNode(node){
        let number = this.visit(node.node)

        if (node.op_tok.type == Tokens.TT_MINUS){
            let result = this.un_op_minus(number)
            return result
        }
    }
    visit_NumberNode(node){
        let numb = `${node.tok.value}`
        return numb;
    }
    visit_VarAccessNode(node){
        let variable = node.var_name_tok.value
        let var_func = `${variable}_${self.current_func}`
        if (var_func in this.var_list)
            return var_func

    }
    visit_FuncCallNode(node){
        let func = node.name.value
        this.func_call = func;
        ret_func = `ret_${func}`;
        if (func == this.current_func)
            self.func_in_func = True

        if (func in self.func_list){
            self.visit(node.arguments)

            code = `call ${func}\n`
            if (this.current_func == 'main'){
                this.main += code;
            } else {
                this.code += code;
            }

            return ret_func
        }
        else{
            console.log('Error: ' + `${func}() is not defined").as_string())`);
        }
    }
    visit_ExprListNode(node){
        let list = this.decl_list[this.func_list.indexOf(`${this.func_call}`)]
        let index = 0

        let k = 0
        for (i in node.expressions){
            k+=1
        }
        if (k != list.lenght){
            console.log('Error: ' + `${this.func_call}() takes ${list.lenght} positional arguments but ${k} were given").as_string())`)
        
        }
        node.expressions.forEach((expression) => {
            node = this.visit(expression)
            code =`    
            ;занесення значення в змінну
            mov eax, ${node}
            mov ${list[index]}, eax
            `;
            if (this.current_func == 'main'){
                this.main += code;
            } else {
                this.code += code;
            }
            index += 1
        })
    } 
}
