import Joi from 'joi';
import validate from '../helpers/validate.js';

export const createContactSchema = validate(data =>
  Joi.object()
    .options({ abortEarly: false })
    .keys({
      name: Joi.string().alphanum().min(3).max(30).required(),
      email: Joi.string()
        .email({ minDomainSegments: 2, tlds: { allow: ['com', 'net'] } })
        .required(),
      phone: Joi.string().required(),
      favorite: Joi.boolean(),
    })
    .validate(data)
);

export const updateContactSchema = validate(data =>
  Joi.object()
    .options({ abortEarly: false })
    .keys({
      name: Joi.string(),
      email: Joi.string().email({ minDomainSegments: 2, tlds: { allow: ['com', 'net'] } }),
      phone: Joi.string(),
    })
    .validate(data)
);

export const patchContactSchema = validate(data =>
  Joi.object()
    .options({ abortEarly: false })
    .keys({
      favorite: Joi.boolean().required(),
    })
    .validate(data)
);
