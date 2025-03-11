import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import { v4 as uuidv4 } from "uuid";
import md5 from "md5";
import { SECRET } from "../global";
import { sign } from "jsonwebtoken";

const prisma = new PrismaClient({ errorFormat: "pretty" });

export const getUser = async (request: Request, response: Response) => {
  try {
    const { search } = request.query;
    const allUser = await prisma.user.findMany({
      where: { nama: { contains: search?.toString() || "" } },
    });

    return response
      .json({
        status: true,
        data: allUser,
        message: `User berhasil ditampilkan`,
      })
      .status(200);
  } catch (error) {
    return response
      .json({
        status: false,
        massage: `Terjadi sebuah kesalahan. ${error}`,
      })
      .status(400);
  }
};

export const newUser = async (request: Request, response: Response) => {
  try {
    const { nama, password, role } = request.body;
    const uuid = uuidv4();

    let filename = "";
    if (request.file) filename = request.file.filename;

    const newUser = await prisma.user.create({
      data: {
        uuid,
        nama,
        password: md5(password),
        role,
        profile_picture: filename,
      },
    });

    return response
      .json({
        status: true,
        data: newUser,
        message: `User Baru Berhasil Dibuat`,
      })
      .status(200);
  } catch (error) {
    return response
      .json({
        status: true,
        message: `Terjadi sebuah kesalahan ${error}`,
      })
      .status(400);
  }
};

export const updateUser = async (request: Request, response: Response) => {
  try {
    const { id } = request.params;
    const { nama, password, role } = request.body;

    const findUser = await prisma.user.findFirst({
      where: { id: Number(id) },
    });
    if (!findUser)
      return response.status(200).json({
        status: false,
        message: `User tidak ditemukan`,
      });

    let filename = findUser.profile_picture;

    if (request.file) {
      // update nama file dari foto yang di upload
      filename = request.file.filename;
    }

    const updateUser = await prisma.user.update({
      data: {
        nama: nama || findUser.nama,
        password: password || findUser.password,
        role: role || findUser.role,
        profile_picture: filename,
      },
      where: { id: Number(id) },
    });

    return response
      .json({
        status: true,
        data: updateUser,
        message: `User berhasil di update`,
      })
      .status(200);
  } catch (error) {
    return response
      .json({
        status: false,
        message: `Terjadi sebuah kesalahan. ${error}`,
      })
      .status(400);
  }
};

export const deleteUser = async (request: Request, response: Response) => {
  try {
    const { id } = request.params;

    const findUser = await prisma.user.findFirst({
      where: { id: Number(id) },
    });
    if (!findUser)
      return response.status(200).json({
        status: false,
        message: `Admin tidak ditemukan`,
      });

    const deleteUser = await prisma.user.delete({
      where: { id: Number(id) },
    });

    return response
      .json({
        status: true,
        data: deleteUser,
        message: `User berhasil dihapus`,
      })
      .status(200);
  } catch (error) {
    return response
      .json({
        status: false,
        message: `Terjadi sebuah kesalahan. ${error}`,
      })
      .status(400);
  }
};

export const authentication = async (request: Request, response: Response) => {
  try {
    const { nama, password } = request.body;

    const findUser = await prisma.user.findFirst({
      where: { nama, password: md5(password) },
    });

    if (!findUser)
      return response.status(200).json({
        status: false,
        logged: false,
        message: `Nama atau Password invalid`,
      });

    let data = {
      id: findUser.id,
      nama: findUser.nama,
      role: findUser.role,
    };

    let payload = JSON.stringify(data);

    let token = sign(payload, SECRET || "token");

    return response
      .status(200)
      .json({
        status: true,
        logged: true,
        message: `Login sukses`,
        token,
      })
      .status(200);
  } catch (error) {
    return response
      .json({
        status: true,
        message: `Terjadi sebuah kesalahan ${error}`,
      })
      .status(400);
  }
};
