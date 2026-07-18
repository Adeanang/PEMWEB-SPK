"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteKategoriHotel = exports.updateKategoriHotel = exports.createKategoriHotel = exports.getKategoriHotelById = exports.getKategoriHotels = void 0;
const prisma_1 = require("../config/prisma");
// ==========================
// GET ALL
// ==========================
const getKategoriHotels = async (req, res) => {
    try {
        const kategoriHotels = await prisma_1.prisma.kategoriHotel.findMany({
            include: {
                hotels: true,
            },
        });
        res.json({
            success: true,
            data: kategoriHotels,
        });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: "Gagal mengambil kategori hotel",
        });
    }
};
exports.getKategoriHotels = getKategoriHotels;
// ==========================
// GET BY ID
// ==========================
const getKategoriHotelById = async (req, res) => {
    try {
        const id = Number(req.params.id);
        const kategoriHotel = await prisma_1.prisma.kategoriHotel.findUnique({
            where: {
                id,
            },
            include: {
                hotels: true,
            },
        });
        if (!kategoriHotel) {
            return res.status(404).json({
                success: false,
                message: "Kategori hotel tidak ditemukan",
            });
        }
        res.json({
            success: true,
            data: kategoriHotel,
        });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: "Gagal mengambil kategori hotel",
        });
    }
};
exports.getKategoriHotelById = getKategoriHotelById;
// ==========================
// CREATE
// ==========================
const createKategoriHotel = async (req, res) => {
    try {
        const { namaKategori } = req.body;
        if (!namaKategori) {
            return res.status(400).json({
                success: false,
                message: "Nama kategori wajib diisi",
            });
        }
        const exist = await prisma_1.prisma.kategoriHotel.findFirst({
            where: {
                namaKategori,
            },
        });
        if (exist) {
            return res.status(400).json({
                success: false,
                message: "Kategori hotel sudah ada",
            });
        }
        const kategoriHotel = await prisma_1.prisma.kategoriHotel.create({
            data: {
                namaKategori,
            },
        });
        res.status(201).json({
            success: true,
            message: "Kategori hotel berhasil ditambahkan",
            data: kategoriHotel,
        });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: "Gagal menambahkan kategori hotel",
        });
    }
};
exports.createKategoriHotel = createKategoriHotel;
// ==========================
// UPDATE
// ==========================
const updateKategoriHotel = async (req, res) => {
    try {
        const id = Number(req.params.id);
        const { namaKategori } = req.body;
        const kategoriHotel = await prisma_1.prisma.kategoriHotel.update({
            where: {
                id,
            },
            data: {
                namaKategori,
            },
        });
        res.json({
            success: true,
            message: "Kategori hotel berhasil diupdate",
            data: kategoriHotel,
        });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: "Gagal update kategori hotel",
        });
    }
};
exports.updateKategoriHotel = updateKategoriHotel;
// ==========================
// DELETE
// ==========================
const deleteKategoriHotel = async (req, res) => {
    try {
        const id = Number(req.params.id);
        const totalHotel = await prisma_1.prisma.hotel.count({
            where: {
                kategoriHotelId: id,
            },
        });
        if (totalHotel > 0) {
            return res.status(400).json({
                success: false,
                message: "Kategori hotel masih digunakan oleh data hotel",
            });
        }
        await prisma_1.prisma.kategoriHotel.delete({
            where: {
                id,
            },
        });
        res.json({
            success: true,
            message: "Kategori hotel berhasil dihapus",
        });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: "Gagal menghapus kategori hotel",
        });
    }
};
exports.deleteKategoriHotel = deleteKategoriHotel;
