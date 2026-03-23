import Joi from "joi";

export const createSubAdminValidation = Joi.object({
  name: Joi.string().required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
  permissions: Joi.object().required(),
});
export const updateSubAdminValidation = Joi.object({
  name: Joi.string(),
  email: Joi.string().email(),
  password: Joi.string().min(6),
  permissions: Joi.object(),
});