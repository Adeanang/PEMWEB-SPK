"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteKategoriKamar = exports.updateKategoriKamar = exports.createKategoriKamar = exports.getKategoriKamarById = exports.getKategoriKamars = void 0;
const prisma_1 = require("../config/prisma");
// ==========================
// GET ALL
// ==========================
const getKategoriKamars = async (req, res) => {
    try {
        const kategoriKamars = await prisma_1.prisma.kategoriKamar.findMany({
            include: {
                hotel: true,
                kamars: true,
            },
        });
        res.json({
            success: true,
            data: kategoriKamars,
        });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: "Gagal mengambil kategori kamar",
        });
    }
};
exports.getKategoriKamars = getKategoriKamars;
// ==========================
// GET BY ID
// ==========================
const getKategoriKamarById = async (req, res) => {
    try {
        const id = Number(req.params.id);
        const kategoriKamar = await prisma_1.prisma.kategoriKamar.findUnique({
            where: { id },
            include: {
                hotel: true,
                kamars: true,
            },
        });
        if (!kategoriKamar) {
            return res.status(404).json({
                success: false,
                message: "Kategori kamar tidak ditemukan",
            });
        }
        res.json({
            success: true,
            data: kategoriKamar,
        });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: "Gagal mengambil kategori kamar",
        });
    }
};
exports.getKategoriKamarById = getKategoriKamarById;
// ==========================
// CREATE
// ==========================
const createKategoriKamar = async (req, res) => {
    try {
        const { hotelId, namaKategori, deskripsi, kapasitasOrang, hargaMin, hargaMax, } = req.body;
        if (!hotelId ||
            !namaKategori ||
            !kapasitasOrang ||
            hargaMin == null ||
            hargaMax == null) {
            return res.status(400).json({
                success: false,
                message: "Data kategori kamar belum lengkap",
            });
        }
        const hotel = await prisma_1.prisma.hotel.findUnique({
            where: {
                id: hotelId,
            },
        });
        if (!hotel) {
            return res.status(404).json({
                success: false,
                message: "Hotel tidak ditemukan",
            });
        }
        const kategoriKamar = await prisma_1.prisma.kategoriKamar.create({
            data: {
                hotelId,
                namaKategori,
                deskripsi,
                kapasitasOrang,
                hargaMin,
                hargaMax,
            },
        });
        res.status(201).json({
            success: true,
            message: "Kategori kamar berhasil ditambahkan",
            data: kategoriKamar,
        });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: "Gagal menambahkan kategori kamar",
        });
    }
};
exports.createKategoriKamar = createKategoriKamar;
// ==========================
// UPDATE
// ==========================
const updateKategoriKamar = async (req, res) => {
    try {
        const id = Number(req.params.id);
        const { namaKategori, deskripsi, kapasitasOrang, hargaMin, hargaMax, } = req.body;
        const kategoriKamar = await prisma_1.prisma.kategoriKamar.update({
            where: { id },
            data: {
                namaKategori,
                deskripsi,
                kapasitasOrang,
                hargaMin,
                hargaMax,
            },
        });
        res.json({
            success: true,
            message: "Kategori kamar berhasil diupdate",
            data: kategoriKamar,
        });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: "Gagal update kategori kamar",
        });
    }
};
exports.updateKategoriKamar = updateKategoriKamar;
// ==========================
// DELETE
// ==========================
const deleteKategoriKamar = async (req, res) => {
    try {
        const id = Number(req.params.id);
        const totalKamar = await prisma_1.prisma.kamar.count({
            where: {
                kategoriId: id,
            },
        });
        if (totalKamar > 0) {
            return res.status(400).json({
                success: false,
                message: "Kategori kamar masih digunakan oleh data kamar",
            });
        }
        await prisma_1.prisma.kategoriKamar.delete({
            where: {
                id,
            },
        });
        res.json({
            success: true,
            message: "Kategori kamar berhasil dihapus",
        });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: "Gagal menghapus kategori kamar",
        });
    }
};
exports.deleteKategoriKamar = deleteKategoriKamar;
