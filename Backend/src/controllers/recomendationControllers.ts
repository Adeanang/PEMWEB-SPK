import { Request, Response } from "express";
import { generateRecommendation } from "./services/recomendationServices";

export const getRecommendation = async (
  req: Request,
  res: Response
) => {

  try {

    const user = (req as any).user;

    const {
      kategoriHotelId,
    } = req.body;

    if (!kategoriHotelId) {
      return res.status(400).json({
        success: false,
        message: "Kategori hotel wajib dipilih",
      });
    }

    const result = await generateRecommendation({
      userId: user.id,
      kategoriHotelId: Number(kategoriHotelId),
    });

    res.json({
      success: true,
      message: "Rekomendasi berhasil dibuat",
      data: result,
    });

  } catch (error) {

    console.error(error);

    res.status(500).json({
      success: false,
      message: "Gagal membuat rekomendasi",
    });

  }

};