import { Request, Response } from "express";
import { calculateAHP } from "./services/AhpServices.controllers";

export const hitungAHP = async (req: Request, res: Response) => {
  try {
    console.log("STEP 1");

    const { rekomendasiId } = req.body;
    console.log("rekomendasiId =", rekomendasiId);

    console.log("STEP 2");

    const result = await calculateAHP(Number(rekomendasiId));

    console.log("STEP 3");

    return res.json({
      message: "Berhasil",
      data: result,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      message: "Terjadi error"
    });
  }
};