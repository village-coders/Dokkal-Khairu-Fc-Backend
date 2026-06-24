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
const morgan_1 = __importDefault(require("morgan"));
const db_1 = require("./Utils/db");
const index_1 = __importDefault(require("./Router/index"));
dotenv_1.default.config();
const app = (0, express_1.default)();
const PORT = parseInt(process.env.PORT || "3001");
// Request logging middleware
app.use((0, morgan_1.default)("dev"));
// Configure CORS
const FRONTEND_URL = process.env.FRONTEND_URL || "http://localhost:5173";
app.use((0, cors_1.default)({
    origin: FRONTEND_URL,
    credentials: true
}));
// 1. Setup request parsing limit (important for base64 images upload)
app.use(express_1.default.json({ limit: "15mb" }));
app.use(express_1.default.urlencoded({ extended: true, limit: "15mb" }));
// 2. Connect to MongoDB
(0, db_1.connectDB)();
// 3. Mount Backend API Routes
app.use("/api", index_1.default);
app.get("/", (req, res) => {
    res.send("Dokkal Khairu Football Club backend is online.");
});
// 4. Serve uploads statically
const UPLOADS_DIR = path_1.default.join(process.cwd(), "public", "uploads");
if (!fs_1.default.existsSync(UPLOADS_DIR)) {
    fs_1.default.mkdirSync(UPLOADS_DIR, { recursive: true });
}
app.use("/uploads", express_1.default.static(UPLOADS_DIR));
app.listen(PORT, () => {
    console.log(`[Server] Dokkal Khairu Football Club backend is online.`);
    console.log(`[Server] Listening on http://localhost:${PORT}`);
});
