#!/usr/bin/env node

/**
 * YouTube to MP3 Converter Script
 * Converts YouTube videos to MP3 files for the Pomodoro Timer
 *
 * Requirements:
 * - Node.js
 * - yt-dlp (pip install yt-dlp)
 * - ffmpeg
 *
 * Usage:
 * node scripts/convert-youtube-audio.js
 */

import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Get __dirname equivalent in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// YouTube URLs to convert
const audioSources = [
  {
    url: 'https://youtu.be/eNUpTV9BGac',
    filename: 'forest-sounds',
    title: 'Forest Sounds',
    category: 'nature',
    description: 'أصوات الغابة الطبيعية'
  },
  {
    url: 'https://youtu.be/K8w3XN-g4LM',
    filename: 'taha-ayyub',
    title: 'Surah Taha - Muhammad Ayyub',
    category: 'quran',
    description: 'سورة طه - محمد أيوب'
  },
  {
    url: 'https://youtu.be/JfFJSsc602g',
    filename: 'ibrahim-minshawi',
    title: 'Surah Ibrahim - Al-Minshawi',
    category: 'quran',
    description: 'سورة إبراهيم - المنشاوي (مرتل)'
  },
  {
    url: 'https://youtu.be/57SBLLGD3Zs',
    filename: 'hijr-minshawi',
    title: 'Surah Al-Hijr - Al-Minshawi',
    category: 'quran',
    description: 'سورة الحجر - المنشاوي (مرتل)'
  }
];

// Output directories
const outputDirs = {
  nature: path.join(__dirname, '..', 'public', 'audio', 'nature'),
  quran: path.join(__dirname, '..', 'public', 'audio', 'quran')
};

// Ensure output directories exist
Object.values(outputDirs).forEach(dir => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
    console.log(`Created directory: ${dir}`);
  }
});

// Check if yt-dlp is installed
function checkDependencies() {
  try {
    execSync('yt-dlp --version', { stdio: 'ignore' });
    console.log('✅ yt-dlp is installed');
  } catch (error) {
    console.error('❌ yt-dlp is not installed. Please install it with: pip install yt-dlp');
    process.exit(1);
  }

  try {
    execSync('ffmpeg -version', { stdio: 'ignore' });
    console.log('✅ ffmpeg is installed');
  } catch (error) {
    console.error('❌ ffmpeg is not installed. Please install ffmpeg');
    process.exit(1);
  }
}

// Convert single video to MP3
async function convertVideo(source) {
  const outputPath = path.join(outputDirs[source.category], `${source.filename}.mp3`);

  console.log(`\n🎵 Converting: ${source.title}`);
  console.log(`📹 URL: ${source.url}`);
  console.log(`📁 Output: ${outputPath}`);

  // Check if file already exists
  if (fs.existsSync(outputPath)) {
    console.log(`⚠️  File already exists: ${outputPath}`);
    console.log('⏭️  Skipping existing file...');
    return;
  }

  try {
    // yt-dlp command with optimized settings
    const command = [
      'yt-dlp',
      '-x',                                    // Extract audio only
      '--audio-format', 'mp3',                 // Convert to MP3
      '--audio-quality', '192K',               // Good quality, reasonable size
      '--no-playlist',                         // Single video only
      '--no-warnings',                         // Reduce output noise
      '--embed-metadata',                      // Include metadata
      '--add-metadata',                        // Add metadata to file
      '-o', `"${outputPath.replace('.mp3', '.%(ext)s')}"`,  // Output template
      `"${source.url}"`                        // YouTube URL
    ].join(' ');

    console.log(`🔄 Running: ${command}`);

    // Execute conversion
    execSync(command, {
      stdio: 'inherit',
      cwd: process.cwd()
    });

    // Check if file was created
    if (fs.existsSync(outputPath)) {
      const stats = fs.statSync(outputPath);
      const fileSizeMB = (stats.size / (1024 * 1024)).toFixed(2);
      console.log(`✅ Success! File size: ${fileSizeMB} MB`);

      // Log file info
      console.log(`📊 File info:`);
      console.log(`   - Path: ${outputPath}`);
      console.log(`   - Size: ${fileSizeMB} MB`);
      console.log(`   - Category: ${source.category}`);
      console.log(`   - Description: ${source.description}`);
    } else {
      console.error(`❌ Failed to create file: ${outputPath}`);
    }

  } catch (error) {
    console.error(`❌ Error converting ${source.title}:`, error.message);
  }
}

// Main conversion function
async function convertAll() {
  console.log('🎬 YouTube to MP3 Converter for Pomodoro Timer');
  console.log('='.repeat(50));

  // Check dependencies
  checkDependencies();

  console.log(`\n📂 Output directories:`);
  Object.entries(outputDirs).forEach(([category, dir]) => {
    console.log(`   - ${category}: ${dir}`);
  });

  console.log(`\n🎯 Converting ${audioSources.length} audio sources...`);

  // Convert each source
  for (const source of audioSources) {
    await convertVideo(source);
  }

  console.log('\n🎉 Conversion complete!');

  // Calculate total size
  let totalSize = 0;
  audioSources.forEach(source => {
    const filePath = path.join(outputDirs[source.category], `${source.filename}.mp3`);
    if (fs.existsSync(filePath)) {
      const stats = fs.statSync(filePath);
      totalSize += stats.size;
    }
  });

  const totalSizeMB = (totalSize / (1024 * 1024)).toFixed(2);
  console.log(`📊 Total size: ${totalSizeMB} MB`);

  console.log('\n📝 Next steps:');
  console.log('1. Test the audio files in the Pomodoro Timer');
  console.log('2. Commit and push the changes to deploy');
  console.log('3. Verify the files work on the live site');
}

// Run the conversion
convertAll().catch(console.error);

export { convertAll, audioSources };
