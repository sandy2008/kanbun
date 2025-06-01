// Test the improved Kanbun compiler with Fibonacci
const fs = require('fs');

// Load the compiler (we'll mock the browser environment)
global.window = {};
const compilerCode = fs.readFileSync('/Users/sandy/kanbun/js/kanbun-compiler.js', 'utf8');
eval(compilerCode);

// Test the Fibonacci code
const fibonacciCode = `夫「Fibonacci」者、受「甲」、
　若甲小於二、還甲。
　否、還Fibonacci之甲減一與Fibonacci之甲減二之和。

昔有數曰「結果」、其値Fibonacci之十。
書結果。`;

console.log('=== Testing Fibonacci Code ===');
console.log('Input:');
console.log(fibonacciCode);
console.log('\n=== Compilation Results ===');

const compiler = new KanbunCompiler();
const result = compiler.compile(fibonacciCode);

console.log('Tokens:');
console.log(JSON.stringify(result.tokens, null, 2));

console.log('\nAST:');
console.log(JSON.stringify(result.ast, null, 2));

console.log('\nGenerated JavaScript:');
console.log(result.javascript);

console.log('\nSuccess:', result.success);
if (!result.success) {
    console.log('Error:', result.error);
}
