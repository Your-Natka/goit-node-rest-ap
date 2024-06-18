import sgMail from '@sendgrid/mail';
import dotenv from 'dotenv';

dotenv.config();
const { SENDGRID_API_KEY, SEND_EMAIL } = process.env;

sgMail.setApiKey(SENDGRID_API_KEY);

const sendEmail = async data => {
  const email = { ...data, from: SEND_EMAIL };
  await sgMail.send(email);
  return true;
};

export default sendEmail;
