import Joi from "joi";

export const registerValidations = Joi.object({
  name: Joi.string().required().messages({
    "string.base": "Name must be a string",
    "string.empty": "Name is require",
    "any.require": "Name is require",
  }),
  email: Joi.string().required().messages({
    "string.base": "Email must be a string",
    "string.empty": "Email is require",
    "any.require": "Email is require",
    "string.email": "Invalid email format",
  }),
  password: Joi.string().required().messages({
    "string.base": "Password must be a string",
    "string.empty": "Password is require",
    "any.require": "Password is require",
    "string.min": "Password must be at least 6 characters long",
  }),
  confirmPassword: Joi.string().valid(Joi.ref("password")).required().messages({
    "any.only": "Password do not match",
    "any.require": "Confirm password is require",
  }),
});

export const loginValidations = Joi.object({
  email: Joi.string().required().messages({
    "string.base": "Email must be a string",
    "string.empty": "Email is require",
    "any.require": "Email is require",
    "string.email": "Invalid email format",
  }),
  password: Joi.string().required().messages({
    "string.base": "Password must be a string",
    "string.empty": "Password is require",
    "any.require": "Password is require",
  }),
});
