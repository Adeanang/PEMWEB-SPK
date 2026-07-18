import express from "express";
import cors from "cors";
import { prisma } from "./config/prisma";

import authRoutes from "./routes/authRoutes";
import hotelRoutes from "./routes/hotelRoutes";
import kategoriRoutes from "./routes/kategoriRoutes";
import kategorikamarRoutes from "./routes/kategorikamarRoutes";
import kamarRoutes from "./routes/kamarRoutes";
import fasilitasHotelRoutes from "./routes/fasilitasHotelRoutes";
import kriteriaRoutes from "./routes/kriteriaRoutes";
import subkriteriaRoutes from "./routes/subkriteriaRoutes";
import hotelKriteriaRoutes from "./routes/hotelKriteriaRoutes";
import recomendationRoutes from "./routes/recomendationRoutes";
import ahpRoutes from "./routes/ahp.Routes";
import userRoutes from "./routes/userRoutes";
import perbandinganRoutes from "./routes/perbandinganKriteriaRoutes";

import { authenticate } from "./middlewares/authMiddlewares";

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Debug request
app.use((req, res, next) => {
  console.log(`${req.method} ${req.originalUrl}`);
  next();
});

// Routes
app.use("/auth", authRoutes);
app.use("/hotels", hotelRoutes);
app.use("/kategori", kategoriRoutes);
app.use("/kategori-kamar", kategorikamarRoutes);
app.use("/kamar", kamarRoutes);
app.use("/fasilitas-hotel", fasilitasHotelRoutes);
app.use("/kriteria", kriteriaRoutes);
app.use("/sub-kriteria", subkriteriaRoutes);
app.use("/hotel-kriteria", hotelKriteriaRoutes);
app.use("/recommendation", recomendationRoutes);
app.use("/api/ahp", ahpRoutes);
app.use("/users", userRoutes);
app.use("/perbandingan", perbandinganRoutes);

app.get("/", (req, res) => {
  res.json({
    message: "Hotel Recommendation API",
  });
});

app.get("/profile", authenticate, (req, res) => {
  res.json((req as any).user);
});

app.get("/test-db", async (req, res) => {
  try {
    const hotels = await prisma.hotel.findMany();

    res.json({
      success: true,
      total: hotels.length,
      data: hotels,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Database gagal terhubung",
    });
  }
});

export default app;