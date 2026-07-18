"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const hotelControllers_1 = require("../controllers/hotelControllers");
const authMiddlewares_1 = require("../middlewares/authMiddlewares");
const roleMiddlewares_1 = require("../middlewares/roleMiddlewares");
const router = express_1.default.Router();
// PUBLIC
router.get("/", hotelControllers_1.getHotels);
router.get("/:id", hotelControllers_1.getHotelById);
// ADMIN
router.post("/", authMiddlewares_1.authenticate, roleMiddlewares_1.adminOnly, hotelControllers_1.createHotel);
router.put("/:id", authMiddlewares_1.authenticate, roleMiddlewares_1.adminOnly, hotelControllers_1.updateHotel);
router.delete("/:id", authMiddlewares_1.authenticate, roleMiddlewares_1.adminOnly, hotelControllers_1.deleteHotel);
exports.default = router;
