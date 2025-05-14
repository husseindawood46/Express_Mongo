import { Request, Response, NextFunction } from 'express';
import { AppError } from '../../../middleware/app.error';
import { catchError } from '../../../middleware/catch.error';

import Auth from '../model/auth.model';
export const checkUniqueEmail = catchError(
  async (req: Request, res: Response, next: NextFunction) => {
    const { email } = req.body;
    const exist = await Auth.findOne({ email });
    if (exist) {
      throw new AppError('Email already Exist', 400);
    }
    next();
  }
);
