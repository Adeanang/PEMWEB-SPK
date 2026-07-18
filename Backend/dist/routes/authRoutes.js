"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const authControllers_1 = require("../controllers/authControllers");
const authMiddlewares_1 = require("../middlewares/authMiddlewares");
const roleMiddlewares_1 = require("../middlewares/roleMiddlewares");
const router = (0, express_1.Router)();
router.post("/login", authControllers_1.login);
router.post("/register", authControllers_1.register);
router.post("/hotel", authMiddlewares_1.authenticate, (0, roleMiddlewares_1.authorize)("SUPER_ADMIN", "ADMIN"), (req, res) => {
    res.json({
        message: "Berhasil masuk route hotel",
        user: req.user,
    });
});
exports.default = router;
