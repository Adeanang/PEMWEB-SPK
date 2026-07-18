"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const fasilitasHotelControllers_1 = require("../controllers/fasilitasHotelControllers");
const authMiddlewares_1 = require("../middlewares/authMiddlewares");
const router = express_1.default.Router();
router.get("/", fasilitasHotelControllers_1.getFasilitasHotels);
router.get("/:id", fasilitasHotelControllers_1.getFasilitasHotelById);
router.post("/", authMiddlewares_1.authenticate, fasilitasHotelControllers_1.createFasilitasHotel);
router.put("/:id", authMiddlewares_1.authenticate, fasilitasHotelControllers_1.updateFasilitasHotel);
router.delete("/:id", authMiddlewares_1.authenticate, fasilitasHotelControllers_1.deleteFasilitasHotel);
exports.default = router;
