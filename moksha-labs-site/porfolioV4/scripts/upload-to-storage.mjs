import { readdirSync, existsSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import { execSync } from 'child_process';
import { initializeApp, cert, getApps } from 'firebase-admin/app';
import { getStorage } from 'firebase-admin/storage';

const __dirname = dirname(fileURLToPath(import.meta.url));
const PROJECT_ROOT = join(__dirname, '..');
const VIDEOS_DIR = join(PROJECT_ROOT, 'public/videos');

// Configuration - matches your firebase.json and nuxt.config
const bucketName = 'mokshalabs.firebasestorage.app';

async function uploadFiles() {
  console.log('🚀 INITIALIZING MOKSHA STORAGE UPLOAD...');
  
  if (!existsSync(VIDEOS_DIR)) {
    console.error(`❌ Source directory not found: ${VIDEOS_DIR}`);
    process.exit(1);
  }

  // Initialize Firebase Admin
  if (!getApps().length) {
    initializeApp({
      storageBucket: bucketName
    });
  }

  const bucket = getStorage().bucket();
  const files = readdirSync(VIDEOS_DIR).filter(file => file.endsWith('.mp4') || file.endsWith('.webm'));

  console.log(`📦 Found ${files.length} files to move to Storage.`);

  for (const file of files) {
    const filePath = join(VIDEOS_DIR, file);
    const destination = `portfolio/${file}`;
    
    console.log(`📤 Uploading: ${file} -> gs://${bucketName}/${destination}`);
    
    await bucket.upload(filePath, {
      destination,
      metadata: {
        cacheControl: 'public, max-age=31536000, immutable',
        contentType: file.endsWith('.mp4') ? 'video/mp4' : 'video/webm',
      },
    });
    
    console.log(`✅ Success: ${file}`);
  }

  console.log('\n✨ ALL MEDIA MOVED TO FIREBASE STORAGE.');
  console.log('💡 You can now delete public/videos/ to save Hosting space.');
}

uploadFiles().catch(err => {
  console.error('❌ UPLOAD FAILED:', err);
  process.exit(1);
});

