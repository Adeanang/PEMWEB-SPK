"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const kategoriControllers_1 = require("../controllers/kategoriControllers");
const authMiddlewares_1 = require("../middlewares/authMiddlewares");
const router = express_1.default.Router();
router.get("/", kategoriControllers_1.getKategoriHotels);
router.get("/:id", kategoriControllers_1.getKategoriHotelById);
router.post("/", authMiddlewares_1.authenticate, kategoriControllers_1.createKategoriHotel);
router.put("/:id", authMiddlewares_1.authenticate, kategoriControllers_1.updateKategoriHotel);
router.delete("/:id", authMiddlewares_1.authenticate, kategoriControllers_1.deleteKategoriHotel);
exports.default = router;
