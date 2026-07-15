import express from "express";

import {
  getHotelKriterias,
  getHotelKriteriaByHotel,
  createHotelKriteria,
  updateHotelKriteria,
  deleteHotelKriteria,
} from "../controllers/hotelkriteriaControllers";

import { authenticate } from "../middlewares/authMiddlewares";

const router = express.Router();

router.get("/", getHotelKriterias);

router.get("/hotel/:hotelId", getHotelKriteriaByHotel);

router.post("/", authenticate, createHotelKriteria);

router.put("/:id", authenticate, updateHotelKriteria);

router.delete("/:id", authenticate, deleteHotelKriteria);

export default router;