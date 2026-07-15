import { Request, Response } from "express";
import { prisma } from "../config/prisma";

// ==========================
// GET ALL
// ==========================
export const getSubKriterias = async (
  req: Request,
  res: Response
) => {
  try {

    const subKriterias = await prisma.subKriteria.findMany({
      include: {
        kriteria: true,
      },
      orderBy: {
        kriteriaId: "asc",
      },
    });

    res.json({
      success: true,
      data: subKriterias,
    });

  } catch (error) {

    console.error(error);

    res.status(500).json({
      success: false,
      message: "Gagal mengambil sub kriteria",
    });

  }
};

// ==========================
// GET BY ID
// ==========================
export const getSubKriteriaById = async (
  req: Request,
  res: Response
) => {

  try {

    const id = Number(req.params.id);

    const subKriteria = await prisma.subKriteria.findUnique({
      where: {
        id,
      },
      include: {
        kriteria: true,
      },
    });

    if (!subKriteria) {
      return res.status(404).json({
        success: false,
        message: "Sub kriteria tidak ditemukan",
      });
    }

    res.json({
      success: true,
      data: subKriteria,
    });

  } catch (error) {

    console.error(error);

    res.status(500).json({
      success: false,
      message: "Gagal mengambil sub kriteria",
    });

  }

};

// ==========================
// CREATE
// ==========================
export const createSubKriteria = async (
  req: Request,
  res: Response
) => {

  try {

    const {
      kriteriaId,
      value,
      skor,
    } = req.body;

    if (
      !kriteriaId ||
      !value ||
      skor == null
    ) {
      return res.status(400).json({
        success: false,
        message: "Data belum lengkap",
      });
    }

    const kriteria = await prisma.kriteria.findUnique({
      where: {
        id: kriteriaId,
      },
    });

    if (!kriteria) {
      return res.status(404).json({
        success: false,
        message: "Kriteria tidak ditemukan",
      });
    }

    const exist = await prisma.subKriteria.findFirst({
      where: {
        kriteriaId,
        value,
      },
    });

    if (exist) {
      return res.status(400).json({
        success: false,
        message: "Sub kriteria sudah ada",
      });
    }

    const subKriteria = await prisma.subKriteria.create({
      data: {
        kriteriaId,
        value,
        skor,
      },
    });

    res.status(201).json({
      success: true,
      message: "Sub kriteria berhasil ditambahkan",
      data: subKriteria,
    });

  } catch (error) {

    console.error(error);

    res.status(500).json({
      success: false,
      message: "Gagal menambahkan sub kriteria",
    });

  }

};

// ==========================
// UPDATE
// ==========================
export const updateSubKriteria = async (
  req: Request,
  res: Response
) => {

  try {

    const id = Number(req.params.id);

    const {
      value,
      skor,
    } = req.body;

    const subKriteria = await prisma.subKriteria.update({
      where: {
        id,
      },
      data: {
        value,
        skor,
      },
    });

    res.json({
      success: true,
      message: "Sub kriteria berhasil diupdate",
      data: subKriteria,
    });

  } catch (error) {

    console.error(error);

    res.status(500).json({
      success: false,
      message: "Gagal update sub kriteria",
    });

  }

};

// ==========================
// DELETE
// ==========================
export const deleteSubKriteria = async (
  req: Request,
  res: Response
) => {

  try {

    const id = Number(req.params.id);

    await prisma.subKriteria.delete({
      where: {
        id,
      },
    });

    res.json({
      success: true,
      message: "Sub kriteria berhasil dihapus",
    });

  } catch (error) {

    console.error(error);

    res.status(500).json({
      success: false,
      message: "Gagal menghapus sub kriteria",
    });

  }

};