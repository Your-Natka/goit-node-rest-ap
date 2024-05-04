import express from 'express';

import { getCurrent, logIn, logout, resendEmail, signUp, updateAvatar } from '../controllers/userControllers.js';
import { checkUserLogIn, checkUserSingUp, protect } from '../middlewares/authMiddlewares.js';
import { uploadAvatar } from '../middlewares/userMiddlewares.js';
import { verifyEmail } from '../services/emailSeriveces.js';
import { checkEmailVerification } from '../middlewares/resetPassMidddlewares.js';

const router = express.Router();

router.post('/register', checkUserSingUp, signUp);
router.post('/login', checkUserLogIn, logIn);
router.post('/logout', protect, logout);
router.get('/current', protect, getCurrent);
router.patch('/avatars', protect, uploadAvatar, updateAvatar);
router.get('/verify/:verificationToken', verifyEmail);
router.post('/verify', checkEmailVerification, resendEmail);

export { router };
