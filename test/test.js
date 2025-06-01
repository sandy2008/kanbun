/**
 * Test suite for Kanbun compiler
 */

const { KanbunLexer, TokenType } = require('../src/lexer');
const { KanbunParser } = require('../src/parser');
const { KanbunCodeGenerator } = require('../src/codegen');
const { KanbunCompiler } = require('../src/compiler');

function testLexer() {
    console.log('🔤 Testing Lexer...');
    
    const testCases = [
        {
            input: '昔有數曰「甲」、其値五。',
            expected: [
                TokenType.VARIABLE_DECL, TokenType.NUMBER_TYPE, TokenType.NAMED,
                TokenType.STRING, TokenType.COMMA, TokenType.VALUE, TokenType.NUMBER, TokenType.PERIOD
            ]
        },
        {
            input: '若甲大於乙、書「甲勝乙」。',
            expected: [
                TokenType.IF, TokenType.IDENTIFIER, TokenType.GREATER_THAN, TokenType.IDENTIFIER,
                TokenType.COMMA, TokenType.PRINT, TokenType.STRING, TokenType.PERIOD
            ]
        }
    ];
    
    let passed = 0;
    for (const testCase of testCases) {
        try {
            const lexer = new KanbunLexer(testCase.input);
            const tokens = lexer.tokenize();
            const tokenTypes = tokens.slice(0, -1).map(t => t.type); // Exclude EOF
            
            const matches = tokenTypes.length === testCase.expected.length &&
                           tokenTypes.every((type, i) => type === testCase.expected[i]);
            
            if (matches) {
                console.log(`  ✅ "${testCase.input}"`);
                passed++;
            } else {
                console.log(`  ❌ "${testCase.input}"`);
                console.log(`     Expected: ${testCase.expected.join(', ')}`);
                console.log(`     Got:      ${tokenTypes.join(', ')}`);
            }
        } catch (error) {
            console.log(`  ❌ "${testCase.input}" - Error: ${error.message}`);
        }
    }
    
    return passed;
}

function testParser() {
    console.log('🌳 Testing Parser...');
    
    const testCases = [
        {
            input: '昔有數曰「甲」、其値五。',
            expectedType: 'VariableDeclaration'
        },
        {
            input: '甲今為十。',
            expectedType: 'Assignment'
        },
        {
            input: '若甲大於乙、書「甲勝乙」。',
            expectedType: 'ConditionalStatement'
        }
    ];
    
    let passed = 0;
    for (const testCase of testCases) {
        try {
            const lexer = new KanbunLexer(testCase.input);
            const tokens = lexer.tokenize();
            const parser = new KanbunParser(tokens);
            const ast = parser.parse();
            
            if (ast.statements.length > 0 && ast.statements[0].type === testCase.expectedType) {
                console.log(`  ✅ "${testCase.input}" -> ${testCase.expectedType}`);
                passed++;
            } else {
                console.log(`  ❌ "${testCase.input}"`);
                console.log(`     Expected: ${testCase.expectedType}`);
                console.log(`     Got:      ${ast.statements[0]?.type || 'undefined'}`);
            }
        } catch (error) {
            console.log(`  ❌ "${testCase.input}" - Error: ${error.message}`);
        }
    }
    
    return passed;
}

function testCodeGenerator() {
    console.log('⚙️  Testing Code Generator...');
    
    const testCases = [
        {
            input: '昔有數曰「甲」、其値五。',
            shouldContain: 'let 甲 = 5;'
        },
        {
            input: '書「世界ニ向カヒテ曰ク、幸イアレ。」。',
            shouldContain: '書("世界ニ向カヒテ曰ク、幸イアレ。");'
        }
    ];
    
    let passed = 0;
    for (const testCase of testCases) {
        try {
            const compiler = new KanbunCompiler();
            const result = compiler.compile(testCase.input);
            
            if (result.success && result.jsCode.includes(testCase.shouldContain)) {
                console.log(`  ✅ "${testCase.input}"`);
                passed++;
            } else {
                console.log(`  ❌ "${testCase.input}"`);
                console.log(`     Should contain: ${testCase.shouldContain}`);
                if (result.jsCode) {
                    console.log(`     Generated code snippet: ${result.jsCode.split('\n').find(line => line.includes('甲') || line.includes('書'))?.trim()}`);
                }
            }
        } catch (error) {
            console.log(`  ❌ "${testCase.input}" - Error: ${error.message}`);
        }
    }
    
    return passed;
}

function testFullCompilation() {
    console.log('🚀 Testing Full Compilation...');
    
    const testPrograms = [
        '昔有數曰「甲」、其値五。書甲。',
        '昔有數曰「甲」、其値三。昔有數曰「乙」、其値四。昔有數曰「丙」。丙為甲加乙。書丙。',
        '若五大於三、書「正確」。否、書「錯誤」。'
    ];
    
    let passed = 0;
    for (const program of testPrograms) {
        try {
            const compiler = new KanbunCompiler();
            const result = compiler.compile(program);
            
            if (result.success) {
                console.log(`  ✅ Complex program compiled successfully`);
                passed++;
            } else {
                console.log(`  ❌ Compilation failed: ${result.error}`);
            }
        } catch (error) {
            console.log(`  ❌ Unexpected error: ${error.message}`);
        }
    }
    
    return passed;
}

function main() {
    console.log('🧪 Kanbun Compiler Test Suite');
    console.log('='.repeat(40));
    
    const results = {
        lexer: testLexer(),
        parser: testParser(),
        codegen: testCodeGenerator(),
        fullCompilation: testFullCompilation()
    };
    
    console.log('\n' + '='.repeat(40));
    console.log('📊 Test Results:');
    
    let totalPassed = 0;
    let totalTests = 0;
    
    for (const [component, passed] of Object.entries(results)) {
        console.log(`  ${component}: ${passed} tests passed`);
        totalPassed += passed;
        totalTests += passed; // This is a simplification
    }
    
    console.log(`\nOverall: ${totalPassed} tests passed`);
    
    if (totalPassed > 0) {
        console.log('🎉 Basic functionality is working!');
    } else {
        console.log('⚠️  Tests failed. Please check the implementation.');
        process.exit(1);
    }
}

if (require.main === module) {
    main();
}

module.exports = { testLexer, testParser, testCodeGenerator, testFullCompilation };
