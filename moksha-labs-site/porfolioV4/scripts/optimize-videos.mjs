import { execSync } from 'child_process';
import { readdirSync, existsSync, mkdirSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const PROJECT_ROOT = join(__dirname, '..');
const INPUT_DIR = join(PROJECT_ROOT, 'assets/portfolio-pieces');
const OUTPUT_DIR = join(PROJECT_ROOT, 'assets/portfolio-pieces/optimized');
const POSTER_DIR = join(PROJECT_ROOT, 'public/portfolio-posters');

async function processVideos() {
  console.log('🎬 Starting high-performance video optimization pipeline...');
  
  // Ensure directories exist
  [OUTPUT_DIR, POSTER_DIR].forEach(dir => {
    if (!existsSync(dir)) {
      console.log(`📁 Creating directory: ${dir}`);
      mkdirSync(dir, { recursive: true });
    }
  });

  const files = readdirSync(INPUT_DIR).filter(f => f.endsWith('.mp4') && !f.includes('optimized'));
  
  for (const file of files) {
    const inputPath = join(INPUT_DIR, file);
    const baseName = file.split('.')[0];
    
    console.log(`📦 Processing: ${file}`);

    // 1. Generate High-Quality Poster (JPG)
    console.log(`   🖼️  Generating poster for ${baseName}...`);
    const posterPath = join(POSTER_DIR, `${baseName}.jpg`);
    try {
      // Use -update 1 for single image output in newer ffmpeg
      execSync(`ffmpeg -y -i "${inputPath}" -ss 0.5 -frames:v 1 -update 1 -q:v 2 "${posterPath}"`, { stdio: 'inherit' });
    } catch (e) {
      console.warn(`⚠️ Poster generation failed for ${baseName}: ${e.message}`);
    }

    // 2. Compress to H.264 MP4 (Universal)
    console.log(`   📱 Compressing to web-optimized MP4...`);
    const mp4Path = join(OUTPUT_DIR, `${baseName}.mp4`);
    try {
      execSync(`ffmpeg -y -i "${inputPath}" -vf "scale='min(1920,iw)':-2" -an -c:v libx264 -crf 28 -preset fast -movflags +faststart "${mp4Path}"`, { stdio: 'inherit' });
    } catch (e) {
      console.error(`❌ MP4 compression failed for ${baseName}: ${e.message}`);
    }

    // 3. Compress to WebM VP9 (High Efficiency)
    console.log(`   🌐 Compressing to high-efficiency WebM...`);
    const webmPath = join(OUTPUT_DIR, `${baseName}.webm`);
    try {
      execSync(`ffmpeg -y -i "${inputPath}" -vf "scale='min(1920,iw)':-2" -an -c:v libvpx-vp9 -crf 35 -b:v 0 -deadline good -row-mt 1 "${webmPath}"`, { stdio: 'inherit' });
    } catch (e) {
      console.error(`❌ WebM compression failed for ${baseName}: ${e.message}`);
    }

    console.log(`✅ Finished ${baseName}\n`);
  }

  console.log('✨ All assets optimized. Ready for deployment!');
}

processVideos().catch(console.error);
