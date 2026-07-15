import express from "express";

import {
  getFasilitasHotels,
  getFasilitasHotelById,
  createFasilitasHotel,
  updateFasilitasHotel,
  deleteFasilitasHotel,
} from "../controllers/fasilitasHotelControllers";

import { authenticate } from "../middlewares/authMiddlewares";

const router = express.Router();

router.get("/", getFasilitasHotels);

router.get("/:id", getFasilitasHotelById);

router.post("/", authenticate, createFasilitasHotel);

router.put("/:id", authenticate, updateFasilitasHotel);

router.delete("/:id", authenticate, deleteFasilitasHotel);

export default router;