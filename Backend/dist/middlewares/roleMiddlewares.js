"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.adminOnly = exports.authorize = void 0;
const authorize = (...roles) => (req, res, next) => {
    const user = req.user;
    if (!user) {
        return res.status(401).json({
            message: "Unauthorized",
        });
    }
    if (!roles.includes(user.role)) {
        return res.status(403).json({
            message: "Forbidden",
        });
    }
    next();
};
exports.authorize = authorize;
const adminOnly = (req, res, next) => {
    const user = req.user;
    if (!user) {
        return res.status(401).json({
            message: "Belum login",
        });
    }
    if (user.role !== "ADMIN" && user.role !== "SUPER_ADMIN") {
        return res.status(403).json({
            message: "Akses hanya untuk admin",
        });
    }
    next();
};
exports.adminOnly = adminOnly;
