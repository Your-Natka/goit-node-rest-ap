import multer from 'multer';
import path from 'path';
import HttpError from '../helpers/HttpError.js';

const MB_SIZE = 1024 * 1024;

const multerStorage = multer.diskStorage({
  destination: (req, file, cbk) => {
    cbk(null, path.join('tmp'));
  },
  filename: (req, file, cbk) => {
    cbk(null, file.originalname);
  },
});

const multerFilter = (req, file, cbk) => {
  if (file.mimetype.startsWith('image/')) {
    cbk(null, true);
  } else {
    cbk(HttpError(400, 'Please, upload images only..'), false);
  }
};

export const uploadAvatar = multer({
  storage: multerStorage,
  fileFilter: multerFilter,
  limits: {
    fieldSize: 2 * MB_SIZE,
  },
}).single('avatar');
