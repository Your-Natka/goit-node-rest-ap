import Joi from 'joi';
import validate from '../helpers/validate.js';
import { PASSWD_REGEX } from '../constants/regex.js';

export const signUpSchema = validate(data =>
  Joi.object()
    .options({ abortEarly: false })
    .keys({
      email: Joi.string()
        .required()
        .email({ minDomainSegments: 2, tlds: { allow: ['com', 'net'] } }),
      password: Joi.string().min(6).regex(PASSWD_REGEX).required(),
    })
    .validate(data)
);

export const loginSchema = validate(data =>
  Joi.object()
    .options({ abortEarly: false })
    .keys({
      email: Joi.string()
        .required()
        .email({ minDomainSegments: 2, tlds: { allow: ['com', 'net'] } }),
      password: Joi.string().min(6).regex(PASSWD_REGEX).required(),
    })
    .validate(data)
);
