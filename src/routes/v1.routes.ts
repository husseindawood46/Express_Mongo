import { Router } from "express";
import { authRoute } from "../modules/auth/routes/auth.route";
import { postRoute } from "../modules/posts/routes/post.route";
const router = Router();
router.use('/auth',authRoute)
router.use('/posts', postRoute)
export { router as v1Routes };