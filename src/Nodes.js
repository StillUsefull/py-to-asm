import {Tokens, KEYWORDS, DIGITS, LETTERS, LETTERS_DIGITS, OPERATIONS} from "./Constants";
import LocalError from "./LocalErrors";


export class FunctionNode {
    constructor(type, declaretionList, name, node){
        this.type = type;
        this.declaretionList = declaretionList;
        this.name = name;
        this.node = node;
    }
    getName(){
        return `function ${this.name}(${this.declaretionList}) ${this.node}`;
    }
}

export class StatementListNode {
    constructor(statements){
        this.statements = statements;
    }
    getName(){
        return String(this.statements);
    }
}

export class DeclaretionNode {
    constructor(type, name){
        this.type = type;
        this.name = name;
    }
    getName(){
        return String(this.name);
    }
}

export class DoWhileNode {
    constructor(statement, expression){
        this.statement = statement;
        this.expression = expression;
    }
    getName(){
        return `do {
            ${this.statement}
        } while ${this.expression}`;
    }
}

export class WhileNode {
    constructor(statement, expression){
        this.statement = statement;
        this.expression = expression;
    }
    getName(){
        return `while (${this.expression}) 
                    {
                        ${this.statement}
                    }`;
    }
}

export class IfElseNode {
    constructor(expression, statementIf, statementElse){
        this.expression = expression;
        this.statementIf = statementIf;
        this.statementElse = statementElse;
    }
    getName(){
        return `if (${this.expression}) {
            ${this.statementIf}
        }
        else {
            ${this.statementElse}
        }`
    }   
}

export class VarAssignNode {
    constructor(type, name, node){
        this.type = type;
        this.name = name;
        this.node = node;
    }
    getName(){
        return `${this.name} = ${this.node}`;
    }
}


export class VarAssignNullNode {
    constructor(type, name){
        this.type = type;
        this.name = name;
    }
    getName(){
        return `${this.name} = 0`;
    }
}

export class ReturnNode {
    constructor(node){
        this.node = node;
    }
    getName(){
        return `RETURN: ${this.node}`
    }
}

export class BreakNode {
    getName(){
        return 'BREAK';
    }
}

export class AssignNode {
    constructor(name, option, node){
        this.name = name;
        this.option = option;
        this.node = node;
    }
    getName(){
        return `(${this.name} ${this.option} ${this.node})`
    }
}

export class TerneryNode {
    constructor(condition, trueValue, falseValue){
        this.condition = condition;
        this.trueValue = trueValue;
        this.falseValue = falseValue;
    }
    getName(){
        return `if (${this.condition}) then (${this.trueValue}) else (${this.falseValue})`;
    }
}
export class BinOpNode {
    constructor(leftNode, rightNode, option){
        this.leftNode = leftNode;
        this.rightNode = rightNode;
        this.option = option;
    }
    getName(){
        return `(${this.leftNode}, ${this.option}, ${this.rightNode})`;
    }
}

export class UnarOpNode {
    constructor(option, node){
        this.option = option;
        this.node = node;
    }
    getName(){
        return `(${this.option}, ${this.node})`
    }
}

export class NumberNode {
    constructor(token){
        this.token = token;
    }
    getName(){
        return this.token;
    }
}

export class AccessNode {
    constructor(variableName){
        this.variableName = variableName;
    }
    getName(){
        return this.variableName;
    }
}

export class FunctionCallNode {
    constructor(name, args){
        this.name = name;
        this.arguments = args;
    }
    getName(){
        return `call ${this.name}(${this.args})`;
    }
}
export class ExpressionListNode {
    constructor(expressions){
        this.expressions = expressions;
    }
    getName(){
        return this.expressions;
    }
}