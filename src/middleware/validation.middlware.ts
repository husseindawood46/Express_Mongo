//body
// import { NextFunction, Request, Response } from 'express';
// import { AppError } from '../utils/app.error';
// export const validate = (Schema: any) => {
//   return (req: Request, res: Response, next: NextFunction) => {
//     const { error } = Schema.validate(req.body, { abortEarly: false });
//     if (error)
//       throw new AppError(
//         error.details.map((e: Error) => e.message.split('"').join('')),
//         400
//       );
//     next();
//   };
// };

import { NextFunction, Request, Response } from 'express';
import Joi from 'joi';
import { AppError } from './app.error';

export const validate = (
  bodySchema?: Joi.ObjectSchema,
  querySchema?: Joi.ObjectSchema
) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const errors: string[] = [];

    if (bodySchema) {
      const { error } = bodySchema.validate(req.body, {
        abortEarly: false,
      });
      if (error) {
        const bodyErrors = error.details.map((e) =>
          e.message.replace(/"/g, '')
        );
        errors.push(...bodyErrors);
      }
    }
    if (querySchema) {
      const { error } = querySchema.validate(req.query, {
        abortEarly: false,
      });
      if (error) {
        const queryErrors = error.details.map((e) =>
          e.message.replace(/"/g, '')
        );
        errors.push(...queryErrors);
      }
    }
    if (errors.length > 0) {
      throw new AppError(errors.join(', '), 400); // Join array into a single string
    }
    next();
  };
};
