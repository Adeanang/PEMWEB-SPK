import { Request, Response } from "express";
import { prisma } from "../config/prisma";

import { calculateAHP } from "./services/AhpServices.controllers";

export const getPerbandingan = async (
  req: Request,
  res: Response
) => {
  try {

    const data =
      await prisma.perbandinganKriteria.findMany({

        include: {
          kriteria1: true,
          kriteria2: true,
        },

        orderBy: {
          id: "asc",
        },

      });

    return res.json(data);

  } catch (err) {

    console.log(err);

    return res.status(500).json({
      message: "Gagal mengambil data",
    });

  }
};

export const createPerbandingan = async (
  req: Request,
  res: Response
) => {

  try {

    const {
      rekomendasiId,
      kriteria1Id,
      kriteria2Id,
      nilai,
    } = req.body;

    const data =
      await prisma.perbandinganKriteria.create({

        data: {

          rekomendasiId,

          kriteria1Id,

          kriteria2Id,

          nilai,

        },

      });

    return res.json(data);

  } catch (err) {

    console.log(err);

    return res.status(500).json({
      message: "Gagal menyimpan",
    });

  }

};

export const updatePerbandingan = async (
  req: Request,
  res: Response
) => {

  try {

    const id = Number(req.params.id);

    const {
      nilai,
    } = req.body;

    const data =
      await prisma.perbandinganKriteria.update({

        where: {
          id,
        },

        data: {
          nilai,
        },

      });

    return res.json(data);

  } catch (err) {

    console.log(err);

    return res.status(500).json({
      message: "Gagal update",
    });

  }

};

export const deletePerbandingan = async (
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

    return res.json({
      message: "Berhasil dihapus",
    });

  } catch (err) {

    console.log(err);

    return res.status(500).json({
      message: "Gagal hapus",
    });

  }

};

export const hitungAHP = async (
  req: Request,
  res: Response
) => {

  try {

    const {
      rekomendasiId,
    } = req.body;

    const result =
      await calculateAHP(
        Number(rekomendasiId)
      );

    return res.json(result);

  } catch (err) {

    console.log(err);

    return res.status(500).json({
      message: "Perhitungan gagal",
    });

  }

};