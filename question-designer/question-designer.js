// BrainCaptcha Question Designer JavaScript
class QuestionDesigner {
    constructor() {
        this.questions = [];
        this.currentCorrectAnswer = 0;
        this.editingIndex = -1;
        this.settings = this.getDefaultSettings();
        this.loadFromStorage();
        this.loadSettings();
        this.renderQuestions();
        this.updateStats();
        this.setupEventListeners();
    }

    getDefaultSettings() {
        return {
            questionsPerCaptcha: 5,
            selectionMethod: 'random',
            allowRepeat: false,
            baseIQ: 80,
            correctAnswerPoints: 20,
            difficultyMultiplier: false,
            timeBonusEnabled: false,
            maxIQ: 200,
            showProgress: true,
            showTimer: false,
            timeLimit: 0,
            shuffleOptions: true
        };
    }

    setupEventListeners() {
        document.getElementById('questionForm').addEventListener('submit', (e) => {
            e.preventDefault();
            this.addQuestion();
        });

        // Settings event listeners
        const settingsInputs = [
            'questionsPerCaptcha', 'selectionMethod', 'allowRepeat', 'baseIQ', 
            'correctAnswerPoints', 'difficultyMultiplier', 'timeBonusEnabled', 
            'maxIQ', 'showProgress', 'showTimer', 'timeLimit', 'shuffleOptions'
        ];

        settingsInputs.forEach(id => {
            const element = document.getElementById(id);
            if (element) {
                element.addEventListener('change', () => this.updateSettingsPreview());
            }
        });

        // Emoji input validation and preview
        const emojiInput = document.getElementById('emoji');
        if (emojiInput) {
            emojiInput.addEventListener('input', (e) => {
                const value = e.target.value;
                // Allow complex emojis like flags (🇮🇳), but limit to reasonable length
                if (value.length > 10) {
                    e.target.value = value.substring(0, 10);
                }
                // Show a preview of the emoji
                this.updateEmojiPreview(e.target.value);
            });
        }

        // Auto-save to localStorage
        setInterval(() => {
            this.saveToStorage();
        }, 5000);
    }

    addQuestion() {
        const type = document.getElementById('questionType').value;
        const mediaUrl = document.getElementById('mediaUrl').value;
        const emoji = document.getElementById('emoji').value || '🤔';
        const questionText = document.getElementById('question').value;
        const brainrotLevel = document.getElementById('brainrotLevel').value;
        
        const optionInputs = document.querySelectorAll('.option-input');
        const options = Array.from(optionInputs).map(input => input.value).filter(val => val.trim());
        
        if (options.length < 2) {
            this.showAlert('Please provide at least 2 options.', 'error');
            return;
        }

        if (this.currentCorrectAnswer >= options.length) {
            this.showAlert('Please select a valid correct answer.', 'error');
            return;
        }

        // Validate media URL for image, video, and gif questions
        if (type !== 'text' && mediaUrl) {
            if (!this.isValidMediaUrl(mediaUrl)) {
                this.showAlert('Please enter a valid URL (https://...) or local path (/images/...)', 'error');
                return;
            }
        } else if (type !== 'text' && !mediaUrl) {
            this.showAlert('Please provide a media URL for this question type.', 'error');
            return;
        }

        const question = {
            id: Date.now(),
            type: type,
            question: questionText,
            options: options,
            correct: this.currentCorrectAnswer,
            brainrotLevel: brainrotLevel,
            emoji: emoji,
            created: new Date().toISOString()
        };

        if (type === 'image') {
            question.image = mediaUrl;
        } else if (type === 'video') {
            question.video = mediaUrl;
        } else if (type === 'gif') {
            question.gif = mediaUrl;
        }

        // Store image data if uploaded
        if (this.currentImageData && question.type === 'image') {
            question.imageData = this.currentImageData;
        }

        if (this.editingIndex >= 0) {
            this.questions[this.editingIndex] = question;
            this.editingIndex = -1;
            this.showAlert('Question updated successfully!', 'success');
        } else {
            this.questions.push(question);
            this.showAlert('Question added successfully!', 'success');
        }

        this.renderQuestions();
        this.updateStats();
        this.clearForm();
        this.updateExportPreview();
    }

    editQuestion(index) {
        const question = this.questions[index];
        this.editingIndex = index;

        // Set form values
        document.getElementById('questionType').value = question.type;
        document.getElementById('mediaUrl').value = question.image || question.video || question.gif || '';
        document.getElementById('emoji').value = question.emoji || '🤔';
        document.getElementById('question').value = question.question;
        document.getElementById('brainrotLevel').value = question.brainrotLevel;

        // Update emoji preview
        this.updateEmojiPreview(question.emoji || '🤔');

        toggleFields(); // Call global function instead of this.toggleFields()

        // Clear existing options
        const container = document.getElementById('optionsContainer');
        container.innerHTML = '';

        // Add options from question
        question.options.forEach((option, i) => {
            const optionDiv = document.createElement('div');
            optionDiv.className = 'options-container';
            optionDiv.innerHTML = `
                <input type="text" class="option-input" placeholder="Option ${i + 1}" value="${option}" required>
                <div class="correct-indicator ${i === question.correct ? 'selected' : ''}" onclick="selectCorrect(${i})">✓</div>
            `;
            container.appendChild(optionDiv);
        });

        // Set the correct answer
        this.currentCorrectAnswer = question.correct;
        
        // Ensure correct answer indicators are properly set
        document.querySelectorAll('.correct-indicator').forEach((indicator, i) => {
            indicator.classList.toggle('selected', i === question.correct);
        });
        
        // Scroll to form
        document.querySelector('.form-section').scrollIntoView({ behavior: 'smooth' });
        this.showAlert('Question loaded for editing.', 'info');
    }

    deleteQuestion(index) {
        if (confirm('Are you sure you want to delete this question?')) {
            this.questions.splice(index, 1);
            this.renderQuestions();
            this.updateStats();
            this.updateExportPreview();
            this.showAlert('Question deleted successfully!', 'success');
        }
    }

    duplicateQuestion(index) {
        const question = { ...this.questions[index] };
        question.id = Date.now();
        question.created = new Date().toISOString();
        question.question = question.question + ' (Copy)';
        this.questions.push(question);
        this.renderQuestions();
        this.updateStats();
        this.updateExportPreview();
        this.showAlert('Question duplicated successfully!', 'success');
    }

    renderQuestions() {
        const container = document.getElementById('questionsList');
        if (this.questions.length === 0) {
            container.innerHTML = '<p style="text-align: center; opacity: 0.7;">No questions yet. Add some questions to get started!</p>';
            return;
        }

        container.innerHTML = this.questions.map((question, index) => `
            <div class="question-item" data-index="${index}">
                <div class="question-header">
                    <span class="question-type ${question.type}">${question.type}</span>
                    <span class="question-actions">
                        <button class="btn btn-secondary" onclick="designer.editQuestion(${index})" style="padding: 0.25rem 0.5rem; font-size: 0.8rem;">Edit</button>
                        <button class="btn btn-secondary" onclick="designer.duplicateQuestion(${index})" style="padding: 0.25rem 0.5rem; font-size: 0.8rem;">Duplicate</button>
                        <button class="btn btn-danger" onclick="designer.deleteQuestion(${index})" style="padding: 0.25rem 0.5rem; font-size: 0.8rem;">Delete</button>
                    </span>
                </div>
                <div class="question-meta">
                    <span>Level: ${question.brainrotLevel}</span>
                    <span>Created: ${new Date(question.created).toLocaleDateString()}</span>
                    ${question.type === 'text' ? `<span>Emoji: ${question.emoji}</span>` : ''}
                </div>
                <div class="question-text">
                    ${question.type === 'text' ? `<span class="emoji-display">${question.emoji}</span>` : ''}
                    ${question.question}
                </div>
                ${question.imageData ? `<div style="margin: 0.5rem 0; font-size: 0.9rem; opacity: 0.8;">Image: ${question.imageData.filename || 'Base64 Image'}</div>` : question.image ? `<div style="margin: 0.5rem 0; font-size: 0.9rem; opacity: 0.8;">Image: ${question.image}</div>` : ''}
                ${question.video ? `<div style="margin: 0.5rem 0; font-size: 0.9rem; opacity: 0.8;">Video: ${question.video}</div>` : ''}
                ${question.gif ? `<div style="margin: 0.5rem 0; font-size: 0.9rem; opacity: 0.8;">GIF: ${question.gif}</div>` : ''}
                <div class="question-options">
                    ${question.options.map((option, i) => `
                        <div class="option ${i === question.correct ? 'correct' : ''}">
                            ${option}
                        </div>
                    `).join('')}
                </div>
            </div>
        `).join('');
    }

    updateStats() {
        document.getElementById('totalQuestions').textContent = this.questions.length;
        document.getElementById('textQuestions').textContent = this.questions.filter(q => q.type === 'text').length;
        document.getElementById('imageQuestions').textContent = this.questions.filter(q => q.type === 'image').length;
        document.getElementById('videoQuestions').textContent = this.questions.filter(q => q.type === 'video').length;
    }

    updateEmojiPreview(emoji) {
        // Create or update emoji preview
        let previewDiv = document.getElementById('emoji-preview');
        if (!previewDiv) {
            previewDiv = document.createElement('div');
            previewDiv.id = 'emoji-preview';
            previewDiv.style.cssText = `
                margin-top: 5px;
                padding: 5px;
                background: rgba(255, 255, 255, 0.1);
                border-radius: 4px;
                font-size: 1.2em;
                text-align: center;
                min-height: 30px;
                display: flex;
                align-items: center;
                justify-content: center;
            `;
            document.getElementById('emoji').parentNode.appendChild(previewDiv);
        }
        
        if (emoji.trim()) {
            previewDiv.textContent = emoji;
            previewDiv.style.display = 'flex';
        } else {
            previewDiv.style.display = 'none';
        }
    }

    showAlert(message, type) {
        const container = document.getElementById('alert-container');
        const alert = document.createElement('div');
        alert.className = `alert alert-${type}`;
        alert.textContent = message;
        container.appendChild(alert);
        
        setTimeout(() => {
            alert.remove();
        }, 3000);
    }

    saveToStorage() {
        localStorage.setItem('brainCaptchaQuestions', JSON.stringify(this.questions));
    }

    loadFromStorage() {
        const saved = localStorage.getItem('brainCaptchaQuestions');
        if (saved) {
            this.questions = JSON.parse(saved);
        }
    }

    saveSettings() {
        const settings = {};
        const settingsInputs = [
            'questionsPerCaptcha', 'selectionMethod', 'allowRepeat', 'baseIQ', 
            'correctAnswerPoints', 'difficultyMultiplier', 'timeBonusEnabled', 
            'maxIQ', 'showProgress', 'showTimer', 'timeLimit', 'shuffleOptions'
        ];

        settingsInputs.forEach(id => {
            const element = document.getElementById(id);
            if (element) {
                let value = element.value;
                // Convert to appropriate types
                if (element.type === 'number') {
                    value = parseInt(value);
                } else if (value === 'true') {
                    value = true;
                } else if (value === 'false') {
                    value = false;
                }
                settings[id] = value;
            }
        });

        this.settings = settings;
        localStorage.setItem('brainCaptchaSettings', JSON.stringify(settings));
        this.showAlert('Settings saved successfully!', 'success');
        this.toggleSettings();
    }

    loadSettings() {
        const saved = localStorage.getItem('brainCaptchaSettings');
        if (saved) {
            this.settings = { ...this.getDefaultSettings(), ...JSON.parse(saved) };
        }
        this.applySettingsToForm();
        this.updateSettingsPreview();
    }

    applySettingsToForm() {
        Object.keys(this.settings).forEach(key => {
            const element = document.getElementById(key);
            if (element) {
                element.value = this.settings[key];
            }
        });
    }

    resetSettings() {
        this.settings = this.getDefaultSettings();
        this.applySettingsToForm();
        this.updateSettingsPreview();
        this.showAlert('Settings reset to defaults!', 'info');
    }

    toggleSettings() {
        const overlay = document.getElementById('settingsOverlay');
        if (overlay.style.display === 'flex') {
            overlay.style.display = 'none';
        } else {
            overlay.style.display = 'flex';
            this.updateSettingsPreview();
        }
    }

    updateSettingsPreview() {
        const questionsCount = document.getElementById('questionsPerCaptcha').value;
        const baseIQ = document.getElementById('baseIQ').value;
        const pointsPerQuestion = document.getElementById('correctAnswerPoints').value;
        const maxIQ = document.getElementById('maxIQ').value;
        const difficultyMultiplier = document.getElementById('difficultyMultiplier').value === 'true';

        document.getElementById('previewQuestions').textContent = questionsCount;
        document.getElementById('previewBaseIQ').textContent = baseIQ;
        document.getElementById('previewPoints').textContent = pointsPerQuestion;
        document.getElementById('previewMaxIQ').textContent = maxIQ;
        document.getElementById('previewDifficulty').textContent = difficultyMultiplier ? 'Enabled' : 'Disabled';
    }

    handleImageUpload(event) {
        const file = event.target.files[0];
        if (!file) return;

        // Validate file type
        if (!file.type.startsWith('image/')) {
            this.showAlert('Please select a valid image file.', 'error');
            return;
        }

        // Validate file size (5MB limit)
        if (file.size > 5 * 1024 * 1024) {
            this.showAlert('Image file is too large. Please select a file smaller than 5MB.', 'error');
            return;
        }

        const reader = new FileReader();
        reader.onload = (e) => {
            const dataUrl = e.target.result;
            
            // Store the image data
            this.currentImageData = {
                dataUrl: dataUrl,
                filename: file.name,
                size: file.size,
                type: file.type
            };

            // Update the URL field with a local path suggestion
            const suggestedPath = `/images/${file.name}`;
            document.getElementById('mediaUrl').value = suggestedPath;

            // Show preview
            this.showImagePreview(dataUrl, file);
            
            this.showAlert('Image uploaded successfully! Remember to copy this image to your website.', 'success');
        };

        reader.readAsDataURL(file);
    }

    showImagePreview(dataUrl, file) {
        const preview = document.getElementById('imagePreview');
        preview.innerHTML = `
            <img src="${dataUrl}" alt="Preview">
            <div class="image-info">
                <strong>File:</strong> ${file.name}<br>
                <strong>Size:</strong> ${this.formatFileSize(file.size)}<br>
                <strong>Type:</strong> ${file.type}<br>
                <strong>Suggested path:</strong> /images/${file.name}
            </div>
        `;
    }

    formatFileSize(bytes) {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    }

    isValidMediaUrl(url) {
        // Check if it's a valid HTTP/HTTPS URL
        try {
            const urlObj = new URL(url);
            if (urlObj.protocol === 'http:' || urlObj.protocol === 'https:') {
                return true;
            }
        } catch (e) {
            // Not a valid URL, check if it's a local path
        }

        // Check if it's a valid local path (starts with / or ./ or ../)
        if (url.startsWith('/') || url.startsWith('./') || url.startsWith('../')) {
            return true;
        }

        // Check if it's a YouTube URL
        if (url.includes('youtube.com') || url.includes('youtu.be')) {
            return true;
        }

        return false;
    }

    clearForm() {
        document.getElementById('questionForm').reset();
        this.currentCorrectAnswer = 0;
        this.editingIndex = -1;
        this.currentImageData = null;
        
        // Reset correct answer indicators
        document.querySelectorAll('.correct-indicator').forEach((indicator, i) => {
            indicator.classList.toggle('selected', i === 0);
        });
        
        // Clear image preview
        document.getElementById('imagePreview').innerHTML = '';
        
        toggleFields(); // Call global function instead of this.toggleFields()
    }

    filterQuestions() {
        const searchTerm = document.getElementById('searchInput').value.toLowerCase();
        const typeFilter = document.getElementById('typeFilter').value;
        const levelFilter = document.getElementById('levelFilter').value;
        
        const questionItems = document.querySelectorAll('.question-item');
        
        questionItems.forEach(item => {
            const index = parseInt(item.dataset.index);
            const question = this.questions[index];
            
            const matchesSearch = question.question.toLowerCase().includes(searchTerm) || 
                                question.options.some(opt => opt.toLowerCase().includes(searchTerm));
            const matchesType = !typeFilter || question.type === typeFilter;
            const matchesLevel = !levelFilter || question.brainrotLevel === levelFilter;
            
            item.style.display = matchesSearch && matchesType && matchesLevel ? 'block' : 'none';
        });
    }

    updateExportPreview() {
        const preview = document.getElementById('exportPreview');
        if (this.questions.length === 0) {
            preview.value = 'No questions to export.';
            return;
        }

        const exportData = {
            questions: this.questions,
            metadata: {
                totalQuestions: this.questions.length,
                createdAt: new Date().toISOString(),
                version: '1.0'
            }
        };

        preview.value = JSON.stringify(exportData, null, 2);
    }

    exportJSON() {
        if (this.questions.length === 0) {
            this.showAlert('No questions to export.', 'error');
            return;
        }

        const exportData = {
            questions: this.questions,
            metadata: {
                totalQuestions: this.questions.length,
                createdAt: new Date().toISOString(),
                version: '1.0'
            }
        };

        this.downloadFile(JSON.stringify(exportData, null, 2), 'braincaptcha-questions.json', 'application/json');
        this.showAlert('Questions exported as JSON!', 'success');
    }

    exportJS() {
        if (this.questions.length === 0) {
            this.showAlert('No questions to export.', 'error');
            return;
        }

        const jsCode = `// BrainCaptcha Questions - Generated on ${new Date().toISOString()}
import { QuestionBuilder } from './question-builder.js';

export function createCustomQuestions() {
    const builder = new QuestionBuilder();
    
    ${this.questions.map(q => {
        if (q.type === 'text') {
            return `builder.addTextQuestion('${q.question}', ${JSON.stringify(q.options)}, ${q.correct}, '${q.brainrotLevel}', '${q.emoji}');`;
        } else if (q.type === 'image') {
            return `builder.addImageQuestion('${q.image}', '${q.question}', ${JSON.stringify(q.options)}, ${q.correct}, '${q.brainrotLevel}');`;
        } else if (q.type === 'video') {
            return `builder.addVideoQuestion('${q.video}', '${q.question}', ${JSON.stringify(q.options)}, ${q.correct}, '${q.brainrotLevel}');`;
        } else if (q.type === 'gif') {
            return `builder.addGifQuestion('${q.gif}', '${q.question}', ${JSON.stringify(q.options)}, ${q.correct}, '${q.brainrotLevel}');`;
        }
    }).join('\n    ')}
    
    return builder.build();
}

// Alternative: Direct questions array
export const questions = ${JSON.stringify(this.questions, null, 2)};`;

        this.downloadFile(jsCode, 'braincaptcha-questions.js', 'text/javascript');
        this.showAlert('Questions exported as JavaScript!', 'success');
    }

    exportCSV() {
        if (this.questions.length === 0) {
            this.showAlert('No questions to export.', 'error');
            return;
        }

        const headers = ['Type', 'Question', 'Option1', 'Option2', 'Option3', 'Option4', 'Option5', 'Correct Answer', 'Brainrot Level', 'Emoji', 'Media URL'];
        const csvRows = [headers.join(',')];

        this.questions.forEach(q => {
            const row = [
                q.type,
                `"${q.question}"`,
                `"${q.options[0] || ''}"`,
                `"${q.options[1] || ''}"`,
                `"${q.options[2] || ''}"`,
                `"${q.options[3] || ''}"`,
                `"${q.options[4] || ''}"`,
                q.correct,
                q.brainrotLevel,
                q.emoji || '',
                q.image || q.video || q.gif || ''
            ];
            csvRows.push(row.join(','));
        });

        this.downloadFile(csvRows.join('\n'), 'braincaptcha-questions.csv', 'text/csv');
        this.showAlert('Questions exported as CSV!', 'success');
    }

    exportConfig() {
        if (this.questions.length === 0) {
            this.showAlert('No questions to export.', 'error');
            return;
        }

        // Collect image files that need to be copied
        const imageFiles = [];
        this.questions.forEach(q => {
            if (q.imageData) {
                imageFiles.push({
                    filename: q.imageData.filename,
                    suggestedPath: q.image || q.video || q.gif,
                    dataUrl: q.imageData.dataUrl
                });
            }
        });

        const config = {
            questions: this.questions,
            settings: this.settings,
            imageFiles: imageFiles,
            metadata: {
                totalQuestions: this.questions.length,
                totalImages: imageFiles.length,
                createdAt: new Date().toISOString(),
                version: '1.0',
                exportType: 'full-config'
            }
        };

        // Generate comprehensive JavaScript code
        const jsCode = `/*
 * BrainCaptcha Complete Configuration
 * Generated on ${new Date().toISOString()}
 * 
 * SETUP INSTRUCTIONS:
 * ${imageFiles.length > 0 ? `
 * 1. Copy these image files to your website:
${imageFiles.map(img => `    - ${img.filename} → ${img.suggestedPath}`).join('\n')}
 * 
 * 2. Import this configuration in your website:
 *    import { initializeCaptcha } from './braincaptcha-config.js';
 * 
 * 3. Initialize the captcha:
 *    const captcha = initializeCaptcha(container, callback);
 */` : `
 * 1. Import this configuration in your website:
 *    import { initializeCaptcha } from './braincaptcha-config.js';
 * 
 * 2. Initialize the captcha:
 *    const captcha = initializeCaptcha(container, callback);
 */`} 

// Captcha Settings
export const captchaSettings = ${JSON.stringify(this.settings, null, 2)};

// Questions Array
export const questions = ${JSON.stringify(this.questions, null, 2)};

// Image Files Information (for reference)
export const imageFiles = ${JSON.stringify(imageFiles.map(img => ({
    filename: img.filename,
    suggestedPath: img.suggestedPath
})), null, 2)};

// Complete Configuration Object
export const captchaConfig = {
    settings: captchaSettings,
    questions: questions,
    imageFiles: imageFiles,
    metadata: {
        totalQuestions: ${this.questions.length},
        totalImages: ${imageFiles.length},
        createdAt: '${new Date().toISOString()}',
        version: '1.0'
    }
};

// Helper function to initialize captcha with this config
export function initializeCaptcha(container, callback) {
    const captcha = new BrainCaptcha(container, callback, {
        questions: questions,
        ...captchaSettings
    });
    return captcha;
}

// Helper function to get random questions based on settings
export function getRandomQuestions() {
    const { questionsPerCaptcha, selectionMethod, allowRepeat } = captchaSettings;
    let selectedQuestions = [];
    
    if (selectionMethod === 'random') {
        selectedQuestions = questions.sort(() => Math.random() - 0.5);
    } else if (selectionMethod === 'difficulty') {
        selectedQuestions = questions.sort((a, b) => {
            const levels = { low: 1, medium: 2, high: 3, extreme: 4, maximum: 5, legendary: 6 };
            return levels[a.brainrotLevel] - levels[b.brainrotLevel];
        });
    } else if (selectionMethod === 'balanced') {
        // Mix of all difficulty levels
        const levels = ['low', 'medium', 'high', 'extreme', 'maximum', 'legendary'];
        selectedQuestions = [];
        levels.forEach(level => {
            const levelQuestions = questions.filter(q => q.brainrotLevel === level);
            selectedQuestions = selectedQuestions.concat(levelQuestions.sort(() => Math.random() - 0.5));
        });
    } else {
        selectedQuestions = [...questions];
    }
    
    return selectedQuestions.slice(0, questionsPerCaptcha);
}

// Default export
export default captchaConfig;`;

        this.downloadFile(jsCode, 'braincaptcha-config.js', 'application/javascript');
        this.showAlert('Complete configuration exported!', 'success');
    }

    downloadFile(content, filename, contentType) {
        const blob = new Blob([content], { type: contentType });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        a.click();
        URL.revokeObjectURL(url);
    }

    loadFromFile() {
        document.getElementById('fileInput').click();
    }

    handleFileLoad(event) {
        const file = event.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (e) => {
            try {
                const content = e.target.result;
                let questions = [];
                let settings = null;

                if (file.name.endsWith('.json')) {
                    const data = JSON.parse(content);
                    questions = data.questions || data;
                    settings = data.settings || null;
                } else if (file.name.endsWith('.csv')) {
                    questions = this.parseCSV(content);
                }

                if (questions.length > 0) {
                    this.questions = questions;
                    
                    // Load settings if available
                    if (settings) {
                        this.settings = { ...this.getDefaultSettings(), ...settings };
                        this.applySettingsToForm();
                        this.updateSettingsPreview();
                        localStorage.setItem('brainCaptchaSettings', JSON.stringify(this.settings));
                    }
                    
                    this.renderQuestions();
                    this.updateStats();
                    this.updateExportPreview();
                    
                    const message = settings ? 
                        `Loaded ${questions.length} questions and settings successfully!` : 
                        `Loaded ${questions.length} questions successfully!`;
                    this.showAlert(message, 'success');
                } else {
                    this.showAlert('No valid questions found in file.', 'error');
                }
            } catch (error) {
                this.showAlert('Error reading file: ' + error.message, 'error');
            }
        };
        reader.readAsText(file);
    }

    parseCSV(content) {
        const lines = content.split('\n');
        const questions = [];
        
        for (let i = 1; i < lines.length; i++) {
            const line = lines[i].trim();
            if (!line) continue;
            
            const parts = line.split(',');
            if (parts.length < 8) continue;
            
            const options = [parts[2], parts[3], parts[4], parts[5], parts[6]]
                .map(opt => opt.replace(/"/g, ''))
                .filter(opt => opt.trim());
            
            if (options.length < 2) continue;
            
            const question = {
                id: Date.now() + Math.random(),
                type: parts[0],
                question: parts[1].replace(/"/g, ''),
                options: options,
                correct: parseInt(parts[7]),
                brainrotLevel: parts[8],
                emoji: parts[9] || '🤔',
                created: new Date().toISOString()
            };
            
            if (parts[10]) {
                if (question.type === 'image') question.image = parts[10];
                if (question.type === 'video') question.video = parts[10];
                if (question.type === 'gif') question.gif = parts[10];
            }
            
            questions.push(question);
        }
        
        return questions;
    }

    clearAllQuestions() {
        if (confirm('Are you sure you want to delete all questions? This cannot be undone.')) {
            this.questions = [];
            this.renderQuestions();
            this.updateStats();
            this.updateExportPreview();
            this.showAlert('All questions cleared!', 'success');
        }
    }

    shuffleQuestions() {
        for (let i = this.questions.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [this.questions[i], this.questions[j]] = [this.questions[j], this.questions[i]];
        }
        this.renderQuestions();
        this.showAlert('Questions shuffled!', 'success');
    }

    addTemplate(template) {
        const templates = {
            skibidi: {
                type: 'text',
                question: 'What level of skibidi energy is this?',
                options: ['None', 'Low', 'Medium', 'Maximum Ohio'],
                correct: 3,
                brainrotLevel: 'extreme',
                emoji: '🚽'
            },
            sigma: {
                type: 'text',
                question: 'Rate this sigma male grindset:',
                options: ['Beta', 'Alpha', 'Sigma', 'Omega'],
                correct: 2,
                brainrotLevel: 'high',
                emoji: '💪'
            },
            gigachad: {
                type: 'text',
                question: 'This gigachad energy represents:',
                options: ['Weak', 'Mid', 'Strong', 'Ultimate'],
                correct: 3,
                brainrotLevel: 'maximum',
                emoji: '🗿'
            },
            rizz: {
                type: 'text',
                question: 'What\'s the rizz level here?',
                options: ['No rizz', 'Some rizz', 'W rizz', 'Unspoken rizz'],
                correct: 3,
                brainrotLevel: 'legendary',
                emoji: '😎'
            },
            ohio: {
                type: 'text',
                question: 'How Ohio is this situation?',
                options: ['Normal', 'Slightly Ohio', 'Very Ohio', 'Maximum Ohio'],
                correct: 3,
                brainrotLevel: 'extreme',
                emoji: '🌽'
            },
            mewing: {
                type: 'text',
                question: 'Rate this mewing technique:',
                options: ['Mouth breather', 'Beginner', 'Intermediate', 'Jawline god'],
                correct: 3,
                brainrotLevel: 'high',
                emoji: '😤'
            },
            sus: {
                type: 'text',
                question: 'Sus level analysis:',
                options: ['Clear', 'Slightly sus', 'Sus', 'Mega sus'],
                correct: 2,
                brainrotLevel: 'medium',
                emoji: '📮'
            },
            bussin: {
                type: 'text',
                question: 'Is this bussin or nah?',
                options: ['Trash', 'Mid', 'Good', 'Absolutely bussin'],
                correct: 3,
                brainrotLevel: 'high',
                emoji: '🔥'
            },
            flag_india: {
                type: 'text',
                question: 'What country is this flag from?',
                options: ['Pakistan', 'India', 'Bangladesh', 'Sri Lanka'],
                correct: 1,
                brainrotLevel: 'medium',
                emoji: '🇮🇳'
            },
            flag_usa: {
                type: 'text',
                question: 'This flag represents:',
                options: ['Canada', 'USA', 'UK', 'Australia'],
                correct: 1,
                brainrotLevel: 'low',
                emoji: '🇺🇸'
            },
            flag_uk: {
                type: 'text',
                question: 'Which country uses this flag?',
                options: ['Ireland', 'Scotland', 'UK', 'Wales'],
                correct: 2,
                brainrotLevel: 'medium',
                emoji: '🇬🇧'
            }
        };

        const templateData = templates[template];
        if (templateData) {
            const question = {
                ...templateData,
                id: Date.now(),
                created: new Date().toISOString()
            };
            this.questions.push(question);
            this.renderQuestions();
            this.updateStats();
            this.updateExportPreview();
            this.showAlert(`Added ${template} template question!`, 'success');
        }
    }

    addAllTemplates() {
        const templates = ['skibidi', 'sigma', 'gigachad', 'rizz', 'ohio', 'mewing', 'sus', 'bussin'];
        templates.forEach(template => this.addTemplate(template));
    }

    generateRandomQuestions() {
        const randomQuestions = [
            {
                type: 'text',
                question: 'What does "no cap" mean?',
                options: ['No hat', 'No lies', 'No limit', 'No idea'],
                correct: 1,
                brainrotLevel: 'medium',
                emoji: '🧢'
            },
            {
                type: 'text',
                question: 'Fanum tax is:',
                options: ['Real tax', 'Stealing food', 'Government fee', 'Meme reference'],
                correct: 1,
                brainrotLevel: 'high',
                emoji: '🍕'
            },
            {
                type: 'text',
                question: 'Gyatt means:',
                options: ['Goodbye', 'Great', 'Wow/impressive', 'Greetings'],
                correct: 2,
                brainrotLevel: 'extreme',
                emoji: '🍑'
            },
            {
                type: 'text',
                question: 'What is a "rizzler"?',
                options: ['A puzzle', 'Someone with charisma', 'A drink', 'A dance'],
                correct: 1,
                brainrotLevel: 'high',
                emoji: '😎'
            },
            {
                type: 'text',
                question: 'NPC behavior means:',
                options: ['Very creative', 'Robotic/predictable', 'Friendly', 'Aggressive'],
                correct: 1,
                brainrotLevel: 'medium',
                emoji: '🤖'
            },
            {
                type: 'text',
                question: 'Touch grass means:',
                options: ['Garden work', 'Go outside', 'Play sports', 'Clean up'],
                correct: 1,
                brainrotLevel: 'low',
                emoji: '🌱'
            },
            {
                type: 'text',
                question: 'What is "based"?',
                options: ['Located', 'Authentic/cool', 'Supported', 'Grounded'],
                correct: 1,
                brainrotLevel: 'medium',
                emoji: '💯'
            },
            {
                type: 'text',
                question: 'Salty means:',
                options: ['Tasty', 'Bitter/upset', 'Thirsty', 'Seasoned'],
                correct: 1,
                brainrotLevel: 'low',
                emoji: '🧂'
            },
            {
                type: 'text',
                question: 'What does "periodt" mean?',
                options: ['Time period', 'End of discussion', 'Punctuation', 'Monthly'],
                correct: 1,
                brainrotLevel: 'medium',
                emoji: '💅'
            },
            {
                type: 'text',
                question: 'Slaps means:',
                options: ['Hits', 'Really good', 'Claps', 'Loud'],
                correct: 1,
                brainrotLevel: 'medium',
                emoji: '👋'
            }
        ];

        const selectedQuestions = randomQuestions.slice(0, 10);
        selectedQuestions.forEach(questionData => {
            const question = {
                ...questionData,
                id: Date.now() + Math.random(),
                created: new Date().toISOString()
            };
            this.questions.push(question);
        });

        this.renderQuestions();
        this.updateStats();
        this.updateExportPreview();
        this.showAlert('Generated 10 random questions!', 'success');
    }
}

// Global functions
function toggleFields() {
    const type = document.getElementById('questionType').value;
    const mediaField = document.getElementById('mediaField');
    const mediaLabel = document.getElementById('mediaLabel');
    const emojiField = document.getElementById('emojiField');
    
    if (type === 'text') {
        mediaField.style.display = 'none';
        emojiField.style.display = 'block';
    } else {
        mediaField.style.display = 'block';
        emojiField.style.display = 'none';
        
        if (type === 'image') {
            mediaLabel.textContent = 'Image URL or Path';
            document.getElementById('mediaUrl').placeholder = 'https://example.com/image.jpg or /images/image.jpg';
        } else if (type === 'video') {
            mediaLabel.textContent = 'Video URL or Path';
            document.getElementById('mediaUrl').placeholder = 'https://youtu.be/dQw4w9WgXcQ or /videos/video.mp4';
        } else if (type === 'gif') {
            mediaLabel.textContent = 'GIF URL or Path';
            document.getElementById('mediaUrl').placeholder = 'https://example.com/animation.gif or /images/animation.gif';
        }
    }
}

function selectCorrect(index) {
    designer.currentCorrectAnswer = index;
    document.querySelectorAll('.correct-indicator').forEach((indicator, i) => {
        indicator.classList.toggle('selected', i === index);
    });
}

function addOption() {
    const container = document.getElementById('optionsContainer');
    const optionCount = container.children.length;
    
    if (optionCount >= 6) {
        designer.showAlert('Maximum 6 options allowed.', 'error');
        return;
    }
    
    const optionDiv = document.createElement('div');
    optionDiv.className = 'options-container';
    optionDiv.innerHTML = `
        <input type="text" class="option-input" placeholder="Option ${optionCount + 1}" required>
        <div class="correct-indicator" onclick="selectCorrect(${optionCount})">✓</div>
    `;
    container.appendChild(optionDiv);
}

function removeOption() {
    const container = document.getElementById('optionsContainer');
    if (container.children.length <= 2) {
        designer.showAlert('Minimum 2 options required.', 'error');
        return;
    }
    
    container.removeChild(container.lastChild);
    
    // Reset correct answer if it was the removed option
    if (designer.currentCorrectAnswer >= container.children.length) {
        designer.currentCorrectAnswer = 0;
        selectCorrect(0);
    }
}

function clearForm() {
    designer.clearForm();
}

function filterQuestions() {
    designer.filterQuestions();
}

function clearAllQuestions() {
    designer.clearAllQuestions();
}

function shuffleQuestions() {
    designer.shuffleQuestions();
}

function addTemplate(template) {
    designer.addTemplate(template);
}

function addAllTemplates() {
    designer.addAllTemplates();
}

function generateRandomQuestions() {
    designer.generateRandomQuestions();
}

function exportJSON() {
    designer.exportJSON();
}

function exportJS() {
    designer.exportJS();
}

function exportCSV() {
    designer.exportCSV();
}

function exportConfig() {
    designer.exportConfig();
}

function toggleSettings() {
    designer.toggleSettings();
}

function saveSettings() {
    designer.saveSettings();
}

function resetSettings() {
    designer.resetSettings();
}

function uploadLocalImage() {
    document.getElementById('imageUpload').click();
}

function handleImageUpload(event) {
    designer.handleImageUpload(event);
}

function loadFromFile() {
    designer.loadFromFile();
}

function handleFileLoad(event) {
    designer.handleFileLoad(event);
}

// Initialize the designer when the page loads
let designer;
document.addEventListener('DOMContentLoaded', () => {
    designer = new QuestionDesigner();
    toggleFields();
    designer.updateExportPreview();
    
    // Select first option as correct by default
    selectCorrect(0);
});
