/* Kanbun Programming Language - Main JavaScript functionality */

class KanbunApp {
    constructor() {
        this.currentLanguage = 'ja';
        this.compiler = new KanbunCompiler();
        this.editorElement = null;
        this.outputElement = null;
        this.isLoading = false;
        this.examples = {
            hello: {
                ja: '昔有言曰「挨拶」、其値「世界ニ向カヒテ曰ク、幸イアレ。」。\n書挨拶。',
                en: '昔有言曰「挨拶」、其値「世界ニ向カヒテ曰ク、幸イアレ。」。\n書挨拶。',
                name: { ja: 'Hello World', en: 'Hello World' }
            },
            fibonacci: {
                ja: '夫「Fibonacci」者、受「甲」、\n　若甲小於二、還甲。\n　否、還Fibonacci之甲減一與Fibonacci之甲減二之和。\n\n昔有數曰「結果」、其値Fibonacci之十。\n書結果。',
                en: '夫「Fibonacci」者、受「甲」、\n　若甲小於二、還甲。\n　否、還Fibonacci之甲減一與Fibonacci之甲減二之和。\n\n昔有數曰「結果」、其値Fibonacci之十。\n書結果。',
                name: { ja: 'Fibonacci数列', en: 'Fibonacci Sequence' }
            },
            fizzbuzz: {
                ja: '凡數一至二十、名曰「甲」、皆行如左：\n　若甲能整除三五、書「FizzBuzz」。\n　否、若甲能整除三、書「Fizz」。\n　否、若甲能整除五、書「Buzz」。\n　否、書甲。',
                en: '凡數一至二十、名曰「甲」、皆行如左：\n　若甲能整除三五、書「FizzBuzz」。\n　否、若甲能整除三、書「Fizz」。\n　否、若甲能整除五、書「Buzz」。\n　否、書甲。',
                name: { ja: 'FizzBuzz', en: 'FizzBuzz' }
            },
            function: {
                ja: '夫「加」者、受「甲」「乙」、還甲加乙。\n夫「乘」者、受「甲」「乙」、還甲乘乙。\n\n昔有數曰「第一」、其値五。\n昔有數曰「第二」、其値三。\n昔有數曰「和」、其値加之第一第二。\n昔有數曰「積」、其値乘之第一第二。\n\n書「和為」。\n書和。\n書「積為」。\n書積。',
                en: '夫「加」者、受「甲」「乙」、還甲加乙。\n夫「乘」者、受「甲」「乙」、還甲乘乙。\n\n昔有數曰「第一」、其値五。\n昔有數曰「第二」、其値三。\n昔有數曰「和」、其値加之第一第二。\n昔有數曰「積」、其値乘之第一第二。\n\n書「和為」。\n書和。\n書「積為」。\n書積。',
                name: { ja: '関数例', en: 'Function Example' }
            },
            math: {
                ja: '昔有數曰「甲」、其値八。\n昔有數曰「乙」、其値五。\n若甲大於乙、書「甲大於乙」。\n否、書「乙大於甲」。',
                en: '昔有數曰「甲」、其値八。\n昔有數曰「乙」、其値五。\n若甲大於乙、書「甲大於乙」。\n否、書「乙大於甲」。',
                name: { ja: '数学計算', en: 'Mathematical Calculation' }
            },
            advanced: {
                ja: '夫「階乘」者、受「甲」、\n　若甲等於一、還一。\n　否、還甲乘階乘之甲減一。\n\n昔有數曰「數字」、其値五。\n昔有數曰「結果」、其値階乘之數字。\n書「五的階乘是」。\n書結果。',
                en: '夫「階乘」者、受「甲」、\n　若甲等於一、還一。\n　否、還甲乘階乘之甲減一。\n\n昔有數曰「數字」、其値五。\n昔有數曰「結果」、其値階乘之數字。\n書「五的階乘是」。\n書結果。',
                name: { ja: '階乗計算', en: 'Factorial Calculation' }
            }
        };
        
        this.init();
    }

    init() {
        this.setupLanguageSwitcher();
        this.setupNavigation();
        this.setupPlayground();
        this.setupLoadingScreen();
        this.setupAnimations();
        this.setupExamples();
        this.setupErrorHandling();
        this.setupPerformanceOptimizations();
        this.setupKeyboardShortcuts();
        this.setupAccessibility();
        this.setupAdvancedFeatures();
        this.setupHelpModal();
        
        console.log('Kanbun app initialized successfully');
    }

    setupLoading() {
        const loadingScreen = document.getElementById('loading-screen');
        if (loadingScreen) {
            // Simulate loading progress
            const progressBar = loadingScreen.querySelector('.progress-bar');
            if (progressBar) {
                progressBar.style.width = '100%';
            }
        }
    }

    hideLoading() {
        const loadingScreen = document.getElementById('loading-screen');
        if (loadingScreen) {
            loadingScreen.style.opacity = '0';
            setTimeout(() => {
                loadingScreen.style.display = 'none';
            }, 500);
        }
    }

    setupLanguageSwitcher() {
        const langButtons = document.querySelectorAll('.lang-btn');
        langButtons.forEach(btn => {
            btn.addEventListener('click', () => {
                const lang = btn.dataset.lang;
                this.switchLanguage(lang);
                
                // Update active state
                langButtons.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
            });
        });
    }

    switchLanguage(lang) {
        this.currentLanguage = lang;
        
        // Update all elements with data-ja and data-en attributes
        const elements = document.querySelectorAll('[data-ja][data-en]');
        elements.forEach(element => {
            const text = element.dataset[lang];
            if (text) {
                // Handle different element types
                if (element.tagName === 'INPUT' || element.tagName === 'TEXTAREA') {
                    if (element.placeholder !== undefined) {
                        element.placeholder = text.replace(/&#10;/g, '\\n');
                    }
                } else {
                    element.innerHTML = text;
                }
            }
        });

        // Update placeholders specifically
        const placeholderElements = document.querySelectorAll(`[data-${lang}-placeholder]`);
        placeholderElements.forEach(element => {
            const placeholder = element.dataset[lang + 'Placeholder'];
            if (placeholder && element.placeholder !== undefined) {
                element.placeholder = placeholder.replace(/&#10;/g, '\\n');
            }
        });

        // Update document title
        const titles = {
            ja: '漢文 (Kanbun) - 古典中国語風プログラミング言語',
            en: 'Kanbun - Classical Chinese-inspired Programming Language'
        };
        document.title = titles[lang];
        
        // Update example options
        this.updateExampleOptions();
    }

    updateExampleOptions() {
        const exampleSelect = document.getElementById('example-select');
        if (exampleSelect) {
            const options = exampleSelect.querySelectorAll('option[value]');
            options.forEach(option => {
                const value = option.value;
                if (value && this.examples[value]) {
                    option.textContent = this.examples[value].name[this.currentLanguage];
                }
            });
        }
    }

    setupNavigation() {
        // Smooth scrolling for navigation links
        const navLinkElements = document.querySelectorAll('.nav-link[href^="#"]');
        navLinkElements.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const targetId = link.getAttribute('href').substring(1);
                const targetElement = document.getElementById(targetId);
                
                if (targetElement) {
                    const offset = 80; // Account for fixed navbar
                    const targetPosition = targetElement.offsetTop - offset;
                    
                    window.scrollTo({
                        top: targetPosition,
                        behavior: 'smooth'
                    });
                    
                    // Update active nav link
                    navLinkElements.forEach(l => l.classList.remove('active'));
                    link.classList.add('active');
                }
            });
        });

        // Mobile navigation toggle
        const navToggle = document.querySelector('.nav-toggle');
        const navLinksContainer = document.querySelector('.nav-links');
        
        if (navToggle && navLinksContainer) {
            navToggle.addEventListener('click', () => {
                navLinksContainer.classList.toggle('active');
            });
        }
    }

    setupPlayground() {
        const runBtn = document.getElementById('run-btn');
        const clearBtn = document.getElementById('clear-btn');
        const clearOutputBtn = document.getElementById('clear-output-btn');
        const codeEditor = document.getElementById('code-editor');
        const outputContainer = document.getElementById('output-container');
        const exampleSelect = document.getElementById('example-select');
        
        // Tab switching
        const tabBtns = document.querySelectorAll('.tab-btn');
        const tabPanes = document.querySelectorAll('.tab-pane');
        
        tabBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                const targetTab = btn.dataset.tab;
                
                // Update active tab button
                tabBtns.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                
                // Show target tab pane
                tabPanes.forEach(pane => {
                    pane.classList.remove('active');
                    if (pane.id === targetTab + '-tab') {
                        pane.classList.add('active');
                    }
                });
            });
        });

        // Run code
        if (runBtn && codeEditor && outputContainer) {
            runBtn.addEventListener('click', () => {
                this.runKanbunCode(codeEditor.value);
            });
        }

        // Clear editor
        if (clearBtn && codeEditor) {
            clearBtn.addEventListener('click', () => {
                codeEditor.value = '';
                codeEditor.focus();
            });
        }

        // Clear output
        if (clearOutputBtn && outputContainer) {
            clearOutputBtn.addEventListener('click', () => {
                this.clearOutput();
            });
        }

        // Example selection
        if (exampleSelect && codeEditor) {
            exampleSelect.addEventListener('change', () => {
                const selectedExample = exampleSelect.value;
                if (selectedExample && this.examples[selectedExample]) {
                    codeEditor.value = this.examples[selectedExample][this.currentLanguage];
                    codeEditor.focus();
                }
            });
        }

        // Auto-resize textarea
        if (codeEditor) {
            codeEditor.addEventListener('input', () => {
                this.autoResizeTextarea(codeEditor);
            });
        }
    }

    setupExamples() {
        const loadExampleBtns = document.querySelectorAll('.load-example');
        const codeEditor = document.getElementById('code-editor');
        
        loadExampleBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                const exampleName = btn.dataset.example;
                if (exampleName && this.examples[exampleName] && codeEditor) {
                    codeEditor.value = this.examples[exampleName][this.currentLanguage];
                    
                    // Scroll to playground
                    const playground = document.getElementById('playground');
                    if (playground) {
                        playground.scrollIntoView({ behavior: 'smooth' });
                    }
                    
                    // Focus editor
                    setTimeout(() => codeEditor.focus(), 500);
                }
            });
        });
    }

    setupBackgroundEffects() {
        // Matrix rain effect
        this.setupMatrixRain();
        
        // Floating particles
        this.setupFloatingParticles();
    }

    setupMatrixRain() {
        const canvas = document.getElementById('matrix-canvas');
        if (!canvas) return;
        
        const ctx = canvas.getContext('2d');
        
        const resizeCanvas = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        };
        
        resizeCanvas();
        window.addEventListener('resize', resizeCanvas);
        
        const columns = Math.floor(canvas.width / 20);
        const drops = Array(columns).fill(1);
        
        const chars = '漢文程式語言古典中國風格編碼藝術美學0123456789';
        
        const draw = () => {
            ctx.fillStyle = 'rgba(13, 17, 23, 0.05)';
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            
            ctx.fillStyle = '#8B4513';
            ctx.font = '15px monospace';
            
            for (let i = 0; i < drops.length; i++) {
                const text = chars[Math.floor(Math.random() * chars.length)];
                ctx.fillText(text, i * 20, drops[i] * 20);
                
                if (drops[i] * 20 > canvas.height && Math.random() > 0.975) {
                    drops[i] = 0;
                }
                drops[i]++;
            }
        };
        
        setInterval(draw, 35);
    }

    setupFloatingParticles() {
        const particlesContainer = document.querySelector('.floating-particles');
        if (!particlesContainer) return;
        
        const createParticle = () => {
            const particle = document.createElement('div');
            particle.style.cssText = `
                position: absolute;
                width: 4px;
                height: 4px;
                background: rgba(139, 69, 19, 0.3);
                border-radius: 50%;
                pointer-events: none;
                left: ${Math.random() * 100}%;
                top: ${Math.random() * 100}%;
                animation: float ${5 + Math.random() * 10}s ease-in-out infinite;
            `;
            
            particlesContainer.appendChild(particle);
            
            setTimeout(() => {
                particle.remove();
            }, 15000);
        };
        
        // Create initial particles
        for (let i = 0; i < 20; i++) {
            setTimeout(createParticle, i * 100);
        }
        
        // Continue creating particles
        setInterval(createParticle, 500);
    }

    setupScrollEffects() {
        // Navbar background on scroll
        const navbar = document.querySelector('.navbar');
        
        window.addEventListener('scroll', () => {
            if (window.scrollY > 50) {
                navbar.style.background = 'rgba(13, 17, 23, 0.95)';
            } else {
                navbar.style.background = 'rgba(13, 17, 23, 0.9)';
            }
        });

        // Intersection Observer for animations
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.animation = 'fadeInUp 0.6s ease forwards';
                }
            });
        }, observerOptions);

        // Observe sections
        const sections = document.querySelectorAll('section');
        sections.forEach(section => {
            observer.observe(section);
        });
    }

    setupErrorHandling() {
        // Global error handler
        window.addEventListener('error', (event) => {
            console.error('Application error:', event.error);
            this.showUserFeedback('アプリケーションエラーが発生しました / Application error occurred', 'error');
        });

        window.addEventListener('unhandledrejection', (event) => {
            console.error('Unhandled promise rejection:', event.reason);
            this.showUserFeedback('予期しないエラーが発生しました / Unexpected error occurred', 'error');
        });
    }

    setupPerformanceOptimizations() {
        // Debounce compilation to improve performance
        this.debouncedCompile = this.debounce(this.compileCode.bind(this), 300);
        
        // Add performance monitoring
        if ('performance' in window) {
            window.addEventListener('load', () => {
                const loadTime = performance.now();
                console.log(`Page loaded in ${loadTime.toFixed(2)}ms`);
            });
        }
    }

    debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func.apply(this, args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }

    showUserFeedback(message, type = 'info') {
        // Create or update feedback element
        let feedback = document.getElementById('user-feedback');
        if (!feedback) {
            feedback = document.createElement('div');
            feedback.id = 'user-feedback';
            feedback.style.cssText = `
                position: fixed;
                top: 20px;
                right: 20px;
                padding: 12px 20px;
                border-radius: 8px;
                color: white;
                font-weight: 500;
                z-index: 1000;
                transform: translateX(100%);
                transition: transform 0.3s ease;
                max-width: 300px;
                box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
            `;
            document.body.appendChild(feedback);
        }

        // Set type-specific styling
        const colors = {
            info: '#3b82f6',
            success: '#10b981',
            warning: '#f59e0b',
            error: '#ef4444'
        };

        feedback.style.backgroundColor = colors[type] || colors.info;
        feedback.textContent = message;
        feedback.style.transform = 'translateX(0)';

        // Auto-hide after 3 seconds
        setTimeout(() => {
            feedback.style.transform = 'translateX(100%)';
        }, 3000);
    }

    runKanbunCode(code) {
        const outputContainer = document.getElementById('output-container');
        const jsOutput = document.getElementById('js-output');
        const astOutput = document.getElementById('ast-output');
        const tokensOutput = document.getElementById('tokens-output');
        
        if (!code.trim()) {
            this.showOutput('请输入代码后再执行', 'error');
            return;
        }

        try {
            // Clear previous output
            this.clearOutput();
            
            // Check if Kanbun compiler is available
            if (typeof KanbunCompiler !== 'undefined') {
                const compiler = new KanbunCompiler();
                const result = compiler.compile(code);
                
                // Show JavaScript output
                if (jsOutput) {
                    jsOutput.textContent = result.javascript || '// 编译失败';
                }
                
                // Show AST
                if (astOutput) {
                    astOutput.textContent = JSON.stringify(result.ast, null, 2) || '// AST 生成失败';
                }
                
                // Show tokens
                if (tokensOutput) {
                    tokensOutput.textContent = JSON.stringify(result.tokens, null, 2) || '// Token 分析失败';
                }
                
                // Execute the compiled JavaScript
                if (result.javascript) {
                    this.executeJavaScript(result.javascript);
                } else {
                    this.showOutput('编译失败：无法生成有效的JavaScript代码', 'error');
                }
                
            } else {
                // Fallback: simulate compilation
                this.simulateCompilation(code);
            }
            
        } catch (error) {
            this.showOutput(`执行错误：${error.message}`, 'error');
            console.error('Kanbun execution error:', error);
        }
    }

    simulateCompilation(code) {
        const jsOutput = document.getElementById('js-output');
        const astOutput = document.getElementById('ast-output');
        const tokensOutput = document.getElementById('tokens-output');
        
        // Simple pattern-based translation for demo
        let jsCode = code
            .replace(/昔有數曰「([^」]+)」、其値([^。]+)。/g, 'let $1 = $2;')
            .replace(/昔有言曰「([^」]+)」、其値「([^」]+)」。/g, 'let $1 = "$2";')
            .replace(/書([^。]+)。/g, 'console.log($1);')
            .replace(/若([^、]+)、([^。]+)。/g, 'if ($1) { $2 }')
            .replace(/否、([^。]+)。/g, 'else { $1 }')
            .replace(/大於/g, '>')
            .replace(/小於/g, '<')
            .replace(/等於/g, '===')
            .replace(/加/g, '+')
            .replace(/減/g, '-')
            .replace(/乘/g, '*')
            .replace(/除/g, '/')
            .replace(/「([^」]+)」/g, '"$1"');
        
        // Show compiled JavaScript
        if (jsOutput) {
            jsOutput.textContent = jsCode;
        }
        
        // Show mock AST
        if (astOutput) {
            const mockAST = {
                type: 'Program',
                body: [
                    {
                        type: 'VariableDeclaration',
                        declarations: [
                            {
                                type: 'VariableDeclarator',
                                id: { type: 'Identifier', name: 'example' },
                                init: { type: 'Literal', value: 'demo' }
                            }
                        ]
                    }
                ]
            };
            astOutput.textContent = JSON.stringify(mockAST, null, 2);
        }
        
        // Show mock tokens
        if (tokensOutput) {
            const mockTokens = [
                { type: 'KEYWORD', value: '昔有數曰', line: 1 },
                { type: 'STRING', value: '甲', line: 1 },
                { type: 'OPERATOR', value: '、其値', line: 1 },
                { type: 'NUMBER', value: '五', line: 1 },
                { type: 'DELIMITER', value: '。', line: 1 }
            ];
            tokensOutput.textContent = JSON.stringify(mockTokens, null, 2);
        }
        
        // Execute the simplified JavaScript
        this.executeJavaScript(jsCode);
    }

    executeJavaScript(jsCode) {
        const outputContainer = document.getElementById('output-container');
        
        // Override console.log to capture output
        const originalLog = console.log;
        const outputs = [];
        
        console.log = (...args) => {
            outputs.push(args.map(arg => String(arg)).join(' '));
        };
        
        try {
            // Execute the code
            eval(jsCode);
            
            // Show output
            if (outputs.length > 0) {
                this.showOutput(outputs.join('\\n'), 'success');
            } else {
                this.showOutput('程序执行完成（无输出）', 'info');
            }
            
        } catch (error) {
            this.showOutput(`运行错误：${error.message}`, 'error');
        } finally {
            // Restore console.log
            console.log = originalLog;
        }
    }

    executeCode() {
        const codeEditor = document.getElementById('code-editor');
        if (codeEditor) {
            const code = codeEditor.value.trim();
            if (!code) {
                this.showUserFeedback('コードを入力してください / Please enter code first', 'warning');
                return;
            }
            
            this.showUserFeedback('コードを実行中... / Executing code...', 'info');
            
            try {
                this.runKanbunCode(code);
                this.showUserFeedback('実行完了 / Execution completed', 'success');
            } catch (error) {
                this.showUserFeedback('実行エラー / Execution error', 'error');
                console.error('Code execution error:', error);
            }
        }
    }

    compileCode() {
        const codeEditor = document.getElementById('code-editor');
        if (codeEditor) {
            const code = codeEditor.value.trim();
            if (!code) return;
            
            try {
                // This will update the compilation tabs without executing
                const jsOutput = document.getElementById('js-output');
                const astOutput = document.getElementById('ast-output');
                const tokensOutput = document.getElementById('tokens-output');
                
                if (typeof KanbunCompiler !== 'undefined') {
                    const compiler = new KanbunCompiler();
                    const result = compiler.compile(code);
                    
                    if (jsOutput) {
                        jsOutput.textContent = result.javascript || '// Compilation failed';
                    }
                    if (astOutput) {
                        astOutput.textContent = JSON.stringify(result.ast, null, 2) || '// AST generation failed';
                    }
                    if (tokensOutput) {
                        tokensOutput.textContent = JSON.stringify(result.tokens, null, 2) || '// Token analysis failed';
                    }
                } else {
                    this.simulateCompilation(code);
                }
            } catch (error) {
                console.error('Compilation error:', error);
            }
        }
    }

    showOutput(message, type = 'info') {
        const outputContainer = document.getElementById('output-container');
        if (!outputContainer) return;
        
        const outputElement = document.createElement('div');
        outputElement.className = `output-line output-${type}`;
        outputElement.textContent = message;
        
        // Add styles based on type
        const styles = {
            success: 'color: #238636;',
            error: 'color: #da3633;',
            warning: 'color: #d29922;',
            info: 'color: #58a6ff;'
        };
        
        outputElement.style.cssText = styles[type] || styles.info;
        
        // Clear placeholder and append output
        const placeholder = outputContainer.querySelector('.output-placeholder');
        if (placeholder) {
            placeholder.remove();
        }
        
        outputContainer.appendChild(outputElement);
        outputContainer.scrollTop = outputContainer.scrollHeight;
    }

    clearOutput() {
        const outputContainer = document.getElementById('output-container');
        if (!outputContainer) return;
        
        outputContainer.innerHTML = `
            <div class="output-placeholder" data-ja="プログラムコードを実行して結果を確認..." data-en="Run program code to see results...">
                ${this.currentLanguage === 'ja' ? 'プログラムコードを実行して結果を確認...' : 'Run program code to see results...'}
            </div>
        `;
    }

    autoResizeTextarea(textarea) {
        textarea.style.height = 'auto';
        textarea.style.height = Math.max(400, textarea.scrollHeight) + 'px';
    }

    setupKeyboardShortcuts() {
        document.addEventListener('keydown', (e) => {
            // Ctrl+Enter or Cmd+Enter to run code
            if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
                e.preventDefault();
                this.executeCode();
                this.showUserFeedback('ショートカットで実行 / Executed via shortcut', 'info');
            }
            
            // Ctrl+Shift+C or Cmd+Shift+C to clear editor
            if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === 'C') {
                e.preventDefault();
                const codeEditor = document.getElementById('code-editor');
                if (codeEditor) {
                    codeEditor.value = '';
                    codeEditor.focus();
                    this.showUserFeedback('エディタをクリア / Editor cleared', 'success');
                }
            }
            
            // Escape to clear notifications
            if (e.key === 'Escape') {
                const feedback = document.getElementById('user-feedback');
                if (feedback) {
                    feedback.style.transform = 'translateX(100%)';
                }
            }
            
            // Ctrl+1-6 or Cmd+1-6 to switch between tabs
            if ((e.ctrlKey || e.metaKey) && e.key >= '1' && e.key <= '3') {
                e.preventDefault();
                const tabMapping = {
                    '1': 'output',
                    '2': 'javascript', 
                    '3': 'ast'
                };
                
                const targetTab = tabMapping[e.key];
                const tabBtn = document.querySelector(`[data-tab="${targetTab}"]`);
                if (tabBtn) {
                    tabBtn.click();
                    this.showUserFeedback(`タブ ${e.key} に切り替え / Switched to tab ${e.key}`, 'info');
                }
            }
        });
    }

    setupAccessibility() {
        // Add ARIA labels and roles
        const codeEditor = document.getElementById('code-editor');
        if (codeEditor) {
            codeEditor.setAttribute('aria-label', 'Kanbun code editor');
            codeEditor.setAttribute('role', 'textbox');
            codeEditor.setAttribute('aria-multiline', 'true');
        }
        
        // Add keyboard navigation hints
        const runBtn = document.getElementById('run-btn');
        if (runBtn) {
            runBtn.setAttribute('aria-label', 'Run code (Ctrl+Enter)');
            runBtn.setAttribute('title', 'Run code (Ctrl+Enter)');
        }
        
        // Add focus management for modals and overlays
        const languageSwitcher = document.querySelector('.language-switcher');
        if (languageSwitcher) {
            languageSwitcher.setAttribute('role', 'toolbar');
            languageSwitcher.setAttribute('aria-label', 'Language switcher');
        }
        
        // Add skip links for screen readers
        this.addSkipLinks();
    }

    addSkipLinks() {
        const skipLink = document.createElement('a');
        skipLink.href = '#main-content';
        skipLink.textContent = 'Skip to main content';
        skipLink.className = 'skip-link';
        skipLink.style.cssText = `
            position: absolute;
            top: -40px;
            left: 6px;
            background: var(--primary-color);
            color: white;
            padding: 8px;
            text-decoration: none;
            border-radius: 4px;
            z-index: 10000;
            transition: top 0.3s;
        `;
        
        skipLink.addEventListener('focus', () => {
            skipLink.style.top = '6px';
        });
        
        skipLink.addEventListener('blur', () => {
            skipLink.style.top = '-40px';
        });
        
        document.body.insertBefore(skipLink, document.body.firstChild);
    }

    setupAdvancedFeatures() {
        // Add code formatting functionality
        this.setupCodeFormatting();
        
        // Add auto-save functionality
        this.setupAutoSave();
        
        // Add theme persistence
        this.setupThemePersistence();
        
        // Add performance monitoring
        this.setupPerformanceMonitoring();
    }

    setupCodeFormatting() {
        // Add a format button if it doesn't exist
        const playground = document.querySelector('.playground-controls');
        if (playground && !document.getElementById('format-btn')) {
            const formatBtn = document.createElement('button');
            formatBtn.id = 'format-btn';
            formatBtn.className = 'btn btn-secondary';
            formatBtn.innerHTML = '<span data-ja="整形" data-en="Format">整形</span>';
            formatBtn.setAttribute('title', 'Format code (Ctrl+Shift+F)');
            
            formatBtn.addEventListener('click', () => {
                this.formatCode();
            });
            
            playground.appendChild(formatBtn);
        }
        
        // Add formatting keyboard shortcut
        document.addEventListener('keydown', (e) => {
            if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === 'F') {
                e.preventDefault();
                this.formatCode();
            }
        });
    }

    formatCode() {
        const codeEditor = document.getElementById('code-editor');
        if (codeEditor) {
            let code = codeEditor.value;
            
            // Basic formatting for Kanbun
            code = code
                .replace(/。\s*/g, '。\n')  // New line after periods
                .replace(/、\s*/g, '、')     // Clean up commas
                .replace(/\n\s*\n/g, '\n\n') // Clean up multiple newlines
                .trim();
            
            codeEditor.value = code;
            this.showUserFeedback('コードを整形しました / Code formatted', 'success');
        }
    }

    setupAutoSave() {
        const codeEditor = document.getElementById('code-editor');
        if (codeEditor) {
            let saveTimeout;
            
            codeEditor.addEventListener('input', () => {
                clearTimeout(saveTimeout);
                saveTimeout = setTimeout(() => {
                    localStorage.setItem('kanbun-code', codeEditor.value);
                }, 1000);
            });
            
            // Restore saved code on load
            const savedCode = localStorage.getItem('kanbun-code');
            if (savedCode && !codeEditor.value.trim()) {
                codeEditor.value = savedCode;
                this.autoResizeTextarea(codeEditor);
            }
        }
    }

    setupThemePersistence() {
        // Save language preference
        const langButtons = document.querySelectorAll('.lang-btn');
        langButtons.forEach(btn => {
            btn.addEventListener('click', () => {
                localStorage.setItem('kanbun-language', btn.dataset.lang);
            });
        });
        
        // Restore language preference
        const savedLang = localStorage.getItem('kanbun-language');
        if (savedLang && ['ja', 'en'].includes(savedLang)) {
            const langBtn = document.querySelector(`[data-lang="${savedLang}"]`);
            if (langBtn) {
                langBtn.click();
            }
        }
    }

    setupPerformanceMonitoring() {
        // Monitor FPS for animations
        let frameCount = 0;
        let lastTime = performance.now();
        
        const measureFPS = () => {
            frameCount++;
            const currentTime = performance.now();
            
            if (currentTime - lastTime >= 1000) {
                const fps = Math.round((frameCount * 1000) / (currentTime - lastTime));
                
                // Adjust animation quality based on performance
                if (fps < 30) {
                    this.reduceAnimations();
                } else if (fps > 50) {
                    this.enhanceAnimations();
                }
                
                frameCount = 0;
                lastTime = currentTime;
            }
            
            requestAnimationFrame(measureFPS);
        };
        
        requestAnimationFrame(measureFPS);
    }

    reduceAnimations() {
        const style = document.createElement('style');
        style.id = 'reduced-motion';
        style.textContent = `
            *, *::before, *::after {
                animation-duration: 0.3s !important;
                animation-iteration-count: 1 !important;
                transition-duration: 0.3s !important;
            }
        `;
        
        if (!document.getElementById('reduced-motion')) {
            document.head.appendChild(style);
        }
    }

    enhanceAnimations() {
        const reducedMotion = document.getElementById('reduced-motion');
        if (reducedMotion) {
            reducedMotion.remove();
        }
    }

    setupHelpModal() {
        const helpModal = document.getElementById('help-modal');
        const modalClose = document.querySelector('.modal-close');
        
        // Add help button to playground controls
        const playgroundControls = document.querySelector('.playground-controls');
        if (playgroundControls && !document.getElementById('help-btn')) {
            const helpBtn = document.createElement('button');
            helpBtn.id = 'help-btn';
            helpBtn.className = 'btn btn-secondary';
            helpBtn.innerHTML = '<span data-ja="ヘルプ" data-en="Help">ヘルプ</span>';
            helpBtn.setAttribute('title', 'Show help (F1)');
            helpBtn.setAttribute('aria-label', 'Show help and shortcuts');
            
            helpBtn.addEventListener('click', () => {
                this.showHelpModal();
            });
            
            playgroundControls.appendChild(helpBtn);
        }
        
        // Close modal handlers
        if (modalClose) {
            modalClose.addEventListener('click', () => {
                this.hideHelpModal();
            });
        }
        
        if (helpModal) {
            helpModal.addEventListener('click', (e) => {
                if (e.target === helpModal) {
                    this.hideHelpModal();
                }
            });
        }
        
        // F1 key to show help
        document.addEventListener('keydown', (e) => {
            if (e.key === 'F1') {
                e.preventDefault();
                this.showHelpModal();
            }
            
            // Escape to close modal
            if (e.key === 'Escape' && helpModal.classList.contains('active')) {
                this.hideHelpModal();
            }
        });
    }

    showHelpModal() {
        const helpModal = document.getElementById('help-modal');
        if (helpModal) {
            helpModal.classList.add('active');
            
            // Focus management
            const firstFocusable = helpModal.querySelector('.modal-close');
            if (firstFocusable) {
                firstFocusable.focus();
            }
            
            // Prevent body scroll
            document.body.style.overflow = 'hidden';
        }
    }

    hideHelpModal() {
        const helpModal = document.getElementById('help-modal');
        if (helpModal) {
            helpModal.classList.remove('active');
            
            // Restore body scroll
            document.body.style.overflow = '';
            
            // Return focus to help button
            const helpBtn = document.getElementById('help-btn');
            if (helpBtn) {
                helpBtn.focus();
            }
        }
    }
}

// Initialize the app when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new KanbunApp();
});

// Enhanced Prism.js support for Kanbun
if (typeof Prism !== 'undefined') {
    Prism.languages.kanbun = {
        'keyword': /(?:昔有|夫|者|受|還|若|否|凡|皆行如左|書|其値|名曰|大於|小於|等於|加|減|乘|除|能整除)/,
        'string': /「[^」]*」/,
        'number': /(?:一|二|三|四|五|六|七|八|九|十|[0-9]+)/,
        'punctuation': /[、。：]/,
        'operator': /[之與]/
    };
}

// Export for potential use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = KanbunApp;
}
