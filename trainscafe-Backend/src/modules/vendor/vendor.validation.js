import Joi from "joi";

export const createVendorSchema = Joi.object({
  name: Joi.string().trim().min(2).required(),

  businessName: Joi.string().trim().required(),

  gstNumber: Joi.string().trim().optional(),

  fssaiNumber: Joi.string().trim().optional(),

  contactNo: Joi.string()
    .pattern(/^\d{10}$/)
    .required()
    .messages({
      "string.pattern.base": "Contact number must be 10 digits",
    }),

  email: Joi.string().email().required(),

  logo: Joi.string().uri().optional(),

  description: Joi.string().max(500).optional(),
});

export const updateVendorSchema = Joi.object({
  name: Joi.string().trim().min(2),
  businessName: Joi.string().trim(),
  gstNumber: Joi.string().trim(),
  fssaiNumber: Joi.string().trim(),
  contactNo: Joi.string().pattern(/^\d{10}$/),
  email: Joi.string().email(),
  logo: Joi.string().uri(),
  description: Joi.string().max(500),
  isActive: Joi.boolean(),
});

export const createVendorOutletSchema = Joi.object({
  vendor: Joi.string().required(),

  station: Joi.string().required(),

  commissionPercent: Joi.number().min(0).max(100).required(),

  deliveryCharges: Joi.number().min(0).default(0),

  minOrderValue: Joi.number().min(0).default(0),

  workingHours: Joi.string().trim().optional(),

  weeklyOff: Joi.array()
    .items(
      Joi.string().valid(
        "Sunday",
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday",
      ),
    )
    .optional(),

  address: Joi.string().trim().optional(),
});

export const updateVendorOutletSchema = Joi.object({
  commissionPercent: Joi.number().min(0).max(100),

  deliveryCharges: Joi.number().min(0),

  minOrderValue: Joi.number().min(0),

  workingHours: Joi.string().trim(),

  weeklyOff: Joi.array().items(
    Joi.string().valid(
      "Sunday",
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
    ),
  ),

  address: Joi.string().trim(),

  isActive: Joi.boolean(),
});
