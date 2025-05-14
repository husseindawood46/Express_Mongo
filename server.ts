import express from 'express';
import dotenv from 'dotenv';
import { connectionToDB } from './src/DB/connection';
import { v1Routes } from './src/routes/v1.routes';
import { errorHandler } from './src/middleware/error.handler';
import { v2 as cloudinary } from 'cloudinary';
dotenv.config(); // Load .env
 
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME || 'your_cloud_name',
  api_key: process.env.CLOUDINARY_API_KEY || 'your_api_key',
  api_secret: process.env.CLOUDINARY_API_SECRET || 'your_api_secret',
});
const app = express();
app.use(express.json());

const PORT = process.env.PORT || 3000;

// DB connection
connectionToDB();
// Routes
app.use('/api/v1', v1Routes);
// static file
app.use(express.static('uploads'))
// Global error handler
app.use(errorHandler);
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
