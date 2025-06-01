const { KanbunCompiler } = require('./src/compiler');

console.log('🔍 Debugging function call assignment...');

const code = '結果一為加之三與五。';
console.log('Input:', code);

const compiler = new KanbunCompiler();
try {
    const result = compiler.compile(code);
    
    if (result.success) {
        console.log('\nGenerated JavaScript:');
        console.log(result.jsCode);
    } else {
        console.error('Compilation failed:', result.error);
    }
} catch (error) {
    console.error('Error:', error.message);
}
