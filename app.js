class ScreenTranslatorApp {
    constructor() {
        this.settings = {
            targetLang: 'en',
            captureMode: 'manual',
            overlayPosition: 'top-right',
            autoTranslate: true,
            showOriginal: true
        };
        
        this.overlay = null;
        this.isOverlayVisible = false;
        this.captureInterval = null;
        this.translationHistory = [];
        
        this.initialize();
    }

    initialize() {
        this.loadSettings();
        this.createOverlay();
        this.bindEvents();
        this.bindKeyboardShortcuts();
        this.loadTranslationHistory();
    }

    loadSettings() {
        const savedSettings = localStorage.getItem('screenTranslatorSettings');
        if (savedSettings) {
            this.settings = { ...this.settings, ...JSON.parse(savedSettings) };
        }
        
        // Update UI with saved settings
        document.getElementById('targetLang').value = this.settings.targetLang;
        document.getElementById('captureMode').value = this.settings.captureMode;
        document.getElementById('overlayPosition').value = this.settings.overlayPosition;
        document.getElementById('autoTranslate').checked = this.settings.autoTranslate;
        document.getElementById('showOriginal').checked = this.settings.showOriginal;
    }

    saveSettings() {
        this.settings = {
            targetLang: document.getElementById('targetLang').value,
            captureMode: document.getElementById('captureMode').value,
            overlayPosition: document.getElementById('overlayPosition').value,
            autoTranslate: document.getElementById('autoTranslate').checked,
            showOriginal: document.getElementById('showOriginal').checked
        };
        
        localStorage.setItem('screenTranslatorSettings', JSON.stringify(this.settings));
        this.updateOverlayPosition();
    }

    createOverlay() {
        // Remove existing overlay if any
        const existingOverlay = document.getElementById('translation-overlay');
        if (existingOverlay) {
            existingOverlay.remove();
        }

        this.overlay = document.createElement('div');
        this.overlay.id = 'translation-overlay';
        this.overlay.className = 'translation-overlay hidden';
        
        this.overlay.innerHTML = `
            <div class="overlay-header">
                <span class="overlay-title">
                    <i class="fas fa-globe"></i> Translation
                </span>
                <button class="overlay-close" id="overlay-close">
                    <i class="fas fa-times"></i>
                </button>
            </div>
            <div class="overlay-content">
                <div id="translation-text" class="translation-text"></div>
            </div>
        `;

        document.body.appendChild(this.overlay);

        // Bind close button
        const closeBtn = this.overlay.querySelector('#overlay-close');
        closeBtn.addEventListener('click', () => this.hideOverlay());

        // Position overlay
        this.updateOverlayPosition();
    }

    updateOverlayPosition() {
        if (!this.overlay) return;

        const position = this.settings.overlayPosition;
        this.overlay.className = `translation-overlay ${position}`;
    }

    bindEvents() {
        // Settings change events
        ['targetLang', 'captureMode', 'overlayPosition', 'autoTranslate', 'showOriginal'].forEach(id => {
            const element = document.getElementById(id);
            if (element) {
                element.addEventListener('change', () => this.saveSettings());
            }
        });

        // Button events
        document.getElementById('captureBtn').addEventListener('click', () => this.handleCapture());
        document.getElementById('toggleOverlay').addEventListener('click', () => this.toggleOverlay());
        document.getElementById('clearBtn').addEventListener('click', () => this.clearResults());
        document.getElementById('clearHistory').addEventListener('click', () => this.clearHistory());
    }

    bindKeyboardShortcuts() {
        document.addEventListener('keydown', (event) => {
            // Ctrl+Shift+T to capture and translate
            if (event.ctrlKey && event.shiftKey && event.key === 'T') {
                event.preventDefault();
                this.handleCapture();
            }
            
            // Ctrl+Shift+O to toggle overlay
            if (event.ctrlKey && event.shiftKey && event.key === 'O') {
                event.preventDefault();
                this.toggleOverlay();
            }
        });
    }

    async handleCapture() {
        try {
            this.updateStatus('Capturing screenshot...');
            this.showProgress();
            this.showLoadingModal('Capturing screenshot and extracting text...');

            // Capture screenshot
            const screenshot = await this.captureScreenshot();
            if (!screenshot) {
                throw new Error('Failed to capture screenshot');
            }

            this.showLoadingModal('Extracting text from image...');

            // Extract text from screenshot
            const extractedText = await this.extractTextFromImage(screenshot);
            if (!extractedText || extractedText.trim().length < 2) {
                throw new Error('No text detected in screenshot');
            }

            this.showLoadingModal('Translating text...');

            // Translate text
            const translation = await this.translateText(extractedText, this.settings.targetLang);
            if (!translation) {
                throw new Error('Translation failed');
            }

            // Display overlay
            this.showTranslationOverlay(extractedText, translation, this.settings.targetLang);

            // Add to history
            this.addToHistory(extractedText, translation, this.settings.targetLang);

            // Start auto-capture if enabled
            if (this.settings.captureMode === 'auto' || this.settings.captureMode === 'continuous') {
                this.startAutoCapture();
            }

            this.updateStatus('Translation completed');
            this.hideLoadingModal();

        } catch (error) {
            console.error('Capture and translate error:', error);
            this.updateStatus('Error: ' + error.message);
            this.hideLoadingModal();
        } finally {
            this.hideProgress();
        }
    }

    async captureScreenshot() {
        try {
            // Use html2canvas for screenshot
            const canvas = await html2canvas(document.body, {
                allowTaint: true,
                useCORS: true,
                scale: 1,
                logging: false,
                backgroundColor: null
            });

            return canvas.toDataURL('image/png');
        } catch (error) {
            console.error('Screenshot error:', error);
            return null;
        }
    }

    async extractTextFromImage(imageDataUrl) {
        try {
            // Use Tesseract.js for OCR
            const result = await Tesseract.recognize(
                imageDataUrl,
                'eng+fra+deu+spa+ita+por+rus+jpn+kor+chi_sim+ara+hin',
                {
                    logger: m => console.log(m)
                }
            );

            return result.data.text.trim();
        } catch (error) {
            console.error('OCR error:', error);
            return '';
        }
    }

    async translateText(text, targetLang) {
        try {
            // Use Google Translate API (free tier)
            const response = await fetch(`https://translate.googleapis.com/translate_a/single?client=gtx&sl=auto&tl=${targetLang}&dt=t&q=${encodeURIComponent(text)}`);
            
            if (!response.ok) {
                throw new Error('Translation API request failed');
            }

            const data = await response.json();
            return data[0][0][0];
        } catch (error) {
            console.error('Translation error:', error);
            
            // Fallback: try alternative translation service
            try {
                const response = await fetch(`https://api.mymemory.translated.net/get?q=${encodeURIComponent(text)}&langpair=auto|${targetLang}`);
                const data = await response.json();
                return data.responseData.translatedText;
            } catch (fallbackError) {
                console.error('Fallback translation error:', fallbackError);
                return text; // Return original text if translation fails
            }
        }
    }

    showTranslationOverlay(originalText, translatedText, targetLang) {
        if (!this.overlay) return;

        const translationText = this.overlay.querySelector('#translation-text');
        
        let content = '';
        if (this.settings.showOriginal) {
            content += `<div class="original-text">${originalText}</div>`;
        }
        content += `<div class="translated-text">${translatedText}</div>`;
        content += `<div class="translation-meta">→ ${targetLang.toUpperCase()}</div>`;
        
        translationText.innerHTML = content;
        
        this.showOverlay();
    }

    showOverlay() {
        if (!this.overlay) return;
        
        this.overlay.classList.remove('hidden');
        this.isOverlayVisible = true;
        
        // Auto-hide after 10 seconds
        setTimeout(() => {
            this.hideOverlay();
        }, 10000);
    }

    hideOverlay() {
        if (!this.overlay) return;
        
        this.overlay.classList.add('hidden');
        this.isOverlayVisible = false;
    }

    toggleOverlay() {
        if (this.isOverlayVisible) {
            this.hideOverlay();
        } else {
            this.showOverlay();
        }
    }

    clearResults() {
        this.hideOverlay();
        if (this.captureInterval) {
            clearInterval(this.captureInterval);
            this.captureInterval = null;
        }
        this.updateStatus('Results cleared');
    }

    startAutoCapture() {
        if (this.captureInterval) {
            clearInterval(this.captureInterval);
        }

        const interval = this.settings.captureMode === 'continuous' ? 10000 : 5000;
        
        this.captureInterval = setInterval(() => {
            this.handleCapture();
        }, interval);
    }

    addToHistory(originalText, translatedText, targetLang) {
        const translation = {
            id: Date.now(),
            originalText,
            translatedText,
            targetLang,
            timestamp: new Date().toLocaleString(),
            showOriginal: this.settings.showOriginal
        };

        this.translationHistory.unshift(translation);
        
        // Keep only last 20 translations
        if (this.translationHistory.length > 20) {
            this.translationHistory = this.translationHistory.slice(0, 20);
        }

        this.saveTranslationHistory();
        this.updateHistoryDisplay();
    }

    updateHistoryDisplay() {
        const resultsList = document.getElementById('resultsList');
        
        if (this.translationHistory.length === 0) {
            resultsList.innerHTML = `
                <div class="no-results">
                    <i class="fas fa-info-circle"></i>
                    <p>No translations yet. Click "Capture & Translate" to start.</p>
                </div>
            `;
            return;
        }

        resultsList.innerHTML = '';
        
        this.translationHistory.forEach(translation => {
            const translationItem = document.createElement('div');
            translationItem.className = 'translation-item';
            
            translationItem.innerHTML = `
                ${translation.showOriginal ? `<div class="original">${translation.originalText}</div>` : ''}
                <div class="translated">${translation.translatedText}</div>
                <div class="meta">${translation.targetLang.toUpperCase()} • ${translation.timestamp}</div>
            `;
            
            resultsList.appendChild(translationItem);
        });
    }

    loadTranslationHistory() {
        const savedHistory = localStorage.getItem('screenTranslatorHistory');
        if (savedHistory) {
            this.translationHistory = JSON.parse(savedHistory);
            this.updateHistoryDisplay();
        }
    }

    saveTranslationHistory() {
        localStorage.setItem('screenTranslatorHistory', JSON.stringify(this.translationHistory));
    }

    clearHistory() {
        this.translationHistory = [];
        this.saveTranslationHistory();
        this.updateHistoryDisplay();
        this.updateStatus('History cleared');
    }

    updateStatus(message) {
        const statusText = document.getElementById('statusText');
        if (statusText) {
            statusText.textContent = message;
        }
    }

    showProgress() {
        const progressBar = document.getElementById('progressBar');
        if (progressBar) {
            progressBar.classList.remove('hidden');
        }
    }

    hideProgress() {
        const progressBar = document.getElementById('progressBar');
        if (progressBar) {
            progressBar.classList.add('hidden');
        }
    }

    showLoadingModal(message) {
        const modal = document.getElementById('loadingModal');
        const loadingText = document.getElementById('loadingText');
        
        if (modal) {
            modal.classList.remove('hidden');
        }
        
        if (loadingText && message) {
            loadingText.textContent = message;
        }
    }

    hideLoadingModal() {
        const modal = document.getElementById('loadingModal');
        if (modal) {
            modal.classList.add('hidden');
        }
    }

    // Utility methods
    getLanguageName(code) {
        const languages = {
            'en': 'English',
            'es': 'Spanish',
            'fr': 'French',
            'de': 'German',
            'it': 'Italian',
            'pt': 'Portuguese',
            'ru': 'Russian',
            'ja': 'Japanese',
            'ko': 'Korean',
            'zh': 'Chinese',
            'ar': 'Arabic',
            'hi': 'Hindi'
        };
        return languages[code] || code.toUpperCase();
    }
}

// Initialize app when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new ScreenTranslatorApp();
});

// Export for potential use in other scripts
window.ScreenTranslatorApp = ScreenTranslatorApp;
