import express from "express";
import { calculateAHP } from "../controllers/services/AhpServices.controllers";
import { saveAHP } from "../controllers/saveAHPControllers";





const router = express.Router();
router.post(
  "/hitung",
  calculateAHP
);

router.post("/save", saveAHP);


export default router;