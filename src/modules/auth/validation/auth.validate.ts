import joi from 'joi';

export const signupSchema = joi.object({
  username: joi.string().min(3).max(15).required(),
  email: joi
    .string()
    .email({
      tlds: {
        allow: ['com', 'net'],
      },
    })
    .required(),
  password: joi.string().required(),
  role: joi.string().valid('user', 'admin').default('user'),
  isVerified: joi.boolean().default(false),
});
export const signinSchema = joi.object({
  email: joi
    .string()
    .email({
      tlds: {
        allow: ['com', 'net'],
      },
    })
    .required(),
  password: joi.string().required(),
});
