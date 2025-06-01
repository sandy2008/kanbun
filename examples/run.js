const { KanbunCompiler } = require('../src/compiler');

/**
 * Test runner for Kanbun examples
 */

async function runExample(filename, description) {
    console.log(`\n🔥 Running Example: ${description}`);
    console.log('='.repeat(50));
    
    const compiler = new KanbunCompiler();
    const result = compiler.runFile(`examples/${filename}`);
    
    if (!result.success) {
        console.error('❌ Example failed:', result.error);
    } else {
        console.log('✅ Example completed successfully');
    }
    
    return result.success;
}

async function main() {
    console.log('🏮 Kanbun Example Runner');
    console.log('Testing the Kanbun compiler with example programs');
    
    const examples = [
        ['hello.kanbun', 'Hello World & Basic Variables'],
        ['conditional.kanbun', 'Conditional Statements'],
        ['functions.kanbun', 'Function Definition & Usage'],
        ['fizzbuzz.kanbun', 'FizzBuzz Algorithm']
    ];
    
    let passed = 0;
    let total = examples.length;
    
    for (const [filename, description] of examples) {
        try {
            const success = await runExample(filename, description);
            if (success) passed++;
        } catch (error) {
            console.error('❌ Unexpected error:', error);
        }
    }
    
    console.log('\n' + '='.repeat(50));
    console.log(`📊 Results: ${passed}/${total} examples passed`);
    
    if (passed === total) {
        console.log('🎉 All examples passed! Kanbun compiler is working correctly.');
    } else {
        console.log('⚠️  Some examples failed. Please check the implementation.');
        process.exit(1);
    }
}

if (require.main === module) {
    main().catch(console.error);
}

module.exports = { runExample };
