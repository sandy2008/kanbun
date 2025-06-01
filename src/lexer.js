/**
 * Kanbun Lexer (词法分析器)
 * Tokenizes Kanbun source code into meaningful tokens
 */

class Token {
    constructor(type, value, line = 1, column = 1) {
        this.type = type;
        this.value = value;
        this.line = line;
        this.column = column;
    }
}

// Token types
const TokenType = {
    // Literals
    NUMBER: 'NUMBER',
    STRING: 'STRING',
    BOOLEAN: 'BOOLEAN',
    
    // Keywords
    VARIABLE_DECL: 'VARIABLE_DECL',    // 昔有
    NUMBER_TYPE: 'NUMBER_TYPE',        // 數
    STRING_TYPE: 'STRING_TYPE',        // 言
    BOOLEAN_TYPE: 'BOOLEAN_TYPE',      // 是非
    ARRAY_TYPE: 'ARRAY_TYPE',          // 巻
    NAMED: 'NAMED',                    // 曰
    VALUE: 'VALUE',                    // 値
    NOW_BE: 'NOW_BE',                  // 今為
    ASSIGN: 'ASSIGN',                  // 為
    
    // Arithmetic
    ADD: 'ADD',                        // 加
    SUBTRACT: 'SUBTRACT',              // 減
    MULTIPLY: 'MULTIPLY',              // 乗
    DIVIDE: 'DIVIDE',                  // 除
    
    // Comparison
    GREATER_THAN: 'GREATER_THAN',      // 大於
    LESS_THAN: 'LESS_THAN',            // 小於
    EQUAL: 'EQUAL',                    // 等於
    
    // Control flow
    IF: 'IF',                          // 若
    ELSE: 'ELSE',                      // 否
    ELSE_IF: 'ELSE_IF',                // 否若
    FOR_EACH: 'FOR_EACH',              // 凡
    TO: 'TO',                          // 至
    NAMED_AS: 'NAMED_AS',              // 名曰
    ALL_DO: 'ALL_DO',                  // 皆行如左
    
    // Functions
    FUNCTION_DEF: 'FUNCTION_DEF',      // 夫
    RECEIVES: 'RECEIVES',              // 受
    RETURNS: 'RETURNS',                // 還
    FUNCTION_CALL: 'FUNCTION_CALL',    // 能整除
    INVOKE: 'INVOKE',                  // 之
    WITH: 'WITH',                      // 與
    
    // Built-ins
    PRINT: 'PRINT',                    // 書
    INPUT: 'INPUT',                    // 問
    LENGTH: 'LENGTH',                  // 長
    NOW_TIME: 'NOW_TIME',              // 今時
    
    // Punctuation
    COMMA: 'COMMA',                    // 、
    PERIOD: 'PERIOD',                  // 。
    SEMICOLON: 'SEMICOLON',            // ；
    COLON: 'COLON',                    // ：
    LEFT_QUOTE: 'LEFT_QUOTE',          // 「
    RIGHT_QUOTE: 'RIGHT_QUOTE',        // 」
    
    // Identifiers
    IDENTIFIER: 'IDENTIFIER',
    
    // Special
    EOF: 'EOF',
    NEWLINE: 'NEWLINE',
    WHITESPACE: 'WHITESPACE'
};

class KanbunLexer {
    constructor(source) {
        this.source = source;
        this.position = 0;
        this.line = 1;
        this.column = 1;
        this.tokens = [];
        
        // Keyword mappings (ordered by length - longer first)
        this.keywords = {
            '昔有': TokenType.VARIABLE_DECL,
            '其値': TokenType.VALUE,
            '今為': TokenType.NOW_BE,
            '大於': TokenType.GREATER_THAN,
            '小於': TokenType.LESS_THAN,
            '等於': TokenType.EQUAL,
            '名曰': TokenType.NAMED_AS,
            '皆行如左': TokenType.ALL_DO,
            '能整除': TokenType.FUNCTION_CALL,
            '今時': TokenType.NOW_TIME,
            '否若': TokenType.ELSE_IF,
            '數': TokenType.NUMBER_TYPE,
            '言': TokenType.STRING_TYPE,
            '是非': TokenType.BOOLEAN_TYPE,
            '巻': TokenType.ARRAY_TYPE,
            '曰': TokenType.NAMED,
            '値': TokenType.VALUE,
            '為': TokenType.ASSIGN,
            '加': TokenType.ADD,
            '減': TokenType.SUBTRACT,
            '乗': TokenType.MULTIPLY,
            '除': TokenType.DIVIDE,
            '若': TokenType.IF,
            '否': TokenType.ELSE,
            '凡': TokenType.FOR_EACH,
            '至': TokenType.TO,
            '夫': TokenType.FUNCTION_DEF,
            '受': TokenType.RECEIVES,
            '還': TokenType.RETURNS,
            '之': TokenType.INVOKE,
            '與': TokenType.WITH,
            '書': TokenType.PRINT,
            '問': TokenType.INPUT,
            '長': TokenType.LENGTH,
            '是': TokenType.BOOLEAN,
            '非': TokenType.BOOLEAN
        };
    }
    
    getCurrentChar() {
        if (this.position >= this.source.length) {
            return null;
        }
        return this.source[this.position];
    }
    
    peekChar(offset = 1) {
        const peekPos = this.position + offset;
        if (peekPos >= this.source.length) {
            return null;
        }
        return this.source[peekPos];
    }
    
    advance() {
        if (this.position < this.source.length) {
            if (this.source[this.position] === '\n') {
                this.line++;
                this.column = 1;
            } else {
                this.column++;
            }
            this.position++;
        }
    }
    
    skipWhitespace() {
        while (this.getCurrentChar() && /\s/.test(this.getCurrentChar()) && this.getCurrentChar() !== '\n') {
            this.advance();
        }
    }
    
    readNumber() {
        let number = '';
        while (this.getCurrentChar() && /[0-9]/.test(this.getCurrentChar())) {
            number += this.getCurrentChar();
            this.advance();
        }
        return parseInt(number);
    }
    
    readChineseNumber() {
        const char = this.getCurrentChar();
        const chineseNumbers = {
            '一': 1, '二': 2, '三': 3, '四': 4, '五': 5,
            '六': 6, '七': 7, '八': 8, '九': 9, '十': 10,
            '百': 100, '千': 1000, '萬': 10000
        };
        
        if (chineseNumbers[char]) {
            this.advance();
            
            // Handle compound numbers like "二十"
            if (char === '二' && this.getCurrentChar() === '十') {
                this.advance(); // Skip 十
                return 20;
            } else if (char === '三' && this.getCurrentChar() === '十') {
                this.advance(); // Skip 十
                return 30;
            } else if (char === '四' && this.getCurrentChar() === '十') {
                this.advance(); // Skip 十
                return 40;
            } else if (char === '五' && this.getCurrentChar() === '十') {
                this.advance(); // Skip 十
                return 50;
            } else if (char === '六' && this.getCurrentChar() === '十') {
                this.advance(); // Skip 十
                return 60;
            } else if (char === '七' && this.getCurrentChar() === '十') {
                this.advance(); // Skip 十
                return 70;
            } else if (char === '八' && this.getCurrentChar() === '十') {
                this.advance(); // Skip 十
                return 80;
            } else if (char === '九' && this.getCurrentChar() === '十') {
                this.advance(); // Skip 十
                return 90;
            }
            
            return chineseNumbers[char];
        }
        
        return null;
    }
    
    readString() {
        let string = '';
        this.advance(); // Skip opening quote
        
        while (this.getCurrentChar() && this.getCurrentChar() !== '」') {
            string += this.getCurrentChar();
            this.advance();
        }
        
        if (this.getCurrentChar() === '」') {
            this.advance(); // Skip closing quote
        }
        
        return string;
    }
    
    readIdentifier() {
        let identifier = '';
        while (this.getCurrentChar() && this.isIdentifierChar(this.getCurrentChar())) {
            identifier += this.getCurrentChar();
            this.advance();
        }
        return identifier;
    }
    
    readSingleCharIdentifier() {
        const char = this.getCurrentChar();
        this.advance();
        return char;
    }
    
    readCompoundIdentifier() {
        let identifier = '';
        const startPos = this.position;
        
        // Read all consecutive identifier characters until we hit a keyword or operator
        while (this.getCurrentChar() && this.isIdentifierChar(this.getCurrentChar())) {
            // Check if the remaining text starts with a keyword
            const remainingText = this.source.slice(this.position);
            const keywordMatch = this.matchKeyword(remainingText);
            
            if (keywordMatch) {
                // If we found a keyword, stop reading the identifier
                break;
            }
            
            // Check if current character is a Chinese number at the end of identifier
            const chineseNumbers = ['一', '二', '三', '四', '五', '六', '七', '八', '九', '十'];
            if (chineseNumbers.includes(this.getCurrentChar())) {
                // If we already have some identifier and hit a number, include it
                if (identifier) {
                    identifier += this.getCurrentChar();
                    this.advance();
                    break; // Stop after number
                } else {
                    // If it's just a standalone number, don't include it
                    break;
                }
            }
            
            identifier += this.getCurrentChar();
            this.advance();
        }
        
        return identifier || null;
    }
    
    isIdentifierChar(char) {
        // Chinese characters, Japanese hiragana/katakana, and basic Latin letters
        return /[\u4e00-\u9fff\u3040-\u309f\u30a0-\u30ff\u3400-\u4dbf\ua-zA-Z]/.test(char);
    }
    
    matchKeyword(text) {
        // Try to match longer keywords first
        const sortedKeywords = Object.keys(this.keywords).sort((a, b) => b.length - a.length);
        
        for (const keyword of sortedKeywords) {
            if (text.startsWith(keyword)) {
                return { keyword, length: keyword.length };
            }
        }
        return null;
    }
    
    tokenize() {
        while (this.position < this.source.length) {
            const char = this.getCurrentChar();
            
            if (!char) break;
            
            // Skip whitespace
            if (/\s/.test(char) && char !== '\n') {
                this.skipWhitespace();
                continue;
            }
            
            // Newlines
            if (char === '\n') {
                this.tokens.push(new Token(TokenType.NEWLINE, char, this.line, this.column));
                this.advance();
                continue;
            }
            
            // Numbers (Arabic and Chinese)
            if (/[0-9]/.test(char)) {
                const number = this.readNumber();
                this.tokens.push(new Token(TokenType.NUMBER, number, this.line, this.column));
                continue;
            }
            
            // Chinese numbers
            const chineseNumbers = ['一', '二', '三', '四', '五', '六', '七', '八', '九', '十', '百', '千', '萬'];
            if (chineseNumbers.includes(char)) {
                const number = this.readChineseNumber();
                if (number !== null) {
                    this.tokens.push(new Token(TokenType.NUMBER, number, this.line, this.column));
                    continue;
                }
            }
            
            // Strings
            if (char === '「') {
                const string = this.readString();
                this.tokens.push(new Token(TokenType.STRING, string, this.line, this.column));
                continue;
            }
            
            // Single character tokens
            const singleCharTokens = {
                '、': TokenType.COMMA,
                '。': TokenType.PERIOD,
                '；': TokenType.SEMICOLON,
                '：': TokenType.COLON,
                '「': TokenType.LEFT_QUOTE,
                '」': TokenType.RIGHT_QUOTE
            };
            
            if (singleCharTokens[char]) {
                this.tokens.push(new Token(singleCharTokens[char], char, this.line, this.column));
                this.advance();
                continue;
            }
            
            // Keywords and identifiers
            if (this.isIdentifierChar(char)) {
                const remainingText = this.source.slice(this.position);
                const keywordMatch = this.matchKeyword(remainingText);
                
                if (keywordMatch) {
                    const tokenType = this.keywords[keywordMatch.keyword];
                    let value = keywordMatch.keyword;
                    
                    // Special handling for boolean values
                    if (keywordMatch.keyword === '是') {
                        value = true;
                    } else if (keywordMatch.keyword === '非') {
                        value = false;
                    }
                    
                    this.tokens.push(new Token(tokenType, value, this.line, this.column));
                    
                    // Advance by keyword length
                    for (let i = 0; i < keywordMatch.length; i++) {
                        this.advance();
                    }
                } else {
                    // Try to read compound identifier first
                    const compound = this.readCompoundIdentifier();
                    if (compound && compound.length > 1) {
                        // If we got a compound identifier (like "結果一"), use it
                        this.tokens.push(new Token(TokenType.IDENTIFIER, compound, this.line, this.column));
                    } else {
                        // Reset position and read single character
                        this.position = this.position - (compound ? compound.length : 0);
                        this.column = this.column - (compound ? compound.length : 0);
                        const identifier = this.readSingleCharIdentifier();
                        this.tokens.push(new Token(TokenType.IDENTIFIER, identifier, this.line, this.column));
                    }
                }
                continue;
            }
            
            // Unknown character - skip it
            this.advance();
        }
        
        this.tokens.push(new Token(TokenType.EOF, null, this.line, this.column));
        return this.tokens;
    }
}

module.exports = { KanbunLexer, Token, TokenType };
