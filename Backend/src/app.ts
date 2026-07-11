import express from "express"
import cors from "cors";

const app = express();

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);

app.use(express.json());

app.get("/", (_, res) => {
  res.json({
    message: "Backend running successfully",
  });
});

export default app;