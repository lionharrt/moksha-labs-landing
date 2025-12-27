import { readdirSync, existsSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import { execSync } from 'child_process';
import { initializeApp, cert } from 'firebase-admin/app';
import { getStorage } from 'firebase-admin/storage';

const __dirname = dirname(fileURLToPath(import.meta.url));
const PROJECT_ROOT = join(__dirname, '..');
const ASSETS_DIR = join(PROJECT_ROOT, 'assets/portfolio-pieces');

// Configuration
const bucketName = process.env.FIREBASE_STORAGE_BUCKET || process.argv[2] || 'mokshalabs.firebasestorage.app';
const serviceAccountPath = process.env.GOOGLE_APPLICATION_CREDENTIALS;

function isGcloudAvailable() {
  try {
    execSync('gcloud --version', { stdio: 'ignore' });
    return true;
  } catch (e) {
    return false;
  }
}

async function uploadWithGcloud(files) {
  console.log('✨ Using gcloud CLI for optimized upload...');
  for (const file of files) {
    const filePath = join(ASSETS_DIR, file);
    const destination = `gs://${bucketName}/portfolio/${file}`;
    console.log(`📤 [gcloud] Uploading ${file}...`);
    try {
      execSync(`gcloud storage cp "${filePath}" "${destination}"`, { stdio: 'inherit' });
      console.log(`✅ Finished ${file}`);
    } catch (error) {
      console.error(`❌ Failed to upload ${file} with gcloud`);
      throw error;
    }
  }
}

async function uploadWithAdminSDK(files) {
  console.log('☁️ Using Firebase Admin SDK...');
  
  if (serviceAccountPath && existsSync(serviceAccountPath)) {
    console.log(`🔑 Using service account from: ${serviceAccountPath}`);
    initializeApp({
      credential: cert(serviceAccountPath),
      storageBucket: bucketName
    });
  } else {
    console.log('ℹ️ Using default application credentials...');
    initializeApp({
      storageBucket: bucketName
    });
  }

  const bucket = getStorage().bucket();
  
  for (const file of files) {
    const filePath = join(ASSETS_DIR, file);
    const destination = `portfolio/${file}`;
    console.log(`📤 [Admin SDK] Uploading ${file}...`);
    await bucket.upload(filePath, {
      destination,
      metadata: {
        contentType: 'video/mp4',
        cacheControl: 'public, max-age=31536000',
      },
    });
    console.log(`✅ Finished ${file}`);
  }
}

async function main() {
  console.log('🚀 Starting portfolio assets upload...');
  console.log(`📌 Target Bucket: ${bucketName}`);

  if (!existsSync(ASSETS_DIR)) {
    console.error(`❌ Assets directory not found: ${ASSETS_DIR}`);
    process.exit(1);
  }

  const files = readdirSync(ASSETS_DIR).filter(file => file.endsWith('.mp4'));
  if (files.length === 0) {
    console.log('⚠️ No mp4 files found in assets/portfolio-pieces/');
    return;
  }

  try {
    if (isGcloudAvailable()) {
      await uploadWithGcloud(files);
    } else {
      await uploadWithAdminSDK(files);
    }
    console.log('✨ All portfolio assets uploaded successfully!');
  } catch (error) {
    console.error('❌ Upload process failed:', error.message);
    process.exit(1);
  }
}

main();
