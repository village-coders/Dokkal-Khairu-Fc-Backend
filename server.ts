import express from "express";
import path from "path";
import fs from "fs";
import dotenv from "dotenv";
import cors from "cors";
import { connectDB } from "./Utils/db";
import masterRouter from "./Router/index";
import { Request, Response, NextFunction } from "express";

dotenv.config();

const app = express();
const PORT = parseInt(process.env.PORT || "3001");

// Configure CORS — allow multiple origins for flexibility
const allowedOrigins = [
  process.env.FRONTEND_URL || "http://localhost:5173",
  "https://dokkal-khairu-fc.vercel.app",
  "http://localhost:5173",
  "http://localhost:3000",
];
app.use(cors({
  origin: (origin, callback) => {
    // Allow requests with no origin (e.g. curl, mobile apps)
    if (!origin) return callback(null, true);
    if (allowedOrigins.includes(origin)) return callback(null, true);
    callback(new Error(`CORS: origin ${origin} not allowed`));
  },
  credentials: true
}));

// 1. Setup request parsing limit (important for base64 images upload)
app.use(express.json({ limit: "15mb" }));
app.use(express.urlencoded({ extended: true, limit: "15mb" }));

// 2. Ensure DB connection on every request (safe for serverless cold-starts)
let dbConnected = false;
app.use(async (_req: Request, _res: Response, next: NextFunction) => {
  if (!dbConnected) {
    await connectDB();
    dbConnected = true;
  }
  next();
});

// 3. Health-check route
app.get("/", (_req: Request, res: Response) => {
  res.json({ status: "ok", message: "Dokkal Khairu Football Club backend is online." });
});

// 4. Mount Backend API Routes
app.use("/api", masterRouter);

// 5. Serve uploads statically (only meaningful in non-serverless environments)
try {
  const UPLOADS_DIR = path.join(process.cwd(), "public", "uploads");
  if (!fs.existsSync(UPLOADS_DIR)) {
    fs.mkdirSync(UPLOADS_DIR, { recursive: true });
  }
  app.use("/uploads", express.static(UPLOADS_DIR));
} catch {
  // Ignore in read-only serverless filesystems
}

// Export app for Vercel serverless (default export required by @vercel/node)
export default app;

// Only call listen when running locally (not in Vercel serverless)
if (process.env.NODE_ENV !== "production") {
  app.listen(PORT, () => {
    console.log(`[Server] Dokkal Khairu Football Club backend is online.`);
    console.log(`[Server] Listening on http://localhost:${PORT}`);
  });
}
