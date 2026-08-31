import { v2 as cloudinary } from 'cloudinary';

const cloudinaryUrl = process.env.CLOUDINARY_URL;
const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
const apiKey = process.env.CLOUDINARY_API_KEY;
const apiSecret = process.env.CLOUDINARY_API_SECRET;

let activeCloudName;
let configSource;

if (cloudinaryUrl) {
  // Cloudinary SDK automatically picks up process.env.CLOUDINARY_URL.
  // We can just trigger the config parsing to read the cloud_name.
  cloudinary.config(true); // Forces initialization from environment variables
  const config = cloudinary.config();
  
  // Fallback regex if SDK parsing behaves unexpectedly
  const match = cloudinaryUrl.match(/@([^/?]+)/);
  activeCloudName = config.cloud_name || (match ? match[1] : 'unknown');
  configSource = 'CLOUDINARY_URL';
} else if (cloudName && apiKey && apiSecret) {
  cloudinary.config({
    cloud_name: cloudName,
    api_key: apiKey,
    api_secret: apiSecret,
  });
  activeCloudName = cloudName;
  configSource = 'separate variables (CLOUDINARY_CLOUD_NAME, etc.)';
} else {
  throw new Error(
    "Cloudinary configuration missing! Please provide either CLOUDINARY_URL (recommended) or all three separate variables (CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET) in your .env.local file."
  );
}

console.log(`[Cloudinary Init] Configured successfully using ${configSource}. Cloud Name: ${activeCloudName}`);

export default cloudinary;
