import express from "express";
import {
  getPerbandingan,
  updatePerbandingan,
  deletePerbandingan,
  hitungAHP,
} from "../controllers/ahpControllers";
import { saveAHP } from "../controllers/saveAHPControllers";

const router = express.Router();

router.get("/", getPerbandingan);

router.post("/save", saveAHP);

router.put("/:id", updatePerbandingan);

router.delete("/:id", deletePerbandingan);

router.post("/hitung", hitungAHP);


export default router;