import { NextFunction, Request, Response, ErrorRequestHandler } from 'express';
import { AppError } from './app.error';
// global Handel Error
export const errorHandler: ErrorRequestHandler = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  if (err instanceof AppError) {
    res.status(err.statusCode).json({
      status: 'error',
      message: err.message,
    });
  }
  console.error(err);
  res.status(500).json({
    status: 'error',
    message: 'Internal Server Error',
  });
};
