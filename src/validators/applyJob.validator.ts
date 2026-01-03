import Joi from "joi";

export const applyJobSchema = Joi.object({
    jobId: Joi.string()
        .pattern(/^[0-9a-fA-F]{24}$/)
        .required(),

    fullName: Joi.string().required(),
    email: Joi.string().email().required(),
    mobile: Joi.string().required(),

    alternateMobile: Joi.string().optional(),
    preferredJobTitle: Joi.string().optional(),
    preferredLocation: Joi.string().optional(),
    expectedSalary: Joi.string().optional(),
    totalExperience: Joi.string().optional(),
    resumeUrl: Joi.string().optional(),
});
