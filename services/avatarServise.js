import multer from 'multer';
import { nanoid } from 'nanoid';
import { promises as fs } from 'fs';
import path from 'path';
import jimp from 'jimp';
import fse from 'fs-extra';

import HttpError from '../helpers/HttpError.js';

export class ImageService {
  static initUploadImageMiddleware(fieldName) {
    const multerStorage = multer.memoryStorage();

    const multerFilter = (req, file, cb) => {
      if (file.mimetype.startsWith('image/')) {
        cb(null, true);
      } else {
        cb(new HttpError(400, 'Not an image! Please upload only images.'), false);
      }
    };
    return multer({
      storage: multerStorage,
      fileFilter: multerFilter,
    }).single(fieldName);
  }

  static async saveImage(file, options, ...pathSegments) {
    if (file.size > (options?.maxFileSize ? options.maxFileSize * 1024 * 1024 : 1 * 1024 * 1024)) {
      throw new HttpError(400, 'File is too large..');
    }
    const fileorig = path.join(process.cwd(), 'tmp', file.originalname);

    fse.ensureFileSync(fileorig); // create file if not exists
    await fs.writeFile(fileorig, file.buffer);

    const fullFilePath = path.join(process.cwd(), 'public', ...pathSegments);
    const fileName = `${nanoid()}.jpeg`;
    const avatar = await jimp.read(file.buffer);
    await avatar
      .cover(options?.width ?? 250, options?.height ?? 250)
      .quality(90)
      .writeAsync(path.join(fullFilePath, fileName));

    await fse.remove(fileorig);
    return path.join(...pathSegments, fileName);
  }
}
