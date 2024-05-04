import { catchAsync } from '../helpers/catchAsync.js';
import { User } from '../models/usersModel.js';
import { checkUser, register, updateAvatarService } from '../services/userServices.js';
import HttpError from '../helpers/HttpError.js';
import { sendEmail } from '../services/emailSeriveces.js';

export const signUp = catchAsync(async (req, res) => {
  const newUser = await register(req.body);

  res.status(201).json({
    user: {
      email: newUser.email,
      subscription: newUser.subscription,
    },
  });
});

export const logIn = catchAsync(async (req, res) => {
  const user = await checkUser(req.body);

  res.status(200).json({
    token: user.token,
    user: {
      email: user.email,
      subscription: user.subscription,
    },
  });
});

export const logout = catchAsync(async (req, res) => {
  const { _id } = req.user;

  await User.findOneAndUpdate(_id, { token: null });

  res.status(204).send();
});

export const getCurrent = catchAsync(async (req, res) => {
  const { email, subscription } = await req.user;

  res.status(200).json({
    email,
    subscription,
  });
});

export const updateAvatar = catchAsync(async (req, res) => {
  const updatedUser = await updateAvatarService(req.body, req.user, req.file);

  res.status(200).json({
    user: updatedUser,
  });
});

export const resendEmail = catchAsync(async (req, res) => {
  const { email } = req.body;
  const user = await User.findOne({ email });
  if (!user) throw new HttpError(404, 'User not found');
  if (user.verify) throw new HttpError(400, 'Verification has already been passed');

  const emailSend = await sendEmail(email, user.verificationToken);

  if (!emailSend) throw new HttpError(500, 'Email not send');
  res.status(200).json({
    message: 'Verification email sent',
  });
});
