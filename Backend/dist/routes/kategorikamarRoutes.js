"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const kategorikamarControllers_1 = require("../controllers/kategorikamarControllers");
const authMiddlewares_1 = require("../middlewares/authMiddlewares");
const router = express_1.default.Router();
router.get("/", kategorikamarControllers_1.getKategoriKamars);
router.get("/:id", kategorikamarControllers_1.getKategoriKamarById);
router.post("/", authMiddlewares_1.authenticate, kategorikamarControllers_1.createKategoriKamar);
router.put("/:id", authMiddlewares_1.authenticate, kategorikamarControllers_1.updateKategoriKamar);
router.delete("/:id", authMiddlewares_1.authenticate, kategorikamarControllers_1.deleteKategoriKamar);
exports.default = router;
