"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyToken = exports.authenticate = void 0;
const jwt_1 = require("../utils/jwt");
Object.defineProperty(exports, "verifyToken", { enumerable: true, get: function () { return jwt_1.verifyToken; } });
const authenticate = (req, res, next) => {
    const auth = req.headers.authorization;
    if (!auth || !auth.startsWith("Bearer ")) {
        return res.status(401).json({
            message: "Token tidak ditemukan",
        });
    }
    const token = auth.split(" ")[1];
    try {
        const decoded = (0, jwt_1.verifyToken)(token);
        req.user = decoded;
        next();
    }
    catch (error) {
        return res.status(401).json({
            message: "Token tidak valid",
        });
    }
};
exports.authenticate = authenticate;
