import { NextFunction, Request, Response } from "express";
import Joi from "joi";

export const addDataSchema = Joi.object({
  nama: Joi.string().required(),
  password: Joi.string().required(),
  admin: Joi.optional(),
});

export const updateDataSchema = Joi.object({
  nama: Joi.string().optional(),
  password: Joi.string().optional(),
  admin: Joi.optional(),
});

export const authSchema = Joi.object({
  nama: Joi.string().required(),
  password: Joi.string().min(3).alphanum().required(),
});

export const verifyAuthentication = (
  request: Request,
  response: Response,
  next: NextFunction
) => {
  const { error } = authSchema.validate(request.body, { abortEarly: false });

  if (error) {
    return response.status(400).json({
      status: false,
      message: error.details.map((it) => it.message).join(),
    });
  }
  return next();
};

export const verifyNewAdmin = (
  request: Request,
  response: Response,
  next: NextFunction
) => {
  // validasi data dari request body dan mengambil info error jika terdapat error
  const { error } = addDataSchema.validate(request.body, { abortEarly: false });

  if (error) {
    // jika terdapat error, akan memberikan pesan seperti ini
    return response.status(400).json({
      status: false,
      message: error.details.map((it) => it.message).join(),
    });
  }
  return next();
};

export const verifyEditAdmin = (
  request: Request,
  response: Response,
  next: NextFunction
) => {
  // validasi data dari request body dan mengambil info error jika terdapat error
  const { error } = updateDataSchema.validate(request.body, {
    abortEarly: false,
  });

  if (error) {
    // jika terdapat error, akan memberikan pesan seperti ini
    return response.status(400).json({
      status: false,
      message: error.details.map((it) => it.message).join(),
    });
  }
  return next();
};
