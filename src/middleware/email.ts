import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
dotenv.config();
// Create a test account or replace with real credentials.
export const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_NAME,
    pass: process.env.EMAIL_PASSWORD,
  },
});
