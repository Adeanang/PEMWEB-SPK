"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const kamarControllers_1 = require("../controllers/kamarControllers");
const authMiddlewares_1 = require("../middlewares/authMiddlewares");
const router = express_1.default.Router();
router.get("/", kamarControllers_1.getKamars);
router.get("/:id", kamarControllers_1.getKamarById);
router.post("/", authMiddlewares_1.authenticate, kamarControllers_1.createKamar);
router.put("/:id", authMiddlewares_1.authenticate, kamarControllers_1.updateKamar);
router.delete("/:id", authMiddlewares_1.authenticate, kamarControllers_1.deleteKamar);
exports.default = router;
