import { NextFunction, Request, Response } from "express";
import Joi from "joi";

const transaksiListSchema = Joi.object({
  produkId: Joi.number().required(),
  jumlah: Joi.number().required(),
});

const addDataSchema = Joi.object({
  pembeli: Joi.string().required(),
  metodeBayar: Joi.string().valid("CASH", "QRIS").uppercase().required(),
  status: Joi.string()
    .valid("BELUM", "SELESAI", "UTANG")
    .uppercase()
    .required(),
  catatan: Joi.string().optional(),
  transaksi_list: Joi.array().items(transaksiListSchema).min(1).required(),
  user: Joi.optional(),
});

const editDataSchema = Joi.object({
  status: Joi.string()
    .valid("BELUM", "SELESAI", "UTANG")
    .uppercase()
    .required(),
  user: Joi.optional(),
});

export const verifyAddTransaksi = (
  request: Request,
  response: Response,
  next: NextFunction
) => {
  /** validate a request body and grab error if exist */
  const { error } = addDataSchema.validate(request.body, { abortEarly: false });

  if (error) {
    /** if there is an error, then give a response like this */
    return response.status(400).json({
      status: false,
      message: error.details.map((it) => it.message).join(),
    });
  }
  return next();
};

export const verifyEditStatus = (
  request: Request,
  response: Response,
  next: NextFunction
) => {
  /** validate a request body and grab error if exist */
  const { error } = editDataSchema.validate(request.body, {
    abortEarly: false,
  });

  if (error) {
    /** if there is an error, then give a response like this */
    return response.status(400).json({
      status: false,
      message: error.details.map((it) => it.message).join(),
    });
  }
  return next();
};
