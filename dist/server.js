"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
const dotenv_1 = __importDefault(require("dotenv"));
const cors_1 = __importDefault(require("cors"));
const db_1 = require("./Utils/db");
const index_1 = __importDefault(require("./Router/index"));
dotenv_1.default.config();
const app = (0, express_1.default)();
const PORT = parseInt(process.env.PORT || "3001");
// Configure CORS — allow multiple origins for flexibility
const allowedOrigins = [
    process.env.FRONTEND_URL || "http://localhost:5173",
    "https://dokkal-khairu-fc.vercel.app",
    "http://localhost:5173",
    "http://localhost:3000",
];
app.use((0, cors_1.default)({
    origin: (origin, callback) => {
        // Allow requests with no origin (e.g. curl, mobile apps)
        if (!origin)
            return callback(null, true);
        if (allowedOrigins.includes(origin))
            return callback(null, true);
        callback(new Error(`CORS: origin ${origin} not allowed`));
    },
    credentials: true
}));
// 1. Setup request parsing limit (important for base64 images upload)
app.use(express_1.default.json({ limit: "15mb" }));
app.use(express_1.default.urlencoded({ extended: true, limit: "15mb" }));
// 2. Ensure DB connection on every request (safe for serverless cold-starts)
let dbConnected = false;
app.use(async (_req, _res, next) => {
    if (!dbConnected) {
        await (0, db_1.connectDB)();
        dbConnected = true;
    }
    next();
});
// 3. Health-check route
app.get("/", (_req, res) => {
    res.json({ status: "ok", message: "Dokkal Khairu Football Club backend is online." });
});
// 4. Mount Backend API Routes
app.use("/api", index_1.default);
// 5. Serve uploads statically (only meaningful in non-serverless environments)
try {
    const UPLOADS_DIR = path_1.default.join(process.cwd(), "public", "uploads");
    if (!fs_1.default.existsSync(UPLOADS_DIR)) {
        fs_1.default.mkdirSync(UPLOADS_DIR, { recursive: true });
    }
    app.use("/uploads", express_1.default.static(UPLOADS_DIR));
}
catch {
    // Ignore in read-only serverless filesystems
}
// Export app for Vercel serverless (default export required by @vercel/node)
exports.default = app;
// Only call listen when running locally (not in Vercel serverless)
if (process.env.NODE_ENV !== "production") {
    app.listen(PORT, () => {
        console.log(`[Server] Dokkal Khairu Football Club backend is online.`);
        console.log(`[Server] Listening on http://localhost:${PORT}`);
    });
}
