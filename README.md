# **Kanbun: A Classical Chinese-Inspired Programming Language**

## **Overview**

**Kanbun (漢文)** is a domain-specific esoteric programming language inspired by the **literary Chinese (文言文)** tradition, read through its **Japanese pronunciation** system (on'yomi). Just as Japanese scholars historically interpreted Chinese texts through kanbun kundoku, this language mimics the structure of classical Chinese while using modern programming semantics.

Kanbun is poetic, minimalist, and historically flavored — a blend of ancient logic and modern computing.

---

## **Core Philosophy**

* **Elegance**: Code should resemble an old scroll or imperial edict.
* **Minimalism**: Inspired by classical brevity and omission of subjects.
* **Kundoku Mapping**: Operates like kanbun kundoku — classical Chinese read with Japanese syntax and logic.
* **Harmony with Nature**: Prioritizes order, clarity, and symmetry, like a Confucian algorithm.

---

## **Syntax & Grammar Rules**

### **1. Variable Declaration**

```kanbun
昔有數曰「甲」、其値五。
```

> *Long ago, there was a number named “A”, its value is 5.*

### **2. Variable Assignment**

```kanbun
甲今為十。
```

> *Let A now be 10.*

### **3. Arithmetic Operations**

```kanbun
乙為甲加三。
丙為乙減二。
丁為丙乗四。
戊為丁除五。
```

### **4. Conditional Statements**

```kanbun
若甲大於乙、書「甲勝乙」。
否、書「乙勝甲」。
```

### **5. Looping**

```kanbun
凡數一至十、名曰「甲」、皆行如左：
　書「今甲」、次以甲。
```

### **6. Function Definition**

```kanbun
夫「加」者、受「甲」「乙」、還其和。
```

### **7. Function Invocation**

```kanbun
丙為加之三與五。
```

---

## **Data Types**

| Kanbun  | Type       | Example             |
| ------- | ---------- | ------------------- |
| 數 (すう)  | Number     | 數曰「甲」、其値五。          |
| 言 (げん)  | String     | 言曰「乙」、其値「今日は」。      |
| 是非 (ぜひ) | Boolean    | 是 (true), 非 (false) |
| 巻 (かん)  | List/Array | 巻曰「書」、含「甲」「乙」。      |

---

## **Built-in Functions**

| Kanbun Code | Meaning                  |
| ----------- | ------------------------ |
| 書「⋯」        | Print to console         |
| 問「⋯」        | Read input               |
| 長「⋯」        | Length of list or string |
| 今時          | Current timestamp        |

---

## **Example: FizzBuzz**

```kanbun
凡數一至百、名「甲」、皆行如左：
　若甲能整除三五、
　　書「FizzBuzz」；
　若甲能整除三、
　　書「Fizz」；
　若甲能整除五、
　　書「Buzz」；
　否、書甲。
```

---

## **Compiler Design**

* **Lexing**: Tokenizes Kanbun grammar (comma-separated clauses, kanji-verb phrasing).
* **Parsing**: Mimics classical Japanese kanbun kundoku structure — verb at the end, modifiers front-loaded.
* **Transpilation Target**: JavaScript or Python via intermediate AST.
* **Optional Kundoku Mode**: Annotated parsing (返り点 style) for didactic use.

---

## **Design Goals**

* **Cultural Computing**: Infuse programming with literary and historical aesthetics.
* **Educational Value**: Learn kanji structure, logic, and expression.
* **Simplicity**: Code that can be read aloud like an imperial decree.

---

## **Installation & Usage**

### **Prerequisites**

- Node.js (v14 or higher)
- npm or yarn package manager

### **Installation**

Clone the repository and install dependencies:

```bash
git clone https://github.com/sandy2008/kanbun
cd kanbun
npm install
```

### **Basic Usage**

#### **1. Command Line Interface**

The Kanbun compiler provides several commands:

```bash
# Compile Kanbun source to JavaScript
node src/cli.js compile examples/hello.kanbun

# Compile with custom output file
node src/cli.js compile examples/hello.kanbun -o hello.js

# Compile and run immediately
node src/cli.js run examples/hello.kanbun

# Show compilation details (tokens, AST)
node src/cli.js run examples/hello.kanbun --tokens --ast

# Start interactive REPL
node src/cli.js repl

# Show help
node src/cli.js help
```

#### **2. Using the Compiler Programmatically**

```javascript
const { KanbunCompiler } = require('./src/compiler');

const compiler = new KanbunCompiler();

// Compile code string
const code = '昔有數曰「甲」、其値五。書甲。';
const result = compiler.compile(code);

if (result.success) {
    console.log('Generated JavaScript:');
    console.log(result.jsCode);
}

// Compile and run file
compiler.runFile('examples/hello.kanbun');
```

#### **3. Example Programs**

The `examples/` directory contains several demonstration programs:

```bash
# Hello World with variables
node src/cli.js run examples/hello.kanbun

# Conditional statements
node src/cli.js run examples/conditional.kanbun

# Function definitions and calls
node src/cli.js run examples/functions.kanbun

# FizzBuzz algorithm
node src/cli.js run examples/fizzbuzz.kanbun
```

#### **4. Writing Your First Kanbun Program**

Create a file `my_program.kanbun`:

```kanbun
// Variable declaration
昔有數曰「年齡」、其値二十五。
昔有言曰「姓名」、其値「李白」。

// Print values
書「姓名：」。
書姓名。
書「年齡：」。
書年齡。

// Conditional logic
若年齡大於十八、書「成年人」。
否、書「未成年」。
```

Compile and run:

```bash
node src/cli.js run my_program.kanbun
```

#### **5. Interactive REPL**

Start the interactive REPL for experimentation:

```bash
node src/cli.js repl
```

Example REPL session:

```
kanbun> 昔有數曰「甲」、其値三。
kanbun> 昔有數曰「乙」、其値四。
kanbun> 書甲加乙。
7
kanbun> exit
```

### **Testing**

Run the test suite to verify installation:

```bash
# Run unit tests
npm test

# Run all example programs
node examples/run.js

# Run specific tests
node test/test.js
```

### **Language Reference**

For detailed syntax and grammar rules, see the examples above or explore the `examples/` directory for working code samples.

---

## **Possible Extensions**

* **Kanbun-to-JS Transpiler** ✅ (Completed)
* **VSCode plugin with kanbun-themed fonts**
* **Online REPL that displays vertical-scroll style code rendering**
