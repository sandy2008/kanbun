/* Kanbun Compiler - Web Version
 * Simplified compiler for browser usage
 */

class KanbunCompiler {
    constructor() {
        this.tokens = [];
        this.current = 0;
        this.variables = new Map();
        this.functions = new Map();
    }

    compile(source) {
        try {
            this.tokens = this.tokenize(source);
            const ast = this.parse();
            const javascript = this.generateJavaScript(ast);
            
            return {
                tokens: this.tokens,
                ast: ast,
                javascript: javascript,
                success: true
            };
        } catch (error) {
            return {
                tokens: this.tokens,
                ast: null,
                javascript: null,
                success: false,
                error: error.message
            };
        }
    }

    tokenize(source) {
        const tokens = [];
        const lines = source.split('\\n');
        
        for (let lineNum = 0; lineNum < lines.length; lineNum++) {
            const line = lines[lineNum].trim();
            if (!line) continue;
            
            let i = 0;
            while (i < line.length) {
                const char = line[i];
                
                // Skip whitespace
                if (char === ' ' || char === '\\t' || char === '　') {
                    i++;
                    continue;
                }
                
                // String literals
                if (char === '「') {
                    let value = '';
                    i++; // Skip opening quote
                    while (i < line.length && line[i] !== '」') {
                        value += line[i];
                        i++;
                    }
                    i++; // Skip closing quote
                    tokens.push({ type: 'STRING', value: value, line: lineNum + 1 });
                    continue;
                }
                
                // Numbers (Chinese or Arabic)
                if (this.isNumber(char)) {
                    let value = '';
                    while (i < line.length && this.isNumber(line[i])) {
                        value += line[i];
                        i++;
                    }
                    tokens.push({ type: 'NUMBER', value: this.convertChineseNumber(value), line: lineNum + 1 });
                    continue;
                }
                
                // Keywords and identifiers
                if (this.isHanzi(char)) {
                    let value = '';
                    while (i < line.length && (this.isHanzi(line[i]) || this.isNumber(line[i]))) {
                        value += line[i];
                        i++;
                    }
                    
                    const tokenType = this.getTokenType(value);
                    tokens.push({ type: tokenType, value: value, line: lineNum + 1 });
                    continue;
                }
                
                // Punctuation
                if ('、。：'.includes(char)) {
                    tokens.push({ type: 'PUNCTUATION', value: char, line: lineNum + 1 });
                    i++;
                    continue;
                }
                
                // Default: skip unknown characters
                i++;
            }
        }
        
        return tokens;
    }

    isHanzi(char) {
        const code = char.charCodeAt(0);
        return (code >= 0x4e00 && code <= 0x9fff) || // CJK Unified Ideographs
               (code >= 0x3400 && code <= 0x4dbf) || // CJK Extension A
               (code >= 0xf900 && code <= 0xfaff);   // CJK Compatibility Ideographs
    }

    isNumber(char) {
        const chineseNumbers = '一二三四五六七八九十百千萬';
        return /[0-9]/.test(char) || chineseNumbers.includes(char);
    }

    convertChineseNumber(value) {
        const numberMap = {
            '一': 1, '二': 2, '三': 3, '四': 4, '五': 5,
            '六': 6, '七': 7, '八': 8, '九': 9, '十': 10,
            '百': 100, '千': 1000, '萬': 10000
        };
        
        // If it's already Arabic numerals, return as is
        if (/^[0-9]+$/.test(value)) {
            return parseInt(value);
        }
        
        // Simple Chinese number conversion
        if (value === '十') return 10;
        if (value.length === 1 && numberMap[value]) {
            return numberMap[value];
        }
        
        // Handle simple cases like 二十, 三十, etc.
        if (value.length === 2 && value.endsWith('十')) {
            const tens = numberMap[value[0]] || 1;
            return tens * 10;
        }
        
        if (value.startsWith('十') && value.length === 2) {
            const ones = numberMap[value[1]];
            return 10 + ones;
        }
        
        // For complex numbers, return 0 as fallback
        return 0;
    }

    getTokenType(value) {
        const keywords = [
            '昔有', '曰', '其値', '書', '若', '否', '夫', '者', '受', '還',
            '凡', '至', '名', '皆行如左', '大於', '小於', '等於', '加', '減',
            '乘', '除', '能整除', '與', '之', '數', '言'
        ];
        
        for (const keyword of keywords) {
            if (value.includes(keyword) || keyword.includes(value)) {
                return 'KEYWORD';
            }
        }
        
        return 'IDENTIFIER';
    }

    parse() {
        const statements = [];
        
        while (this.current < this.tokens.length) {
            const stmt = this.parseStatement();
            if (stmt) {
                statements.push(stmt);
            }
        }
        
        return {
            type: 'Program',
            body: statements
        };
    }

    parseStatement() {
        if (this.current >= this.tokens.length) {
            return null;
        }
        
        const token = this.tokens[this.current];
        
        // Variable declaration: 昔有數曰「甲」、其値五。
        if (token.value === '昔有' || token.value.startsWith('昔有')) {
            return this.parseVariableDeclaration();
        }
        
        // Function declaration: 夫「加」者、受「甲」「乙」、還甲加乙。
        if (token.value === '夫' || token.value.startsWith('夫')) {
            return this.parseFunctionDeclaration();
        }
        
        // Print statement: 書甲。
        if (token.value === '書' || token.value.startsWith('書')) {
            return this.parsePrintStatement();
        }
        
        // If statement: 若甲大於乙、書「甲大於乙」。
        if (token.value === '若' || token.value.startsWith('若')) {
            return this.parseIfStatement();
        }
        
        // For loop: 凡數一至十、名曰「甲」、皆行如左：
        if (token.value === '凡' || token.value.startsWith('凡')) {
            return this.parseForStatement();
        }
        
        // Skip unknown tokens
        this.current++;
        return null;
    }

    parseVariableDeclaration() {
        // Skip '昔有'
        this.current++;
        
        // Get type (數 or 言)
        let varType = 'number';
        if (this.current < this.tokens.length && this.tokens[this.current].value === '言') {
            varType = 'string';
            this.current++;
        } else if (this.current < this.tokens.length && this.tokens[this.current].value === '數') {
            varType = 'number';
            this.current++;
        }
        
        // Skip '曰'
        if (this.current < this.tokens.length && this.tokens[this.current].value === '曰') {
            this.current++;
        }
        
        // Get variable name
        let varName = null;
        if (this.current < this.tokens.length && this.tokens[this.current].type === 'STRING') {
            varName = this.tokens[this.current].value;
            this.current++;
        }
        
        // Skip punctuation and '其値'
        while (this.current < this.tokens.length && 
               (this.tokens[this.current].type === 'PUNCTUATION' || 
                this.tokens[this.current].value === '其値' || 
                this.tokens[this.current].value === '其' || 
                this.tokens[this.current].value === '値')) {
            this.current++;
        }
        
        // Get initial value
        let value = null;
        if (this.current < this.tokens.length) {
            const valueToken = this.tokens[this.current];
            if (valueToken.type === 'STRING') {
                value = { type: 'Literal', value: valueToken.value };
            } else if (valueToken.type === 'NUMBER') {
                value = { type: 'Literal', value: valueToken.value };
            } else if (valueToken.type === 'IDENTIFIER') {
                value = { type: 'Identifier', name: valueToken.value };
            }
            this.current++;
        }
        
        // Skip to end of statement
        while (this.current < this.tokens.length && this.tokens[this.current].value !== '。') {
            this.current++;
        }
        if (this.current < this.tokens.length) {
            this.current++; // Skip '。'
        }
        
        return {
            type: 'VariableDeclaration',
            declarations: [{
                type: 'VariableDeclarator',
                id: { type: 'Identifier', name: varName || 'unknown' },
                init: value
            }]
        };
    }

    parseFunctionDeclaration() {
        // Skip '夫'
        this.current++;
        
        // Get function name
        let funcName = null;
        if (this.current < this.tokens.length && this.tokens[this.current].type === 'STRING') {
            funcName = this.tokens[this.current].value;
            this.current++;
        }
        
        // Skip '者、受'
        while (this.current < this.tokens.length && 
               (this.tokens[this.current].value === '者' || 
                this.tokens[this.current].value === '受' ||
                this.tokens[this.current].type === 'PUNCTUATION')) {
            this.current++;
        }
        
        // Get parameters
        const params = [];
        while (this.current < this.tokens.length && this.tokens[this.current].type === 'STRING') {
            params.push({ type: 'Identifier', name: this.tokens[this.current].value });
            this.current++;
        }
        
        // Skip to function body (after '還')
        while (this.current < this.tokens.length && this.tokens[this.current].value !== '還') {
            this.current++;
        }
        if (this.current < this.tokens.length) {
            this.current++; // Skip '還'
        }
        
        // Parse simple return expression
        let returnExpr = null;
        if (this.current < this.tokens.length) {
            returnExpr = this.parseExpression();
        }
        
        return {
            type: 'FunctionDeclaration',
            id: { type: 'Identifier', name: funcName || 'unknown' },
            params: params,
            body: {
                type: 'BlockStatement',
                body: [{
                    type: 'ReturnStatement',
                    argument: returnExpr
                }]
            }
        };
    }

    parsePrintStatement() {
        // Skip '書'
        this.current++;
        
        // Get expression to print
        const expr = this.parseExpression();
        
        // Skip to end of statement
        while (this.current < this.tokens.length && this.tokens[this.current].value !== '。') {
            this.current++;
        }
        if (this.current < this.tokens.length) {
            this.current++; // Skip '。'
        }
        
        return {
            type: 'ExpressionStatement',
            expression: {
                type: 'CallExpression',
                callee: {
                    type: 'MemberExpression',
                    object: { type: 'Identifier', name: 'console' },
                    property: { type: 'Identifier', name: 'log' }
                },
                arguments: [expr]
            }
        };
    }

    parseIfStatement() {
        // Skip '若'
        this.current++;
        
        // Parse condition
        const condition = this.parseExpression();
        
        // Skip to consequent
        while (this.current < this.tokens.length && this.tokens[this.current].type === 'PUNCTUATION') {
            this.current++;
        }
        
        // Parse consequent
        const consequent = this.parseStatement();
        
        // Check for else (否)
        let alternate = null;
        if (this.current < this.tokens.length && this.tokens[this.current].value === '否') {
            this.current++; // Skip '否'
            while (this.current < this.tokens.length && this.tokens[this.current].type === 'PUNCTUATION') {
                this.current++;
            }
            alternate = this.parseStatement();
        }
        
        return {
            type: 'IfStatement',
            test: condition,
            consequent: {
                type: 'BlockStatement',
                body: [consequent]
            },
            alternate: alternate ? {
                type: 'BlockStatement',
                body: [alternate]
            } : null
        };
    }

    parseForStatement() {
        // This is a simplified implementation
        // Skip tokens until we find the body
        while (this.current < this.tokens.length && this.tokens[this.current].value !== '：') {
            this.current++;
        }
        if (this.current < this.tokens.length) {
            this.current++; // Skip '：'
        }
        
        // Parse body statements
        const body = [];
        while (this.current < this.tokens.length) {
            const stmt = this.parseStatement();
            if (stmt) {
                body.push(stmt);
            } else {
                break;
            }
        }
        
        return {
            type: 'ForStatement',
            init: null,
            test: null,
            update: null,
            body: {
                type: 'BlockStatement',
                body: body
            }
        };
    }

    parseExpression() {
        if (this.current >= this.tokens.length) {
            return { type: 'Literal', value: null };
        }
        
        const token = this.tokens[this.current];
        
        if (token.type === 'STRING') {
            this.current++;
            return { type: 'Literal', value: token.value };
        }
        
        if (token.type === 'NUMBER') {
            this.current++;
            return { type: 'Literal', value: token.value };
        }
        
        if (token.type === 'IDENTIFIER') {
            this.current++;
            
            // Check for binary operations
            if (this.current < this.tokens.length) {
                const nextToken = this.tokens[this.current];
                if (nextToken.value === '大於') {
                    this.current++;
                    const right = this.parseExpression();
                    return {
                        type: 'BinaryExpression',
                        operator: '>',
                        left: { type: 'Identifier', name: token.value },
                        right: right
                    };
                } else if (nextToken.value === '小於') {
                    this.current++;
                    const right = this.parseExpression();
                    return {
                        type: 'BinaryExpression',
                        operator: '<',
                        left: { type: 'Identifier', name: token.value },
                        right: right
                    };
                } else if (nextToken.value === '加') {
                    this.current++;
                    const right = this.parseExpression();
                    return {
                        type: 'BinaryExpression',
                        operator: '+',
                        left: { type: 'Identifier', name: token.value },
                        right: right
                    };
                }
            }
            
            return { type: 'Identifier', name: token.value };
        }
        
        this.current++;
        return { type: 'Literal', value: null };
    }

    generateJavaScript(ast) {
        if (!ast || ast.type !== 'Program') {
            return '';
        }
        
        let code = '';
        
        for (const statement of ast.body) {
            code += this.generateStatement(statement) + '\\n';
        }
        
        return code;
    }

    generateStatement(node) {
        switch (node.type) {
            case 'VariableDeclaration':
                const decl = node.declarations[0];
                const name = decl.id.name;
                const init = this.generateExpression(decl.init);
                return `let ${name} = ${init};`;
                
            case 'FunctionDeclaration':
                const funcName = node.id.name;
                const params = node.params.map(p => p.name).join(', ');
                const body = this.generateStatement(node.body.body[0]);
                return `function ${funcName}(${params}) { ${body} }`;
                
            case 'ExpressionStatement':
                return this.generateExpression(node.expression) + ';';
                
            case 'IfStatement':
                const test = this.generateExpression(node.test);
                const consequent = this.generateStatement(node.consequent.body[0]);
                const alternate = node.alternate ? this.generateStatement(node.alternate.body[0]) : '';
                return alternate ? 
                    `if (${test}) { ${consequent} } else { ${alternate} }` :
                    `if (${test}) { ${consequent} }`;
                
            case 'ReturnStatement':
                const arg = this.generateExpression(node.argument);
                return `return ${arg};`;
                
            case 'ForStatement':
                // Simplified for loop
                let forBody = '';
                for (const stmt of node.body.body) {
                    forBody += this.generateStatement(stmt) + ' ';
                }
                return `for (let i = 1; i <= 20; i++) { ${forBody} }`;
                
            default:
                return '';
        }
    }

    generateExpression(node) {
        if (!node) return 'null';
        
        switch (node.type) {
            case 'Literal':
                return typeof node.value === 'string' ? `"${node.value}"` : String(node.value);
                
            case 'Identifier':
                return node.name;
                
            case 'BinaryExpression':
                const left = this.generateExpression(node.left);
                const right = this.generateExpression(node.right);
                return `${left} ${node.operator} ${right}`;
                
            case 'CallExpression':
                const callee = this.generateExpression(node.callee);
                const args = node.arguments.map(arg => this.generateExpression(arg)).join(', ');
                return `${callee}(${args})`;
                
            case 'MemberExpression':
                const obj = this.generateExpression(node.object);
                const prop = node.property.name;
                return `${obj}.${prop}`;
                
            default:
                return 'null';
        }
    }
}

// Make available globally
if (typeof window !== 'undefined') {
    window.KanbunCompiler = KanbunCompiler;
}
