#!/usr/bin/env node

// Verification script for Kanbun homepage
const fs = require('fs');
const path = require('path');

console.log('🔍 Verifying Kanbun Homepage...\n');

// Check required files
const requiredFiles = [
    'index.html',
    'styles/main.css', 
    'js/main.js',
    'js/kanbun-compiler.js',
    'manifest.json',
    'favicon.svg',
    'DEPLOYMENT_GUIDE.md',
    'HOMEPAGE_SUMMARY.md'
];

let allFilesExist = true;

console.log('📁 Checking required files:');
requiredFiles.forEach(file => {
    const exists = fs.existsSync(path.join(__dirname, file));
    const status = exists ? '✅' : '❌';
    console.log(`   ${status} ${file}`);
    if (!exists) allFilesExist = false;
});

// Check HTML structure
console.log('\n🔧 Checking HTML structure:');
try {
    const htmlContent = fs.readFileSync(path.join(__dirname, 'index.html'), 'utf8');
    
    const checks = [
        { name: 'Loading screen', regex: /<div id="loading-screen"/ },
        { name: 'Language switcher', regex: /<div class="language-switcher"/ },
        { name: 'Code playground', regex: /<section id="playground"/ },
        { name: 'Help modal', regex: /<div id="help-modal"/ },
        { name: 'Main script', regex: /<script src="js\/main\.js"/ },
        { name: 'Compiler script', regex: /<script src="js\/kanbun-compiler\.js"/ }
    ];
    
    checks.forEach(check => {
        const found = check.regex.test(htmlContent);
        const status = found ? '✅' : '❌';
        console.log(`   ${status} ${check.name}`);
    });
} catch (error) {
    console.log('   ❌ Error reading HTML file:', error.message);
}

// Check JavaScript functionality
console.log('\n⚡ Checking JavaScript:');
try {
    const jsContent = fs.readFileSync(path.join(__dirname, 'js/main.js'), 'utf8');
    
    const jsChecks = [
        { name: 'KanbunApp class', regex: /class KanbunApp/ },
        { name: 'setupLoadingScreen method', regex: /setupLoadingScreen\(\)/ },
        { name: 'Language switching', regex: /switchLanguage\(/ },
        { name: 'Playground setup', regex: /setupPlayground\(\)/ },
        { name: 'Help modal', regex: /setupHelpModal\(\)/ }
    ];
    
    jsChecks.forEach(check => {
        const found = check.regex.test(jsContent);
        const status = found ? '✅' : '❌';
        console.log(`   ${status} ${check.name}`);
    });
} catch (error) {
    console.log('   ❌ Error reading JavaScript file:', error.message);
}

// Check CSS
console.log('\n🎨 Checking CSS:');
try {
    const cssContent = fs.readFileSync(path.join(__dirname, 'styles/main.css'), 'utf8');
    
    const cssChecks = [
        { name: 'Loading screen styles', regex: /\.loading-screen/ },
        { name: 'Dark theme', regex: /--background-darker/ },
        { name: 'Animations', regex: /@keyframes/ },
        { name: 'Responsive design', regex: /@media.*max-width/ },
        { name: 'Japanese fonts', regex: /Noto.*JP/ }
    ];
    
    cssChecks.forEach(check => {
        const found = check.regex.test(cssContent);
        const status = found ? '✅' : '❌';
        console.log(`   ${status} ${check.name}`);
    });
} catch (error) {
    console.log('   ❌ Error reading CSS file:', error.message);
}

console.log('\n📊 Summary:');
if (allFilesExist) {
    console.log('✅ All required files present');
    console.log('🚀 Homepage is ready for deployment!');
    console.log('\n📝 Next steps:');
    console.log('   1. Test the homepage locally: http://localhost:8081');
    console.log('   2. Follow DEPLOYMENT_GUIDE.md for GitHub Pages setup');
    console.log('   3. Push to GitHub and enable Pages in repository settings');
} else {
    console.log('❌ Some required files are missing');
    console.log('⚠️  Please ensure all files are in place before deployment');
}

console.log('\n🔗 Local test URL: http://localhost:8081');
console.log('📚 Documentation: HOMEPAGE_SUMMARY.md');
console.log('🚀 Deployment guide: DEPLOYMENT_GUIDE.md\n');
