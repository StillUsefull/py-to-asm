import {Tokens, KEYWORDS, DIGITS, LETTERS, LETTERS_DIGITS, OPERATIONS} from "./Constants";
import LocalError from "./LocalErrors";

class Token {
    constructor(type, value = null){
        this.type = type;
        this.value = value ;
    }
}


export default class Lexer {
    constructor(text, position){
        this.text = text;
        this.position = position;
        this.current_char = null;
        this.blockCounter = 0;
    }
    advance(){
        this.position+=1;
        if (this.position < this.text.lenght){
            this.current_char = this.text[this.position]
        } else {
            this.position = null;
        }
        
    };

    makeLower(){
        let tokenType=Tokens.TT_LT;
        this.advance();
        if (this.current_char == '='){
            this.advance();
            return null, new LocalError('IllegalCharError', '"<="');
            
        }
        return new Token(tokenType), null
    };
    makeOr(){
        let tokenType = Tokens.TT_BIT_OR;
        this.advance();
        if (this.current_char == '|'){
            this.advance();
            return null, new LocalError('IllegalCharError', '||');
            
        }
        return new Token(tokenType), null 
    };
    makeBigger(){
        let tokenType = Tokens.TT_GT;
        this.advance();
        if (this.current_char == '='){
            this.advance();
            return null, new LocalError('IllegalCharError', '">="');
            
        }
        return new Token(tokenType), null
    };
    makeMul(){
        let tokenType = Tokens.TT_MUL;
        this.advance();
        if (this.current_char == '='){
            this.advance();
            return null, new LocalError('IllegalCharError', '"*="');
            
        }
        return new Token(tokenType), null
    };
    makeDiv(){
        let tokenType = Tokens.TT_DIV;
        this.advance();
        if (this.current_char == '='){
            this.advance();
            return new Token(Tokens.TT_DIV_EQ);
        }
        return new Token(tokenType);
    };
    makeMinus(){
        let tokenType = Tokens.TT_MINUS;
        this.advance();
        if (this.current_char == '='){
            this.advance();
            return null, new LocalError('IllegalCharError', '"-="');
        }
        return new Token(tokenType), null;
    };
    makePlus(){
        let tokenType = Tokens.TT_SUM;
        this.advance();
        if (this.current_char == '='){
            this.advance();
            return null, new LocalError('IllegalCharError', '"+="');
        }
        return new Token(tokenType), null;
    };
    makeEqual(){
        let tokenType = Tokens.TT_EQ;
        this.advance();
        if (this.current_char == '='){
            this.advance();
            return null, new LocalError('IllegalCharError', '"=="');
        }
        return new Token(tokenType), null;
    };
    makeNumber(){
        num = '';
        dots = 0;

        while (this.current_char && this.current_char.match(DIGITS)){
            if (this.current_char == '.'){
                if (dots == 1){
                    return null, new LocalError('NumberError' ,'Number exists more than one dots');
                    
                }
                dots++;
                num += '.';
            }
            else if (this.current_char == '0'){
                num =+ 'o';
            }
            else {
                num += this.current_char;
            }
            this.advance();
        }
        if (dots != 0){
            return new Token(Tokens.TT_FLOAT_NUMBER, +num), null;
        }
        else if (dots == 0){
            return new Token(Tokens.TT_INT_NUMBER, +num), null;
        }
        else {
            return new Token(Tokens.TT_INVALID_NUMBER, num), null;
        }
    };
    makeIdentifier(){
        str = '';
        while (this.current_char != ' ' && this.current_char.match(LETTERS_DIGITS)){
            str += this.current_char;
            this.advance();
        }
        if (str == 'or'){
            tokenType = Tokens.TT_BIT_OR;
            return new Token(tokenType);
        }
        else if (str == 'and'){
            tokenType = Tokens.TT_AND;
            return new Token(tokenType);
        }
        else if (KEYWORDS.includes(str)){
            tokenType = Tokens.TT_KEYWORD;
            return new Token(tokenType, str);
        }
        else {
            tokenType = Tokens.TT_INT_NUMBER;
            return new Token(tokenType, str);
        }
    }
    makeBlock(){
        let tokenType = Tokens.TT_RBLOCK;
        let emptyCounter = 0;
        while (this.current_char == ' '){
            emptyCounter++;
            this.advance();
        }
        if (round(emptyCounter/4) != 0 && round(emptyCounter/4) < blockCounter){
            this.blockCounter = this.blockCounter - empCounter/4;
            return new Token(tokenType);
        } else {
            return null;
        }
        
    }
    createTokens(){
        let tokens = [];
        
        while (this.current_char != null){
            if (this.current_char == ':'){
                this.blockCounter++;
                tokens.push(Tokens.TT_LBLOCK);
            }
            else if (this.current_char.match(DIGITS)){
                tokens.push(this.makeNumber());
            }
            else if (this.current_char.match(LETTERS)){
                tokens.push(this.makeIdentifier());
            }
            else if (this.current_char == '-'){
                let token, error = this.makeMinus();
                if (error) {
                    return [], error
                }
                tokens.push(token);
            } 
            else if (this.current_char == '/'){
                let token, error = this.makeDiv();
                if (error) {
                    return [], error
                }
                tokens.push(token);
            }
            else if (this.current_char == '*'){
                let token, error = this.makeMul();
                if (error) {
                    return [], error
                }
                tokens.push(token);
            }
            else if (this.current_char == '='){
                let token, error = this.makeEqual();
                if (error) {
                    return [], error
                }
                tokens.push(token);
            }
            else if (this.current_char == '>'){
                let token, error = this.makeBigger();
                if (error) {
                    return [], error
                }
                tokens.push(token);
            }
            else if (this.current_char == '<'){
                let token, error = this.makeLower();
                if (error) {
                    return [], error
                }
                tokens.push(token);
            }
            else if (this.current_char == '|'){
                let token, error = this.makeOr();
                if (error) {
                    return [], error
                }
                tokens.push(token);
            }
            else if (this.current_char == '%'){
                tokens.push(Tokens.TT_PROC);
                this.advance();
            }
            else if (this.current_char == '?'){
                tokens.push(Tokens.TT_QM);
                this.advance();
            }
            else if (this.current_char == ','){
                tokens.push(Tokens.TT_COMMA);
                this.advance();
            }
            else if (this.current_char == '('){
                tokens.push(Tokens.TT_LPAREN);
                this.advance();
            }
            else if (this.current_char == ')'){
                tokens.push(Tokens.TT_RPAREN);
            }
            else if (this.current_char == ' '){
                let token = this.makeBlock();
                if (token){
                    tokens.push(token);
                }
            }
            else {
                const char = this.current_char;
                this.advance();
                return [], new LocalError('IllegalCharError', `"${char}"`)
            }
        }
    }
    

}