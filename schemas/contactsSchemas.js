import Joi from "joi";

export const createContactSchema = Joi.object({
  name: Joi.string().min(2).max(30).required(),
  email: Joi.string()
    .email({
      minDomainSegments: 2,
      tlds: { allow: ["com", "net", "org", "ua"] },
    })
    .required(),
  phone: Joi.string().min(10).max(14).required(),
  favorite: Joi.boolean(),
});

export const updateContactSchema = Joi.object({
  name: Joi.string(),
  email: Joi.string(),
  phone: Joi.string(),
})
  .min(1)
  .message("Body must have at least one field");

export const patchContactSchema = Joi.object({
  favorite: Joi.boolean().required(),
});
