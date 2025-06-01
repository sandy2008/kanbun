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
  for (let 甲 = 1; 甲 <= 20; 甲++) {
    if (能整除(甲, 3, 5)) {
      書("FizzBuzz");
    }
    if (能整除(甲, 3)) {
      書("Fizz");
    }
    if (能整除(甲, 5)) {
      書("Buzz");
    } else {
      書(甲);
    }
  }
})();
