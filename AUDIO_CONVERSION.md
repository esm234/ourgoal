# 🎵 Audio Conversion Guide for Pomodoro Timer

This guide explains how to convert YouTube videos to MP3 files for the Pomodoro Timer feature.

## 📋 Required Audio Files

### 🌲 Nature Sounds:
1. **Forest Sounds** - https://youtu.be/eNUpTV9BGac
   - Output: `public/audio/nature/forest-sounds.mp3`
   - Description: أصوات الغابة الطبيعية

### 📖 Quran Recitations:
1. **Surah Taha - Muhammad Ayyub** - https://youtu.be/K8w3XN-g4LM
   - Output: `public/audio/quran/taha-ayyub.mp3`
   - Description: سورة طه - محمد أيوب

2. **Surah Ibrahim - Al-Minshawi** - https://youtu.be/JfFJSsc602g
   - Output: `public/audio/quran/ibrahim-minshawi.mp3`
   - Description: سورة إبراهيم - المنشاوي (مرتل)

3. **Surah Al-Hijr - Al-Minshawi** - https://youtu.be/57SBLLGD3Zs
   - Output: `public/audio/quran/hijr-minshawi.mp3`
   - Description: سورة الحجر - المنشاوي (مرتل)

## 🛠️ Installation Requirements

### 1. Install yt-dlp:
```bash
# Using pip
pip install yt-dlp

# Using conda
conda install -c conda-forge yt-dlp

# Using homebrew (macOS)
brew install yt-dlp
```

### 2. Install ffmpeg:
```bash
# Windows (using chocolatey)
choco install ffmpeg

# macOS (using homebrew)
brew install ffmpeg

# Ubuntu/Debian
sudo apt update && sudo apt install ffmpeg

# CentOS/RHEL
sudo yum install ffmpeg
```

### 3. Install Node.js dependencies:
```bash
npm install readline-sync
```

## 🚀 Conversion Methods

### Method 1: Automated Script (Recommended)
```bash
# Run the conversion script
node scripts/convert-youtube-audio.js
```

### Method 2: Manual Conversion
```bash
# Forest sounds
yt-dlp -x --audio-format mp3 --audio-quality 192K "https://youtu.be/eNUpTV9BGac" -o "public/audio/nature/forest-sounds.%(ext)s"

# Surah Taha - Muhammad Ayyub
yt-dlp -x --audio-format mp3 --audio-quality 192K "https://youtu.be/K8w3XN-g4LM" -o "public/audio/quran/taha-ayyub.%(ext)s"

# Surah Ibrahim - Al-Minshawi
yt-dlp -x --audio-format mp3 --audio-quality 192K "https://youtu.be/JfFJSsc602g" -o "public/audio/quran/ibrahim-minshawi.%(ext)s"

# Surah Al-Hijr - Al-Minshawi
yt-dlp -x --audio-format mp3 --audio-quality 192K "https://youtu.be/57SBLLGD3Zs" -o "public/audio/quran/hijr-minshawi.%(ext)s"
```

### Method 3: Online Converters (Alternative)
If you can't install yt-dlp, use online converters:
1. Go to https://ytmp3.cc/ or similar
2. Paste the YouTube URL
3. Download as MP3 (192kbps quality)
4. Rename and place in correct directory

## 📁 Directory Structure
```
public/
└── audio/
    ├── nature/
    │   └── forest-sounds.mp3
    ├── quran/
    │   ├── taha-ayyub.mp3
    │   ├── ibrahim-minshawi.mp3
    │   └── hijr-minshawi.mp3
    └── README.md
```

## ⚙️ Quality Settings

### Recommended Settings:
- **Format**: MP3
- **Bitrate**: 192kbps (good quality, reasonable size)
- **Sample Rate**: 44.1kHz
- **Channels**: Stereo

### File Size Estimates:
- **Forest sounds** (~10 min): 8-12 MB
- **Quran recitations** (~45-60 min each): 15-25 MB
- **Total**: ~60-80 MB

## 🌐 Bandwidth Considerations

### Impact on Website:
- Files are loaded **on-demand** (only when selected)
- Browser caching reduces repeated downloads
- Cloudflare CDN provides fast global delivery
- Total bandwidth increase: minimal (users only download what they use)

### Optimization:
- Use 192kbps quality (balance between size and quality)
- Enable browser caching headers
- Serve through CDN for faster delivery
- Consider lazy loading for better UX

## 🧪 Testing

### After Conversion:
1. **Test locally**: Start dev server and test audio playback
2. **Check file sizes**: Ensure files are reasonable size
3. **Test on mobile**: Verify mobile compatibility
4. **Test loading**: Check loading times and error handling

### Test Commands:
```bash
# Start development server
npm run dev

# Test audio files exist
ls -la public/audio/nature/
ls -la public/audio/quran/

# Check file sizes
du -h public/audio/nature/*
du -h public/audio/quran/*
```

## 🚀 Deployment

### Steps:
1. Convert all audio files
2. Test locally
3. Commit files to git
4. Push to GitHub
5. Cloudflare Pages will auto-deploy
6. Test on live site

### Git Commands:
```bash
# Add audio files
git add public/audio/

# Commit
git commit -m "Add audio files for Pomodoro Timer"

# Push
git push origin main
```

## 🔧 Troubleshooting

### Common Issues:

#### 1. yt-dlp not found:
```bash
# Check if installed
yt-dlp --version

# Reinstall if needed
pip install --upgrade yt-dlp
```

#### 2. ffmpeg not found:
```bash
# Check if installed
ffmpeg -version

# Install based on your OS (see installation section)
```

#### 3. Permission errors:
```bash
# Make script executable (Linux/macOS)
chmod +x scripts/convert-youtube-audio.js

# Run with proper permissions
sudo node scripts/convert-youtube-audio.js
```

#### 4. Large file sizes:
```bash
# Use lower quality if needed
yt-dlp -x --audio-format mp3 --audio-quality 128K "URL"
```

#### 5. Network issues:
```bash
# Use proxy if needed
yt-dlp --proxy "http://proxy:port" "URL"

# Retry with different server
yt-dlp --force-ipv4 "URL"
```

## 📞 Support

If you encounter issues:
1. Check the error messages carefully
2. Verify all dependencies are installed
3. Try manual conversion for specific files
4. Check YouTube URL accessibility
5. Consider using alternative sources if needed

## 🎯 Final Notes

- Audio files will be served directly from `/public/audio/`
- Files are cached by browsers for better performance
- Total impact on site performance is minimal
- Users only download audio they actually use
- Quality is optimized for web delivery while maintaining good sound quality
