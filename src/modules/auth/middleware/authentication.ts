import { NextFunction, Request, Response } from 'express';
import { catchError } from '../../../middleware/catch.error';
import { AppError } from '../../../middleware/app.error';
import jwt, { JwtPayload } from 'jsonwebtoken';
import { UserType } from '../../../../types/UserType';

// Extend JwtPayload to include expected fields
interface AuthJwtPayload extends JwtPayload {
  id: string;
  role: 'admin' | 'user';
  username?: string; // Make username optional
}

// Ensure req.user is typed correctly
declare global {
  namespace Express {
    interface Request {
      user?: UserType;
    }
  }
}

// Environment variable for JWT secret
const JWT_SECRET = process.env.JWT_SECRET || 'your_fallback_secret';

export const authentication = catchError(
  async (req: Request, res: Response, next: NextFunction) => {
    const authHeader = req.header('Authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new AppError('Unauthorized: No token provided', 401);
    }

    const token = authHeader.replace('Bearer ', '');

    try {
      const decoded = jwt.verify(token, JWT_SECRET) as AuthJwtPayload;

      // Validate required fields and role
      if (!decoded.id) {
        throw new AppError('Invalid token payload', 401);
      }

      if (decoded.role !== 'admin' && decoded.role !== 'user') {
        throw new AppError('Invalid role', 403);
      }

      req.user = {
        id: decoded.id,
        role: decoded.role,
        username: decoded.username || '', // Fallback to empty string if username is missing
      };
      next();
    } catch (err: any) {
      if (err.name === 'TokenExpiredError') {
        throw new AppError('Token has expired', 401);
      }
      if (err.name === 'JsonWebTokenError') {
        throw new AppError('Invalid token', 401);
      }
      throw new AppError(err.message || 'Authentication failed', 401);
    }
  }
);
