import 'server-only';
import { v2 as cloudinary } from 'cloudinary';

let configured = false;
try {
  if (process.env.CLOUDINARY_URL) {
    cloudinary.config(true);
  } else {
    cloudinary.config({
      cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
      api_key: process.env.CLOUDINARY_API_KEY,
      api_secret: process.env.CLOUDINARY_API_SECRET,
    });
  }
  const config = cloudinary.config();
  configured = Boolean(config.cloud_name && config.api_key && config.api_secret);
} catch {
  // Importing an optional upload integration must not crash the whole app.
}

export const isCloudinaryConfigured = configured;
export default cloudinary;
