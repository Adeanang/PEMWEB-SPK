"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteFasilitasHotel = exports.updateFasilitasHotel = exports.createFasilitasHotel = exports.getFasilitasHotelById = exports.getFasilitasHotels = void 0;
const prisma_1 = require("../config/prisma");
// ==========================
// GET ALL
// ==========================
const getFasilitasHotels = async (req, res) => {
    try {
        const fasilitas = await prisma_1.prisma.fasilitasHotel.findMany({
            include: {
                hotel: true,
            },
        });
        res.json({
            success: true,
            data: fasilitas,
        });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: "Gagal mengambil fasilitas hotel",
        });
    }
};
exports.getFasilitasHotels = getFasilitasHotels;
// ==========================
// GET BY ID
// ==========================
const getFasilitasHotelById = async (req, res) => {
    try {
        const id = Number(req.params.id);
        const fasilitas = await prisma_1.prisma.fasilitasHotel.findUnique({
            where: {
                id,
            },
            include: {
                hotel: true,
            },
        });
        if (!fasilitas) {
            return res.status(404).json({
                success: false,
                message: "Fasilitas tidak ditemukan",
            });
        }
        res.json({
            success: true,
            data: fasilitas,
        });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: "Gagal mengambil fasilitas hotel",
        });
    }
};
exports.getFasilitasHotelById = getFasilitasHotelById;
// ==========================
// CREATE
// ==========================
const createFasilitasHotel = async (req, res) => {
    try {
        const { hotelId, fasilitas, } = req.body;
        if (!hotelId || !fasilitas) {
            return res.status(400).json({
                success: false,
                message: "Data belum lengkap",
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
        const data = await prisma_1.prisma.fasilitasHotel.create({
            data: {
                hotelId,
                fasilitas,
            },
        });
        res.status(201).json({
            success: true,
            message: "Fasilitas berhasil ditambahkan",
            data,
        });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: "Gagal menambahkan fasilitas",
        });
    }
};
exports.createFasilitasHotel = createFasilitasHotel;
// ==========================
// UPDATE
// ==========================
const updateFasilitasHotel = async (req, res) => {
    try {
        const id = Number(req.params.id);
        const { fasilitas } = req.body;
        const data = await prisma_1.prisma.fasilitasHotel.update({
            where: {
                id,
            },
            data: {
                fasilitas,
            },
        });
        res.json({
            success: true,
            message: "Fasilitas berhasil diupdate",
            data,
        });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: "Gagal update fasilitas",
        });
    }
};
exports.updateFasilitasHotel = updateFasilitasHotel;
// ==========================
// DELETE
// ==========================
const deleteFasilitasHotel = async (req, res) => {
    try {
        const id = Number(req.params.id);
        await prisma_1.prisma.fasilitasHotel.delete({
            where: {
                id,
            },
        });
        res.json({
            success: true,
            message: "Fasilitas berhasil dihapus",
        });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: "Gagal menghapus fasilitas",
        });
    }
};
exports.deleteFasilitasHotel = deleteFasilitasHotel;
