import Joi from "joi";

export const enquirySchema = Joi.object({
    name: Joi.string().required(),
    email: Joi.string().email().required(),
    subject: Joi.string().required(),
    message: Joi.string().required(),
});

export const enquiryUpdateSchema = Joi.object({
    isSolved: Joi.boolean().optional(),
    remarks: Joi.string().allow("", null),
});

export const enquiryQuerySchema = Joi.object({
    page: Joi.number().integer().min(1).optional().default(1),
    limit: Joi.number().integer().min(1).max(100).optional().default(10),
    search: Joi.string().max(100).allow("", null).optional(),
});