"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteKamar = exports.updateKamar = exports.createKamar = exports.getKamarById = exports.getKamars = void 0;
const prisma_1 = require("../config/prisma");
// ==========================
// GET ALL
// ==========================
const getKamars = async (req, res) => {
    try {
        const kamars = await prisma_1.prisma.kamar.findMany({
            include: {
                hotel: true,
                kategori: true,
            },
        });
        res.json({
            success: true,
            data: kamars,
        });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: "Gagal mengambil data kamar",
        });
    }
};
exports.getKamars = getKamars;
// ==========================
// GET BY ID
// ==========================
const getKamarById = async (req, res) => {
    try {
        const id = Number(req.params.id);
        const kamar = await prisma_1.prisma.kamar.findUnique({
            where: { id },
            include: {
                hotel: true,
                kategori: true,
            },
        });
        if (!kamar) {
            return res.status(404).json({
                success: false,
                message: "Kamar tidak ditemukan",
            });
        }
        res.json({
            success: true,
            data: kamar,
        });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: "Gagal mengambil kamar",
        });
    }
};
exports.getKamarById = getKamarById;
// ==========================
// CREATE
// ==========================
const createKamar = async (req, res) => {
    try {
        const { hotelId, kategoriId, nomorKamar, } = req.body;
        if (!hotelId ||
            !kategoriId ||
            !nomorKamar) {
            return res.status(400).json({
                success: false,
                message: "Data kamar belum lengkap",
            });
        }
        const kategori = await prisma_1.prisma.kategoriKamar.findUnique({
            where: {
                id: kategoriId,
            },
        });
        if (!kategori) {
            return res.status(404).json({
                success: false,
                message: "Kategori kamar tidak ditemukan",
            });
        }
        const exist = await prisma_1.prisma.kamar.findFirst({
            where: {
                nomorKamar,
                hotelId,
            },
        });
        if (exist) {
            return res.status(400).json({
                success: false,
                message: "Nomor kamar sudah digunakan",
            });
        }
        const kamar = await prisma_1.prisma.kamar.create({
            data: {
                hotelId,
                kategoriId,
                nomorKamar,
            },
        });
        res.status(201).json({
            success: true,
            message: "Kamar berhasil ditambahkan",
            data: kamar,
        });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: "Gagal menambahkan kamar",
        });
    }
};
exports.createKamar = createKamar;
// ==========================
// UPDATE
// ==========================
const updateKamar = async (req, res) => {
    try {
        const id = Number(req.params.id);
        const { kategoriId, nomorKamar, } = req.body;
        const kamar = await prisma_1.prisma.kamar.update({
            where: {
                id,
            },
            data: {
                kategoriId,
                nomorKamar,
            },
        });
        res.json({
            success: true,
            message: "Kamar berhasil diupdate",
            data: kamar,
        });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: "Gagal update kamar",
        });
    }
};
exports.updateKamar = updateKamar;
// ==========================
// DELETE
// ==========================
const deleteKamar = async (req, res) => {
    try {
        const id = Number(req.params.id);
        await prisma_1.prisma.kamar.delete({
            where: {
                id,
            },
        });
        res.json({
            success: true,
            message: "Kamar berhasil dihapus",
        });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: "Gagal menghapus kamar",
        });
    }
};
exports.deleteKamar = deleteKamar;
