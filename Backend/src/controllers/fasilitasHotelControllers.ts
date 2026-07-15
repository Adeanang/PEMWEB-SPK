import { Request, Response } from "express";
import { prisma } from "../config/prisma";

// ==========================
// GET ALL
// ==========================
export const getFasilitasHotels = async (
  req: Request,
  res: Response
) => {
  try {
    const fasilitas = await prisma.fasilitasHotel.findMany({
      include: {
        hotel: true,
      },
    });

    res.json({
      success: true,
      data: fasilitas,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Gagal mengambil fasilitas hotel",
    });
  }
};

// ==========================
// GET BY ID
// ==========================
export const getFasilitasHotelById = async (
  req: Request,
  res: Response
) => {
  try {
    const id = Number(req.params.id);

    const fasilitas = await prisma.fasilitasHotel.findUnique({
      where: {
        id,
      },
      include: {
        hotel: true,
      },
    });

    if (!fasilitas) {
      return res.status(404).json({
        success: false,
        message: "Fasilitas tidak ditemukan",
      });
    }

    res.json({
      success: true,
      data: fasilitas,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Gagal mengambil fasilitas hotel",
    });
  }
};

// ==========================
// CREATE
// ==========================
export const createFasilitasHotel = async (
  req: Request,
  res: Response
) => {
  try {
    const {
      hotelId,
      fasilitas,
    } = req.body;

    if (!hotelId || !fasilitas) {
      return res.status(400).json({
        success: false,
        message: "Data belum lengkap",
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

    const data = await prisma.fasilitasHotel.create({
      data: {
        hotelId,
        fasilitas,
      },
    });

    res.status(201).json({
      success: true,
      message: "Fasilitas berhasil ditambahkan",
      data,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Gagal menambahkan fasilitas",
    });
  }
};

// ==========================
// UPDATE
// ==========================
export const updateFasilitasHotel = async (
  req: Request,
  res: Response
) => {
  try {
    const id = Number(req.params.id);

    const { fasilitas } = req.body;

    const data = await prisma.fasilitasHotel.update({
      where: {
        id,
      },
      data: {
        fasilitas,
      },
    });

    res.json({
      success: true,
      message: "Fasilitas berhasil diupdate",
      data,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Gagal update fasilitas",
    });
  }
};

// ==========================
// DELETE
// ==========================
export const deleteFasilitasHotel = async (
  req: Request,
  res: Response
) => {
  try {
    const id = Number(req.params.id);

    await prisma.fasilitasHotel.delete({
      where: {
        id,
      },
    });

    res.json({
      success: true,
      message: "Fasilitas berhasil dihapus",
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Gagal menghapus fasilitas",
    });
  }
};