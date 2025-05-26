#!/usr/bin/env node

/**
 * Simple YouTube to MP3 Converter
 * Uses yt-dlp only (no ffmpeg required)
 */

import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Audio sources to convert
const sources = [
  {
    url: 'https://youtu.be/eNUpTV9BGac',
    filename: 'forest-sounds',
    category: 'nature',
    title: 'Forest Sounds'
  },
  {
    url: 'https://youtu.be/K8w3XN-g4LM',
    filename: 'taha-ayyub',
    category: 'quran',
    title: 'Surah Taha - Muhammad Ayyub'
  },
  {
    url: 'https://youtu.be/JfFJSsc602g',
    filename: 'ibrahim-minshawi',
    category: 'quran',
    title: 'Surah Ibrahim - Al-Minshawi'
  },
  {
    url: 'https://youtu.be/57SBLLGD3Zs',
    filename: 'hijr-minshawi',
    category: 'quran',
    title: 'Surah Al-Hijr - Al-Minshawi'
  }
];

// Create directories
const audioDir = path.join(__dirname, '..', 'public', 'audio');
const natureDir = path.join(audioDir, 'nature');
const quranDir = path.join(audioDir, 'quran');

[audioDir, natureDir, quranDir].forEach(dir => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
    console.log(`📁 Created: ${dir}`);
  }
});

// Check yt-dlp
try {
  execSync('yt-dlp --version', { stdio: 'ignore' });
  console.log('✅ yt-dlp is available');
} catch (error) {
  console.error('❌ yt-dlp not found. Install with: pip install yt-dlp');
  process.exit(1);
}

console.log('\n🎵 Starting conversion...\n');

// Convert each source
for (const source of sources) {
  const outputDir = source.category === 'nature' ? natureDir : quranDir;
  const outputPath = path.join(outputDir, `${source.filename}.mp3`);
  
  console.log(`🎬 Converting: ${source.title}`);
  console.log(`📹 URL: ${source.url}`);
  
  if (fs.existsSync(outputPath)) {
    console.log(`⏭️  File exists, skipping: ${source.filename}.mp3\n`);
    continue;
  }
  
  try {
    // Simple yt-dlp command
    const command = `yt-dlp -x --audio-format mp3 --audio-quality 192K "${source.url}" -o "${outputPath.replace('.mp3', '.%(ext)s')}"`;
    
    console.log('🔄 Downloading and converting...');
    execSync(command, { stdio: 'inherit' });
    
    if (fs.existsSync(outputPath)) {
      const stats = fs.statSync(outputPath);
      const sizeMB = (stats.size / (1024 * 1024)).toFixed(2);
      console.log(`✅ Success! Size: ${sizeMB} MB\n`);
    } else {
      console.log(`❌ Failed to create: ${source.filename}.mp3\n`);
    }
    
  } catch (error) {
    console.error(`❌ Error converting ${source.title}:`, error.message);
    console.log('');
  }
}

console.log('🎉 Conversion complete!');

// Show total size
let totalSize = 0;
sources.forEach(source => {
  const outputDir = source.category === 'nature' ? natureDir : quranDir;
  const filePath = path.join(outputDir, `${source.filename}.mp3`);
  if (fs.existsSync(filePath)) {
    totalSize += fs.statSync(filePath).size;
  }
});

if (totalSize > 0) {
  const totalMB = (totalSize / (1024 * 1024)).toFixed(2);
  console.log(`📊 Total size: ${totalMB} MB`);
}

console.log('\n📝 Next steps:');
console.log('1. Test the audio files in the Pomodoro Timer');
console.log('2. Commit and push to deploy');
