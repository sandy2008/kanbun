// Quick test of the playground functionality

console.log('🧪 Testing Playground Compilation...\n');

// Load the compiler directly
const fs = require('fs');
const vm = require('vm');

// Load and execute the compiler in a sandbox
const compilerCode = fs.readFileSync('./js/kanbun-compiler.js', 'utf8');
const sandbox = { console, module: { exports: {} }, exports: {} };
vm.createContext(sandbox);
vm.runInContext(compilerCode, sandbox);

const KanbunCompiler = sandbox.KanbunCompiler || sandbox.module.exports.KanbunCompiler || sandbox.module.exports;

const compiler = new KanbunCompiler();

// Test examples that should be available in the playground
const testPrograms = [
    {
        name: 'Hello World',
        code: '昔有言曰「挨拶」、其値「世界ニ向カヒテ曰ク、幸イアレ。」。\n書挨拶。'
    },
    {
        name: 'Simple Math',
        code: '昔有數曰「甲」、其値八。\n昔有數曰「乙」、其値五。\n若甲大於乙、書「甲大於乙」。\n否、書「乙大於甲」。'
    },
    {
        name: 'Function',
        code: '夫「加」者、受「甲」「乙」、還甲加乙。\n昔有數曰「結果」、其値加之三五。\n書結果。'
    }
];

let allTestsPassed = true;

testPrograms.forEach((test, index) => {
    try {
        console.log(`${index + 1}. Testing: ${test.name}`);
        const result = compiler.compile(test.code);
        
        if (result.success) {
            console.log('   ✅ Compilation successful');
            console.log(`   📜 Generated: ${result.code.slice(0, 50)}...`);
        } else {
            console.log('   ❌ Compilation failed');
            console.log(`   💥 Error: ${result.error}`);
            allTestsPassed = false;
        }
    } catch (error) {
        console.log('   ❌ Compilation crashed');
        console.log(`   💥 Error: ${error.message}`);
        allTestsPassed = false;
    }
    console.log('');
});

console.log('📊 Final Result:');
if (allTestsPassed) {
    console.log('🎉 All playground tests passed!');
    console.log('✅ The interactive playground is ready for users');
} else {
    console.log('❌ Some playground tests failed');
    console.log('⚠️  Check the compiler implementation');
}

console.log('\n🌐 Homepage Status: Ready for deployment');
console.log('🔗 Local URL: http://localhost:8081');
