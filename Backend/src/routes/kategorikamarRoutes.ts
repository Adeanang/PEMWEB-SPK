import express from "express";

import {
  getKategoriKamars,
  getKategoriKamarById,
  createKategoriKamar,
  updateKategoriKamar,
  deleteKategoriKamar,
} from "../controllers/kategorikamarControllers";

import { authenticate } from "../middlewares/authMiddlewares";

const router = express.Router();

router.get("/", getKategoriKamars);

router.get("/:id", getKategoriKamarById);

router.post("/", authenticate, createKategoriKamar);

router.put("/:id", authenticate, updateKategoriKamar);

router.delete("/:id", authenticate, deleteKategoriKamar);

export default router;