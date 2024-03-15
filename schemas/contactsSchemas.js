import Joi from "joi";

import {
  nameRegex,
  phoneRegex,
  emailRegex,
} from "../constants/contact-constants.js";

export const createContactSchema = Joi.object({
  name: Joi.string().pattern(nameRegex).required(),
  email: Joi.string().pattern(emailRegex).required(),
  phone: Joi.string().pattern(phoneRegex).required(),
  favorite: Joi.boolean().required(),
});

export const updateContactSchema = Joi.object({
  name: Joi.string().pattern(nameRegex),
  email: Joi.string().pattern(emailRegex),
  phone: Joi.string().pattern(phoneRegex),
  favorite: Joi.boolean(),
});
