/**
 * Kanbun Code Generator (代码生成器)
 * Generates JavaScript code from the AST
 */

const { TokenType } = require('./lexer');

class KanbunCodeGenerator {
    constructor() {
        this.output = '';
        this.indentLevel = 0;
        this.variables = new Set();
    }
    
    indent() {
        return '  '.repeat(this.indentLevel);
    }
    
    emit(code) {
        this.output += code;
    }
    
    emitLine(code = '') {
        this.output += this.indent() + code + '\n';
    }
    
    generate(ast) {
        this.output = '';
        this.emitLine('// Generated JavaScript code from Kanbun');
        this.emitLine('// 漢文 -> JavaScript transpiler output');
        this.emitLine('');
        
        // Add built-in functions
        this.emitBuiltins();
        
        this.generateNode(ast);
        
        return this.output;
    }
    
    emitBuiltins() {
        this.emitLine('// Built-in functions');
        this.emitLine('function 書(value) {');
        this.indentLevel++;
        this.emitLine('console.log(value);');
        this.indentLevel--;
        this.emitLine('}');
        this.emitLine('');
        
        this.emitLine('function 問(prompt) {');
        this.indentLevel++;
        this.emitLine('const readline = require("readline");');
        this.emitLine('const rl = readline.createInterface({');
        this.indentLevel++;
        this.emitLine('input: process.stdin,');
        this.emitLine('output: process.stdout');
        this.indentLevel--;
        this.emitLine('});');
        this.emitLine('return new Promise((resolve) => {');
        this.indentLevel++;
        this.emitLine('rl.question(prompt || "", (answer) => {');
        this.indentLevel++;
        this.emitLine('rl.close();');
        this.emitLine('resolve(answer);');
        this.indentLevel--;
        this.emitLine('});');
        this.indentLevel--;
        this.emitLine('});');
        this.indentLevel--;
        this.emitLine('}');
        this.emitLine('');
        
        this.emitLine('function 長(value) {');
        this.indentLevel++;
        this.emitLine('return value.length;');
        this.indentLevel--;
        this.emitLine('}');
        this.emitLine('');
        
        this.emitLine('function now() {');
        this.indentLevel++;
        this.emitLine('return Date.now();');
        this.indentLevel--;
        this.emitLine('}');
        this.emitLine('');
        
        this.emitLine('// Helper function for divisibility check');
        this.emitLine('function 能整除(num, ...divisors) {');
        this.indentLevel++;
        this.emitLine('return divisors.every(d => num % d === 0);');
        this.indentLevel--;
        this.emitLine('}');
        this.emitLine('');
        
        this.emitLine('// Main program');
        this.emitLine('(async function main() {');
        this.indentLevel++;
    }
    
    generateNode(node) {
        if (!node) return;
        
        switch (node.type) {
            case 'Program':
                this.generateProgram(node);
                break;
            case 'Block':
                this.generateBlock(node);
                break;
            case 'VariableDeclaration':
                this.generateVariableDeclaration(node);
                break;
            case 'Assignment':
                this.generateAssignment(node);
                break;
            case 'BinaryOperation':
                return this.generateBinaryOperation(node);
            case 'ConditionalStatement':
                this.generateConditional(node);
                break;
            case 'ForLoop':
                this.generateForLoop(node);
                break;
            case 'FunctionDeclaration':
                this.generateFunctionDeclaration(node);
                break;
            case 'FunctionCall':
                return this.generateFunctionCall(node);
            case 'PrintStatement':
                this.generatePrintStatement(node);
                break;
            case 'Literal':
                return this.generateLiteral(node);
            case 'Identifier':
                return this.generateIdentifier(node);
            default:
                throw new Error(`Unknown node type: ${node.type}`);
        }
    }
    
    generateProgram(node) {
        for (const statement of node.statements) {
            this.generateNode(statement);
        }
        
        // Close main function
        this.indentLevel--;
        this.emitLine('})();');
    }
    
    generateBlock(node) {
        for (const statement of node.statements) {
            this.generateNode(statement);
        }
    }
    
    generateVariableDeclaration(node) {
        this.variables.add(node.name);
        
        if (node.value) {
            const value = this.generateNode(node.value);
            this.emitLine(`let ${node.name} = ${value};`);
        } else {
            // Default values based on type
            let defaultValue;
            switch (node.dataType) {
                case 'number': defaultValue = '0'; break;
                case 'string': defaultValue = '""'; break;
                case 'boolean': defaultValue = 'false'; break;
                case 'array': defaultValue = '[]'; break;
                default: defaultValue = 'null';
            }
            this.emitLine(`let ${node.name} = ${defaultValue};`);
        }
    }
    
    generateAssignment(node) {
        const value = this.generateNode(node.value);
        this.emitLine(`${node.name} = ${value};`);
    }
    
    generateBinaryOperation(node) {
        const left = this.generateNode(node.left);
        const right = this.generateNode(node.right);
        
        const operatorMap = {
            [TokenType.ADD]: '+',
            [TokenType.SUBTRACT]: '-',
            [TokenType.MULTIPLY]: '*',
            [TokenType.DIVIDE]: '/',
            [TokenType.GREATER_THAN]: '>',
            [TokenType.LESS_THAN]: '<',
            [TokenType.EQUAL]: '==='
        };
        
        const jsOperator = operatorMap[node.operator];
        if (!jsOperator) {
            throw new Error(`Unknown operator: ${node.operator}`);
        }
        
        return `(${left} ${jsOperator} ${right})`;
    }
    
    generateConditional(node) {
        const condition = this.generateNode(node.condition);
        this.emitLine(`if (${condition}) {`);
        this.indentLevel++;
        this.generateNode(node.thenBranch);
        this.indentLevel--;
        
        if (node.elseBranch) {
            this.emitLine('} else {');
            this.indentLevel++;
            this.generateNode(node.elseBranch);
            this.indentLevel--;
        }
        
        this.emitLine('}');
    }
    
    generateForLoop(node) {
        const start = this.generateNode(node.start);
        const end = this.generateNode(node.end);
        
        this.emitLine(`for (let ${node.variable} = ${start}; ${node.variable} <= ${end}; ${node.variable}++) {`);
        this.indentLevel++;
        this.generateNode(node.body);
        this.indentLevel--;
        this.emitLine('}');
    }
    
    generateFunctionDeclaration(node) {
        const params = node.parameters.join(', ');
        this.emitLine(`function ${node.name}(${params}) {`);
        this.indentLevel++;
        
        if (node.body) {
            const returnValue = this.generateNode(node.body);
            this.emitLine(`return ${returnValue};`);
        }
        
        this.indentLevel--;
        this.emitLine('}');
        this.emitLine('');
    }
    
    generateFunctionCall(node) {
        const args = node.arguments.map(arg => this.generateNode(arg)).join(', ');
        return `${node.name}(${args})`;
    }
    
    generatePrintStatement(node) {
        const value = this.generateNode(node.expression);
        this.emitLine(`書(${value});`);
    }
    
    generateLiteral(node) {
        if (node.dataType === 'string') {
            return `"${node.value.replace(/"/g, '\\"')}"`;
        }
        return String(node.value);
    }
    
    generateIdentifier(node) {
        return node.name;
    }
}

module.exports = { KanbunCodeGenerator };
