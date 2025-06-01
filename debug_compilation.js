// Debug the playground compilation issue
console.log('🔍 Debugging Playground Compilation...\n');

// Load the compiler
const fs = require('fs');
const compilerCode = fs.readFileSync('./js/kanbun-compiler.js', 'utf8');

// Extract the KanbunCompiler class
eval(compilerCode);

const compiler = new KanbunCompiler();

// Test simple examples
const testCases = [
    {
        name: 'Simple String',
        code: '書「Hello World」。'
    },
    {
        name: 'Variable Declaration', 
        code: '昔有數曰「甲」、其值五。\n書甲。'
    },
    {
        name: 'String Variable',
        code: '昔有言曰「挨拶」、其値「世界ニ向カヒテ曰ク、幸イアレ。」。\n書挨拶。'
    }
];

testCases.forEach(test => {
    console.log(`\n📝 Testing: ${test.name}`);
    console.log(`Input: ${test.code}`);
    
    try {
        const result = compiler.compile(test.code);
        
        if (result.success) {
            console.log('✅ Compilation successful');
            console.log(`Generated JS: ${result.javascript}`);
            
            // Try to execute the generated JavaScript
            try {
                const outputs = [];
                const originalLog = console.log;
                console.log = (...args) => {
                    outputs.push(args.join(' '));
                };
                
                eval(result.javascript);
                console.log = originalLog;
                
                if (outputs.length > 0) {
                    console.log(`Output: ${outputs.join('\\n')}`);
                } else {
                    console.log('No output generated');
                }
            } catch (execError) {
                console.log(`❌ Execution error: ${execError.message}`);
            }
        } else {
            console.log('❌ Compilation failed');
            console.log(`Error: ${result.error}`);
        }
    } catch (error) {
        console.log(`💥 Compilation crashed: ${error.message}`);
    }
});

console.log('\n🏁 Debug complete');
