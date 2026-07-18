"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const authMiddlewares_1 = require("../middlewares/authMiddlewares");
const roleMiddlewares_1 = require("../middlewares/roleMiddlewares");
const userControllers_1 = require("../controllers/userControllers");
const router = express_1.default.Router();
router.get("/profile", authMiddlewares_1.authenticate, userControllers_1.getProfile);
router.get("/", authMiddlewares_1.authenticate, (0, roleMiddlewares_1.authorize)("SUPER_ADMIN", "ADMIN"), userControllers_1.getAllUsers);
router.put("/:id", authMiddlewares_1.authenticate, (0, roleMiddlewares_1.authorize)("SUPER_ADMIN", "ADMIN"), userControllers_1.updateUser);
router.delete("/:id", authMiddlewares_1.authenticate, (0, roleMiddlewares_1.authorize)("SUPER_ADMIN", "ADMIN"), userControllers_1.deleteUser);
exports.default = router;
