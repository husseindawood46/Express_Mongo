import Joi from 'joi';
export const createPostSchema = Joi.object({
  url: Joi.string(),
  comment: Joi.string().required(),
});
