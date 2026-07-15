import express from "express";

import {
  getKriterias,
  getKriteriaById,
  createKriteria,
  updateKriteria,
  deleteKriteria,
} from "../controllers/kriteriaControllers";

import { authenticate } from "../middlewares/authMiddlewares";

const router = express.Router();

router.get("/", getKriterias);

router.get("/:id", getKriteriaById);

router.post("/", authenticate, createKriteria);

router.put("/:id", authenticate, updateKriteria);

router.delete("/:id", authenticate, deleteKriteria);

export default router;