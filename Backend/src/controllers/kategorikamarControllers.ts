import { Request, Response } from "express";
import { prisma } from "../config/prisma";

// ==========================
// GET ALL
// ==========================
export const getKategoriKamars = async (
  req: Request,
  res: Response
) => {
  try {
    const kategoriKamars = await prisma.kategoriKamar.findMany({
      include: {
        hotel: true,
        kamars: true,
      },
    });

    res.json({
      success: true,
      data: kategoriKamars,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Gagal mengambil kategori kamar",
    });
  }
};

// ==========================
// GET BY ID
// ==========================
export const getKategoriKamarById = async (
  req: Request,
  res: Response
) => {
  try {
    const id = Number(req.params.id);

    const kategoriKamar = await prisma.kategoriKamar.findUnique({
      where: { id },
      include: {
        hotel: true,
        kamars: true,
      },
    });

    if (!kategoriKamar) {
      return res.status(404).json({
        success: false,
        message: "Kategori kamar tidak ditemukan",
      });
    }

    res.json({
      success: true,
      data: kategoriKamar,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Gagal mengambil kategori kamar",
    });
  }
};

// ==========================
// CREATE
// ==========================
export const createKategoriKamar = async (
  req: Request,
  res: Response
) => {
  try {
    const {
      hotelId,
      namaKategori,
      deskripsi,
      kapasitasOrang,
      hargaMin,
      hargaMax,
    } = req.body;

    if (
      !hotelId ||
      !namaKategori ||
      !kapasitasOrang ||
      hargaMin == null ||
      hargaMax == null
    ) {
      return res.status(400).json({
        success: false,
        message: "Data kategori kamar belum lengkap",
      });
    }

    const hotel = await prisma.hotel.findUnique({
      where: {
        id: hotelId,
      },
    });

    if (!hotel) {
      return res.status(404).json({
        success: false,
        message: "Hotel tidak ditemukan",
      });
    }

    const kategoriKamar = await prisma.kategoriKamar.create({
      data: {
        hotelId,
        namaKategori,
        deskripsi,
        kapasitasOrang,
        hargaMin,
        hargaMax,
      },
    });

    res.status(201).json({
      success: true,
      message: "Kategori kamar berhasil ditambahkan",
      data: kategoriKamar,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Gagal menambahkan kategori kamar",
    });
  }
};

// ==========================
// UPDATE
// ==========================
export const updateKategoriKamar = async (
  req: Request,
  res: Response
) => {
  try {
    const id = Number(req.params.id);

    const {
      namaKategori,
      deskripsi,
      kapasitasOrang,
      hargaMin,
      hargaMax,
    } = req.body;

    const kategoriKamar = await prisma.kategoriKamar.update({
      where: { id },
      data: {
        namaKategori,
        deskripsi,
        kapasitasOrang,
        hargaMin,
        hargaMax,
      },
    });

    res.json({
      success: true,
      message: "Kategori kamar berhasil diupdate",
      data: kategoriKamar,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Gagal update kategori kamar",
    });
  }
};

// ==========================
// DELETE
// ==========================
export const deleteKategoriKamar = async (
  req: Request,
  res: Response
) => {
  try {
    const id = Number(req.params.id);

    const totalKamar = await prisma.kamar.count({
      where: {
        kategoriId: id,
      },
    });

    if (totalKamar > 0) {
      return res.status(400).json({
        success: false,
        message: "Kategori kamar masih digunakan oleh data kamar",
      });
    }

    await prisma.kategoriKamar.delete({
      where: {
        id,
      },
    });

    res.json({
      success: true,
      message: "Kategori kamar berhasil dihapus",
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Gagal menghapus kategori kamar",
    });
  }
};