"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteUser = exports.updateUser = exports.getAllUsers = exports.getProfile = void 0;
const prisma_1 = require("../config/prisma");
const getProfile = async (req, res) => {
    try {
        const userId = req.user.id;
        const user = await prisma_1.prisma.user.findUnique({
            where: {
                id: userId
            },
            select: {
                id: true,
                email: true,
                role: true
            }
        });
        res.json(user);
    }
    catch (error) {
        res.status(500).json({
            message: "Server error"
        });
    }
};
exports.getProfile = getProfile;
const getAllUsers = async (req, res) => {
    try {
        const users = await prisma_1.prisma.user.findMany({
            select: {
                id: true,
                email: true,
                role: true,
            }
        });
        res.json({ success: true, data: users });
    }
    catch (error) {
        res.status(500).json({ success: false, message: "Server error" });
    }
};
exports.getAllUsers = getAllUsers;
const updateUser = async (req, res) => {
    try {
        const { id } = req.params;
        const { email, role } = req.body;
        const user = await prisma_1.prisma.user.update({
            where: { id: Number(id) },
            data: { email, role }
        });
        res.json({ success: true, data: user });
    }
    catch (error) {
        res.status(500).json({ success: false, message: "Failed to update user" });
    }
};
exports.updateUser = updateUser;
const deleteUser = async (req, res) => {
    try {
        const { id } = req.params;
        await prisma_1.prisma.user.delete({ where: { id: Number(id) } });
        res.json({ success: true, message: "User deleted" });
    }
    catch (error) {
        res.status(500).json({ success: false, message: "Failed to delete user" });
    }
};
exports.deleteUser = deleteUser;
