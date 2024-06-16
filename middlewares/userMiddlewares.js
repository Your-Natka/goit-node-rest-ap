import { Types } from 'mongoose';

import { catchAsync } from '../helpers/catchAsync.js';
import HttpError from '../helpers/HttpError.js';
import { Contacts } from '../models/contactsModel.js';
import { createContactSchema, patchContactSchema, updateContactSchema } from '../schemas/contactsSchemas.js';
import { ImageService } from '../services/avatarServise.js';

export const checkUserId = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  try {
    if (!Types.ObjectId.isValid(id)) throw new HttpError(400);

    const contact = await Contacts.findById(id);

    if (!contact || contact.owner.toString() !== req.user.id) throw new HttpError(404);

    req.contact = contact;

    next();
  } catch (error) {
    next(error);
  }
});

export const checkUpdateUserData = (req, res, next) => {
  const { value, error } = updateContactSchema(req.body);
  try {
    if (error) throw new HttpError(400);

    if (!Object.keys(req.body).length) throw new HttpError(400, 'Data must have one cheange');

    req.body = value;

    next();
  } catch (error) {
    next(error);
  }
};

export const checkFavorite = (req, res, next) => {
  const { value, error } = patchContactSchema(req.body);
  try {
    if (error) throw new HttpError(400);

    if (!Object.keys(req.body).length) throw new HttpError(400, 'Favorite is missing');

    req.body = value;

    next();
  } catch (error) {
    next(error);
  }
};

export const checkCreateUserData = (req, res, next) => {
  const { value, error } = createContactSchema(req.body);
  try {
    if (error) throw new HttpError(400);

    req.body = value;

    next();
  } catch (error) {
    next(error);
  }
};

export const uploadAvatar = ImageService.initUploadImageMiddleware('avatar');
