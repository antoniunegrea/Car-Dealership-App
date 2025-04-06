import Joi from 'joi';

export const carSchema = Joi.object({
    id: Joi.number().min(0),
    manufacturer: Joi.string().min(2).max(50).required(),
    model: Joi.string().min(1).max(50).required(),
    year: Joi.number().integer().min(1900).max(new Date().getFullYear()).required(),
    price: Joi.number().min(0).required(),
    image_url: Joi.string().uri().required()
});

export const carUpdateSchema = Joi.object({
    id: Joi.number().min(0),
    manufacturer: Joi.string().min(2).max(50),
    model: Joi.string().min(1).max(50),
    year: Joi.number().integer().min(1900).max(new Date().getFullYear()),
    price: Joi.number().min(0),
    image_url: Joi.string().uri()
}).min(1); // At least one field must be provided for PATCH