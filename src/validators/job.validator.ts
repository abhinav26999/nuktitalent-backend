import Joi from 'joi';

export const createJobSchema = Joi.object({
  title: Joi.string().required(),
  company: Joi.string().required(),
  location: Joi.string().required(),
  experience: Joi.string().required(),
  salary: Joi.string().required(),
  description: Joi.string().required(),
});

export const updateJobSchema = Joi.object({
  title: Joi.string().optional(),
  company: Joi.string().optional(),
  location: Joi.string().optional(),
  experience: Joi.string().optional(),
  salary: Joi.string().optional(),
  description: Joi.string().optional(),
});

export const updateJobParamSchema= Joi.object({
 id:Joi.string()
        .pattern(/^[0-9a-fA-F]{24}$/)
        .required()
        .messages({
            "string.base": `"runMemberId" must be text`,
            "string.pattern.base": `"runMemberId" must be a valid ObjectId`,
            "any.required": `"runMemberId" is required`,
        }),
});
