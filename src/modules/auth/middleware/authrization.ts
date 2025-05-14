import { NextFunction, Request, Response } from 'express';
import { catchError } from '../../../middleware/catch.error';
import { AppError } from '../../../middleware/app.error';
import { UserType } from '../../../../types/UserType';

// Ensure req.user is typed correctly
declare global {
  namespace Express {
    interface Request {
      user?: UserType;
    }
  }
}

/**
 * Middleware to restrict access to users only.
 * Admins are forbidden from accessing user-specific resources (e.g., viewing user posts).
 */
export const authorize = catchError(
  async (req: Request, res: Response, next: NextFunction) => {
    // Check if user exists and has a role
    if (!req.user || !req.user.role) {
      throw new AppError('Unauthorized: User not authenticated', 401);
    }

    // Restrict access to users only
    if (req.user.role !== 'user') {
      throw new AppError('Forbidden: Only users can access this resource', 403);
    }

    next();
  }
);
