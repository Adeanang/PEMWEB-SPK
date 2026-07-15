import { Request, Response } from "express";
import { prisma } from "../config/prisma";

// ==========================
// GET ALL
// ==========================
export const getPerbandinganKriterias = async (
  req: Request,
  res: Response
) => {
  try {

    const data = await prisma.perbandinganKriteria.findMany({
      include: {
        kriteria1: true,
        kriteria2: true,
      },
      orderBy: {
        id: "asc",
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
      message: "Gagal mengambil data",
    });

  }
};

// ==========================
// GET BY ID
// ==========================
export const getPerbandinganById = async (
  req: Request,
  res: Response
) => {

  try {

    const id = Number(req.params.id);

    const data = await prisma.perbandinganKriteria.findUnique({
      where: {
        id,
      },
      include: {
        kriteria1: true,
        kriteria2: true,
      },
    });

    if (!data) {
      return res.status(404).json({
        success: false,
        message: "Data tidak ditemukan",
      });
    }

    res.json({
      success: true,
      data,
    });

  } catch (error) {

    console.error(error);

    res.status(500).json({
      success: false,
      message: "Gagal mengambil data",
    });

  }

};

// ==========================
// CREATE
// ==========================
export const createPerbandinganKriteria = async (
  req: Request,
  res: Response
) => {

  try {

    const {
      kriteria1Id,
      kriteria2Id,
      nilai,
    } = req.body;

    if (
      !kriteria1Id ||
      !kriteria2Id ||
      nilai == null
    ) {
      return res.status(400).json({
        success: false,
        message: "Data belum lengkap",
      });
    }

    if (kriteria1Id === kriteria2Id) {
      return res.status(400).json({
        success: false,
        message: "Kriteria tidak boleh sama",
      });
    }

    const exist = await prisma.perbandinganKriteria.findFirst({
      where: {
        kriteria1Id,
        kriteria2Id,
      },
    });

    if (exist) {
      return res.status(400).json({
        success: false,
        message: "Perbandingan sudah ada",
      });
    }

    const data = await prisma.perbandinganKriteria.create({
      data: {
        kriteria1Id,
        kriteria2Id,
        nilai,
        rekomendasiId: req.body.rekomendasiId,
      },
    });

    res.status(201).json({
      success: true,
      message: "Perbandingan berhasil ditambahkan",
      data,
    });

  } catch (error) {

    console.error(error);

    res.status(500).json({
      success: false,
      message: "Gagal menambahkan data",
    });

  }

};

// ==========================
// UPDATE
// ==========================
export const updatePerbandinganKriteria = async (
  req: Request,
  res: Response
) => {

  try {

    const id = Number(req.params.id);

    const { nilai } = req.body;

    const data = await prisma.perbandinganKriteria.update({
      where: {
        id,
      },
      data: {
        nilai,
      },
    });

    res.json({
      success: true,
      message: "Perbandingan berhasil diupdate",
      data,
    });

  } catch (error) {

    console.error(error);

    res.status(500).json({
      success: false,
      message: "Gagal update data",
    });

  }

};

// ==========================
// DELETE
// ==========================
export const deletePerbandinganKriteria = async (
  req: Request,
  res: Response
) => {

  try {

    const id = Number(req.params.id);

    await prisma.perbandinganKriteria.delete({
      where: {
        id,
      },
    });

    res.json({
      success: true,
      message: "Perbandingan berhasil dihapus",
    });

  } catch (error) {

    console.error(error);

    res.status(500).json({
      success: false,
      message: "Gagal menghapus data",
    });

  }

};