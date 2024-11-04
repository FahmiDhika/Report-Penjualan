import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import { v4 as uuidv4 } from "uuid"
import md5 from "md5"
import { SECRET } from "../global";
import { sign } from "jsonwebtoken";

const prisma = new PrismaClient({errorFormat: "pretty"})

export const newAdmin = async (request: Request, response: Response) => {
    try {
        const { nama, password } = request.body
        const uuid = uuidv4()

        const newAdmin = await prisma.admin.create({
            data: { uuid, nama, password: md5(password) }
        })

        return response.json({
            status: true,
            data: newAdmin,
            message: `Admin Baru Berhasil Dibuat`
        }).status(200)
    } catch (error) {
        return response.json({
            status: true,
            message: `Terjadi sebuah kesalahan ${error}`
        }).status(400)
    }
}

export const updateAdmin = async (request: Request, response: Response) => {
    try {
        const { id } = request.params
        const { nama, password } = request.body
        
        const findAdmin= await prisma.admin.findFirst({where: { id: Number(id)}})
        if (!findAdmin) return response.status(200).json({
            status: false,
            message: `Admin tidak ditemukan`
        })

        const updateAdmin = await prisma.admin.update({
            data: {
                nama: nama || findAdmin.nama,
                password: password || findAdmin.password
            },
            where: { id: Number(id) }
        })

        return response.json({
            status: true,
            data: updateAdmin,
            message: `Admin berhasil di update`
        })
    } catch (error) {
        return response.json({
            status: false,
            message: `Terjadi sebuah kesalahan. ${error}`
        }).status(400)
    }
}

export const deleteAdmin = async (request: Request, response: Response) => {
    try {
        const { id } = request.params

        const findAdmin = await prisma.admin.findFirst({where: { id: Number(id)}})
        if (!findAdmin) return response.status(200).json({
            status: false,
            message: `Admin tidak ditemukan`
        })

        const deleteAdmin = await prisma.admin.delete({
            where: { id: Number(id)}
        })

        return response.json({
            status: true,
            data: deleteAdmin,
            message: `Admin berhasil dihapus`
        })
    } catch (error) {
        return response.json({
            status: false,
            message: `Terjadi sebuah kesalahan. ${error}`
        }).status(400)
    }
}

export const authentication = async (request: Request, response: Response) => {
    try {
        const { nama, password } = request.body

        const findAdmin = await prisma.admin.findFirst({
            where: { nama, password: md5(password) }
        })

        if (!findAdmin) return response.status(200).json({
            status: false,
            logged: false,
            message: `Nama atau Password invalid`
        })

        let data = {
            id: findAdmin.id,
            nama: findAdmin.nama,
        }

        let payload = JSON.stringify(data)

        let token = sign(payload, SECRET || "token")

        return response.status(200).json({
            status: true,
            logged: true,
            message: `Login sukses`,
            token
        })
    } catch (error) {
        return response.json({
            status: true,
            message: `Terjadi sebuah kesalahan ${error}`
        }).status(400)
    }
}