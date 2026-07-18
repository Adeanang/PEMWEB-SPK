"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.hitungAHP = void 0;
const AhpServices_controllers_1 = require("./services/AhpServices.controllers");
const hitungAHP = async (req, res) => {
    try {
        console.log("STEP 1");
        const { rekomendasiId } = req.body;
        console.log("rekomendasiId =", rekomendasiId);
        console.log("STEP 2");
        const result = await (0, AhpServices_controllers_1.calculateAHP)(Number(rekomendasiId));
        console.log("STEP 3");
        return res.json({
            message: "Berhasil",
            data: result,
        });
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({
            message: "Terjadi error"
        });
    }
};
exports.hitungAHP = hitungAHP;
