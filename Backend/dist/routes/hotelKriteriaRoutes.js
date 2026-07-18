"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const hotelkriteriaControllers_1 = require("../controllers/hotelkriteriaControllers");
const authMiddlewares_1 = require("../middlewares/authMiddlewares");
const router = express_1.default.Router();
router.get("/", hotelkriteriaControllers_1.getHotelKriterias);
router.get("/hotel/:hotelId", hotelkriteriaControllers_1.getHotelKriteriaByHotel);
router.post("/", authMiddlewares_1.authenticate, hotelkriteriaControllers_1.createHotelKriteria);
router.put("/:id", authMiddlewares_1.authenticate, hotelkriteriaControllers_1.updateHotelKriteria);
router.delete("/:id", authMiddlewares_1.authenticate, hotelkriteriaControllers_1.deleteHotelKriteria);
exports.default = router;
