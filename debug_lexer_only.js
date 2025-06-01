const { KanbunLexer } = require('./src/lexer');

console.log('Testing lexer only...');
const testInput = '昔有數曰「甲」、其値六。';
const lexer = new KanbunLexer(testInput);
const tokens = lexer.tokenize();

console.log('Tokens found:');
tokens.forEach((token, i) => {
    console.log(`${i}: ${token.type} = "${token.value}"`);
});

console.log('Lexer test complete.');
