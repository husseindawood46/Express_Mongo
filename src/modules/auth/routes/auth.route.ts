import { Router } from 'express';
import { signup, signin, confirmEmail } from '../controller/auth.controller';
import { checkUniqueEmail } from '../middleware/checkUniqueEmail';
import { validate } from '../../../middleware/validation.middlware';
import { signinSchema, signupSchema } from '../validation/auth.validate';
const router = Router();
router
  .post('/signup', validate(signupSchema), checkUniqueEmail, signup)
  .post('/signin', validate(signinSchema), signin);
router.get('/confirmEmail/:token', confirmEmail);
export { router as authRoute };
