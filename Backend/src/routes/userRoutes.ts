import express from "express";
import { authenticate } from "../middlewares/authMiddlewares";
import { authorize } from "../middlewares/roleMiddlewares";
import { getProfile, getAllUsers, updateUser, deleteUser } from "../controllers/userControllers";

const router = express.Router();

router.get("/users", authenticate, getProfile);
router.get("/", authenticate, authorize("SUPER_ADMIN", "ADMIN"), getAllUsers);
router.put("/:id", authenticate, authorize("SUPER_ADMIN", "ADMIN"), updateUser);
router.delete("/:id", authenticate, authorize("SUPER_ADMIN", "ADMIN"), deleteUser);

export default router;