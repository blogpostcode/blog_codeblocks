document.addEventListener('DOMContentLoaded', function() {
    // 모든 pre 태그에 복사 버튼과 언어 감지 추가
    function initCodeBlocks() {
        const preElements = document.querySelectorAll('pre');
        
        preElements.forEach(function(pre) {
            // 이미 처리된 경우 건너뛰기
            if (pre.querySelector('.code-copy-btn')) return;
            
            const codeElement = pre.querySelector('code');
            if (!codeElement) return;
            
            // 언어 감지 및 클래스 추가
            detectAndSetLanguage(codeElement);
            
            // 복사 버튼 추가
            const copyBtn = document.createElement('button');
            copyBtn.className = 'code-copy-btn';
            copyBtn.textContent = '복사';
            copyBtn.onclick = function() {
                copyCodeToClipboard(codeElement, copyBtn);
            };
            
            pre.appendChild(copyBtn);
        });
        
        // Prism 하이라이팅 재실행
        if (typeof Prism !== 'undefined') {
            Prism.highlightAll();
        }
    }
    
    // 언어 자동 감지 함수
    function detectAndSetLanguage(codeElement) {
        const code = codeElement.textContent.trim();
        
        // 이미 language 클래스가 있으면 건너뛰기
        if (codeElement.className.includes('language-')) return;
        
        let detectedLanguage = 'markup'; // 기본값
        
        // HTML 감지
        if (/<\/?[a-z][\s\S]*>/i.test(code) || /<!DOCTYPE/i.test(code)) {
            detectedLanguage = 'markup';
        }
        // CSS 감지
        else if (/\{[\s\S]*\}/.test(code) && (/[.#][\w-]+\s*\{/.test(code) || /@[\w-]+/.test(code))) {
            detectedLanguage = 'css';
        }
        // JavaScript 감지
        else if (/\b(function|const|let|var|=>\s*\{|console\.log|document\.)/i.test(code)) {
            detectedLanguage = 'javascript';
        }
        // Python 감지
        else if (/\b(def |import |from |print\(|if __name__|class )/i.test(code)) {
            detectedLanguage = 'python';
        }
        // Java 감지
        else if (/\b(public class|public static void|System\.out\.print)/i.test(code)) {
            detectedLanguage = 'java';
        }
        // C/C++ 감지
        else if (/#include|int main\(|printf\(|cout <</.test(code)) {
            detectedLanguage = 'c';
        }
        // JSON 감지
        else if (/^\s*[\{\[]/.test(code) && /[\}\]]\s*$/.test(code)) {
            try {
                JSON.parse(code);
                detectedLanguage = 'json';
            } catch(e) {}
        }
        // SQL 감지
        else if (/\b(SELECT|INSERT|UPDATE|DELETE|CREATE|ALTER)\b/i.test(code)) {
            detectedLanguage = 'sql';
        }
        
        codeElement.className = 'language-' + detectedLanguage;
    }
    
    // 클립보드 복사 함수
    function copyCodeToClipboard(codeElement, button) {
        const text = codeElement.textContent;
        
        if (navigator.clipboard && navigator.clipboard.writeText) {
            navigator.clipboard.writeText(text).then(function() {
                showCopySuccess(button);
            }).catch(function() {
                fallbackCopy(text, button);
            });
        } else {
            fallbackCopy(text, button);
        }
    }
    
    // 구형 브라우저용 복사 함수
    function fallbackCopy(text, button) {
        const textArea = document.createElement('textarea');
        textArea.value = text;
        textArea.style.position = 'fixed';
        textArea.style.left = '-999999px';
        textArea.style.top = '-999999px';
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();
        
        try {
            document.execCommand('copy');
            showCopySuccess(button);
        } catch (err) {
            console.error('복사 실패:', err);
        }
        
        document.body.removeChild(textArea);
    }
    
    // 복사 성공 표시
    function showCopySuccess(button) {
        const originalText = button.textContent;
        button.textContent = '복사됨!';
        button.classList.add('copied');
        
        setTimeout(function() {
            button.textContent = originalText;
            button.classList.remove('copied');
        }, 2000);
    }
    
    // 초기 실행
    initCodeBlocks();
    
    // 동적으로 추가되는 코드 블록을 위한 옵저버
    const observer = new MutationObserver(function(mutations) {
        let shouldUpdate = false;
        mutations.forEach(function(mutation) {
            mutation.addedNodes.forEach(function(node) {
                if (node.nodeType === 1) { // Element 노드
                    if (node.tagName === 'PRE' || node.querySelector && node.querySelector('pre')) {
                        shouldUpdate = true;
                    }
                }
            });
        });
        
        if (shouldUpdate) {
            setTimeout(initCodeBlocks, 100);
        }
    });
    
    observer.observe(document.body, {
        childList: true,
        subtree: true
    });
});
