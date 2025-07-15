/**
 * BrainCaptcha - A brainrot-themed captcha system
 * Shows configurable number of brainrot images and calculates a fake IQ score
 */
export class BrainCaptcha {
  constructor(container, onComplete, config = {}) {
    this.container = container
    this.onComplete = onComplete
    this.currentQuestion = 0
    this.answers = []
    
    // Merge config with defaults
    this.settings = {
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
      shuffleOptions: true,
      ...config.settings
    }
    
    // All available questions
    this.allQuestions = config.questions || [
      {
        type: 'text',
        question: 'What level of skibidi is this?',
        options: ['Ohio', 'Sigma', 'Gyatt', 'Rizz'],
        correct: 0,
        brainrotLevel: 'extreme',
        emoji: '🚽'
      },
      {
        type: 'text',
        question: 'Rate this sigma male energy:',
        options: ['Mid', 'Based', 'Cringe', 'Bussin'],
        correct: 1,
        brainrotLevel: 'high',
        emoji: '💪'
      },
      {
        type: 'image',
        image: '/brainrot/image3.txt',
        question: 'This gigachad represents:',
        options: ['Beta behavior', 'Alpha mindset', 'NPC energy', 'Soy face'],
        correct: 1,
        brainrotLevel: 'medium'
      },
      {
        type: 'text',
        question: 'How much rizz does this have?',
        options: ['No cap', 'Fr fr', 'On god', 'All of the above'],
        correct: 3,
        brainrotLevel: 'maximum',
        emoji: '😎'
      },
      {
        type: 'text',
        question: 'This mewing technique is:',
        options: ['Sussy baka', 'Poggers', 'Sheesh', 'Fanum tax'],
        correct: 2,
        brainrotLevel: 'legendary',
        emoji: '😤'
      }
    ]
    
    // Select questions based on settings
    this.questions = this.selectQuestions()
    
    this.init()
  }

  selectQuestions() {
    const numQuestions = Math.min(this.settings.questionsPerCaptcha, this.allQuestions.length)
    let selectedQuestions = []
    
    if (this.settings.selectionMethod === 'random') {
      // Random selection
      const availableQuestions = [...this.allQuestions]
      
      for (let i = 0; i < numQuestions; i++) {
        const randomIndex = Math.floor(Math.random() * availableQuestions.length)
        selectedQuestions.push(availableQuestions[randomIndex])
        
        if (!this.settings.allowRepeat) {
          availableQuestions.splice(randomIndex, 1)
        }
      }
    } else {
      // Sequential selection
      selectedQuestions = this.allQuestions.slice(0, numQuestions)
    }
    
    // Shuffle options if enabled
    if (this.settings.shuffleOptions) {
      selectedQuestions = selectedQuestions.map(q => {
        const question = { ...q }
        const correctAnswer = question.options[question.correct]
        
        // Shuffle options
        const shuffledOptions = [...question.options]
        for (let i = shuffledOptions.length - 1; i > 0; i--) {
          const j = Math.floor(Math.random() * (i + 1));
          [shuffledOptions[i], shuffledOptions[j]] = [shuffledOptions[j], shuffledOptions[i]]
        }
        
        // Update correct answer index
        question.options = shuffledOptions
        question.correct = shuffledOptions.indexOf(correctAnswer)
        
        return question
      })
    }
    
    return selectedQuestions
  }

  init() {
    this.container.className = 'braincaptcha-container'
    this.showQuestion()
  }

  showQuestion() {
    const question = this.questions[this.currentQuestion]
    const progress = ((this.currentQuestion + 1) / this.questions.length) * 100

    this.container.innerHTML = `
      <div class="braincaptcha-card" data-question-type="${question.type || 'text'}">
        <div class="progress-bar">
          <div class="progress-fill" style="width: ${progress}%"></div>
        </div>
        
        <div class="question-header">
          <span class="question-number">Question ${this.currentQuestion + 1} of ${this.questions.length}</span>
          <span class="brainrot-level">${question.brainrotLevel.toUpperCase()}</span>
        </div>

        ${this.renderMediaContent(question)}

        <h3 class="question-text">${question.question}</h3>

        <div class="options-grid">
          ${question.options.map((option, index) => `
            <button class="option-btn" data-option="${index}">
              ${option}
            </button>
          `).join('')}
        </div>
      </div>
    `

    // Add event listeners
    this.container.querySelectorAll('.option-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const selectedOption = parseInt(e.target.dataset.option)
        this.selectAnswer(selectedOption)
      })
    })
  }

  renderMediaContent(question) {
    const container = '<div class="media-container">';
    const containerEnd = '</div>';
    
    switch (question.type) {
      case 'image':
        // Check if we have base64 image data first, then fall back to image path
        const imageSource = question.imageData?.dataUrl || question.image;
        return `${container}
          <img class="media-image" src="${imageSource}" alt="Brainrot Image ${this.currentQuestion + 1}" 
               onerror="this.style.display='none'; this.nextElementSibling.style.display='flex';">
          <div class="placeholder-image" style="display:none;">
            📸 Brainrot Image ${this.currentQuestion + 1}
            <br><small>Image not found</small>
          </div>
        ${containerEnd}`;
      
      case 'text':
        return `${container}
          <div class="text-question-display">
            <div class="emoji-display">${question.emoji || '🤔'}</div>
          </div>
        ${containerEnd}`;
      
      case 'video':
        const isYouTube = question.video.includes('youtube.com') || question.video.includes('youtu.be');
        if (isYouTube) {
          const videoId = this.extractYouTubeId(question.video);
          return `${container}
            <div class="video-container">
              <iframe src="https://www.youtube.com/embed/${videoId}" 
                      frameborder="0" allowfullscreen class="media-video">
              </iframe>
            </div>
          ${containerEnd}`;
        } else {
          return `${container}
            <video class="media-video" controls>
              <source src="${question.video}" type="video/mp4">
              Your browser does not support the video tag.
            </video>
          ${containerEnd}`;
        }
      
      case 'gif':
        return `${container}
          <img class="media-gif" src="${question.gif}" alt="Brainrot GIF ${this.currentQuestion + 1}">
        ${containerEnd}`;
      
      default:
        // Fallback for legacy format - check for base64 data first
        if (question.imageData?.dataUrl) {
          return `${container}
            <img class="media-image" src="${question.imageData.dataUrl}" alt="Brainrot Image ${this.currentQuestion + 1}" 
                 onerror="this.style.display='none'; this.nextElementSibling.style.display='flex';">
            <div class="placeholder-image" style="display:none;">
              📸 Brainrot Image ${this.currentQuestion + 1}
              <br><small>Image not found</small>
            </div>
          ${containerEnd}`;
        } else if (question.image) {
          return `${container}
            <div class="placeholder-image" data-src="${question.image}">
              📸 Brainrot Image ${this.currentQuestion + 1}
              <br><small>Replace with actual image</small>
            </div>
          ${containerEnd}`;
        }
        return `${container}
          <div class="text-question-display">
            <div class="emoji-display">🤔</div>
          </div>
        ${containerEnd}`;
    }
  }

  extractYouTubeId(url) {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? match[2] : null;
  }

  selectAnswer(selectedOption) {
    const question = this.questions[this.currentQuestion]
    const isCorrect = selectedOption === question.correct
    
    this.answers.push({
      question: this.currentQuestion,
      selected: selectedOption,
      correct: question.correct,
      isCorrect: isCorrect,
      brainrotLevel: question.brainrotLevel
    })

    // Visual feedback
    const selectedBtn = this.container.querySelector(`[data-option="${selectedOption}"]`)
    selectedBtn.classList.add(isCorrect ? 'correct' : 'incorrect')

    // Show correct answer if wrong
    if (!isCorrect) {
      const correctBtn = this.container.querySelector(`[data-option="${question.correct}"]`)
      correctBtn.classList.add('correct')
    }

    // Disable all buttons
    this.container.querySelectorAll('.option-btn').forEach(btn => {
      btn.disabled = true
    })

    // Move to next question or show results
    setTimeout(() => {
      this.currentQuestion++
      if (this.currentQuestion < this.questions.length) {
        this.showQuestion()
      } else {
        this.showResults()
      }
    }, 1500)
  }

  showResults() {
    const iq = this.calculateFakeIQ()
    const correctAnswers = this.answers.filter(a => a.isCorrect).length
    const totalQuestions = this.questions.length
    
    const result = {
      iq: iq,
      correctAnswers: correctAnswers,
      totalQuestions: totalQuestions,
      answers: this.answers,
      accuracy: Math.round((correctAnswers / totalQuestions) * 100),
      brainrotLevel: this.getBrainrotTier(iq),
      timestamp: new Date().toISOString()
    }
    
    this.container.innerHTML = `
      <div class="braincaptcha-results">
        <div class="results-header">
          <h2>🧠 Captcha Complete!</h2>
          <div class="iq-score">
            <span class="iq-number">${iq}</span>
            <span class="iq-label">Brainrot IQ</span>
          </div>
        </div>

        <div class="results-stats">
          <div class="stat">
            <span class="stat-value">${correctAnswers}</span>
            <span class="stat-label">Correct</span>
          </div>
          <div class="stat">
            <span class="stat-value">${totalQuestions - correctAnswers}</span>
            <span class="stat-label">Wrong</span>
          </div>
          <div class="stat">
            <span class="stat-value">${result.accuracy}%</span>
            <span class="stat-label">Accuracy</span>
          </div>
        </div>

        <div class="brainrot-verdict">
          <h3>${this.getBrainrotVerdict(iq)}</h3>
          <p>${this.getBrainrotMessage(iq)}</p>
        </div>

        <div class="completion-notice">
          <p>✅ Verification completed successfully</p>
        </div>
      </div>
    `

    // Call the completion callback with comprehensive result data
    if (this.onComplete) {
      this.onComplete(result)
    }
  }

  calculateFakeIQ() {
    const correctAnswers = this.answers.filter(a => a.isCorrect).length
    const totalQuestions = this.questions.length
    const accuracy = correctAnswers / totalQuestions
    
    // Base IQ starts at 85 (slightly below average)
    let baseIQ = 85
    
    // Accuracy bonus (0-60 points based on percentage correct)
    const accuracyBonus = Math.floor(accuracy * 60)
    
    // Difficulty-based bonuses
    const difficultyBonus = this.answers.reduce((bonus, answer) => {
      if (answer.isCorrect) {
        switch (answer.brainrotLevel) {
          case 'low': return bonus + 2
          case 'medium': return bonus + 4
          case 'high': return bonus + 6
          case 'extreme': return bonus + 8
          case 'maximum': return bonus + 10
          case 'legendary': return bonus + 12
          default: return bonus + 3
        }
      }
      return bonus
    }, 0)
    
    // Consistency bonus (extra points for getting multiple questions right)
    const consistencyBonus = correctAnswers >= 4 ? 10 : 
                            correctAnswers >= 3 ? 5 : 0
    
    // Perfect score bonus
    const perfectScoreBonus = accuracy === 1.0 ? 15 : 0
    
    // Small random factor for variation (-3 to +3)
    const randomFactor = Math.floor(Math.random() * 7) - 3
    
    // Calculate final IQ
    const finalIQ = baseIQ + accuracyBonus + difficultyBonus + consistencyBonus + perfectScoreBonus + randomFactor
    
    // Ensure IQ is within reasonable bounds (70-200)
    return Math.max(70, Math.min(200, finalIQ))
  }

  getBrainrotTier(iq) {
    if (iq >= 180) return "legendary"
    if (iq >= 160) return "maximum"
    if (iq >= 140) return "extreme"
    if (iq >= 120) return "high"
    if (iq >= 100) return "medium"
    return "low"
  }

  getBrainrotVerdict(iq) {
    if (iq >= 180) return "🔥 ULTIMATE SIGMA BRAINROT GOD"
    if (iq >= 150) return "💎 DIAMOND TIER RIZZLER"
    if (iq >= 120) return "⚡ OMEGA CHAD ENERGY"
    if (iq >= 100) return "🎯 CERTIFIED SKIBIDI MASTER"
    if (iq >= 80) return "📈 ASPIRING OHIO LEGEND"
    return "🤡 STILL LEARNING THE WAYS"
  }

  getBrainrotMessage(iq) {
    if (iq >= 180) return "You've transcended mortal brainrot. You ARE the meme."
    if (iq >= 150) return "Your rizz levels are off the charts. Respect."
    if (iq >= 120) return "Solid sigma grindset. Keep mewing, king."
    if (iq >= 100) return "You understand the assignment. Pretty sus but bussin."
    if (iq >= 80) return "Mid performance but you're getting there, no cap."
    return "Time to touch grass and study the sacred texts."
  }
}

// Export for easy integration
window.BrainCaptcha = BrainCaptcha
