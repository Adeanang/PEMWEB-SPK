"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const recomendationControllers_1 = require(".././controllers/recomendationControllers");
const authMiddlewares_1 = require("../middlewares/authMiddlewares");
const router = (0, express_1.Router)();
router.post("/", authMiddlewares_1.authenticate, recomendationControllers_1.getRecommendation);
exports.default = router;
