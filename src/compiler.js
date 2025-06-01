/**
 * Kanbun Compiler (编译器主入口)
 * Main compiler that orchestrates lexing, parsing, and code generation
 */

const fs = require('fs');
const path = require('path');
const { KanbunLexer } = require('./lexer');
const { KanbunParser } = require('./parser');
const { KanbunCodeGenerator } = require('./codegen');

class KanbunCompiler {
    constructor() {
        this.lexer = null;
        this.parser = null;
        this.codegen = null;
    }
    
    compile(source, options = {}) {
        try {
            // Lexical Analysis (词法分析)
            console.log('🔤 Lexical Analysis...');
            this.lexer = new KanbunLexer(source);
            const tokens = this.lexer.tokenize();
            
            if (options.verbose) {
                console.log('Tokens:', tokens);
            }
            
            // Syntax Analysis (语法分析)
            console.log('🌳 Syntax Analysis...');
            this.parser = new KanbunParser(tokens);
            const ast = this.parser.parse();
            
            if (options.verbose) {
                console.log('AST:', JSON.stringify(ast, null, 2));
            }
            
            // Code Generation (代码生成)
            console.log('⚙️  Code Generation...');
            this.codegen = new KanbunCodeGenerator();
            const jsCode = this.codegen.generate(ast);
            
            console.log('✅ Compilation successful!');
            return {
                success: true,
                tokens,
                ast,
                jsCode
            };
            
        } catch (error) {
            console.error('❌ Compilation failed:', error.message);
            return {
                success: false,
                error: error.message,
                stack: error.stack
            };
        }
    }
    
    compileFile(inputPath, outputPath = null, options = {}) {
        try {
            // Read source file
            const source = fs.readFileSync(inputPath, 'utf8');
            console.log(`📖 Reading file: ${inputPath}`);
            
            // Compile
            const result = this.compile(source, options);
            
            if (!result.success) {
                return result;
            }
            
            // Write output file
            if (outputPath) {
                fs.writeFileSync(outputPath, result.jsCode);
                console.log(`📝 Output written to: ${outputPath}`);
            }
            
            return result;
            
        } catch (error) {
            console.error('❌ File operation failed:', error.message);
            return {
                success: false,
                error: error.message,
                stack: error.stack
            };
        }
    }
    
    run(source, options = {}) {
        const result = this.compile(source, options);
        
        if (!result.success) {
            return result;
        }
        
        try {
            console.log('🚀 Executing generated code...');
            console.log('--- Output ---');
            eval(result.jsCode);
            console.log('--- End ---');
            
            return {
                ...result,
                executed: true
            };
            
        } catch (error) {
            console.error('❌ Runtime error:', error.message);
            return {
                ...result,
                executed: false,
                runtimeError: error.message
            };
        }
    }
    
    runFile(inputPath, options = {}) {
        try {
            const source = fs.readFileSync(inputPath, 'utf8');
            return this.run(source, options);
        } catch (error) {
            console.error('❌ File read failed:', error.message);
            return {
                success: false,
                error: error.message
            };
        }
    }
}

// Export for use as module
module.exports = { KanbunCompiler };

// CLI usage when run directly
if (require.main === module) {
    const args = process.argv.slice(2);
    
    if (args.length === 0) {
        console.log('Usage: node compiler.js <input.kanbun> [output.js] [--verbose] [--run]');
        console.log('');
        console.log('Options:');
        console.log('  --verbose  Show detailed compilation information');
        console.log('  --run      Execute the code after compilation');
        console.log('');
        console.log('Examples:');
        console.log('  node compiler.js hello.kanbun');
        console.log('  node compiler.js hello.kanbun hello.js');
        console.log('  node compiler.js hello.kanbun --run');
        process.exit(1);
    }
    
    const inputPath = args[0];
    let outputPath = null;
    let options = {};
    
    // Parse arguments
    for (let i = 1; i < args.length; i++) {
        const arg = args[i];
        if (arg === '--verbose') {
            options.verbose = true;
        } else if (arg === '--run') {
            options.run = true;
        } else if (!outputPath && !arg.startsWith('--')) {
            outputPath = arg;
        }
    }
    
    const compiler = new KanbunCompiler();
    
    if (options.run) {
        // Run directly
        const result = compiler.runFile(inputPath, options);
        if (!result.success) {
            process.exit(1);
        }
    } else {
        // Compile to file
        if (!outputPath) {
            outputPath = inputPath.replace(/\.kanbun$/, '.js');
        }
        
        const result = compiler.compileFile(inputPath, outputPath, options);
        if (!result.success) {
            process.exit(1);
        }
        
        console.log(`✨ Compilation complete! Run with: node ${outputPath}`);
    }
}
