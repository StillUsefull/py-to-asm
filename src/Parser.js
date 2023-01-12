import { Tokens } from "./Constants";
import LocalError from "./LocalErrors";
import { BinOpNode, FunctionNode, StatementListNode, DeclaretionNode, 
    DoWhileNode, WhileNode, IfElseNode,VarAssignNode, VarAssignNullNode, ReturnNode, 
    BreakNode,AssignNode, TerneryNode, UnarOpNode, NumberNode, AccessNode,
    FunctionCallNode, ExpressionListNode } from "./Nodes";

export class ParserResult {
    constructor(){
        this.errors = null;
        this.node = null;
    }
    register(result){
        if (result instanceof ParserResult){
            if (result.errors){
                this.errors = result.errors;
            }
            return result.node;
        }
        return result;
    }
    setSuccess(node){
        this.node = node;
    }
    setFailure(error){
        this.errors = error;
        return this;
    }
}

export class Parser {
    constructor(tokens){
        this.tokens = tokens;
        this.tokenIndex = -1;
        this.currentToken = null;
    }
    advance(){
        this.tokenIndex += 1;
        if (this.tokenIndex < this.tokens.lenght){
            this.currentToken = this.tokens[this.tokenIndex];
        }
        return this.currentToken;
    }
    retreat(){
        this.tokenIndex -= 1;
        if (this.tokenIndex > 0){
            this.currentToken = this.tokens[this.currentToken];
        }
        return this.currentToken;
    }
    program(){
        const result = new ParserResult();
        functionsList = [];
        while (this.currentToken.type != Tokens.TT_EOF){
            let func = result.register(this.func());
            if (result.errors) {
                return result;
            }
            functionsList.push(func);
        }
    }
    parse(){
        let result = this.program();
        if (!result.errors && this.currentToken.type != Tokens.TT_EOF){
            return result.setFailure(new LocalError('InvalidSyntaxError', 'Error'));
        }
        return result;
    }
    func(){
        let type;
        let value;
        let result = new ParserResult();
        if (this.current_tok.type == Tokens.TT_IDENTIFIER){
            value = this.current_tok
            result.register(this.advance())
        } else {
            return result.failure(new LocalError('InvalidSyntaxError', 'Expected identefier'))
        }
        if (this.current_tok.type == Tokens.TT_LPAREN){
            result.register(this.advance())
        } else {
            return result.failure(new LocalError('InvalidSyntaxError',"Expected '('"))
        }
        let decl_list = res.register(this.decl_list())
        if (result.error) return res;
        if (this.current_tok.type == Tokens.TT_RPAREN){
            result.register(this.advance())
        }
        else {
            return result.failure(new LocalError('InvalidSyntaxError',"Expected ')' or type"))
        }
        if (this.current_tok.type == Tokens.TT_LBLOCK)
            result.register(this.advance())
        
        let stmt_list = result.register(this.stmt_list())
        if (result.error) return result;

        if (this.current_tok.type == Tokens.TT_RBLOCK){
            result.register(this.advance())
            return result.success(new FunctionNode(type, decl_list, value_of_func, stmt_list))
        }
    }
    decl_list(){
        let result = new ParserResult();
        this.decl_list = [];
        if (this.currentToken.type == Tokens.TT_INT_NUMBER && this.currentToken.type == Tokens.TT_FLOAT_NUMBER){
            type = this.currentToken;
            result.register(this.advance());
            if (this.currentToken.type == Tokens.TT_IDENTIFIER){
                let ID = this.currentToken;
                result.register(this.advance());
                return result.setSuccess(new DeclaretionNode(type, ID));
            } 
            else {
                return result.setFailure(new LocalError('InvalidSyntaxError', 'Expected identifier'));
            }
        }
        else {
            return result.setFailure(new LocalError('InvalidSyntaxError', 'Exprected type'));
        }
    }
    statementList(){
        let result = new ParserResult();
        let statementList = [];
        while (this.currentToken.type != Tokens.TT_RBLOCK){
            let statement = result.register(this.statement());
            if (result.errors) return result;
            statementList.push(statement);
        }
        return result.success(new StatementListNode(statementList));
    }
    statement(){
        let statementList = [];
        let expression;
        let result = new ParserResult();
        if (this.currentToken.type == Tokens.TT_KEYWORD && this.currentToken.value == 'return'){
            result.register(this.advance());
            let exp = result.register(this.expression());
            if (res.errors) return result;
            return result.setSuccess(new ReturnNode(exp));
        }

        if (this.currentToken.type == Tokens.TT_KEYWORD && this.currentToken.value == 'do'){
            result.register(this.advance());
            if (this.currentToken.type == Tokens.TT_LBLOCK){
                result.register(this.advance());
                statementList = result.register(this.statementList());
                if (res.errors) return result;
                if (this.currentToken.type == Tokens.TT_KEYWORD && this.currentToken.value == 'while'){
                    result.register(this.advance());
                    expression = result.register(this.cond_expr());
                    if (result.errors) return result;
                    result.setSuccess(new DoWhileNode(statementList, expression))
                }
            }
            else {
                return result.register(new LocalError('InvalidSyntaxError', 'Expected value while'));
            }
        } else {
            return result.register(new LocalError('InvalidSyntaxError', 'Expected block'))
        }
        if (this.currentToken.type == Tokens.TT_KEYWORD && this.currentToken.value == 'if'){
            result.register(this.advance());
            expression = result.register(this.cond_expr());
            if (result.errors) return result;
            if (this.currentToken.type = Tokens.TT_LBLOCK){
                result.register(this.advance());
                let statement_of_if = result.register(this.statementList());
                if (result.errors) return result;
                if (this.currentToken.type == Tokens.TT_RBLOCK){
                    result.register(this.advance());
                    if (this.currentToken.type == Tokens.TT_KEYWORD && this.currentToken.value == 'else'){
                        result.register(this.advance())
                        if (result.errors) return result;
                        if (this.currentToken.type == Tokens.TT_LBLOCK){
                            result.register(this.advance())
                            let stmt_list_else = result.register(this.statementList());
                            if (result.errors) return result;
                            if (this.currentToken.type == Tokens.TT_RBLOCK){
                                return result.setSuccess(new IfElseNode(expression, statement_of_if, stmt_list_else));
                            }
                        }
                    }
                    else {
                        return result.setFailure(new LocalError('InvalidSyntaxError', 'Expected else'))
                    }
                }
            }
        }

        if (this.currentToken.type == Tokens.TT_KEYWORD && this.currentToken.value == 'while'){
            result.register(this.advance());
            let expression = result.register(this.cond_expr());
            if (result.errors) return result;
            if (this.currentToken.type == Tokens.TT_LBLOCK){
                result.register(this.advance());
                let statementList = result.register(this.statementList());
                if (result.errors) return result;
                if (this.currentToken.type == Tokens.TT_RBLOCK){
                    return result.setSuccess(new WhileNode(expression, statementList));
                }
            }
        }
        if (this.currentToken.type == Tokens.TT_KEYWORD && this.currentToken.value == 'break'){
            return result.setSuccess(new BreakNode());
        }
        if (this.currentToken.type == Tokens.TT_INT_NUMBER){
            let ID = this.currentToken.value;
            result.register(this.advance());
            if (this.currentToken.type == Tokens.TT_EQ){
                result.register(this.advance());
                let expression = result.register(this.cond_expr());
                if (result.errors) return result;
                return result.setSuccess(new VarAssignNode('int', ID, expression));
            } else {
                return result.register(new LocalError('InvalidSyntaxError', `Expected '='`));
            }

        }
        else {
            let expression = result.register(this.expression());
            return result.setSuccess(expression);
        }
        

    }
    expressionList(){
        let result = new ParserResult();
        let expressionList = [];
        if (this.currentToken.type != Tokens.TT_RPAREN){
            let expression = result.register(this.expression());
            if (result.errors) return result;
            expressionList.push(expression);
            while (this.currentToken.type == TT_COMMA){
                result.register(this.advance());
                expression = result.register(this.expression());
                if (result.errors) return result;
                expressionList.push(expression);
            }
        }
        return result.setSuccess(new ExpressionListNode(expressionList));
    }
    expression(){
        let result = new ParserResult();
        if (this.currentToken.type == Tokens.TT_INT_NUMBER){
            let ID = this.currentToken.value;
            result.register(this.advance());
            if (this.currentToken.type == Tokens.TT_EQ){
                let op = this.currentToken;
                result.register(this.advance());
                let expression = result.register(this.expression());
                if (result.errors) return result;
                return result.setSuccess(new AssignNode(ID, op, expression))
            }
            else {
                result.register(this.retreat());
                let cond_expr = result.register(this.cond_expr());
                if (result.errors) return result;
                return result.setSuccess(cond_expr)
            }
        } else {
            result.register(this.retreat());
            let cond_expr = result.register(this.cond_expr());
            if (result.errors) return result;
            return result.setSuccess(cond_expr)
        }
    }
    cond_expr(){
        let result = new ParserResult();
        let bit_or = result.register(this.bit_or());
        if (result.errors) return result;
        if (this.currentToken.type = Tokens.TT_QM){
            result.register(this.advance());
            let firstExp = result.register(this.expression());
            if (result.errors) return result;
            if (this.currentToken.type == Tokens.TT_COLON){
                result.register(this.advance());
                let secondExp = result.register(this.expression());
                if (result.errors) return result;
                return result.setSuccess(new TerneryNode(bit_or, firstExp, secondExp));
            }
            else {
                return result.failure(new LocalError('InvalidSyntaxError', 'Expected :'));
            }
        } else {
            return result.setSuccess(bit_or);
        }
    }
    bit_or(){
        return this.bin_op(this.not_equas, Tokens.TT_BIT_OR);
    }
    not_equas(){
        return this.bin_op(this.add, [Tokens.TT_GT, Tokens.TT_LT]);
    }
    add(){
        return this.bin_op(this.term, Tokens.TT_MINUS);
    }
    term(){
        return this.bin_op(this.factor, [Tokens.TT_DIV, Tokens.TT_MUL, Tokens.TT_PROC]);
    }

    factor(){
        let result = new ParserResult();
        let token = this.currentToken;
        if (token.type == Tokens.TT_MINUS){
            result.register(this.advance());
            let factor = result.register(this.factor());
            if (result.errors) return result;
            return result.setSuccess(new UnarOpNode(token, factor));
        }
        else if (token.type == Tokens.TT_INT_NUMBER){
            result.register(this.advance());
            return result.setSuccess(new NumberNode(tok));
        }
        else if (token.type == Tokens.TT_IDENTIFIER){
            result.register(this.advance());
            if (this.currentToken.type == Tokens.TT_LPAREN){
                let expressionList = result.register(this.expressionList());
                if (result.errors) return result; 
                if (this.currentToken.type == Tokens.TT_RPAREN){
                    result.register(this.advance());
                    return result.setSuccess(new FunctionCallNode(token, expressionList));
                } else {
                    return result.setFailure(new LocalError('InvalidSyntaxError', `Expected ')'`))
                }
        
            }
            return result.setSuccess(new AccessNode(tok));
        }
        else if (token.type == Tokens.TT_INVALID_NUMBER){
            return result.setFailure(new LocalError('InvalidSyntaxError', 'Invalid number'));
        }
        else {
            return result.setFailure(new LocalError('InvalidSyntaxError', 'Expected number or invalid expressions'));
        }
    }
    bin_op(func, options){
        let result = new ParserResult();
        let left = result.register(func());
        if (result.errors) return result; 
        while (this.currentToken.type in options){
            let optionToken = this.currentToken;
            result.register(this.advance());
            right = result.register(func());
            if (result.errors) return result; 
            left = new BinOpNode(left, right, optionToken);
        }
        return result.setSuccess(left);
    }
}