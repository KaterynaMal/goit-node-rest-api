import Joi from "joi";

export const createContactSchema = Joi.object({
  name: Joi.string().required(),
  email: Joi.string().required(),
  phone: Joi.string().required(),
});

export const updateContactSchema = Joi.object({
  name: Joi.string().regex(/[a-zA-Z]+/),
  email: Joi.string().email(),
  phone: Joi.string().regex(/^[+0-9()\-.\s]+$/),
});
