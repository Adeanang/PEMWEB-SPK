import { Request, Response } from "express";
import { prisma } from "../config/prisma";

// ==========================
// GET ALL
// ==========================
export const getKategoriHotels = async (
  req: Request,
  res: Response
) => {
  try {
    const kategoriHotels = await prisma.kategoriHotel.findMany({
      include: {
        hotels: true,
      },
    });

    res.json({
      success: true,
      data: kategoriHotels,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Gagal mengambil kategori hotel",
    });
  }
};

// ==========================
// GET BY ID
// ==========================
export const getKategoriHotelById = async (
  req: Request,
  res: Response
) => {
  try {
    const id = Number(req.params.id);

    const kategoriHotel = await prisma.kategoriHotel.findUnique({
      where: {
        id,
      },
      include: {
        hotels: true,
      },
    });

    if (!kategoriHotel) {
      return res.status(404).json({
        success: false,
        message: "Kategori hotel tidak ditemukan",
      });
    }

    res.json({
      success: true,
      data: kategoriHotel,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Gagal mengambil kategori hotel",
    });
  }
};

// ==========================
// CREATE
// ==========================
export const createKategoriHotel = async (
  req: Request,
  res: Response
) => {
  try {
    const { namaKategori } = req.body;

    if (!namaKategori) {
      return res.status(400).json({
        success: false,
        message: "Nama kategori wajib diisi",
      });
    }

    const exist = await prisma.kategoriHotel.findFirst({
      where: {
        namaKategori,
      },
    });

    if (exist) {
      return res.status(400).json({
        success: false,
        message: "Kategori hotel sudah ada",
      });
    }

    const kategoriHotel = await prisma.kategoriHotel.create({
      data: {
        namaKategori,
      },
    });

    res.status(201).json({
      success: true,
      message: "Kategori hotel berhasil ditambahkan",
      data: kategoriHotel,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Gagal menambahkan kategori hotel",
    });
  }
};

// ==========================
// UPDATE
// ==========================
export const updateKategoriHotel = async (
  req: Request,
  res: Response
) => {
  try {
    const id = Number(req.params.id);

    const { namaKategori } = req.body;

    const kategoriHotel = await prisma.kategoriHotel.update({
      where: {
        id,
      },
      data: {
        namaKategori,
      },
    });

    res.json({
      success: true,
      message: "Kategori hotel berhasil diupdate",
      data: kategoriHotel,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Gagal update kategori hotel",
    });
  }
};

// ==========================
// DELETE
// ==========================
export const deleteKategoriHotel = async (
  req: Request,
  res: Response
) => {
  try {
    const id = Number(req.params.id);

    const totalHotel = await prisma.hotel.count({
      where: {
        kategoriHotelId: id,
      },
    });

    if (totalHotel > 0) {
      return res.status(400).json({
        success: false,
        message: "Kategori hotel masih digunakan oleh data hotel",
      });
    }

    await prisma.kategoriHotel.delete({
      where: {
        id,
      },
    });

    res.json({
      success: true,
      message: "Kategori hotel berhasil dihapus",
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Gagal menghapus kategori hotel",
    });
  }
};