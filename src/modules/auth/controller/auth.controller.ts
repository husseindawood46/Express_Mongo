import { Request, Response, NextFunction } from 'express';
import User from '../model/auth.model';
import bcrypt from 'bcrypt';
import { AppError } from '../../../middleware/app.error';
import { catchError } from '../../../middleware/catch.error';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import { transporter } from '../../../middleware/email';
dotenv.config();
export const signup = catchError(async (req: Request, res: Response) => {
  const { username, password, email } = req.body;
  const JWT_SECRET = process.env.JWT_SECRET || 'your_fallback_secret';
  const email_token = jwt.sign({ email }, JWT_SECRET);
  const link =
    process.env.BASE_URL + `/api/v1/auth/confirmEmail/${email_token}`;
  const htmlContent = `
  <h1>Welcome to Our App!</h1>
  <p>Hi, this is a test email sent from our Express app.</p>
  <p>Thank you for using our service!</p>
  <a href="${link}">Visit our website</a>
`;
  await transporter.sendMail({
    from: process.env.EMAIL_NAME,
    to: email,
    subject: 'email confirmation ',
    text: 'This is a test email sent from our Express app.',
    html: htmlContent,
  });
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

export const confirmEmail = catchError(
  async (req: Request, res: Response, next: NextFunction) => {
    const { token } = req.params;
    if (!token) {
      return next(new AppError('Email is required', 400));
    }
    try {
      const JWT_SECRET = process.env.JWT_SECRET || 'your_fallback_secret';
      const decoded = jwt.verify(token, JWT_SECRET);

      let email: string | undefined;
      if (
        typeof decoded === 'object' &&
        decoded !== null &&
        'email' in decoded
      ) {
        email = (decoded as any).email;
      }

      if (!email) {
        throw new AppError('Invalid or expired token', 400);
      }

      console.log('Decoded email:', email);
      const updatedUser = await User.findOneAndUpdate(
        { email },
        { isVerified: true },
        { new: true }
      );
      console.log('Updated user:', updatedUser);

      if (!updatedUser) {
        throw new AppError('User not found', 404);
      }

      return res.status(200).send('email verified successfuly');
    } catch (error: any) {
      throw new AppError(error.message, 400);
    }
  }
);
