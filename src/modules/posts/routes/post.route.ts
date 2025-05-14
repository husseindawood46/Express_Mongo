import { Router } from 'express';
import {
  createPosts,
  deletePosts,
  updatePosts,
  getPostById,
} from '../controllers/post.controller';
import { authentication } from '../../auth/middleware/authentication';
import { authorize } from '../../auth/middleware/authrization';
import { validate } from '../../../middleware/validation.middlware';
import { createPostSchema } from '../validation/post.validation';
import { getUploadMiddleware } from '../../../middleware/upload.middleware';
const route = Router();
route.post(
  '/',
  validate(createPostSchema),
  authentication,
  authorize,
  getUploadMiddleware('url'),
  createPosts
);
route
  .route('/:id')
  .delete(authentication, authorize, deletePosts)
  .patch(authentication, authorize, updatePosts)
  .get(authentication, authorize, getPostById);
export { route as postRoute };
