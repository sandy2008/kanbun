#!/usr/bin/env node

/**
 * Kanbun CLI Tool
 * Command line interface for the Kanbun compiler
 */

const { KanbunCompiler } = require('./compiler');
const fs = require('fs');
const path = require('path');

function showHelp() {
    console.log('Kanbun (漢文) - A Classical Chinese-Inspired Programming Language');
    console.log('');
    console.log('Usage:');
    console.log('  kanbun <command> [options]');
    console.log('');
    console.log('Commands:');
    console.log('  compile <file>     Compile Kanbun source to JavaScript');
    console.log('  run <file>         Compile and run Kanbun source');
    console.log('  repl              Start interactive REPL');
    console.log('  version           Show version information');
    console.log('  help              Show this help message');
    console.log('');
    console.log('Options:');
    console.log('  -o, --output <file>   Output file (for compile command)');
    console.log('  -v, --verbose         Show detailed compilation information');
    console.log('  --ast                 Show Abstract Syntax Tree');
    console.log('  --tokens              Show token stream');
    console.log('');
    console.log('Examples:');
    console.log('  kanbun compile hello.kanbun');
    console.log('  kanbun compile hello.kanbun -o hello.js');
    console.log('  kanbun run fizzbuzz.kanbun');
    console.log('  kanbun repl');
}

function showVersion() {
    const packageJson = require('../package.json');
    console.log(`Kanbun v${packageJson.version}`);
    console.log('A Classical Chinese-Inspired Programming Language');
}

function startRepl() {
    const readline = require('readline');
    const compiler = new KanbunCompiler();
    
    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout,
        prompt: 'kanbun> '
    });
    
    console.log('Kanbun REPL - Enter Kanbun code (type "exit" to quit)');
    console.log('Example: 昔有數曰「甲」、其値五。');
    console.log('');
    
    rl.prompt();
    
    rl.on('line', (line) => {
        const input = line.trim();
        
        if (input === 'exit' || input === '退出') {
            console.log('Goodbye! 再見！');
            rl.close();
            return;
        }
        
        if (input === 'help' || input === '幫助') {
            console.log('REPL Commands:');
            console.log('  exit / 退出  - Exit REPL');
            console.log('  help / 幫助  - Show this help');
            console.log('  clear / 清除 - Clear screen');
            rl.prompt();
            return;
        }
        
        if (input === 'clear' || input === '清除') {
            console.clear();
            rl.prompt();
            return;
        }
        
        if (input) {
            try {
                const result = compiler.run(input);
                if (!result.success) {
                    console.error('Error:', result.error);
                }
            } catch (error) {
                console.error('Error:', error.message);
            }
        }
        
        rl.prompt();
    });
    
    rl.on('close', () => {
        process.exit(0);
    });
}

function main() {
    const args = process.argv.slice(2);
    
    if (args.length === 0) {
        showHelp();
        return;
    }
    
    const command = args[0];
    const compiler = new KanbunCompiler();
    
    switch (command) {
        case 'help':
        case '--help':
        case '-h':
            showHelp();
            break;
            
        case 'version':
        case '--version':
        case '-V':
            showVersion();
            break;
            
        case 'repl':
            startRepl();
            break;
            
        case 'compile': {
            if (args.length < 2) {
                console.error('Error: Please specify input file');
                console.error('Usage: kanbun compile <input.kanbun> [options]');
                process.exit(1);
            }
            
            const inputFile = args[1];
            let outputFile = null;
            let options = {};
            
            // Parse options
            for (let i = 2; i < args.length; i++) {
                const arg = args[i];
                if (arg === '-o' || arg === '--output') {
                    outputFile = args[++i];
                } else if (arg === '-v' || arg === '--verbose') {
                    options.verbose = true;
                } else if (arg === '--ast') {
                    options.showAst = true;
                } else if (arg === '--tokens') {
                    options.showTokens = true;
                }
            }
            
            if (!outputFile) {
                outputFile = inputFile.replace(/\.kanbun$/, '.js');
            }
            
            const result = compiler.compileFile(inputFile, outputFile, options);
            
            if (options.showTokens && result.tokens) {
                console.log('\n=== Tokens ===');
                console.log(result.tokens);
            }
            
            if (options.showAst && result.ast) {
                console.log('\n=== AST ===');
                console.log(JSON.stringify(result.ast, null, 2));
            }
            
            if (!result.success) {
                process.exit(1);
            }
            break;
        }
            
        case 'run': {
            if (args.length < 2) {
                console.error('Error: Please specify input file');
                console.error('Usage: kanbun run <input.kanbun> [options]');
                process.exit(1);
            }
            
            const inputFile = args[1];
            let options = {};
            
            // Parse options
            for (let i = 2; i < args.length; i++) {
                const arg = args[i];
                if (arg === '-v' || arg === '--verbose') {
                    options.verbose = true;
                } else if (arg === '--ast') {
                    options.showAst = true;
                } else if (arg === '--tokens') {
                    options.showTokens = true;
                }
            }
            
            const result = compiler.runFile(inputFile, options);
            
            if (options.showTokens && result.tokens) {
                console.log('\n=== Tokens ===');
                console.log(result.tokens);
            }
            
            if (options.showAst && result.ast) {
                console.log('\n=== AST ===');
                console.log(JSON.stringify(result.ast, null, 2));
            }
            
            if (!result.success) {
                process.exit(1);
            }
            break;
        }
            
        default:
            console.error(`Unknown command: ${command}`);
            console.error('Run "kanbun help" for usage information');
            process.exit(1);
    }
}

if (require.main === module) {
    main();
}

module.exports = { main };
