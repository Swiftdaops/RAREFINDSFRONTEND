// This file configures the Cloudinary service using environment variables.

import { v2 as cloudinary } from 'cloudinary';
import dotenv from 'dotenv';
import path from 'path';

// Load environment variables from .env file.
// Note: In production environments (like Vercel or Railway), these are usually
// injected directly into the environment and this line might be optional,
// but it's crucial for local development with the provided .env file.
dotenv.config();

// Configuration object passed to Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export default cloudinary;

// Note on Multer:
// You had a previous error (MulterError: Unexpected field).
// Since the last few attempts hit the Cloudinary error, it implies you may have fixed Multer.
// If the Multer error persists, ensure your Multer middleware uses the exact field name
// "coverImage" (e.g., multer().single('coverImage')).