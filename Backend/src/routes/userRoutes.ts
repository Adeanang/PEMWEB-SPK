import { authenticate } from "../middlewares/authMiddlewares";
import { getProfile } from "../controllers/userControllers";
import router from "./authRoutes";

router.get(
 "/profile",
 authenticate,
 getProfile
);