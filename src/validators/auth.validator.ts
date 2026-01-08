import Joi from 'joi';
;
import { Role } from '@prisma/client';


export const registerSchema = Joi.object({
    name: Joi.string().optional().messages({
        'string.base': `"name" should be a type of 'text'`,
    }),
    email: Joi.string().email().required().messages({
        'string.base': `"email" should be a type of 'text'`,
        'string.email': `"email" must be a valid email`,
        'any.required': `"email" is a required field`,
    }),
    password: Joi.string().min(6).required().messages({
        'string.base': `"password" should be a type of 'text'`,
        'string.min': `"password" should have a minimum length of {#limit}`,
        'any.required': `"password" is a required field`,
    }),
    role: Joi.string()
        .valid(...Object.values(Role))
        .required()
        .messages({
            'any.required': `"role" is a required field`,
            'any.only': `"role" must be one of ${Object.values(Role).join(', ')}`,
    }),
});

export const loginSchema = Joi.object({
    email: Joi.string().email().required().messages({
        'string.base': `"email" should be a type of 'text'`,
        'string.email': `"email" must be a valid email`,
        'any.required': `"email" is a required field`,
    }),
    password: Joi.string().min(6).required().messages({
        'string.base': `"password" should be a type of 'text'`,
        'string.min': `"password" should have a minimum length of {#limit}`,
        'any.required': `"password" is a required field`,
    }),
});



// Forgot password validation
export const forgotPasswordSchema = Joi.object({
    email: Joi.string().email().required().messages({
        'string.base': `"email" should be a type of 'text'`,
        'string.email': `"email" must be a valid email`,
        'any.required': `"email" is a required field`,
    }),
});

// Reset password validation
export const resetPasswordSchema = Joi.object({
    email: Joi.string().email().required().messages({
        'string.base': `"email" should be a type of 'text'`,
        'string.email': `"email" must be a valid email`,
        'any.required': `"email" is a required field`,
    }),
    otp: Joi.string()
        .trim()
        .pattern(/^[0-9]{6}$/)
        .required()
        .messages({
            'string.pattern.base': `"otp" must be a 6 digit number`,
            'any.required': `"otp" is a required field`,
        }),

    newPassword: Joi.string().min(6).required().messages({
        'string.base': `"newPassword" should be a type of 'text'`,
        'string.min': `"newPassword" should have a minimum length of {#limit}`,
        'any.required': `"newPassword" is a required field`,
    }),
});