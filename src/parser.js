/**
 * Kanbun Parser (语法分析器)
 * Parses tokens into an Abstract Syntax Tree (AST)
 */

const { TokenType } = require('./lexer');

// AST Node Types
class ASTNode {
    constructor(type) {
        this.type = type;
    }
}

class Program extends ASTNode {
    constructor(statements = []) {
        super('Program');
        this.statements = statements;
    }
}

class VariableDeclaration extends ASTNode {
    constructor(dataType, name, value) {
        super('VariableDeclaration');
        this.dataType = dataType;
        this.name = name;
        this.value = value;
    }
}

class Assignment extends ASTNode {
    constructor(name, value) {
        super('Assignment');
        this.name = name;
        this.value = value;
    }
}

class BinaryOperation extends ASTNode {
    constructor(left, operator, right) {
        super('BinaryOperation');
        this.left = left;
        this.operator = operator;
        this.right = right;
    }
}

class ConditionalStatement extends ASTNode {
    constructor(condition, thenBranch, elseBranch = null) {
        super('ConditionalStatement');
        this.condition = condition;
        this.thenBranch = thenBranch;
        this.elseBranch = elseBranch;
    }
}

class ForLoop extends ASTNode {
    constructor(start, end, variable, body) {
        super('ForLoop');
        this.start = start;
        this.end = end;
        this.variable = variable;
        this.body = body;
    }
}

class FunctionDeclaration extends ASTNode {
    constructor(name, parameters, body) {
        super('FunctionDeclaration');
        this.name = name;
        this.parameters = parameters;
        this.body = body;
    }
}

class FunctionCall extends ASTNode {
    constructor(name, arguments_) {
        super('FunctionCall');
        this.name = name;
        this.arguments = arguments_;
    }
}

class PrintStatement extends ASTNode {
    constructor(expression) {
        super('PrintStatement');
        this.expression = expression;
    }
}

class Literal extends ASTNode {
    constructor(value, dataType) {
        super('Literal');
        this.value = value;
        this.dataType = dataType;
    }
}

class Identifier extends ASTNode {
    constructor(name) {
        super('Identifier');
        this.name = name;
    }
}

class Block extends ASTNode {
    constructor(statements = []) {
        super('Block');
        this.statements = statements;
    }
}

class KanbunParser {
    constructor(tokens) {
        this.tokens = tokens.filter(token => 
            token.type !== TokenType.WHITESPACE && 
            token.type !== TokenType.NEWLINE
        );
        this.position = 0;
        this.currentToken = this.tokens[0] || null;
    }
    
    advance() {
        this.position++;
        if (this.position < this.tokens.length) {
            this.currentToken = this.tokens[this.position];
        } else {
            this.currentToken = null;
        }
    }
    
    peek(offset = 1) {
        const peekPos = this.position + offset;
        if (peekPos < this.tokens.length) {
            return this.tokens[peekPos];
        }
        return null;
    }
    
    expect(tokenType) {
        if (!this.currentToken || this.currentToken.type !== tokenType) {
            throw new Error(`Expected ${tokenType}, got ${this.currentToken ? this.currentToken.type : 'EOF'} at line ${this.currentToken ? this.currentToken.line : 'unknown'}`);
        }
        const token = this.currentToken;
        this.advance();
        return token;
    }
    
    match(...tokenTypes) {
        if (!this.currentToken) return false;
        return tokenTypes.includes(this.currentToken.type);
    }
    
    parse() {
        const statements = [];
        
        while (this.currentToken && this.currentToken.type !== TokenType.EOF) {
            const prevPosition = this.position;
            const statement = this.parseStatement();
            
            if (statement) {
                statements.push(statement);
            }
            
            // Prevent infinite loop - if position hasn't changed, advance
            if (this.position === prevPosition) {
                console.warn(`Parser stuck at position ${this.position}, token: ${this.currentToken?.type}`);
                this.advance();
            }
        }
        
        return new Program(statements);
    }
    
    parseStatement() {
        if (!this.currentToken || this.currentToken.type === TokenType.EOF) return null;
        
        let statement = null;
        
        switch (this.currentToken.type) {
            case TokenType.VARIABLE_DECL:
                statement = this.parseVariableDeclaration();
                break;
            case TokenType.IDENTIFIER:
                statement = this.parseAssignmentOrExpression();
                break;
            case TokenType.IF:
                statement = this.parseConditional();
                break;
            case TokenType.FOR_EACH:
                statement = this.parseForLoop();
                break;
            case TokenType.FUNCTION_DEF:
                statement = this.parseFunctionDeclaration();
                break;
            case TokenType.PRINT:
                statement = this.parsePrintStatement();
                break;
            case TokenType.COMMA:
            case TokenType.PERIOD:
            case TokenType.SEMICOLON:
                this.advance(); // Skip punctuation
                return this.parseStatement();
            default:
                statement = this.parseExpression();
                break;
        }
        
        // Skip trailing punctuation
        while (this.currentToken && this.match(TokenType.COMMA, TokenType.PERIOD, TokenType.SEMICOLON)) {
            this.advance();
        }
        
        return statement;
    }
    
    parseBlock() {
        const statements = [];
        
        // Parse indented statements until we hit a non-indented line or EOF
        while (this.currentToken && this.currentToken.type !== TokenType.EOF) {
            // Skip leading whitespace/newlines
            while (this.match(TokenType.NEWLINE)) {
                this.advance();
            }
            
            // If we hit EOF or a statement that doesn't start with indentation, end the block
            if (!this.currentToken || this.currentToken.type === TokenType.EOF) {
                break;
            }
            
            // Check if this is still part of the indented block
            // For simplicity, we'll assume all statements until the next FOR_EACH, 
            // top-level statement, or EOF are part of this block
            if (this.match(TokenType.FOR_EACH, TokenType.FUNCTION_DEF, TokenType.VARIABLE_DECL) && statements.length > 0) {
                break;
            }
            
            // Special handling for conditional chains - parse full if-else-if-else chain as one statement
            if (this.match(TokenType.IF)) {
                const conditionalChain = this.parseConditionalChain();
                if (conditionalChain) {
                    statements.push(conditionalChain);
                }
            } else {
                const statement = this.parseStatement();
                if (statement) {
                    statements.push(statement);
                } else {
                    break;
                }
            }
        }
        
        // If we only have one statement, return it directly
        // Otherwise, return a Block node
        if (statements.length === 1) {
            return statements[0];
        } else if (statements.length > 1) {
            return new Block(statements);
        } else {
            return null;
        }
    }
    
    parseConditionalChain() {
        // Parse a complete if-else-if-else chain
        const firstCondition = this.parseConditional();
        
        // Look ahead for else-if or else continuations
        while (this.match(TokenType.ELSE_IF)) {
            // This is handled in parseConditional already
            break;
        }
        
        return firstCondition;
    }
    
    parseVariableDeclaration() {
        // 昔有數曰「甲」、其値五。
        this.expect(TokenType.VARIABLE_DECL); // 昔有
        
        let dataType = 'number'; // default
        if (this.match(TokenType.NUMBER_TYPE, TokenType.STRING_TYPE, TokenType.BOOLEAN_TYPE, TokenType.ARRAY_TYPE)) {
            const typeToken = this.currentToken;
            this.advance();
            
            switch (typeToken.type) {
                case TokenType.NUMBER_TYPE: dataType = 'number'; break;
                case TokenType.STRING_TYPE: dataType = 'string'; break;
                case TokenType.BOOLEAN_TYPE: dataType = 'boolean'; break;
                case TokenType.ARRAY_TYPE: dataType = 'array'; break;
            }
        }
        
        this.expect(TokenType.NAMED); // 曰
        
        let name = '';
        if (this.currentToken.type === TokenType.LEFT_QUOTE) {
            this.advance(); // Skip 「
            name = this.expect(TokenType.STRING).value;
            // Skip 」 if present
            if (this.match(TokenType.RIGHT_QUOTE)) {
                this.advance();
            }
        } else if (this.currentToken.type === TokenType.STRING) {
            // Direct string token (already parsed by lexer)
            name = this.currentToken.value;
            this.advance();
        } else {
            name = this.expect(TokenType.IDENTIFIER).value;
        }
        
        // Skip optional comma
        if (this.match(TokenType.COMMA)) {
            this.advance();
        }
        
        let value = null;
        if (this.match(TokenType.VALUE)) {
            this.advance(); // Skip 其値 or 値
            value = this.parseExpression();
        }
        
        return new VariableDeclaration(dataType, name, value);
    }
    
    parseAssignmentOrExpression() {
        const identifier = this.currentToken.value;
        this.advance();
        
        if (this.match(TokenType.NOW_BE, TokenType.ASSIGN)) {
            // Assignment: 甲今為十 or 甲為十 or 結果一為加之三與五
            this.advance();
            const value = this.parseExpression();
            return new Assignment(identifier, value);
        } else {
            // It's just an identifier expression
            return new Identifier(identifier);
        }
    }
    
    parseConditional() {
        // 若甲大於乙、書「甲勝乙」。否、書「乙勝甲」。
        this.expect(TokenType.IF); // 若
        
        const condition = this.parseExpression();
        
        // Skip optional comma
        if (this.match(TokenType.COMMA)) {
            this.advance();
        }
        
        const thenBranch = this.parseStatement();
        
        let elseBranch = null;
        if (this.match(TokenType.ELSE_IF)) {
            // 否若 - else if
            this.advance(); // 否若
            
            // Parse the else-if as a new conditional
            const elseIfCondition = this.parseExpression();
            
            // Skip optional comma
            if (this.match(TokenType.COMMA)) {
                this.advance();
            }
            
            const elseIfThenBranch = this.parseStatement();
            
            // Check for more else/else-if clauses
            let finalElseBranch = null;
            if (this.match(TokenType.ELSE)) {
                this.advance(); // 否
                
                // Skip optional comma
                if (this.match(TokenType.COMMA)) {
                    this.advance();
                }
                
                finalElseBranch = this.parseStatement();
            }
            
            // Create nested conditional structure
            elseBranch = new ConditionalStatement(elseIfCondition, elseIfThenBranch, finalElseBranch);
        } else if (this.match(TokenType.ELSE)) {
            this.advance(); // 否
            
            // Skip optional comma
            if (this.match(TokenType.COMMA)) {
                this.advance();
            }
            
            elseBranch = this.parseStatement();
        }
        
        return new ConditionalStatement(condition, thenBranch, elseBranch);
    }
    
    parseForLoop() {
        // 凡數一至十、名曰「甲」、皆行如左：
        this.expect(TokenType.FOR_EACH); // 凡
        
        // Skip optional 數
        if (this.match(TokenType.NUMBER_TYPE)) {
            this.advance();
        }
        
        const start = this.parseExpression();
        this.expect(TokenType.TO); // 至
        const end = this.parseExpression();
        
        // Skip optional comma
        if (this.match(TokenType.COMMA)) {
            this.advance();
        }
        
        this.expect(TokenType.NAMED_AS); // 名曰
        
        let variable = '';
        if (this.currentToken.type === TokenType.LEFT_QUOTE) {
            this.advance(); // Skip 「
            variable = this.expect(TokenType.STRING).value;
            // Skip 」 if present
            if (this.match(TokenType.RIGHT_QUOTE)) {
                this.advance();
            }
        } else if (this.currentToken.type === TokenType.STRING) {
            // Direct string token
            variable = this.currentToken.value;
            this.advance();
        } else {
            variable = this.expect(TokenType.IDENTIFIER).value;
        }
        
        // Skip optional comma
        if (this.match(TokenType.COMMA)) {
            this.advance();
        }
        
        this.expect(TokenType.ALL_DO); // 皆行如左
        
        // Skip optional colon
        if (this.match(TokenType.COLON)) {
            this.advance();
        }
        
        // Skip newlines to get to the loop body
        while (this.match(TokenType.NEWLINE)) {
            this.advance();
        }
        
        // Parse the loop body as a block of statements
        const body = this.parseBlock();
        
        return new ForLoop(start, end, variable, body);
    }
    
    parseFunctionDeclaration() {
        // 夫「加」者、受「甲」「乙」、還其和。
        this.expect(TokenType.FUNCTION_DEF); // 夫
        
        let name = '';
        if (this.currentToken.type === TokenType.LEFT_QUOTE) {
            this.advance(); // Skip 「
            name = this.expect(TokenType.STRING).value;
            // Skip 」 if present
            if (this.match(TokenType.RIGHT_QUOTE)) {
                this.advance();
            }
        } else if (this.currentToken.type === TokenType.STRING) {
            // Direct string token
            name = this.currentToken.value;
            this.advance();
        } else {
            name = this.expect(TokenType.IDENTIFIER).value;
        }
        
        // Skip 者
        if (this.match(TokenType.IDENTIFIER) && this.currentToken.value === '者') {
            this.advance();
        }
        
        // Skip optional comma
        if (this.match(TokenType.COMMA)) {
            this.advance();
        }
        
        const parameters = [];
        if (this.match(TokenType.RECEIVES)) {
            this.advance(); // 受
            
            // Parse parameter list
            while (this.currentToken && !this.match(TokenType.COMMA, TokenType.RETURNS, TokenType.PERIOD)) {
                if (this.currentToken.type === TokenType.LEFT_QUOTE) {
                    this.advance(); // Skip 「
                    parameters.push(this.expect(TokenType.STRING).value);
                    // Skip 」 if present
                    if (this.match(TokenType.RIGHT_QUOTE)) {
                        this.advance();
                    }
                } else if (this.currentToken.type === TokenType.STRING) {
                    // Direct string token
                    parameters.push(this.currentToken.value);
                    this.advance();
                } else {
                    parameters.push(this.expect(TokenType.IDENTIFIER).value);
                }
            }
        }
        
        // Skip optional comma
        if (this.match(TokenType.COMMA)) {
            this.advance();
        }
        
        let body = null;
        if (this.match(TokenType.RETURNS)) {
            this.advance(); // 還
            body = this.parseExpression();
        }
        
        return new FunctionDeclaration(name, parameters, body);
    }
    
    parsePrintStatement() {
        this.expect(TokenType.PRINT); // 書
        
        let expression = null;
        if (this.currentToken.type === TokenType.LEFT_QUOTE) {
            this.advance(); // Skip 「
            expression = new Literal(this.expect(TokenType.STRING).value, 'string');
            // Skip 」 if present
            if (this.match(TokenType.RIGHT_QUOTE)) {
                this.advance();
            }
        } else if (this.currentToken.type === TokenType.STRING) {
            // Direct string token
            expression = new Literal(this.currentToken.value, 'string');
            this.advance();
        } else {
            expression = this.parseExpression();
        }
        
        return new PrintStatement(expression);
    }
    
    parseExpression() {
        return this.parseComparison();
    }
    
    parseComparison() {
        let expr = this.parseArithmetic();
        
        while (this.match(TokenType.GREATER_THAN, TokenType.LESS_THAN, TokenType.EQUAL)) {
            const operator = this.currentToken.type;
            this.advance();
            const right = this.parseArithmetic();
            expr = new BinaryOperation(expr, operator, right);
        }
        
        return expr;
    }
    
    parseArithmetic() {
        let expr = this.parseTerm();
        
        while (this.match(TokenType.ADD, TokenType.SUBTRACT)) {
            const operator = this.currentToken.type;
            this.advance();
            const right = this.parseTerm();
            expr = new BinaryOperation(expr, operator, right);
        }
        
        return expr;
    }
    
    parseTerm() {
        let expr = this.parseFactor();
        
        while (this.match(TokenType.MULTIPLY, TokenType.DIVIDE)) {
            const operator = this.currentToken.type;
            this.advance();
            const right = this.parseFactor();
            expr = new BinaryOperation(expr, operator, right);
        }
        
        return expr;
    }
    
    parseFactor() {
        if (this.match(TokenType.NUMBER)) {
            const value = this.currentToken.value;
            this.advance();
            return new Literal(value, 'number');
        }
        
        if (this.match(TokenType.STRING)) {
            const value = this.currentToken.value;
            this.advance();
            return new Literal(value, 'string');
        }
        
        if (this.match(TokenType.BOOLEAN)) {
            const value = this.currentToken.value;
            this.advance();
            return new Literal(value, 'boolean');
        }
        
        // Handle operator tokens that can be function names when followed by INVOKE (之)
        if (this.match(TokenType.ADD, TokenType.SUBTRACT, TokenType.MULTIPLY, TokenType.DIVIDE)) {
            const operatorToken = this.currentToken;
            
            // Check if next token is INVOKE (之), which indicates function call
            if (this.peek() && this.peek().type === TokenType.INVOKE) {
                const functionName = operatorToken.value; // 加, 減, 乗, 除
                this.advance(); // Skip the operator token
                this.advance(); // Skip 之
                
                const args = [];
                
                // Parse arguments
                while (this.currentToken && !this.match(TokenType.COMMA, TokenType.PERIOD, TokenType.SEMICOLON)) {
                    args.push(this.parseExpression());
                    
                    if (this.match(TokenType.WITH)) {
                        this.advance(); // 與
                    }
                }
                
                return new FunctionCall(functionName, args);
            } else {
                // If not followed by INVOKE, it's an error in this context
                throw new Error(`Unexpected operator ${operatorToken.value} without invocation context at line ${operatorToken.line}`);
            }
        }
        
        if (this.match(TokenType.IDENTIFIER)) {
            const name = this.currentToken.value;
            this.advance();
            
            // Check for special function calls like "能整除"
            if (this.match(TokenType.FUNCTION_CALL)) {
                this.advance(); // Skip 能整除
                const args = [new Identifier(name)]; // First argument is the number
                
                // Parse additional arguments (numbers to check divisibility)
                while (this.currentToken && 
                       (this.currentToken.type === TokenType.NUMBER || this.currentToken.type === TokenType.IDENTIFIER) &&
                       !this.match(TokenType.COMMA, TokenType.PERIOD, TokenType.SEMICOLON) &&
                       this.currentToken.type !== TokenType.EOF) {
                    if (this.currentToken.type === TokenType.NUMBER) {
                        args.push(new Literal(this.currentToken.value, 'number'));
                        this.advance();
                    } else {
                        // Handle consecutive Chinese numbers like "三五"
                        args.push(this.parseExpression());
                    }
                }
                
                return new FunctionCall('能整除', args);
            }
            
            // Check if it's a function call with 之
            if (this.match(TokenType.INVOKE)) {
                this.advance(); // 之
                const args = [];
                
                // Parse arguments
                while (this.currentToken && !this.match(TokenType.COMMA, TokenType.PERIOD, TokenType.SEMICOLON)) {
                    args.push(this.parseExpression());
                    
                    if (this.match(TokenType.WITH)) {
                        this.advance(); // 與
                    }
                }
                
                return new FunctionCall(name, args);
            }
            
            return new Identifier(name);
        }
        
        if (this.match(TokenType.NOW_TIME)) {
            this.advance();
            return new FunctionCall('now', []);
        }
        
        throw new Error(`Unexpected token: ${this.currentToken.type} at line ${this.currentToken.line}`);
    }
}

module.exports = {
    KanbunParser,
    ASTNode,
    Program,
    VariableDeclaration,
    Assignment,
    BinaryOperation,
    ConditionalStatement,
    ForLoop,
    FunctionDeclaration,
    FunctionCall,
    PrintStatement,
    Literal,
    Identifier,
    Block
};
