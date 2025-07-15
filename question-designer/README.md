# BrainCaptcha Question Designer

## 🚀 Quick Start (No Server Required!)

You can use the Question Designer in two ways:

### Method 1: Open Directly (Recommended)
1. Simply double-click on `index.html` in this folder
2. Or drag and drop `index.html` into your browser
3. The tool will open and work completely offline!

### Method 2: Via Development Server
1. From the main project folder, run: `npm run dev`
2. Open: `http://localhost:5173/question-designer/index.html`

## ✨ Features

- **🎯 Create Questions**: Add text, image, video, and GIF questions
- **📸 Image Upload**: Upload images that get embedded as base64 data
- **⚙️ Configure Settings**: Customize IQ scoring, difficulty, and more
- **💾 Auto-Save**: Your work is automatically saved to browser storage
- **📤 Export Options**: Generate complete configuration files
- **🔄 Import/Export**: Save and load your question sets

## 🛠️ Usage

### Creating Questions

1. **Select Question Type**: Choose from Text, Image, Video, or GIF
2. **Enter Question**: Write your brainrot question
3. **Add Options**: Provide 4 answer choices
4. **Set Correct Answer**: Select the right answer
5. **Choose Difficulty**: Set the brainrot level (low to legendary)
6. **Add Media** (if applicable): Upload image or enter video/GIF URL

### Configuring Settings

Click the "⚙️ Settings" button to customize:
- Questions per captcha (1-20)
- Selection method (random, sequential, etc.)
- IQ scoring parameters
- Time limits and bonuses

### Exporting Your Configuration

1. Click "📤 Export Complete Config"
2. Save the generated `braincaptcha-config.js` file
3. Copy your images to the `/images/` folder as instructed
4. Import and use in your website!

## 📱 Browser Compatibility

The Question Designer works in all modern browsers:
- ✅ Chrome/Edge (recommended)
- ✅ Firefox
- ✅ Safari
- ✅ Opera

## 🔧 Technical Details

- **No Server Required**: Uses only client-side JavaScript
- **File API**: Uses HTML5 File API for image uploads
- **localStorage**: Saves your work locally in the browser
- **Base64 Encoding**: Images are embedded directly in the config
- **Offline Ready**: Works completely without internet connection

## 🚨 Important Notes

1. **Image Size**: Keep images under 5MB for best performance
2. **Browser Storage**: Your questions are saved locally - backup regularly!
3. **File Paths**: Generated config assumes images are in `/images/` folder
4. **Modern Browsers**: Requires a browser with ES6+ support

## 🔄 Backup & Restore

- **Backup**: Use "📤 Export JSON" to save your questions
- **Restore**: Use "📥 Import" to load saved questions
- **Multiple Sets**: You can create and manage multiple question sets

## 🎨 Integration

After creating your questions:

1. Save the exported `braincaptcha-config.js` file
2. Copy images to your `/images/` folder
3. Import in your HTML:

```html
<script type="module">
    import { initializeCaptcha } from './braincaptcha-config.js';
    
    const captcha = initializeCaptcha(
        document.getElementById('container'),
        function(result) {
            console.log('IQ Score:', result.iq);
        }
    );
</script>
```

## 🆘 Troubleshooting

- **Images not showing**: Check browser console for errors
- **Can't save**: Ensure localStorage is enabled in your browser
- **Export not working**: Try using a different browser or update yours
- **File too large**: Reduce image size or use external hosting

Enjoy creating your brainrot questions! 🧠✨
