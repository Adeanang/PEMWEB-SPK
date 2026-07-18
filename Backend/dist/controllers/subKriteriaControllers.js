"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteSubKriteria = exports.updateSubKriteria = exports.createSubKriteria = exports.getSubKriteriaById = exports.getSubKriterias = void 0;
const prisma_1 = require("../config/prisma");
// ==========================
// GET ALL
// ==========================
const getSubKriterias = async (req, res) => {
    try {
        const subKriterias = await prisma_1.prisma.subKriteria.findMany({
            include: {
                kriteria: true,
            },
            orderBy: {
                kriteriaId: "asc",
            },
        });
        res.json({
            success: true,
            data: subKriterias,
        });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: "Gagal mengambil sub kriteria",
        });
    }
};
exports.getSubKriterias = getSubKriterias;
// ==========================
// GET BY ID
// ==========================
const getSubKriteriaById = async (req, res) => {
    try {
        const id = Number(req.params.id);
        const subKriteria = await prisma_1.prisma.subKriteria.findUnique({
            where: {
                id,
            },
            include: {
                kriteria: true,
            },
        });
        if (!subKriteria) {
            return res.status(404).json({
                success: false,
                message: "Sub kriteria tidak ditemukan",
            });
        }
        res.json({
            success: true,
            data: subKriteria,
        });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: "Gagal mengambil sub kriteria",
        });
    }
};
exports.getSubKriteriaById = getSubKriteriaById;
// ==========================
// CREATE
// ==========================
const createSubKriteria = async (req, res) => {
    try {
        const { kriteriaId, value, skor, } = req.body;
        if (!kriteriaId ||
            !value ||
            skor == null) {
            return res.status(400).json({
                success: false,
                message: "Data belum lengkap",
            });
        }
        const kriteria = await prisma_1.prisma.kriteria.findUnique({
            where: {
                id: kriteriaId,
            },
        });
        if (!kriteria) {
            return res.status(404).json({
                success: false,
                message: "Kriteria tidak ditemukan",
            });
        }
        const exist = await prisma_1.prisma.subKriteria.findFirst({
            where: {
                kriteriaId,
                value,
            },
        });
        if (exist) {
            return res.status(400).json({
                success: false,
                message: "Sub kriteria sudah ada",
            });
        }
        const subKriteria = await prisma_1.prisma.subKriteria.create({
            data: {
                kriteriaId,
                value,
                skor,
            },
        });
        res.status(201).json({
            success: true,
            message: "Sub kriteria berhasil ditambahkan",
            data: subKriteria,
        });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: "Gagal menambahkan sub kriteria",
        });
    }
};
exports.createSubKriteria = createSubKriteria;
// ==========================
// UPDATE
// ==========================
const updateSubKriteria = async (req, res) => {
    try {
        const id = Number(req.params.id);
        const { value, skor, } = req.body;
        const subKriteria = await prisma_1.prisma.subKriteria.update({
            where: {
                id,
            },
            data: {
                value,
                skor,
            },
        });
        res.json({
            success: true,
            message: "Sub kriteria berhasil diupdate",
            data: subKriteria,
        });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: "Gagal update sub kriteria",
        });
    }
};
exports.updateSubKriteria = updateSubKriteria;
// ==========================
// DELETE
// ==========================
const deleteSubKriteria = async (req, res) => {
    try {
        const id = Number(req.params.id);
        await prisma_1.prisma.subKriteria.delete({
            where: {
                id,
            },
        });
        res.json({
            success: true,
            message: "Sub kriteria berhasil dihapus",
        });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: "Gagal menghapus sub kriteria",
        });
    }
};
exports.deleteSubKriteria = deleteSubKriteria;
