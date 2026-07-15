import express from "express";

import {
  getKategoriHotels,
  getKategoriHotelById,
  createKategoriHotel,
  updateKategoriHotel,
  deleteKategoriHotel,
} from "../controllers/kategoriControllers";

import { authenticate } from "../middlewares/authMiddlewares";

const router = express.Router();

router.get("/", getKategoriHotels);

router.get("/:id", getKategoriHotelById);

router.post("/", authenticate, createKategoriHotel);

router.put("/:id", authenticate, updateKategoriHotel);

router.delete("/:id", authenticate, deleteKategoriHotel);

export default router;