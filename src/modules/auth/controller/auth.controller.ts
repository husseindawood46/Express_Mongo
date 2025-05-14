import { Request, Response } from 'express';
import User from '../model/auth.model';
import bcrypt from 'bcrypt';
import { AppError } from '../../../middleware/app.error';
import { catchError } from '../../../middleware/catch.error';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config();
export const signup = catchError(async (req: Request, res: Response) => {
  const { username, password, email } = req.body;
  const salt = parseInt(process.env.SALT || '10');
  const hashPassword = await bcrypt.hashSync(password, salt);
  const user = await User.create({ username, password: hashPassword, email });
  if (!user) {
    new AppError('User not created', 400);
  }
  return res.status(201).json({
    status: 'success',
    data: {
      user,
    },
  });
});
interface SigninBody {
  email: string;
  password: string;
}

const JWT_SECRET = process.env.JWT_SECRET || 'your_fallback_secret';

/**
 * Signin function to authenticate a user and return a JWT token.
 * Validates email and password, and generates a token if credentials are correct.
 */
export const signin = catchError(
  async (req: Request<{}, {}, SigninBody>, res: Response) => {
    const { email, password } = req.body;
    if (!email || !password) {
      throw new AppError('Email and password are required', 400);
    }
    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      throw new AppError('Invalid credentials', 401);
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      throw new AppError('Invalid credentials', 401);
    }

    // Check if _id exists
    if (!user._id) {
      console.error('User missing _id:', user);
      throw new AppError('Invalid user data: Missing ID', 500);
    }
    // Generate JWT token with 'id'
    const payload = {
      id: user._id.toString(),
      username: user.username || 'unknown', // Fallback for username
      role: user.role || 'user', // Fallback for role
    };
    const token = jwt.sign(payload, JWT_SECRET, { expiresIn: '1d' });
    return res.status(200).json({
      status: 'success',
      token,
    });
  }
);

