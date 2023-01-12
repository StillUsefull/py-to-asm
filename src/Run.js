import Lexer from "./Lexer";
import { Parser } from "./Parser";
import Interpreter from "./Interpreter";
export function run(text){
    let lexer = new Lexer(text);
    let tokens, errors = lexer.makeTokens();
    if (errors){
        return null, errors;
    }
    // console.log(`Tokens:`);
    // tokens.forEach((token) => {
        // console.log(token);
    //})
    let parser = new Parser(tokens);
    let ast = parser.parse();
    if (ast.errors){
        return null, ast.errors;
    }
    //console.log(`AST:`);
    //console.log(ast);
    let interpreter = new Interpreter();
    let result = interpreter.visit(ast.node);
    return result, null;
}