/**
 * BrainCaptcha Library - Standalone version for easy website integration
 * 
 * Usage:
 * <script src="braincaptcha.min.js"></script>
 * <script>
 *   const captcha = new BrainCaptcha(container, callback);
 * </script>
 */

(function(global) {
  'use strict';

  // Default configuration
  const DEFAULT_CONFIG = {
    questions: [
      {
        image: 'https://via.placeholder.com/400x300/646cff/ffffff?text=Skibidi+Toilet',
        question: 'What level of skibidi is this?',
        options: ['Ohio', 'Sigma', 'Gyatt', 'Rizz'],
        correct: 0,
        brainrotLevel: 'extreme'
      },
      {
        image: 'https://via.placeholder.com/400x300/535bf2/ffffff?text=Ohio+Sigma',
        question: 'Rate this sigma male energy:',
        options: ['Mid', 'Based', 'Cringe', 'Bussin'],
        correct: 1,
        brainrotLevel: 'high'
      },
      {
        image: 'https://via.placeholder.com/400x300/4caf50/ffffff?text=Gigachad',
        question: 'This gigachad represents:',
        options: ['Beta behavior', 'Alpha mindset', 'NPC energy', 'Soy face'],
        correct: 1,
        brainrotLevel: 'medium'
      },
      {
        image: 'https://via.placeholder.com/400x300/ff9800/ffffff?text=Rizzler',
        question: 'How much rizz does this have?',
        options: ['No cap', 'Fr fr', 'On god', 'All of the above'],
        correct: 3,
        brainrotLevel: 'maximum'
      },
      {
        image: 'https://via.placeholder.com/400x300/f44336/ffffff?text=Mewing+Cat',
        question: 'This mewing technique is:',
        options: ['Sussy baka', 'Poggers', 'Sheesh', 'Fanum tax'],
        correct: 2,
        brainrotLevel: 'legendary'
      }
    ],
    theme: {
      primaryColor: '#646cff',
      secondaryColor: '#535bf2',
      successColor: '#4caf50',
      errorColor: '#f44336',
      warningColor: '#ff9800',
      bgColor: '#1a1a1a',
      cardBg: '#2d2d2d',
      textColor: '#ffffff',
      borderColor: '#404040'
    }
  };

  // Inject CSS styles
  function injectStyles(theme) {
    const styles = `
      .braincaptcha-container {
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
        max-width: 600px;
        margin: 0 auto;
        color: ${theme.textColor};
      }
      
      .braincaptcha-card {
        background: ${theme.cardBg};
        border-radius: 12px;
        padding: 2rem;
        border: 2px solid ${theme.borderColor};
        box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
        transition: all 0.3s ease;
      }
      
      .braincaptcha-card:hover {
        transform: translateY(-2px);
        box-shadow: 0 15px 40px rgba(0, 0, 0, 0.4);
      }
      
      .braincaptcha-progress-bar {
        width: 100%;
        height: 6px;
        background: ${theme.borderColor};
        border-radius: 3px;
        overflow: hidden;
        margin-bottom: 1.5rem;
      }
      
      .braincaptcha-progress-fill {
        height: 100%;
        background: linear-gradient(90deg, ${theme.primaryColor}, ${theme.secondaryColor});
        transition: width 0.5s ease;
      }
      
      .braincaptcha-question-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 1.5rem;
      }
      
      .braincaptcha-question-number {
        font-size: 0.9rem;
        opacity: 0.7;
      }
      
      .braincaptcha-brainrot-level {
        font-size: 0.8rem;
        padding: 0.25rem 0.75rem;
        background: ${theme.warningColor};
        color: ${theme.bgColor};
        border-radius: 20px;
        font-weight: bold;
      }
      
      .braincaptcha-image-container {
        margin-bottom: 2rem;
      }
      
      .braincaptcha-image {
        width: 100%;
        height: 250px;
        object-fit: cover;
        border-radius: 12px;
        background: linear-gradient(135deg, ${theme.primaryColor}, ${theme.secondaryColor});
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 1.2rem;
        font-weight: bold;
        text-align: center;
        color: white;
      }
      
      .braincaptcha-question-text {
        font-size: 1.4rem;
        margin-bottom: 1.5rem;
        text-align: center;
      }
      
      .braincaptcha-options-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
        gap: 1rem;
      }
      
      .braincaptcha-option-btn {
        padding: 1rem 1.5rem;
        background: ${theme.bgColor};
        border: 2px solid ${theme.borderColor};
        border-radius: 12px;
        color: ${theme.textColor};
        font-size: 1rem;
        font-weight: 500;
        cursor: pointer;
        transition: all 0.3s ease;
        font-family: inherit;
      }
      
      .braincaptcha-option-btn:hover {
        border-color: ${theme.primaryColor};
        background: rgba(100, 108, 255, 0.1);
        transform: translateY(-2px);
      }
      
      .braincaptcha-option-btn.correct {
        background: ${theme.successColor};
        border-color: ${theme.successColor};
        color: white;
      }
      
      .braincaptcha-option-btn.incorrect {
        background: ${theme.errorColor};
        border-color: ${theme.errorColor};
        color: white;
      }
      
      .braincaptcha-option-btn:disabled {
        cursor: not-allowed;
        opacity: 0.7;
      }
      
      .braincaptcha-results {
        background: ${theme.cardBg};
        border-radius: 12px;
        padding: 2rem;
        text-align: center;
        border: 2px solid ${theme.borderColor};
        box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
      }
      
      .braincaptcha-results h2 {
        font-size: 2rem;
        margin-bottom: 1rem;
      }
      
      .braincaptcha-iq-score {
        display: flex;
        flex-direction: column;
        align-items: center;
        margin-bottom: 1rem;
      }
      
      .braincaptcha-iq-number {
        font-size: 4rem;
        font-weight: bold;
        background: linear-gradient(45deg, ${theme.primaryColor}, ${theme.secondaryColor});
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        background-clip: text;
        line-height: 1;
      }
      
      .braincaptcha-iq-label {
        font-size: 1.2rem;
        opacity: 0.7;
        margin-top: 0.5rem;
      }
      
      .braincaptcha-stats {
        display: flex;
        justify-content: center;
        gap: 2rem;
        margin-bottom: 2rem;
      }
      
      .braincaptcha-stat {
        display: flex;
        flex-direction: column;
        align-items: center;
      }
      
      .braincaptcha-stat-value {
        font-size: 2rem;
        font-weight: bold;
        color: ${theme.primaryColor};
      }
      
      .braincaptcha-stat-label {
        font-size: 0.9rem;
        opacity: 0.7;
      }
      
      .braincaptcha-verdict {
        margin-bottom: 2rem;
        padding: 1.5rem;
        background: rgba(100, 108, 255, 0.1);
        border-radius: 12px;
        border: 1px solid ${theme.primaryColor};
      }
      
      .braincaptcha-verdict h3 {
        font-size: 1.3rem;
        margin-bottom: 0.5rem;
        color: ${theme.primaryColor};
      }
      
      .braincaptcha-verdict p {
        font-size: 1rem;
        opacity: 0.9;
        margin: 0;
      }
      
      .braincaptcha-completion-notice {
        margin-top: 2rem;
        padding: 1rem;
        background: rgba(76, 175, 80, 0.1);
        border: 1px solid ${theme.successColor};
        border-radius: 8px;
        color: ${theme.successColor};
        text-align: center;
        font-weight: 500;
      }
      
      .braincaptcha-completion-notice p {
        margin: 0;
        font-size: 1rem;
      }
      
      @media (max-width: 768px) {
        .braincaptcha-card {
          padding: 1.5rem;
        }
        
        .braincaptcha-options-grid {
          grid-template-columns: 1fr;
        }
        
        .braincaptcha-stats {
          flex-direction: column;
          gap: 1rem;
        }
        
        .braincaptcha-iq-number {
          font-size: 3rem;
        }
      }
    `;
    
    const styleSheet = document.createElement('style');
    styleSheet.textContent = styles;
    document.head.appendChild(styleSheet);
  }

  // Main BrainCaptcha class
  class BrainCaptcha {
    constructor(container, onComplete, config = {}) {
      this.container = container;
      this.onComplete = onComplete;
      this.config = { ...DEFAULT_CONFIG, ...config };
      this.currentQuestion = 0;
      this.answers = [];
      
      // Inject styles if not already done
      if (!document.querySelector('.braincaptcha-styles-injected')) {
        injectStyles(this.config.theme);
        document.head.appendChild(Object.assign(document.createElement('meta'), {
          className: 'braincaptcha-styles-injected'
        }));
      }
      
      this.init();
    }

    init() {
      this.container.className = 'braincaptcha-container';
      this.showQuestion();
    }

    showQuestion() {
      const question = this.config.questions[this.currentQuestion];
      const progress = ((this.currentQuestion + 1) / this.config.questions.length) * 100;

      this.container.innerHTML = `
        <div class="braincaptcha-card">
          <div class="braincaptcha-progress-bar">
            <div class="braincaptcha-progress-fill" style="width: ${progress}%"></div>
          </div>
          
          <div class="braincaptcha-question-header">
            <span class="braincaptcha-question-number">Question ${this.currentQuestion + 1} of ${this.config.questions.length}</span>
            <span class="braincaptcha-brainrot-level">${question.brainrotLevel.toUpperCase()}</span>
          </div>

          <div class="braincaptcha-image-container">
            <img class="braincaptcha-image" src="${question.imageData?.dataUrl || question.image}" alt="Brainrot Image ${this.currentQuestion + 1}" onerror="this.style.display='flex'; this.innerHTML='📸 Brainrot Image ${this.currentQuestion + 1}<br><small>Image not found</small>'">
          </div>

          <h3 class="braincaptcha-question-text">${question.question}</h3>

          <div class="braincaptcha-options-grid">
            ${question.options.map((option, index) => `
              <button class="braincaptcha-option-btn" data-option="${index}">
                ${option}
              </button>
            `).join('')}
          </div>
        </div>
      `;

      // Add event listeners
      this.container.querySelectorAll('.braincaptcha-option-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
          const selectedOption = parseInt(e.target.dataset.option);
          this.selectAnswer(selectedOption);
        });
      });
    }

    selectAnswer(selectedOption) {
      const question = this.config.questions[this.currentQuestion];
      const isCorrect = selectedOption === question.correct;
      
      this.answers.push({
        question: this.currentQuestion,
        selected: selectedOption,
        correct: question.correct,
        isCorrect: isCorrect,
        brainrotLevel: question.brainrotLevel
      });

      // Visual feedback
      const selectedBtn = this.container.querySelector(`[data-option="${selectedOption}"]`);
      selectedBtn.classList.add(isCorrect ? 'correct' : 'incorrect');

      // Show correct answer if wrong
      if (!isCorrect) {
        const correctBtn = this.container.querySelector(`[data-option="${question.correct}"]`);
        correctBtn.classList.add('correct');
      }

      // Disable all buttons
      this.container.querySelectorAll('.braincaptcha-option-btn').forEach(btn => {
        btn.disabled = true;
      });

      // Move to next question or show results
      setTimeout(() => {
        this.currentQuestion++;
        if (this.currentQuestion < this.config.questions.length) {
          this.showQuestion();
        } else {
          this.showResults();
        }
      }, 1500);
    }

    showResults() {
      const iq = this.calculateFakeIQ();
      const correctAnswers = this.answers.filter(a => a.isCorrect).length;
      const totalQuestions = this.config.questions.length;
      
      const result = {
        iq: iq,
        correctAnswers: correctAnswers,
        totalQuestions: totalQuestions,
        answers: this.answers,
        accuracy: Math.round((correctAnswers / totalQuestions) * 100),
        brainrotLevel: this.getBrainrotTier(iq),
        timestamp: new Date().toISOString()
      };
      
      this.container.innerHTML = `
        <div class="braincaptcha-results">
          <div class="braincaptcha-results-header">
            <h2>🧠 Captcha Complete!</h2>
            <div class="braincaptcha-iq-score">
              <span class="braincaptcha-iq-number">${iq}</span>
              <span class="braincaptcha-iq-label">Brainrot IQ</span>
            </div>
          </div>

          <div class="braincaptcha-stats">
            <div class="braincaptcha-stat">
              <span class="braincaptcha-stat-value">${correctAnswers}</span>
              <span class="braincaptcha-stat-label">Correct</span>
            </div>
            <div class="braincaptcha-stat">
              <span class="braincaptcha-stat-value">${totalQuestions - correctAnswers}</span>
              <span class="braincaptcha-stat-label">Wrong</span>
            </div>
            <div class="braincaptcha-stat">
              <span class="braincaptcha-stat-value">${result.accuracy}%</span>
              <span class="braincaptcha-stat-label">Accuracy</span>
            </div>
          </div>

          <div class="braincaptcha-verdict">
            <h3>${this.getBrainrotVerdict(iq)}</h3>
            <p>${this.getBrainrotMessage(iq)}</p>
          </div>

          <div class="braincaptcha-completion-notice">
            <p>✅ Verification completed successfully</p>
          </div>
        </div>
      `;

      // Call the completion callback with comprehensive result data
      if (this.onComplete) {
        this.onComplete(result);
      }
    }

    calculateFakeIQ() {
      const correctAnswers = this.answers.filter(a => a.isCorrect).length;
      const totalQuestions = this.config.questions.length;
      const accuracy = correctAnswers / totalQuestions;
      
      // Base IQ starts at 85 (slightly below average)
      let baseIQ = 85;
      
      // Accuracy bonus (0-60 points based on percentage correct)
      const accuracyBonus = Math.floor(accuracy * 60);
      
      // Difficulty-based bonuses
      const difficultyBonus = this.answers.reduce((bonus, answer) => {
        if (answer.isCorrect) {
          switch (answer.brainrotLevel) {
            case 'low': return bonus + 2;
            case 'medium': return bonus + 4;
            case 'high': return bonus + 6;
            case 'extreme': return bonus + 8;
            case 'maximum': return bonus + 10;
            case 'legendary': return bonus + 12;
            default: return bonus + 3;
          }
        }
        return bonus;
      }, 0);
      
      // Consistency bonus (extra points for getting multiple questions right)
      const consistencyBonus = correctAnswers >= 4 ? 10 : 
                              correctAnswers >= 3 ? 5 : 0;
      
      // Perfect score bonus
      const perfectScoreBonus = accuracy === 1.0 ? 15 : 0;
      
      // Small random factor for variation (-3 to +3)
      const randomFactor = Math.floor(Math.random() * 7) - 3;
      
      // Calculate final IQ
      const finalIQ = baseIQ + accuracyBonus + difficultyBonus + consistencyBonus + perfectScoreBonus + randomFactor;
      
      // Ensure IQ is within reasonable bounds (70-200)
      return Math.max(70, Math.min(200, finalIQ));
    }

    getBrainrotTier(iq) {
      if (iq >= 180) return "legendary";
      if (iq >= 160) return "maximum";
      if (iq >= 140) return "extreme";
      if (iq >= 120) return "high";
      if (iq >= 100) return "medium";
      return "low";
    }

    getBrainrotVerdict(iq) {
      if (iq >= 180) return "🔥 ULTIMATE SIGMA BRAINROT GOD";
      if (iq >= 150) return "💎 DIAMOND TIER RIZZLER";
      if (iq >= 120) return "⚡ OMEGA CHAD ENERGY";
      if (iq >= 100) return "🎯 CERTIFIED SKIBIDI MASTER";
      if (iq >= 80) return "📈 ASPIRING OHIO LEGEND";
      return "🤡 STILL LEARNING THE WAYS";
    }

    getBrainrotMessage(iq) {
      if (iq >= 180) return "You've transcended mortal brainrot. You ARE the meme.";
      if (iq >= 150) return "Your rizz levels are off the charts. Respect.";
      if (iq >= 120) return "Solid sigma grindset. Keep mewing, king.";
      if (iq >= 100) return "You understand the assignment. Pretty sus but bussin.";
      if (iq >= 80) return "Mid performance but you're getting there, no cap.";
      return "Time to touch grass and study the sacred texts.";
    }
  }

  // Make it globally available
  global.BrainCaptcha = BrainCaptcha;

  // AMD support
  if (typeof define === 'function' && define.amd) {
    define(function() {
      return BrainCaptcha;
    });
  }

  // CommonJS support
  if (typeof module === 'object' && module.exports) {
    module.exports = BrainCaptcha;
  }

})(typeof window !== 'undefined' ? window : this);
