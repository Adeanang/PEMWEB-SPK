"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteKriteria = exports.updateKriteria = exports.createKriteria = exports.getKriteriaById = exports.getKriterias = void 0;
const prisma_1 = require("../config/prisma");
// ==========================
// GET ALL
// ==========================
const getKriterias = async (req, res) => {
    try {
        const kriterias = await prisma_1.prisma.kriteria.findMany({
            include: {
                subKriterias: true,
                hotelKriterias: true,
            },
            orderBy: {
                kode: "asc",
            },
        });
        res.json({
            success: true,
            data: kriterias,
        });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: "Gagal mengambil data kriteria",
        });
    }
};
exports.getKriterias = getKriterias;
// ==========================
// GET BY ID
// ==========================
const getKriteriaById = async (req, res) => {
    try {
        const id = Number(req.params.id);
        const kriteria = await prisma_1.prisma.kriteria.findUnique({
            where: {
                id,
            },
            include: {
                subKriterias: true,
                hotelKriterias: true,
            },
        });
        if (!kriteria) {
            return res.status(404).json({
                success: false,
                message: "Kriteria tidak ditemukan",
            });
        }
        res.json({
            success: true,
            data: kriteria,
        });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: "Gagal mengambil kriteria",
        });
    }
};
exports.getKriteriaById = getKriteriaById;
// ==========================
// CREATE
// ==========================
const createKriteria = async (req, res) => {
    try {
        const { kode, nama, bobot, jenis, } = req.body;
        if (!kode ||
            !nama ||
            bobot == null ||
            !jenis) {
            return res.status(400).json({
                success: false,
                message: "Data belum lengkap",
            });
        }
        const exist = await prisma_1.prisma.kriteria.findFirst({
            where: {
                OR: [
                    { kode },
                    { nama },
                ],
            },
        });
        if (exist) {
            return res.status(400).json({
                success: false,
                message: "Kode atau nama kriteria sudah digunakan",
            });
        }
        const kriteria = await prisma_1.prisma.kriteria.create({
            data: {
                kode,
                nama,
                bobot: Number(bobot),
                jenis,
            },
        });
        res.status(201).json({
            success: true,
            message: "Kriteria berhasil ditambahkan",
            data: kriteria,
        });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: "Gagal menambahkan kriteria",
        });
    }
};
exports.createKriteria = createKriteria;
// ==========================
// UPDATE
// ==========================
const updateKriteria = async (req, res) => {
    try {
        const id = Number(req.params.id);
        const { kode, nama, bobot, jenis, } = req.body;
        const kriteria = await prisma_1.prisma.kriteria.update({
            where: {
                id,
            },
            data: {
                kode,
                nama,
                bobot: bobot != null ? Number(bobot) : undefined,
                jenis,
            },
        });
        res.json({
            success: true,
            message: "Kriteria berhasil diupdate",
            data: kriteria,
        });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: "Gagal update kriteria",
        });
    }
};
exports.updateKriteria = updateKriteria;
// ==========================
// DELETE
// ==========================
const deleteKriteria = async (req, res) => {
    try {
        const id = Number(req.params.id);
        const hotel = await prisma_1.prisma.hotelKriteria.count({
            where: {
                kriteriaId: id,
            },
        });
        if (hotel > 0) {
            return res.status(400).json({
                success: false,
                message: "Kriteria masih digunakan hotel",
            });
        }
        await prisma_1.prisma.subKriteria.deleteMany({
            where: {
                kriteriaId: id,
            },
        });
        await prisma_1.prisma.kriteria.delete({
            where: {
                id,
            },
        });
        res.json({
            success: true,
            message: "Kriteria berhasil dihapus",
        });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: "Gagal menghapus kriteria",
        });
    }
};
exports.deleteKriteria = deleteKriteria;
