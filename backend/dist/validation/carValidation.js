"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.carUpdateSchema = exports.carSchema = void 0;
const joi_1 = __importDefault(require("joi"));
exports.carSchema = joi_1.default.object({
    id: joi_1.default.number().min(0),
    manufacturer: joi_1.default.string().min(2).max(50).required(),
    model: joi_1.default.string().min(1).max(50).required(),
    year: joi_1.default.number().integer().min(1900).max(new Date().getFullYear()).required(),
    price: joi_1.default.number().min(0).required(),
    image_url: joi_1.default.string().uri().required()
});
exports.carUpdateSchema = joi_1.default.object({
    id: joi_1.default.number().min(0),
    manufacturer: joi_1.default.string().min(2).max(50),
    model: joi_1.default.string().min(1).max(50),
    year: joi_1.default.number().integer().min(1900).max(new Date().getFullYear()),
    price: joi_1.default.number().min(0),
    image_url: joi_1.default.string().uri()
}).min(1); // At least one field must be provided for PATCH
