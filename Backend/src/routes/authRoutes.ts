import { Router } from "express";
import { login, register } from "../controllers/authControllers";
import { authenticate } from "../middlewares/authMiddlewares";
import { authorize } from "../middlewares/roleMiddlewares";

const router = Router();

router.post("/login", login);
router.post("/register", register);
router.post(
  "/hotel",
  authenticate,
  authorize("SUPER_ADMIN", "ADMIN"),
  (req, res) => {
    res.json({
      message: "Berhasil masuk route hotel",
      user: (req as any).user,
    });
  }
);

export default router;
