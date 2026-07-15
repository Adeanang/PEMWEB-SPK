import express from "express";

import {
  getKamars,
  getKamarById,
  createKamar,
  updateKamar,
  deleteKamar,
} from "../controllers/kamarControllers";

import { authenticate } from "../middlewares/authMiddlewares";

const router = express.Router();

router.get("/", getKamars);

router.get("/:id", getKamarById);

router.post("/", authenticate, createKamar);

router.put("/:id", authenticate, updateKamar);

router.delete("/:id", authenticate, deleteKamar);

export default router;