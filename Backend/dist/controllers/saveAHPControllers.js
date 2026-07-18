"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.saveAHP = void 0;
const saveAhp_service_1 = require("./services/saveAhp.service");
const saveAHP = async (req, res) => {
    try {
        const { rekomendasiId, comparisons } = req.body;
        if (!comparisons || comparisons.length === 0) {
            return res.status(400).json({
                message: "Perbandingan kosong"
            });
        }
        await (0, saveAhp_service_1.savePerbandingan)(Number(rekomendasiId), comparisons);
        return res.json({
            message: "Berhasil menyimpan perbandingan"
        });
    }
    catch (err) {
        return res.status(500).json({
            message: err.message
        });
    }
};
exports.saveAHP = saveAHP;
