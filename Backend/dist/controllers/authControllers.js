"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.register = exports.login = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
const prisma_1 = require("../config/prisma");
const jwt_1 = require("../utils/jwt");
const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await prisma_1.prisma.user.findUnique({
            where: {
                email,
            },
        });
        if (!user) {
            return res.status(404).json({
                message: "User tidak ditemukan",
            });
        }
        const validPassword = await bcrypt_1.default.compare(password, user.password);
        if (!validPassword) {
            return res.status(401).json({
                message: "Password salah",
            });
        }
        const token = (0, jwt_1.generateToken)({
            id: user.id,
            email: user.email,
            role: user.role,
        });
        const { password: _, ...userWithoutPassword } = user;
        res.json({
            message: "Login berhasil",
            token,
            user: userWithoutPassword,
        });
    }
    catch (error) {
        res.status(500).json(error);
    }
};
exports.login = login;
const register = async (req, res) => {
    try {
        const { email, password, role } = req.body;
        const exist = await prisma_1.prisma.user.findUnique({
            where: { email },
        });
        if (exist) {
            return res.status(400).json({
                message: "Email sudah digunakan",
            });
        }
        const hash = await bcrypt_1.default.hash(password, 10);
        const user = await prisma_1.prisma.user.create({
            data: {
                email,
                password: hash,
                role,
            },
        });
        const { password: _, ...userWithoutPassword } = user;
        res.status(201).json({
            message: "Register berhasil",
            data: userWithoutPassword,
        });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({
            message: "Internal Server Error",
        });
    }
};
exports.register = register;
