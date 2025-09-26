document.addEventListener('DOMContentLoaded', function() {
    function initCodeBlocks() {
        document.querySelectorAll('pre').forEach(function(pre) {
            if (pre.querySelector('.code-copy-btn')) return;
            
            const code = pre.querySelector('code');
            if (!code) return;
            
            // 언어 자동 감지
            if (!code.className.includes('language-')) {
                const text = code.textContent.trim();
                let lang = 'markup';
                
                if (/<\/?[a-z][\s\S]*>/i.test(text)) lang = 'markup';
                else if (/\{[\s\S]*\}/.test(text) && /[.#][\w-]+\s*\{/.test(text)) lang = 'css';
                else if (/\b(function|const|let|var|=>|console\.)/i.test(text)) lang = 'javascript';
                else if (/\b(def |import |print\(|class )/i.test(text)) lang = 'python';
                else if (/\b(public class|System\.out)/i.test(text)) lang = 'java';
                
                code.className = 'language-' + lang;
            }
            
            // 복사 버튼 추가
            const btn = document.createElement('button');
            btn.className = 'code-copy-btn';
            btn.textContent = '복사';
            btn.onclick = function() {
                navigator.clipboard.writeText(code.textContent).then(function() {
                    btn.textContent = '복사됨!';
                    btn.classList.add('copied');
                    setTimeout(function() {
                        btn.textContent = '복사';
                        btn.classList.remove('copied');
                    }, 2000);
                });
            };
            
            pre.appendChild(btn);
        });
        
        if (typeof Prism !== 'undefined') Prism.highlightAll();
    }
    
    initCodeBlocks();
    
    // 동적 컨텐츠 감지
    new MutationObserver(function(mutations) {
        if (mutations.some(m => Array.from(m.addedNodes).some(n => n.tagName === 'PRE' || (n.querySelector && n.querySelector('pre'))))) {
            setTimeout(initCodeBlocks, 100);
        }
    }).observe(document.body, { childList: true, subtree: true });
});