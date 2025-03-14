import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import { v4 as uuidv4 } from "uuid";

const prisma = new PrismaClient({ errorFormat: "pretty" });

export const getTransaksiHistory = async (
  request: Request,
  response: Response
) => {
  try {
    const { search, status, start_date, end_date } = request.query;

    const filterConditions: any = {
      OR: [
        { pembeli: { contains: search?.toString() || "" } },
        // { statusBayar: { contains: statusBayar?.toString() || "" } },
      ],
    };

    if (status) {
      filterConditions.status = status.toString();
    }

    if (start_date && end_date) {
      filterConditions.createdAt = {
        gte: new Date(start_date.toString()),
        lte: new Date(end_date.toString()),
      };
    }

    const allTransaksi = await prisma.transaksi.findMany({
      where: filterConditions,
      orderBy: { createdAt: "desc" },
      include: { transaksiList: true },
    });

    return response
      .json({
        status: true,
        data: allTransaksi,
        message: `List transaksi telah diterima`,
      })
      .status(200);
  } catch (error) {
    return response
      .json({
        status: false,
        message: `Terjadi sebuah kesalahan ${error}`,
      })
      .status(400);
  }
};

export const createTransaksi = async (request: Request, response: Response) => {
  try {
    const { pembeli, metodeBayar, status, catatan, transaksi_list } =
      request.body;
    const user = request.body.user;
    const uuid = uuidv4();

    let total = 0;
    for (let index = 0; index < transaksi_list.length; index++) {
      const { produkId } = transaksi_list[index];
      const detailProduk = await prisma.produk.findFirst({
        where: {
          id: produkId,
        },
      });
      if (!detailProduk)
        return response.status(200).json({
          status: false,
          message: `Produk dengan id ${produkId} tidak ditemukan`,
        });
      total += detailProduk.harga * transaksi_list[index].jumlah;
    }

    const newTransaksi = await prisma.transaksi.create({
      data: {
        uuid,
        pembeli,
        total,
        metodeBayar,
        status,
        catatan,
        userId: user.id,
      },
    });

    for (let index = 0; index < transaksi_list.length; index++) {
      const uuid = uuidv4();
      const { produkId, jumlah } = transaksi_list[index];
      await prisma.transaksi_list.create({
        data: {
          uuid,
          idTransaksi: newTransaksi.idTransaksi,
          idProduk: Number(produkId),
          jumlah: Number(jumlah),
        },
      });
    }

    return response
      .json({
        status: true,
        data: newTransaksi,
        message: `Transaksi baru berhasil dibuat`,
      })
      .status(200);
  } catch (error) {
    return response
      .json({
        status: false,
        message: `Terjadi sebuah kesalahan ${error}`,
      })
      .status(400);
  }
};

export const updateTransaksi = async (request: Request, response: Response) => {
  try {
    const { id } = request.params;
    const { status } = request.body;

    const findTransaksi = await prisma.transaksi.findFirst({
      where: { idTransaksi: Number(id) },
    });
    if (!findTransaksi)
      return response.status(200).json({
        status: false,
        message: "Transaksi tidak ditemukan",
      });

    const editedData = await prisma.transaksi.update({
      data: {
        status: status || findTransaksi.status,
      },
      where: { idTransaksi: Number(id) },
    });

    return response
      .json({
        status: true,
        user: editedData,
        message: "Transaksi telah diupdate",
      })
      .status(200);
  } catch (error) {
    return response
      .json({
        status: false,
        message: `Terjadi sebuah kesalahan ${error}`,
      })
      .status(400);
  }
};

export const deleteTransaksi = async (request: Request, response: Response) => {
  try {
    const { id } = request.params;

    const findTransaksi = await prisma.transaksi.findFirst({
      where: { idTransaksi: Number(id) },
    });

    if (!findTransaksi) {
      return response.status(404).json({
        status: false,
        message: `Transaksi tidak ditemukan`,
      });
    }

    await prisma.transaksi_list.deleteMany({
      where: { idTransaksi: findTransaksi.idTransaksi },
    });

    const deleteTransaksi = await prisma.transaksi.delete({
      where: { idTransaksi: Number(id) },
    });

    return response
      .json({
        status: true,
        data: deleteTransaksi,
        message: `Transaksi has deleted`,
      })
      .status(200);
  } catch (error) {
    return response
      .json({
        status: false,
        message: `Terjadi sebuah kesalahan ${error}`,
      })
      .status(400);
  }
};
