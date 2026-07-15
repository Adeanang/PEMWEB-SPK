import express from "express";

import {
  getSubKriterias,
  getSubKriteriaById,
  createSubKriteria,
  updateSubKriteria,
  deleteSubKriteria,
} from "../controllers/subKriteriaControllers";

import { authenticate } from "../middlewares/authMiddlewares";

const router = express.Router();

router.get("/", getSubKriterias);

router.get("/:id", getSubKriteriaById);

router.post("/", authenticate, createSubKriteria);

router.put("/:id", authenticate, updateSubKriteria);

router.delete("/:id", authenticate, deleteSubKriteria);

export default router;