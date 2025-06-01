// Generated JavaScript code from Kanbun
// 漢文 -> JavaScript transpiler output

// Built-in functions
function 書(value) {
  console.log(value);
}

function 問(prompt) {
  const readline = require("readline");
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });
  return new Promise((resolve) => {
    rl.question(prompt || "", (answer) => {
      rl.close();
      resolve(answer);
    });
  });
}

function 長(value) {
  return value.length;
}

function now() {
  return Date.now();
}

// Helper function for divisibility check
function 能整除(num, ...divisors) {
  return divisors.every(d => num % d === 0);
}

// Main program
(async function main() {
})();
