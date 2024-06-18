import express from 'express';
import validateBody from '../middlewares/validateBody.js';
import { loginSchema, registerSchema, verifyEmailSchema } from '../schemas/usersSchemas.js';
import {
  getCurrentUser,
  loginUser,
  registerUser,
  logoutUser,
  uploadUserAvatar,
  verifyUser,
  verifyNewEmailSend,
} from '../controllers/authControllers.js';
import { protect } from '../middlewares/authMiddlewares.js';
import { uploadAvatar } from '../middlewares/userMiddlewares.js';

const authRouter = express.Router();

authRouter.post('/register', validateBody(registerSchema), registerUser);
authRouter.post('/login', validateBody(loginSchema), loginUser);
authRouter.post('/logout', protect, logoutUser);
authRouter.get('/current', protect, getCurrentUser);
authRouter.patch('/avatars', protect, uploadAvatar, uploadUserAvatar);

authRouter.get('/verify/:verificationToken', verifyUser);
authRouter.post('/verify/', validateBody(verifyEmailSchema), verifyNewEmailSend);

export default authRouter;
