const { KanbunLexer } = require('./src/lexer');

const testInput = '若甲大於乙、書「甲勝乙」。';
console.log('Testing input:', testInput);

const lexer = new KanbunLexer(testInput);
const tokens = lexer.tokenize();

console.log('Tokens:');
tokens.forEach((token, i) => {
    console.log(`${i}: ${token.type} = "${token.value}"`);
});
