
//Constants

const DIGITS = /\d/g;
const LETTERS = /[a-zA-Z]+/g;
const LETTERS_DIGITS = /\w+/g;
const OPERATIONS = new RegExp('+-/*:%<>&|^');


//Tokens

const Tokens = {
    TT_INT_NUMBER : 'INT_NUMBER',
    TT_FLOAT_NUMBER : 'FLOAT_NUMBER',
    TT_INVALID_NUMBER : 'INVALID_NUMBER',
    TT_TYPE_INT : 'TYPE_INT',
    TT_TYPE_FLOAT : 'TYPE_FLOAT',
    TT_IDENTIFIER : 'IDENTIFIER',
    TT_LPAREN : 'LPAREN',
    TT_RPAREN : 'RPAREN',
    TT_LBLOCK : 'BEGIN',
    TT_RBLOCK : 'END',
    TT_MINUS : 'MINUS',
    TT_SUM : 'SUM',
    TT_AND : 'AND',
    TT_BIT_OR : 'BIT_OR',
    TT_PROC : 'PROC',
    TT_DIV : 'DIV',
    TT_MUL : 'MUL',
    TT_EQ : 'EQ',
    TT_GT : 'GT',
    TT_LT : 'LT',
    TT_QM : 'QM',
    TT_DIV_EQ : 'DIV_EQ',
    TT_COMMA : 'COMMA',
    TT_COLON : 'COLON',
    TT_SEMICOLON : 'SEMICOLON',
    TT_KEYWORD : 'KEYWORD',
    TT_EOF : 'EOF'
}

//Keywords

const KEYWORDS = [
    'return',
    'do',
    'while',
    'break',
    'if',
    'else'
];


export {Tokens, KEYWORDS, DIGITS, LETTERS, LETTERS_DIGITS, OPERATIONS};