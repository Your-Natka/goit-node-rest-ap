import express from 'express';
import validateBody from '../middlewares/validateBody.js';
import { loginSchema, registerSchema } from '../schemas/usersSchemas.js';
import { getCurrentUser, loginUser, registerUser, logoutUser, uploadUserAvatar } from '../controllers/authControllers.js';
import { protect } from '../middlewares/authMiddlewares.js';
import { uploadAvatar } from '../middlewares/userMiddlewares.js';

const authRouter = express.Router();

authRouter.post('/register', validateBody(registerSchema), registerUser);
authRouter.post('/login', validateBody(loginSchema), loginUser);
authRouter.post('/logout', protect, logoutUser);
authRouter.get('/current', protect, getCurrentUser);
authRouter.patch('/avatars', protect, uploadAvatar, uploadUserAvatar);

export default authRouter;
