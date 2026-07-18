import { Request, Response } from "express";
import { prisma } from "../config/prisma";

// ==========================
// GET ALL HOTEL
// ==========================
export const getHotels = async (
  req: Request,
  res: Response
) => {
  try {
    const hotels = await prisma.hotel.findMany({
      include: {
        kategoriHotel: true,
        kategoriKamars: true,
        fasilitasHotels: true,
        hotelKriterias: {
          include: {
            kriteria: true,
          },
        },
      },
    });

    res.json({
      success: true,
      data: hotels,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Gagal mengambil data hotel",
    });
  }
};

// ==========================
// GET HOTEL BY ID
// ==========================
export const getHotelById = async (
  req: Request,
  res: Response
) => {
  try {
    const id = Number(req.params.id);

    const hotel = await prisma.hotel.findUnique({
      where: { id },
      include: {
        kategoriHotel: true,
        kategoriKamars: true,
        fasilitasHotels: true,
        hotelKriterias: {
          include: {
            kriteria: true,
          },
        },
      },
    });

    if (!hotel) {
      return res.status(404).json({
        message: "Hotel tidak ditemukan",
      });
    }

    res.json({
      success: true,
      data: hotel,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Gagal mengambil detail hotel",
    });
  }
};

// ==========================
// CREATE HOTEL
// ==========================
export const createHotel = async (
  req: Request,
  res: Response
) => {
  try {
    const {
      name,
      location,
      sosialMedia,
      imageHotel,
      lat,
      lng,
      kategoriHotelId,
      kriteria,
    } = req.body;

    if (!name || !location || !kategoriHotelId) {
      return res.status(400).json({
        message: "Data hotel belum lengkap",
      });
    }

    const user = (req as any).user;

    const result = await prisma.$transaction(async (tx : any) => {
      const hotel = await tx.hotel.create({
        data: {
          name,
          location,
          sosialMedia,
          imageHotel,
          lat,
          lng,
          kategoriHotelId,
          userId: user.id,
        },
      });

      if (Array.isArray(kriteria) && kriteria.length > 0) {
        await tx.hotelKriteria.createMany({
          data: kriteria.map((item: any) => ({
            hotelId: hotel.id,
            kriteriaId: item.kriteriaId,
            nilai: item.nilai,
          })),
        });
      }

      return hotel;
    });

    res.status(201).json({
      message: "Hotel berhasil ditambahkan",
      data: result,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Gagal menambahkan hotel",
    });
  }
};

// ==========================
// UPDATE HOTEL
// ==========================
export const updateHotel = async (
  req: Request,
  res: Response
) => {
  try {
    const id = Number(req.params.id);

    const {
      name,
      location,
      sosialMedia,
      imageHotel,
      lat,
      lng,
      kategoriHotelId,
    } = req.body;

    const hotel = await prisma.hotel.update({
      where: { id },
      data: {
        name,
        location,
        sosialMedia,
        imageHotel,
        lat,
        lng,
        kategoriHotelId,
      },
    });

    res.json({
      message: "Hotel berhasil diupdate",
      data: hotel,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Gagal update hotel",
    });
  }
};

// ==========================
// DELETE HOTEL
// ==========================
export const deleteHotel = async (
  req: Request,
  res: Response
) => {
  try {
    const id = Number(req.params.id);

    await prisma.$transaction(async (tx : any) => {
      await tx.hotelKriteria.deleteMany({
        where: {
          hotelId: id,
        },
      });

      await tx.fasilitasHotel.deleteMany({
        where: {
          hotelId: id,
        },
      });

      await tx.kategoriKamar.deleteMany({
        where: {
          hotelId: id,
        },
      });

      await tx.hotel.delete({
        where: {
          id,
        },
      });
    });

    res.json({
      message: "Hotel berhasil dihapus",
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Gagal menghapus hotel",
    });
  }
};