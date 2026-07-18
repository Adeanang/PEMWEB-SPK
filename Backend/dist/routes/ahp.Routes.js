"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const AhpServices_controllers_1 = require("../controllers/services/AhpServices.controllers");
const saveAHPControllers_1 = require("../controllers/saveAHPControllers");
const router = express_1.default.Router();
router.post("/hitung", AhpServices_controllers_1.calculateAHP);
router.post("/save", saveAHPControllers_1.saveAHP);
exports.default = router;
