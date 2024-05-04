import jwt from 'jsonwebtoken';
import HttpError from '../helpers/HttpError.js';

export const createToken = id => jwt.sign({ id }, process.env.SECRET_TOKEN, { expiresIn: '2d' });

export const checkToken = token => {
  if (!token) throw new HttpError(401);

  try {
    const { id } = jwt.verify(token, process.env.SECRET_TOKEN);

    return id;
  } catch (error) {
    throw new HttpError(401);
  }
};
