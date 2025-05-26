# Audio Files Directory

This directory contains audio files for the Pomodoro Timer feature.

## Structure:

### `/nature/`
- `forest-sounds.mp3` - Forest sounds from YouTube (https://youtu.be/eNUpTV9BGac)

### `/quran/`
- `taha-ayyub.mp3` - سورة طه - محمد أيوب (https://youtu.be/K8w3XN-g4LM)
- `ibrahim-minshawi.mp3` - سورة إبراهيم - المنشاوي (https://youtu.be/JfFJSsc602g)
- `hijr-minshawi.mp3` - سورة الحجر - المنشاوي (https://youtu.be/57SBLLGD3Zs)

## Notes:
- Audio files are converted from YouTube videos using yt-dlp or similar tools
- Files should be in MP3 format with good quality (192kbps recommended)
- Total size should be optimized for web delivery
- Files are served directly from the public directory

## Conversion Commands:
```bash
# Using yt-dlp to convert YouTube videos to MP3
yt-dlp -x --audio-format mp3 --audio-quality 192K "YOUTUBE_URL" -o "filename.%(ext)s"
```

## File Sizes (Estimated):
- Forest sounds: ~8-12 MB (10 minutes)
- Quran recitations: ~15-25 MB each (45-60 minutes)
- Total: ~60-80 MB for all files

## Bandwidth Impact:
- Files are loaded on-demand (only when selected)
- Browser caching reduces repeated downloads
- Cloudflare CDN provides fast global delivery
