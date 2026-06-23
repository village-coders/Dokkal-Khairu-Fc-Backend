import express from "express";
import path from "path";
import fs from "fs";
import dotenv from "dotenv";
import cors from "cors";
import morgan from "morgan";
import { connectDB } from "./Utils/db";
import masterRouter from "./Router/index";
import { Request, Response } from "express";

dotenv.config();

const app = express();
const PORT = parseInt(process.env.PORT || "3001");

// Request logging middleware
app.use(morgan("dev"));

// Configure CORS
const FRONTEND_URL = process.env.FRONTEND_URL || "http://localhost:5173";
app.use(cors({
  origin: FRONTEND_URL,
  credentials: true
}));

// 1. Setup request parsing limit (important for base64 images upload)
app.use(express.json({ limit: "15mb" }));
app.use(express.urlencoded({ extended: true, limit: "15mb" }));

// 2. Connect to MongoDB
connectDB();

// 3. Mount Backend API Routes
app.use("/api", masterRouter);

app.get("/", (req: Request, res: Response) => {
  res.send("Dokkal Khairu Football Club backend is online.");
});

// 4. Serve uploads statically
const UPLOADS_DIR = path.join(process.cwd(), "public", "uploads");
if (!fs.existsSync(UPLOADS_DIR)) {
  fs.mkdirSync(UPLOADS_DIR, { recursive: true });
}
app.use("/uploads", express.static(UPLOADS_DIR));

app.listen(PORT, () => {
  console.log(`[Server] Dokkal Khairu Football Club backend is online.`);
  console.log(`[Server] Listening on http://localhost:${PORT}`);
});
