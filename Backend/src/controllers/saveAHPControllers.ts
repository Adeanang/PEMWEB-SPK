import { Request, Response } from "express";
import { savePerbandingan } from "./services/saveAhp.service";

export const saveAHP = async (
  req: Request,
  res: Response
) => {

  try {

    const {
      rekomendasiId,
      comparisons
    } = req.body;

    if (!comparisons || comparisons.length === 0) {
      return res.status(400).json({
        message: "Perbandingan kosong"
      });
    }

    await savePerbandingan(
      Number(rekomendasiId),
      comparisons
    );

    return res.json({
      message: "Berhasil menyimpan perbandingan"
    });

  } catch (err: any) {

    return res.status(500).json({
      message: err.message
    });

  }

};