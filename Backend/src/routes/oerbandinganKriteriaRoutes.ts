import express from "express";

import {
  getPerbandinganKriterias,
  getPerbandinganById,
  createPerbandinganKriteria,
  updatePerbandinganKriteria,
  deletePerbandinganKriteria,
} from "../controllers/perbandinganKriteriaRoutes";

import { authenticate } from "../middlewares/authMiddlewares";

const router = express.Router();

router.get("/", getPerbandinganKriterias);

router.get("/:id", getPerbandinganById);

router.post("/", authenticate, createPerbandinganKriteria);

router.put("/:id", authenticate, updatePerbandinganKriteria);

router.delete("/:id", authenticate, deletePerbandinganKriteria);

export default router;