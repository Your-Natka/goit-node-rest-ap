import Joi from 'joi';
import validate from '../helpers/validate.js';

export const emailSchema = validate(data =>
  Joi.object()
    .options({ abortEarly: false })
    .keys({
      email: Joi.string()
        .required()
        .email({ minDomainSegments: 2, tlds: { allow: ['com', 'net'] } }),
    })
    .validate(data)
);
