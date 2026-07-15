import { Request, Response } from "express";
import { prisma } from "../config/prisma";

// ==========================
// GET ALL
// ==========================
export const getKamars = async (
  req: Request,
  res: Response
) => {
  try {
    const kamars = await prisma.kamar.findMany({
      include: {
        hotel: true,
        kategori: true,
      },
    });

    res.json({
      success: true,
      data: kamars,
    });

  } catch (error) {

    console.error(error);

    res.status(500).json({
      success: false,
      message: "Gagal mengambil data kamar",
    });

  }
};

// ==========================
// GET BY ID
// ==========================
export const getKamarById = async (
  req: Request,
  res: Response
) => {

  try {

    const id = Number(req.params.id);

    const kamar = await prisma.kamar.findUnique({
      where: { id },
      include: {
        hotel: true,
        kategori: true,
      },
    });

    if (!kamar) {
      return res.status(404).json({
        success: false,
        message: "Kamar tidak ditemukan",
      });
    }

    res.json({
      success: true,
      data: kamar,
    });

  } catch (error) {

    console.error(error);

    res.status(500).json({
      success: false,
      message: "Gagal mengambil kamar",
    });

  }

};

// ==========================
// CREATE
// ==========================
export const createKamar = async (
  req: Request,
  res: Response
) => {

  try {

    const {
      hotelId,
      kategoriId,
      nomorKamar,
    } = req.body;

    if (
      !hotelId ||
      !kategoriId ||
      !nomorKamar
    ) {
      return res.status(400).json({
        success: false,
        message: "Data kamar belum lengkap",
      });
    }

    const kategori = await prisma.kategoriKamar.findUnique({
      where: {
        id: kategoriId,
      },
    });

    if (!kategori) {
      return res.status(404).json({
        success: false,
        message: "Kategori kamar tidak ditemukan",
      });
    }

    const exist = await prisma.kamar.findFirst({
      where: {
        nomorKamar,
        hotelId,
      },
    });

    if (exist) {
      return res.status(400).json({
        success: false,
        message: "Nomor kamar sudah digunakan",
      });
    }

    const kamar = await prisma.kamar.create({
      data: {
        hotelId,
        kategoriId,
        nomorKamar,
      },
    });

    res.status(201).json({
      success: true,
      message: "Kamar berhasil ditambahkan",
      data: kamar,
    });

  } catch (error) {

    console.error(error);

    res.status(500).json({
      success: false,
      message: "Gagal menambahkan kamar",
    });

  }

};

// ==========================
// UPDATE
// ==========================
export const updateKamar = async (
  req: Request,
  res: Response
) => {

  try {

    const id = Number(req.params.id);

    const {
      kategoriId,
      nomorKamar,
    } = req.body;

    const kamar = await prisma.kamar.update({
      where: {
        id,
      },
      data: {
        kategoriId,
        nomorKamar,
      },
    });

    res.json({
      success: true,
      message: "Kamar berhasil diupdate",
      data: kamar,
    });

  } catch (error) {

    console.error(error);

    res.status(500).json({
      success: false,
      message: "Gagal update kamar",
    });

  }

};

// ==========================
// DELETE
// ==========================
export const deleteKamar = async (
  req: Request,
  res: Response
) => {

  try {

    const id = Number(req.params.id);

    await prisma.kamar.delete({
      where: {
        id,
      },
    });

    res.json({
      success: true,
      message: "Kamar berhasil dihapus",
    });

  } catch (error) {

    console.error(error);

    res.status(500).json({
      success: false,
      message: "Gagal menghapus kamar",
    });

  }

};