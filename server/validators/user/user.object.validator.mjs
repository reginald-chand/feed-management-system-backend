import Joi from "joi";

export const userObjectValidator = Joi.object({
  userData: Joi.object().required(),
});
