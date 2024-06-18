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
import dotenv from 'dotenv';
//import sendEmail from "../helpers/sendEmail.js";
import nodemailer from 'nodemailer';

dotenv.config();

const { HOST_URL, SEND_HOST, SEND_EMAIL, META_PASSWORD, SEND_TO_EMAIL } = process.env;

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

    const verificationToken = v4();

    /*const verifyEmail = {
      to: email,
      subject: "Verify email",
      html: `<a target="_blank" href ="${HOST_URL}/api/users/verify/${verificationToken}"> Verify your email please!</a>`,
    };

    await sendEmail(verifyEmail);*/

    const config = {
      host: SEND_HOST,
      port: 465,
      secure: true,
      auth: {
        user: SEND_EMAIL,
        pass: META_PASSWORD,
      },
    };
    const transporter = nodemailer.createTransport(config);
    const verifyEmail = {
      from: SEND_EMAIL,
      to: SEND_TO_EMAIL,
      subject: 'Verify email',
      html: `<a target="_blank" href ="${HOST_URL}/api/users/verify/${verificationToken}"> Verify your email please!</a>`,
    };

    await transporter
      .sendMail(verifyEmail)
      .then(info => console.log(info))
      .catch(err => console.log(err));

    const newUser = await User.create({
      email,
      password: passwordHash,
      subscription,
      avatarURL,
      verificationToken,
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

export const verifyUser = async (req, res, next) => {
  const { verificationToken } = req.params;

  try {
    const user = await User.findOne({ verificationToken });

    if (!user) {
      throw HttpError(404, 'User not found');
    }

    await User.findByIdAndUpdate(
      user.id,
      {
        verificationToken: '',
        verify: true,
      },
      { new: true }
    );

    res.status(200).json({ message: 'Verification successful' });
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

    if (!user.verify) {
      throw HttpError(401, 'Your email has not been verified. Please click on the link sent to you by email');
    }

    const passwordIsValid = await bcrypt.compare(password, user.password);
    if (!passwordIsValid) {
      throw HttpError(401, 'Email or password is wrong');
    }

    const token = registerToken(user.id);

    await User.findByIdAndUpdate(user._id, { token }, { new: true });

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

export const verifyNewEmailSend = async (req, res, next) => {
  const { email } = req.body;

  try {
    const user = await User.findOne({ email });

    if (!user) {
      throw HttpError(404, 'User not found');
    }

    if (user.verify) {
      throw HttpError(400, 'Verification has already been passed');
    }

    const verificationToken = user.verificationToken;

    const config = {
      host: SEND_HOST,
      port: 465,
      secure: true,
      auth: {
        user: SEND_EMAIL,
        pass: META_PASSWORD,
      },
    };
    const transporter = nodemailer.createTransport(config);
    const verifyEmail = {
      from: SEND_EMAIL,
      to: SEND_TO_EMAIL,
      subject: 'Verify email',
      html: `<a target="_blank" href ="${HOST_URL}/api/users/verify/${verificationToken}"> Verify your email please!</a>`,
    };

    await transporter
      .sendMail(verifyEmail)
      .then(info => console.log(info))
      .catch(err => console.log(err));

    res.json({ message: 'Verification email sent' });
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
    await User.findByIdAndUpdate(req.user.id, { token: '' });

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
