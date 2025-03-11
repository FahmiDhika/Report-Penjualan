import { NextFunction, Request, Response } from "express";
import Joi from "joi";

export const addDataSchema = Joi.object({
    namaProduk: Joi.string().required(),
    harga: Joi.number().min(0).required(),
    stok: Joi.number().min(0).required(),
    user: Joi.required()
})

export const updateDataSchema = Joi.object({
    namaProduk: Joi.string().optional(),
    harga: Joi.number().min(0).optional(),
    stok: Joi.number().min(0).optional(),
    user: Joi.required()
})

export const verifyNewProduk = (request: Request, response: Response, next: NextFunction) => {
    // validasi data dari request body dan mengambil info error jika terdapat error
    const { error } = addDataSchema.validate(request.body, { abortEarly: false })

    if (error) {
        // jika terdapat error, akan memberikan pesan seperti ini
        return response.status(400).json({
            status: false,
            message: error.details.map(it => it.message).join()
        })
    }
    return next()
}

export const verifyEditProduk = (request: Request, response: Response, next: NextFunction) => {
    // validasi data dari request body dan mengambil info error jika terdapat error
    const { error } = updateDataSchema.validate(request.body, { abortEarly: false })

    if (error) {
        // jika terdapat error, akan memberikan pesan seperti ini
        return response.status(400).json({
            status: false,
            message: error.details.map(it => it.message).join()
        })
    }
    return next()
}