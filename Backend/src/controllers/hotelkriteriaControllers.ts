import { Request, Response } from "express";
import { prisma } from "../config/prisma";

// ==========================
// GET ALL
// ==========================
export const getHotelKriterias = async (
  req: Request,
  res: Response
) => {
  try {

    const data = await prisma.hotelKriteria.findMany({
      include: {
        hotel: true,
        kriteria: true,
      },
      orderBy: {
        hotelId: "asc",
      },
    });

    res.json({
      success: true,
      data,
    });

  } catch (error) {

    console.error(error);

    res.status(500).json({
      success: false,
      message: "Gagal mengambil data hotel kriteria",
    });

  }
};

// ==========================
// GET BY HOTEL
// ==========================
export const getHotelKriteriaByHotel = async (
  req: Request,
  res: Response
) => {

  try {

    const hotelId = Number(req.params.hotelId);

    const data = await prisma.hotelKriteria.findMany({
      where: {
        hotelId,
      },
      include: {
        kriteria: true,
      },
    });

    res.json({
      success: true,
      data,
    });

  } catch (error) {

    console.error(error);

    res.status(500).json({
      success: false,
      message: "Gagal mengambil data hotel",
    });

  }

};

// ==========================
// CREATE
// ==========================
export const createHotelKriteria = async (
  req: Request,
  res: Response
) => {

  try {

    const {
      hotelId,
      kriteriaId,
      nilai,
    } = req.body;

    if (
      !hotelId ||
      !kriteriaId ||
      nilai == null
    ) {
      return res.status(400).json({
        success: false,
        message: "Data belum lengkap",
      });
    }

    const exist = await prisma.hotelKriteria.findFirst({
      where: {
        hotelId,
        kriteriaId,
      },
    });

    if (exist) {
      return res.status(400).json({
        success: false,
        message: "Nilai hotel untuk kriteria ini sudah ada",
      });
    }

    const data = await prisma.hotelKriteria.create({
      data: {
        hotelId,
        kriteriaId,
        nilai,
      },
    });

    res.status(201).json({
      success: true,
      message: "Nilai hotel berhasil ditambahkan",
      data,
    });

  } catch (error) {

    console.error(error);

    res.status(500).json({
      success: false,
      message: "Gagal menambahkan nilai hotel",
    });

  }

};

// ==========================
// UPDATE
// ==========================
export const updateHotelKriteria = async (
  req: Request,
  res: Response
) => {

  try {

    const id = Number(req.params.id);

    const {
      nilai,
    } = req.body;

    const data = await prisma.hotelKriteria.update({
      where: {
        id,
      },
      data: {
        nilai,
      },
    });

    res.json({
      success: true,
      message: "Nilai hotel berhasil diupdate",
      data,
    });

  } catch (error) {

    console.error(error);

    res.status(500).json({
      success: false,
      message: "Gagal update nilai hotel",
    });

  }

};

// ==========================
// DELETE
// ==========================
export const deleteHotelKriteria = async (
  req: Request,
  res: Response
) => {

  try {

    const id = Number(req.params.id);

    await prisma.hotelKriteria.delete({
      where: {
        id,
      },
    });

    res.json({
      success: true,
      message: "Nilai hotel berhasil dihapus",
    });

  } catch (error) {

    console.error(error);

    res.status(500).json({
      success: false,
      message: "Gagal menghapus nilai hotel",
    });

  }

};