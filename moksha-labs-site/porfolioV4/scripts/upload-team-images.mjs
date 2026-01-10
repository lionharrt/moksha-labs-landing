import { execSync } from "child_process";
import { readdirSync, existsSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const PROJECT_ROOT = join(__dirname, "..");
const IMAGES_DIR = join(PROJECT_ROOT, "public/image");

// Configuration - matches your firebase.json and nuxt.config
const bucketName = "mokshalabs.firebasestorage.app";

async function uploadFiles() {
  console.log("🚀 INITIALIZING TEAM IMAGES UPLOAD VIA GSUTIL...");

  if (!existsSync(IMAGES_DIR)) {
    console.error(`❌ Source directory not found: ${IMAGES_DIR}`);
    process.exit(1);
  }

  try {
    console.log(
      `📤 Uploading images from ${IMAGES_DIR} to gs://${bucketName}/team/`
    );

    // Using gsutil directly as it respects your local gcloud/firebase authentication
    const command = `gsutil -m cp "${IMAGES_DIR}/*.{jpg,jpeg,png,webp}" gs://${bucketName}/team/`;

    execSync(command, { stdio: "inherit" });

    console.log("\n✨ ALL IMAGES UPLOADED TO FIREBASE STORAGE.");
  } catch (err) {
    console.error("\n❌ UPLOAD FAILED:", err.message);
    console.log(
      "💡 Make sure you are logged in with 'gcloud auth login' or 'firebase login'."
    );
    process.exit(1);
  }
}

uploadFiles();
