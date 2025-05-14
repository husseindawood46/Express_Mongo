import { Request } from 'express';
import multer from 'multer';
import { v4 as uuidv4 } from 'uuid';
import { AppError } from './app.error';
export const getUploadMiddleware = (fieldName: string = 'url') => {
  const storage = multer.diskStorage({
    // don't store in server backend
    //         destination: function (req, file, cb) {
    //             cb(null, 'uploads/');
    //         },
    //         filename: function (req, file, cb) {
    //             cb(null, uuidv4() + file.originalname);
    //   },
  });
  // store image only
  function fileFilter(
    req: Request,
    file: Express.Multer.File,
    cb: multer.FileFilterCallback
  ) {
    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif'];
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true); // accept file
    } else {
      cb(
        new AppError(
          'Invalid file type. Only JPEG, PNG, and GIF are allowed',
          400
        )
      ); // invalid
    }
  }
  // Multer configuration size
  // const upload = multer({
  //     storage,
  //     fileFilter,
  //     limits: {
  //       fileSize: 5 * 1024 * 1024, // Max 5MB
  //     },
  //   });
  const upload = multer({ storage, fileFilter });
  const uploadMiddleware = upload.single(fieldName);
  return uploadMiddleware;
};
