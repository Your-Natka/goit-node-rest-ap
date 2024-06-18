import { isValidObjectId } from 'mongoose';
import HttpError from '../helpers/HttpError.js';

const isValidateId = (req, res, next) => {
  const { id } = req.params;
  if (!isValidObjectId(id)) {
    return next(HttpError(404, 'Not found'));
  }
  next();
};
export default isValidateId;
