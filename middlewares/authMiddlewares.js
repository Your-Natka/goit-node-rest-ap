import { catchAsync } from '../helpers/catchAsync.js';
import HttpError from '../helpers/HttpError.js';
import { User } from '../models/usersModel.js';
import { loginSchema, signUpSchema } from '../schemas/authSchemas.js';
import { checkEmail } from '../services/userServices.js';
import { checkToken } from '../services/jwtServices.js';

export const checkUserSingUp = catchAsync(async (req, res, next) => {
  const { value, error } = signUpSchema(req.body);

  if (error) throw new HttpError(400, error.message);

  const emailCheck = await checkEmail(value.email);

  if (emailCheck) throw new HttpError(409, 'Email in use');

  req.body = value;

  next();
});

export const checkUserLogIn = (req, res, next) => {
  const { value, error } = loginSchema(req.body);

  if (error) throw new HttpError(400, error.message);

  req.body = value;
  next();
};

export const protect = catchAsync(async (req, res, next) => {
  const token = req.headers.authorization ? req.headers.authorization.split(' ')[1] : null;

  if (!token) throw new HttpError(401);

  const id = checkToken(token);
  const user = await User.findById(id);

  if (!user || !user.token || user.token !== token) throw new HttpError(401);

  req.user = user;

  next();
});
