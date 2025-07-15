# 🧠 BrainCaptcha

A modern, engaging captcha system that tests users' knowledge of internet culture and brainrot memes while providing comprehensive analytics. Perfect for websites that want to verify users in a fun, interactive way.

## ✨ Features

- 🎯 **Brainrot Theme**: Engaging questions about internet culture and memes
- 🧠 **IQ Scoring**: Sophisticated algorithm that calculates user intelligence based on performance
- � **Rich Analytics**: Comprehensive data collection including accuracy, difficulty levels, and timing
- 🎨 **Modern UI**: Clean, responsive design with smooth animations
- 📱 **Mobile Friendly**: Works perfectly on all devices and screen sizes
- 🛠️ **Question Designer**: Visual tool for creating custom questions with image uploads
- 🔧 **Easy Integration**: Simple JavaScript API for quick website integration
- 🎪 **No Retry Policy**: One-time verification system to prevent gaming

## 📦 Installation

### Option 1: Direct Download
1. Download the latest release
2. Include the files in your project
3. Import and use

### Option 2: Clone Repository
```bash
git clone https://github.com/yourusername/braincaptcha.git
cd braincaptcha
npm install
npm run dev
```

## 🚀 Quick Start

### Basic Implementation

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>My Website</title>
    <link rel="stylesheet" href="path/to/braincaptcha/src/style.css">
</head>
<body>
    <div id="captcha-container"></div>
    
    <script type="module">
        import { BrainCaptcha } from 'path/to/braincaptcha/src/braincaptcha.js';
        
        const captcha = new BrainCaptcha(
            document.getElementById('captcha-container'),
            function(result) {
                console.log('User IQ:', result.iq);
                console.log('Accuracy:', result.accuracy + '%');
                console.log('Brainrot Level:', result.brainrotLevel);
                
                // Send to your backend
                fetch('/api/save-captcha-result', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(result)
                });
            }
        );
    </script>
</body>
</html>
```

### Using Custom Questions

1. Open `question-designer/index.html` in your browser
2. Create your custom questions with images
3. Export the configuration file
4. Use the generated `braincaptcha-config.js`:

```javascript
import { BrainCaptcha } from './src/braincaptcha.js';
import { captchaConfig, initializeCaptcha } from './braincaptcha-config.js';

// Option 1: Use helper function
const captcha = initializeCaptcha(
    document.getElementById('captcha-container'),
    function(result) {
        handleCaptchaResult(result);
    }
);

// Option 2: Manual initialization
const captcha = new BrainCaptcha(
    document.getElementById('captcha-container'),
    function(result) {
        handleCaptchaResult(result);
    },
    captchaConfig
);
```

## 📊 Result Object

The completion callback receives a comprehensive result object:

```javascript
{
    iq: 142,                        // Calculated IQ score (70-200)
    correctAnswers: 4,              // Number of correct answers
    totalQuestions: 5,              // Total questions asked
    accuracy: 80,                   // Percentage correct
    brainrotLevel: "extreme",       // Tier: low, medium, high, extreme, maximum, legendary
    timestamp: "2025-07-15T...",    // ISO timestamp of completion
    answers: [                      // Detailed answer data
        {
            question: 0,
            selected: 1,
            correct: 1,
            isCorrect: true,
            brainrotLevel: "extreme"
        },
        // ... more answers
    ]
}
```

## 🎨 Question Designer

The Question Designer is a powerful visual tool for creating custom questions:

### Features:
- **Visual Interface**: Easy-to-use form for question creation
- **Image Upload**: Direct image upload with base64 encoding
- **Template Library**: Pre-built templates for common brainrot themes
- **Live Preview**: See questions as users will see them
- **Export Options**: Multiple export formats (JSON, JS, CSV, Config)
- **Offline Ready**: Works without server, open HTML file directly

### Usage:
1. Open `question-designer/index.html` in your browser
2. Create questions using the intuitive interface
3. Upload images or use URLs
4. Configure settings (IQ calculation, difficulty, etc.)
5. Export complete configuration
6. Copy images to your `/images/` folder
7. Import configuration in your website

## 🔧 Configuration Options

### Question Format
```javascript
{
    type: 'image',                 // 'image', 'text', 'video', 'gif'
    image: '/images/meme.jpg',     // Image path
    imageData: {                   // Optional: Base64 encoded image
        dataUrl: 'data:image/jpeg;base64,...',
        filename: 'meme.jpg',
        size: 123456,
        type: 'image/jpeg'
    },
    question: 'What does this meme represent?',
    options: ['Option A', 'Option B', 'Option C', 'Option D'],
    correct: 0,                    // Index of correct answer
    brainrotLevel: 'extreme',      // Difficulty level
    emoji: '🤔'                    // For text questions
}
```

### Settings Object
```javascript
{
    questionsPerCaptcha: 5,        // Number of questions (1-20)
    selectionMethod: 'random',     // 'random', 'sequential', 'difficulty', 'balanced'
    allowRepeat: false,            // Allow question repetition
    baseIQ: 85,                    // Starting IQ score
    correctAnswerPoints: 12,       // Points calculation factor
    difficultyMultiplier: true,    // Weight by difficulty
    maxIQ: 200,                    // Maximum possible IQ
    showProgress: true,            // Show progress bar
    shuffleOptions: true           // Randomize answer order
}
```

## 🧮 IQ Calculation Algorithm

The IQ calculation uses a sophisticated algorithm:

1. **Base Score**: Starts at 85 (slightly below average)
2. **Accuracy Bonus**: 0-60 points based on percentage correct
3. **Difficulty Bonus**: 2-12 points per correct answer by difficulty level
4. **Consistency Bonus**: Extra points for multiple correct answers
5. **Perfect Score Bonus**: 15 points for 100% accuracy
6. **Random Variation**: Small factor (-3 to +3) for natural variation

**Difficulty Multipliers:**
- Low: +2 points per correct answer
- Medium: +4 points per correct answer
- High: +6 points per correct answer
- Extreme: +8 points per correct answer
- Maximum: +10 points per correct answer
- Legendary: +12 points per correct answer

## 📁 Project Structure

```
braincaptcha/
├── src/
│   ├── braincaptcha.js           # Main library (ES6 modules)
│   ├── braincaptcha-standalone.js # Standalone version
│   └── style.css                 # CSS styles
├── question-designer/            # Question creation tool
│   ├── index.html               # Designer interface
│   ├── question-designer.js     # Designer logic
│   └── README.md                # Designer documentation
├── images/                       # Sample images
├── index.html                    # Main demo
├── example.html                  # Basic example
├── designer-example.html         # Designer integration
├── local-images-example.html     # Local images example
├── iq-data-example.html          # Data access example
└── README.md                     # This file
```

## 🌐 Examples

### Basic Demo
- **File**: `index.html`
- **Purpose**: Main demo with navigation to other examples

### Basic Integration
- **File**: `example.html`
- **Purpose**: Simple implementation example

### Designer Integration
- **File**: `designer-example.html`
- **Purpose**: Using questions created with the Question Designer

### Local Images
- **File**: `local-images-example.html`
- **Purpose**: Working with local image files

### IQ Data Access
- **File**: `iq-data-example.html`
- **Purpose**: Demonstrates comprehensive data collection

## 🎯 Use Cases

### Website Verification
```javascript
const captcha = new BrainCaptcha(container, function(result) {
    if (result.iq >= 100) {
        allowAccess();
    } else {
        showEducationalContent();
    }
});
```

### User Segmentation
```javascript
const captcha = new BrainCaptcha(container, function(result) {
    const userTier = result.brainrotLevel;
    
    switch(userTier) {
        case 'legendary':
            showPremiumFeatures();
            break;
        case 'maximum':
        case 'extreme':
            showAdvancedFeatures();
            break;
        default:
            showBasicFeatures();
    }
});
```

### Analytics Collection
```javascript
const captcha = new BrainCaptcha(container, function(result) {
    // Send to analytics
    gtag('event', 'captcha_completed', {
        'iq_score': result.iq,
        'accuracy': result.accuracy,
        'brainrot_level': result.brainrotLevel
    });
    
    // Store in database
    saveUserProfile({
        userId: getCurrentUserId(),
        iqScore: result.iq,
        brainrotLevel: result.brainrotLevel,
        timestamp: result.timestamp
    });
});
```

## 🔧 Development

### Prerequisites
- Node.js 16+
- Modern browser with ES6 support

### Commands
```bash
# Development server
npm run dev

# Build for production
npm run build

# Library build
npm run build:lib

# Preview build
npm run preview
```

### Build Output
- `dist/` - Production build
- `dist/braincaptcha.js` - Main library
- `dist/braincaptcha.min.js` - Minified version

## 🌍 Browser Support

- ✅ Chrome/Edge 88+
- ✅ Firefox 85+
- ✅ Safari 14+
- ✅ Mobile browsers
- ⚠️ IE 11 (with polyfills)

## 📝 API Reference

### BrainCaptcha Constructor
```javascript
new BrainCaptcha(container, onComplete, config)
```

**Parameters:**
- `container` (HTMLElement): DOM element to render captcha
- `onComplete` (Function): Callback when captcha is completed
- `config` (Object, optional): Configuration object

### Configuration Object
All configuration options are optional and have sensible defaults.

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🎉 Acknowledgments

- Inspired by modern internet culture and memes
- Built with vanilla JavaScript for maximum compatibility
- Designed for developers who want engaging user verification

---

**Made with 🧠 by the BrainCaptcha team**

*Turn user verification into an engaging experience!*
    options: [                   // For multiple-choice only
        'Gigachad',
        'Sigma Male',
        'Chad Thundercock'
    ],
    correctAnswer: 0,           // Index of correct answer
    iqPoints: 20,               // Points for correct answer
    difficulty: 'medium',        // 'easy', 'medium', 'hard'
    category: 'memes'           // Custom category
};
```

## Question Designer

The Question Designer is a powerful browser-based tool for creating and managing captcha questions.

### Access the Designer
Open `question-designer/index.html` in your browser.

### Key Features
- **Visual Editor**: Add questions with live preview
- **Media Support**: Images, videos, GIFs (URLs or local files)
- **Bulk Operations**: Select multiple questions for batch actions
- **Templates**: Pre-built question templates
- **Search & Filter**: Find questions by text, category, difficulty
- **Import/Export**: Save and load question configurations
- **Statistics**: View question distribution and analytics
- **Settings**: Configure IQ scoring, question count, themes

### Question Types
- **Multiple Choice**: Traditional A/B/C/D format
- **Text Input**: Free-form text answers
- **Emoji Selection**: Choose from emoji options

## API Reference

### BrainCaptcha Methods

```javascript
const captcha = new BrainCaptcha(options);

// Control flow
captcha.start();              // Initialize captcha
captcha.reset();              // Reset to first question
captcha.nextQuestion();       // Move to next question
captcha.previousQuestion();   // Move to previous question

// Get information
captcha.getCurrentQuestion(); // Get current question data
captcha.getProgress();        // Get progress (0-1)
captcha.getAnswers();        // Get all user answers

// Cleanup
captcha.destroy();           // Remove captcha and cleanup
```

### Result Object

```javascript
{
    iq: 127,                    // Calculated IQ score
    answers: [                  // User answers array
        { questionId: 'q1', answer: 'Option A', correct: true },
        { questionId: 'q2', answer: 'sigma', correct: false }
    ],
    correctCount: 3,           // Number of correct answers
    totalQuestions: 5,         // Total questions shown
    completionTime: 45000,     // Time taken in milliseconds
    isValid: true              // Whether user passed verification
}
```

## Project Structure

```
braincaptcha/
├── src/
│   ├── braincaptcha.js       # Main captcha component
│   ├── question-builder.js   # Question management utility
│   ├── main.js              # Demo application
│   └── style.css            # Styles and themes
├── public/brainrot/         # Sample brainrot images
├── question-designer/       # Question creation tool
│   ├── index.html           # Designer interface
│   └── question-designer.js # Designer logic
├── dist/                    # Production build output
├── index.html              # Main demo
├── designer-example.html   # Designer output example
├── braincaptcha-config.js  # Sample configuration
└── package.json           # Dependencies and scripts
```

## Development

### Setup
```bash
npm install
npm run dev      # Start development server
```

### Building
```bash
npm run build    # Build for production
```

### Testing
- Open `index.html` - Basic demo
- Open `designer-example.html` - Custom questions demo
- Open `question-designer/index.html` - Question designer tool

## Integration Examples

### React Integration
```jsx
import { useEffect, useRef } from 'react';
import BrainCaptcha from './src/braincaptcha.js';

function CaptchaComponent({ onComplete }) {
    const containerRef = useRef(null);
    
    useEffect(() => {
        const captcha = new BrainCaptcha({
            containerId: containerRef.current.id,
            onComplete: onComplete
        });
        
        captcha.start();
        
        return () => captcha.destroy();
    }, [onComplete]);
    
    return <div ref={containerRef} id="captcha-container" />;
}
```

### Form Integration
```html
<form id="signup-form">
    <input type="email" name="email" required>
    <input type="password" name="password" required>
    <div id="captcha-container"></div>
    <button type="submit" disabled>Sign Up</button>
</form>

<script type="module">
    import BrainCaptcha from './src/braincaptcha.js';
    
    const form = document.getElementById('signup-form');
    const submitBtn = form.querySelector('button[type="submit"]');
    
    const captcha = new BrainCaptcha({
        containerId: 'captcha-container',
        onComplete: (result) => {
            if (result.isValid) {
                submitBtn.disabled = false;
                form.addEventListener('submit', handleSubmit);
            }
        }
    });
    
    captcha.start();
</script>
```

## Browser Support

- Chrome 80+
- Firefox 75+
- Safari 13+
- Edge 80+

## License

MIT License - Free to use in your projects!

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request