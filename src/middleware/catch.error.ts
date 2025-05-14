import { NextFunction, Request, Response } from 'express';

// ✅ Helper to catch async errors in controllers
export const catchError = (
  fn: (req: Request, res: Response, next: NextFunction) => Promise<any>
) => {
  return (req: Request, res: Response, next: NextFunction) => {
    fn(req, res, next).catch(next); 
  };
};