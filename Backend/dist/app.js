"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const prisma_1 = require("./config/prisma");
const authRoutes_1 = __importDefault(require("./routes/authRoutes"));
const hotelRoutes_1 = __importDefault(require("./routes/hotelRoutes"));
const kategoriRoutes_1 = __importDefault(require("./routes/kategoriRoutes"));
const kategorikamarRoutes_1 = __importDefault(require("./routes/kategorikamarRoutes"));
const kamarRoutes_1 = __importDefault(require("./routes/kamarRoutes"));
const fasilitasHotelRoutes_1 = __importDefault(require("./routes/fasilitasHotelRoutes"));
const kriteriaRoutes_1 = __importDefault(require("./routes/kriteriaRoutes"));
const subkriteriaRoutes_1 = __importDefault(require("./routes/subkriteriaRoutes"));
const hotelKriteriaRoutes_1 = __importDefault(require("./routes/hotelKriteriaRoutes"));
const recomendationRoutes_1 = __importDefault(require("./routes/recomendationRoutes"));
const ahp_Routes_1 = __importDefault(require("./routes/ahp.Routes"));
const userRoutes_1 = __importDefault(require("./routes/userRoutes"));
const authMiddlewares_1 = require("./middlewares/authMiddlewares");
const app = (0, express_1.default)();
app.use((0, cors_1.default)());
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
// Debug request
app.use((req, res, next) => {
    console.log(`${req.method} ${req.originalUrl}`);
    next();
});
// Routes
app.use("/auth", authRoutes_1.default);
app.use("/hotels", hotelRoutes_1.default);
app.use("/kategori", kategoriRoutes_1.default);
app.use("/kategori-kamar", kategorikamarRoutes_1.default);
app.use("/kamar", kamarRoutes_1.default);
app.use("/fasilitas-hotel", fasilitasHotelRoutes_1.default);
app.use("/kriteria", kriteriaRoutes_1.default);
app.use("/sub-kriteria", subkriteriaRoutes_1.default);
app.use("/hotel-kriteria", hotelKriteriaRoutes_1.default);
app.use("/recommendation", recomendationRoutes_1.default);
app.use("/api/ahp", ahp_Routes_1.default);
app.use("/users", userRoutes_1.default);
app.get("/", (req, res) => {
    res.json({
        message: "Hotel Recommendation API",
    });
});
app.get("/profile", authMiddlewares_1.authenticate, (req, res) => {
    res.json(req.user);
});
app.get("/test-db", async (req, res) => {
    try {
        const hotels = await prisma_1.prisma.hotel.findMany();
        res.json({
            success: true,
            total: hotels.length,
            data: hotels,
        });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: "Database gagal terhubung",
        });
    }
});
exports.default = app;
