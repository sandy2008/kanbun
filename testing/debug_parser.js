const { KanbunLexer } = require('./src/lexer');
const { KanbunParser } = require('./src/parser');

const testInput = '昔有數曰「甲」、其値六。';
console.log('Testing input:', testInput);

const lexer = new KanbunLexer(testInput);
const tokens = lexer.tokenize();

console.log('Tokens:');
tokens.forEach((token, i) => {
    console.log(`${i}: ${token.type} = "${token.value}"`);
});

console.log('\nParsing...');
const parser = new KanbunParser(tokens);
const ast = parser.parse();

console.log('AST:', JSON.stringify(ast, null, 2));
