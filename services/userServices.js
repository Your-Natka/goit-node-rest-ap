import bcrypt from 'bcrypt';

import HttpError from '../helpers/HttpError.js';
import { User } from '../models/usersModel.js';
import { createToken } from './jwtServices.js';
import { ImageService } from './avatarServise.js';

export const register = async data => {
  const newUser = await User.create({
    ...data,
  });

  newUser.password = undefined;

  return newUser;
};

export const checkEmail = async email => {
  const user = await User.findOne({ email });

  return user;
};

export const updateUserToken = async id => {
  const token = createToken(id);

  await User.findOneAndUpdate(id, { token });

  return token;
};

export const checkUser = async data => {
  const { email, password } = data;

  const user = await User.findOne({ email }).select('+password');

  if (!user) throw new HttpError(401, 'Email or password is wrong');

  const isValidPassword = await bcrypt.compare(password, user.password);

  if (!isValidPassword) throw new HttpError(401, 'Email or password is wrong');

  const token = createToken(user._id);

  const userUpdate = await User.findOneAndUpdate(user._id, { token }, { new: true });

  userUpdate.password = undefined;

  return userUpdate;
};

export const updateAvatarService = async (userData, user, file) => {
  if (file) {
    user.avatarURL = await ImageService.saveImage(
      file,
      {
        maxFileSize: 5,
        width: 200,
        height: 200,
      },
      'avatars'
    );
  }

  Object.keys(userData).forEach(key => {
    user[key] = userData[key];
  });

  return user.save();
};
