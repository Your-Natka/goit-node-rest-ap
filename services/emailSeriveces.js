import { MailService } from '@sendgrid/mail';

import { User } from '../models/usersModel.js';
import HttpError from '../helpers/HttpError.js';
import { catchAsync } from '../helpers/catchAsync.js';

export const verifyEmail = catchAsync(async (req, res) => {
  const { verificationToken } = req.params;
  const user = await User.findOne({ verificationToken });
  if (!user) throw new HttpError(404, 'User not found');
  await User.findOneAndUpdate(user._id, {
    verify: true,
    verificationToken: null,
  });
  res.status(200).json({
    message: 'Verification successful',
  });
});

export const sendEmail = async (email, verificationToken) => {
  try {
    const emailTransport = new MailService();
    emailTransport.setApiKey(process.env.ACCESS_TOKEN_EMAIL);

    const user = await User.findOne({ email });

    if (!user) throw new HttpError(404, 'User not found');

    const emailConfig = {
      to: email,
      from: `jerek.d.lem@meta.ua`,
      subject: 'Sending with SendGrid is Fun',
      text: 'and easy to do anywhere, even with Node.js',
      html: `<a href="http://localhost:${process.env.PORT}/users/verify/${verificationToken}">Click to verify email</a>`,
    };

    const checkSendEmail = await emailTransport
      .send(emailConfig)
      .then(() => true)
      .catch(error => {
        throw new HttpError(500, error.message);
      });

    return checkSendEmail;
  } catch (error) {
    throw new HttpError(500, error.message);
  }
};
