# 🌐 Screen Translator - Web Application

A modern web application that captures screenshots, extracts text using OCR, and displays translations as beautiful overlays. Perfect for hosting on any website or web server.

## ✨ Features

- **📸 Smart Screenshot Capture**: Capture any part of your browser screen using HTML2Canvas
- **🔍 Advanced OCR**: Extract text from images using Tesseract.js
- **🌍 Multi-language Support**: Translate to 100+ languages
- **💫 Non-intrusive Overlays**: Beautiful translation displays that don't interfere with browsing
- **⚡ Multiple Capture Modes**: Manual, auto, and continuous capture
- **🎯 Flexible Positioning**: Choose overlay position (top-right, top-left, bottom-right, bottom-left, center)
- **⌨️ Keyboard Shortcuts**: Quick access with customizable shortcuts
- **💾 Translation History**: Save and view recent translations
- **🌙 Dark Mode Support**: Automatic dark mode detection
- **📱 Responsive Design**: Works perfectly on desktop and mobile devices

## 🚀 Quick Start

### Method 1: Direct Hosting

1. **Download the files**
   ```bash
   git clone <repository-url>
   cd web-translator
   ```

2. **Host on any web server**
   - Upload all files to your web hosting provider
   - Access via your domain (e.g., `https://yoursite.com/screen-translator/`)

### Method 2: Local Development

1. **Set up a local server**
   ```bash
   # Using Python
   python -m http.server 8000
   
   # Using Node.js
   npx serve .
   
   # Using PHP
   php -S localhost:8000
   ```

2. **Open in browser**
   - Navigate to `http://localhost:8000`

### Method 3: GitHub Pages

1. **Push to GitHub repository**
2. **Enable GitHub Pages** in repository settings
3. **Access via** `https://username.github.io/repository-name`

## 🎯 Usage

### Basic Translation

1. **Open the web app** in your browser
2. **Navigate to any webpage** you want to translate
3. **Click "Capture & Translate"** or use `Ctrl+Shift+T`
4. **Wait for processing** (screenshot → OCR → translation)
5. **View the translation** in the overlay that appears

### Advanced Features

#### Capture Modes
- **Manual**: Capture only when you click the button
- **Auto**: Automatically capture every 5 seconds
- **Continuous**: Continuously capture every 10 seconds

#### Overlay Positions
- Top Right (default)
- Top Left
- Bottom Right
- Bottom Left
- Center

#### Language Support
- English, Spanish, French, German, Italian, Portuguese
- Russian, Japanese, Korean, Chinese, Arabic, Hindi
- And 90+ more languages

### Keyboard Shortcuts

- **Ctrl+Shift+T**: Capture and translate current page
- **Ctrl+Shift+O**: Toggle translation overlay visibility

## ⚙️ Configuration

### Settings Panel
Access settings in the web app interface:

- **Target Language**: Choose your preferred translation language
- **Capture Mode**: Select manual, auto, or continuous capture
- **Overlay Position**: Choose where translations appear
- **Auto-translate**: Enable/disable automatic translation
- **Show Original**: Toggle display of original text

### Storage
- Settings are saved in browser localStorage
- Translation history is stored locally
- No data is sent to external servers (except translation APIs)

## 🔧 Technical Details

### Architecture
- **Pure JavaScript**: No framework dependencies
- **HTML2Canvas**: Screenshot capture
- **Tesseract.js**: OCR text extraction
- **Google Translate API**: Primary translation service
- **MyMemory API**: Fallback translation service

### File Structure
```
web-translator/
├── index.html          # Main application page
├── styles.css          # Main application styles
├── overlay.css         # Overlay-specific styles
├── app.js              # Main application logic
└── README.md           # This file
```

### Dependencies
- **HTML2Canvas**: Screenshot functionality
- **Tesseract.js**: OCR capabilities
- **Font Awesome**: Icons
- **Google Translate API**: Translation service

## 🌐 Hosting Options

### Static Hosting
- **Netlify**: Drag and drop deployment
- **Vercel**: Git-based deployment
- **GitHub Pages**: Free hosting for public repositories
- **AWS S3**: Scalable static hosting
- **Firebase Hosting**: Google's hosting solution

### Traditional Hosting
- **Shared Hosting**: Upload files via FTP
- **VPS**: Full control over server
- **Dedicated Server**: Maximum performance

### Example Deployment

#### Netlify
1. Create a new site from Git
2. Connect your repository
3. Build command: (leave empty for static site)
4. Publish directory: `web-translator`
5. Deploy!

#### Vercel
1. Install Vercel CLI: `npm i -g vercel`
2. Navigate to project: `cd web-translator`
3. Deploy: `vercel`
4. Follow prompts

## 🔒 Security & Privacy

### Data Handling
- **No data collection**: App doesn't collect personal information
- **Local storage**: All data stays in user's browser
- **Secure APIs**: Only translation APIs are called
- **No tracking**: No analytics or tracking scripts

### API Usage
- **Google Translate**: Free tier with rate limits
- **MyMemory**: Free translation service as fallback
- **CORS**: Handled properly for cross-origin requests

## 🐛 Troubleshooting

### Common Issues

**Screenshot not working**
- Check if the page allows iframe embedding
- Ensure JavaScript is enabled
- Try refreshing the page

**Translation not appearing**
- Check your internet connection
- Verify the target language is supported
- Check browser console for errors

**Overlay not visible**
- Check if overlay is positioned off-screen
- Try changing overlay position in settings
- Use Ctrl+Shift+O to toggle visibility

**OCR not detecting text**
- Ensure text is clearly visible
- Try zooming in on the page
- Check if text is in a supported language

### Performance Tips

- Use manual capture mode for better performance
- Close unnecessary browser tabs
- Disable auto-translate if not needed
- Clear translation history periodically

### Browser Compatibility

- **Chrome**: Full support
- **Firefox**: Full support
- **Safari**: Full support
- **Edge**: Full support
- **Mobile browsers**: Responsive design support

## 🚀 Performance Optimization

### Loading Speed
- **CDN Resources**: External libraries loaded from CDN
- **Minified Code**: Optimized JavaScript and CSS
- **Lazy Loading**: Resources loaded on demand
- **Caching**: Browser caching for better performance

### Memory Management
- **Limited History**: Only last 20 translations stored
- **Auto-cleanup**: Old data automatically removed
- **Efficient Processing**: Optimized image processing

## 🤝 Contributing

We welcome contributions! Please see our contributing guidelines:

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

### Development Setup

```bash
# Clone the repository
git clone <repository-url>
cd web-translator

# Start local server
python -m http.server 8000

# Open in browser
open http://localhost:8000
```

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgments

- **Tesseract.js** for OCR capabilities
- **HTML2Canvas** for screenshot functionality
- **Google Translate** for translation services
- **MyMemory** for fallback translation API
- **Font Awesome** for beautiful icons

## 📞 Support

- **Issues**: Report bugs on GitHub
- **Feature Requests**: Submit via GitHub issues
- **Documentation**: Check this README and inline code comments

## 🔄 Updates

The application will automatically check for updates and notify users when new versions are available.

---

**Made with ❤️ for seamless translation experience**

## 🎯 Demo

Try the live demo at: [Your Demo URL]

The demo includes multilingual content for testing all features of the application.
