import { catchAsync } from '../helpers/catchAsync.js';
import { emailSchema } from '../schemas/resetSchemas.js';
import HttpError from '../helpers/HttpError.js';

export const checkEmailVerification = catchAsync((req, res, next) => {
  const { value, errors } = emailSchema(req.body);
  if (errors) throw new HttpError(400, errors);
  req.body = value;
  next();
});
