import Joi from "joi";

export const sendInvitationValidationsSchema = Joi.object({
    email: Joi.string().required().messages({
        "string.base": "Email must be a string",
        "string.empty": "Email is require",
        "any.require": "Email is require",
        "string.email": "Invalid email format",
    }),
    projectId: Joi.string().required().messages({
        "string.base": "Project ID must be a string",
        "string.empty": "Project ID is require",
        "any.require": "Project ID is require",
    }),
});