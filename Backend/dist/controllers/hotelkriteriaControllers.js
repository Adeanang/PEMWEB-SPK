"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteHotelKriteria = exports.updateHotelKriteria = exports.createHotelKriteria = exports.getHotelKriteriaByHotel = exports.getHotelKriterias = void 0;
const prisma_1 = require("../config/prisma");
// ==========================
// GET ALL
// ==========================
const getHotelKriterias = async (req, res) => {
    try {
        const data = await prisma_1.prisma.hotelKriteria.findMany({
            include: {
                hotel: true,
                kriteria: true,
            },
            orderBy: {
                hotelId: "asc",
            },
        });
        res.json({
            success: true,
            data,
        });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: "Gagal mengambil data hotel kriteria",
        });
    }
};
exports.getHotelKriterias = getHotelKriterias;
// ==========================
// GET BY HOTEL
// ==========================
const getHotelKriteriaByHotel = async (req, res) => {
    try {
        const hotelId = Number(req.params.hotelId);
        const data = await prisma_1.prisma.hotelKriteria.findMany({
            where: {
                hotelId,
            },
            include: {
                kriteria: true,
            },
        });
        res.json({
            success: true,
            data,
        });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: "Gagal mengambil data hotel",
        });
    }
};
exports.getHotelKriteriaByHotel = getHotelKriteriaByHotel;
// ==========================
// CREATE
// ==========================
const createHotelKriteria = async (req, res) => {
    try {
        const { hotelId, kriteriaId, nilai, } = req.body;
        if (!hotelId ||
            !kriteriaId ||
            nilai == null) {
            return res.status(400).json({
                success: false,
                message: "Data belum lengkap",
            });
        }
        const exist = await prisma_1.prisma.hotelKriteria.findFirst({
            where: {
                hotelId,
                kriteriaId,
            },
        });
        if (exist) {
            return res.status(400).json({
                success: false,
                message: "Nilai hotel untuk kriteria ini sudah ada",
            });
        }
        const data = await prisma_1.prisma.hotelKriteria.create({
            data: {
                hotelId,
                kriteriaId,
                nilai,
            },
        });
        res.status(201).json({
            success: true,
            message: "Nilai hotel berhasil ditambahkan",
            data,
        });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: "Gagal menambahkan nilai hotel",
        });
    }
};
exports.createHotelKriteria = createHotelKriteria;
// ==========================
// UPDATE
// ==========================
const updateHotelKriteria = async (req, res) => {
    try {
        const id = Number(req.params.id);
        const { nilai, } = req.body;
        const data = await prisma_1.prisma.hotelKriteria.update({
            where: {
                id,
            },
            data: {
                nilai,
            },
        });
        res.json({
            success: true,
            message: "Nilai hotel berhasil diupdate",
            data,
        });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: "Gagal update nilai hotel",
        });
    }
};
exports.updateHotelKriteria = updateHotelKriteria;
// ==========================
// DELETE
// ==========================
const deleteHotelKriteria = async (req, res) => {
    try {
        const id = Number(req.params.id);
        await prisma_1.prisma.hotelKriteria.delete({
            where: {
                id,
            },
        });
        res.json({
            success: true,
            message: "Nilai hotel berhasil dihapus",
        });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: "Gagal menghapus nilai hotel",
        });
    }
};
exports.deleteHotelKriteria = deleteHotelKriteria;
