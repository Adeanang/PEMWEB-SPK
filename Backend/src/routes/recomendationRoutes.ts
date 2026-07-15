import { Router } from "express";
import { getRecommendation } from ".././controllers/recomendationControllers";
import { authenticate, verifyToken } from "../middlewares/authMiddlewares";

const router = Router();

router.post("/", authenticate, getRecommendation);

export default router;