import { ImageService } from './imageServis.js';
import HttpError from '../helpers/HttpError.js';

export const updateAvatarService = async (userData, user, file) => {
  if (file === null || file === undefined) {
    throw HttpError(400, 'there will be a link to the image');
  }
  user.avatarURL = await ImageService.saveImage(
    file,
    {
      maxFileSize: 5,
      width: 200,
      height: 200,
    },
    'avatars'
  );

  Object.keys(userData).forEach(key => {
    user[key] = userData[key];
  });
  return user.save();
};
