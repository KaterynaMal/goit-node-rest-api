import Joi from "joi";
import  {emailRegex}  from "../constants/user-constants.js";

export const userSignupSchema = Joi.object({
  password: Joi.string().min(6).required(),
  email: Joi.string().pattern(emailRegex).required(),
});

export const userSigninSchema = Joi.object({
  password: Joi.string().min(6).required(),
  email: Joi.string().pattern(emailRegex).required(),
});

export const userEmailSchema = Joi.object({
  email: Joi.string().min(6).required(),
})
