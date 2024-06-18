import HttpError from '../helpers/HttpError.js';
import bcrypt from 'bcrypt';
import crypto from 'crypto';
import path from 'path';
import fs from 'fs/promises';
import { User } from '../models/userModals.js';
import { registerToken } from '../services/jwtServices.js';
import Jimp from 'jimp';
import { v4 } from 'uuid';
import gravatar from 'gravatar';

export const registerUser = async (req, res, next) => {
  const { email, password, subscription } = req.body;

  try {
    const user = await User.findOne({ email });
    if (user) {
      throw HttpError(409, 'Email in use');
    }

    const emailHash = crypto.createHash('md5').update(email).digest('hex');
    const avatarURL = gravatar.url(emailHash, { d: 'robohash' });

    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    const newUser = await User.create({
      email,
      password: passwordHash,
      subscription,
      avatarURL,
    });

    res.status(201).json({
      user: {
        email: newUser.email,
        subscription: newUser.subscription,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const loginUser = async (req, res, next) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      throw HttpError(401, 'Email or password is wrong');
    }

    const passwordIsValid = await bcrypt.compare(password, user.password);
    if (!passwordIsValid) {
      throw HttpError(401, 'Email or password is wrong');
    }

    const token = registerToken(user.id);

    res.status(200).json({
      token,
      user: {
        email,
        subscription: user.subscription,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const getCurrentUser = async (req, res, next) => {
  try {
    const { email, subscription } = await User.findById(req.user.id);

    res.status(200).json({
      email,
      subscription,
    });
  } catch (error) {
    next(error);
  }
};

export const logoutUser = async (req, res, next) => {
  try {
    await User.findByIdAndUpdate(req.user.id, { token: null });

    res.status(204).json({
      message: 'Not authorized',
    });
  } catch (error) {
    next(error);
  }
};

export const uploadUserAvatar = async (req, res, next) => {
  const { id } = req.user;

  try {
    if (!req.file) {
      throw HttpError(400, 'File not uploaded');
    }

    const { path: tmpUpload, originalname } = req.file;

    const filename = `${id}-${v4()}-${originalname}`;

    const changeSizeAvatar = await Jimp.read(tmpUpload);
    changeSizeAvatar.resize(250, 250).write(tmpUpload);

    await fs.rename(tmpUpload, path.join('public/avatars', filename));

    const updateAvatarURL = path.join('/avatars', filename);

    const user = await User.findByIdAndUpdate(id, { avatarURL: updateAvatarURL }, { new: true });

    res.status(200).json({ avatarURL: user.avatarURL });
  } catch (error) {
    next(error);
  }
};
