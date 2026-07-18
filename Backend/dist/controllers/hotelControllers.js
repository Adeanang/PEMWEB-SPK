"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteHotel = exports.updateHotel = exports.createHotel = exports.getHotelById = exports.getHotels = void 0;
const prisma_1 = require("../config/prisma");
// ==========================
// GET ALL HOTEL
// ==========================
const getHotels = async (req, res) => {
    try {
        const hotels = await prisma_1.prisma.hotel.findMany({
            include: {
                kategoriHotel: true,
                kategoriKamars: true,
                fasilitasHotels: true,
                hotelKriterias: {
                    include: {
                        kriteria: true,
                    },
                },
            },
        });
        res.json({
            success: true,
            data: hotels,
        });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({
            message: "Gagal mengambil data hotel",
        });
    }
};
exports.getHotels = getHotels;
// ==========================
// GET HOTEL BY ID
// ==========================
const getHotelById = async (req, res) => {
    try {
        const id = Number(req.params.id);
        const hotel = await prisma_1.prisma.hotel.findUnique({
            where: { id },
            include: {
                kategoriHotel: true,
                kategoriKamars: true,
                fasilitasHotels: true,
                hotelKriterias: {
                    include: {
                        kriteria: true,
                    },
                },
            },
        });
        if (!hotel) {
            return res.status(404).json({
                message: "Hotel tidak ditemukan",
            });
        }
        res.json({
            success: true,
            data: hotel,
        });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({
            message: "Gagal mengambil detail hotel",
        });
    }
};
exports.getHotelById = getHotelById;
// ==========================
// CREATE HOTEL
// ==========================
const createHotel = async (req, res) => {
    try {
        const { name, location, sosialMedia, imageHotel, lat, lng, kategoriHotelId, kriteria, } = req.body;
        if (!name || !location || !kategoriHotelId) {
            return res.status(400).json({
                message: "Data hotel belum lengkap",
            });
        }
        const user = req.user;
        const result = await prisma_1.prisma.$transaction(async (tx) => {
            const hotel = await tx.hotel.create({
                data: {
                    name,
                    location,
                    sosialMedia,
                    imageHotel,
                    lat,
                    lng,
                    kategoriHotelId,
                    userId: user.id,
                },
            });
            if (Array.isArray(kriteria) && kriteria.length > 0) {
                await tx.hotelKriteria.createMany({
                    data: kriteria.map((item) => ({
                        hotelId: hotel.id,
                        kriteriaId: item.kriteriaId,
                        nilai: item.nilai,
                    })),
                });
            }
            return hotel;
        });
        res.status(201).json({
            message: "Hotel berhasil ditambahkan",
            data: result,
        });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({
            message: "Gagal menambahkan hotel",
        });
    }
};
exports.createHotel = createHotel;
// ==========================
// UPDATE HOTEL
// ==========================
const updateHotel = async (req, res) => {
    try {
        const id = Number(req.params.id);
        const { name, location, sosialMedia, imageHotel, lat, lng, kategoriHotelId, } = req.body;
        const hotel = await prisma_1.prisma.hotel.update({
            where: { id },
            data: {
                name,
                location,
                sosialMedia,
                imageHotel,
                lat,
                lng,
                kategoriHotelId,
            },
        });
        res.json({
            message: "Hotel berhasil diupdate",
            data: hotel,
        });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({
            message: "Gagal update hotel",
        });
    }
};
exports.updateHotel = updateHotel;
// ==========================
// DELETE HOTEL
// ==========================
const deleteHotel = async (req, res) => {
    try {
        const id = Number(req.params.id);
        await prisma_1.prisma.$transaction(async (tx) => {
            await tx.hotelKriteria.deleteMany({
                where: {
                    hotelId: id,
                },
            });
            await tx.fasilitasHotel.deleteMany({
                where: {
                    hotelId: id,
                },
            });
            await tx.kategoriKamar.deleteMany({
                where: {
                    hotelId: id,
                },
            });
            await tx.hotel.delete({
                where: {
                    id,
                },
            });
        });
        res.json({
            message: "Hotel berhasil dihapus",
        });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({
            message: "Gagal menghapus hotel",
        });
    }
};
exports.deleteHotel = deleteHotel;
