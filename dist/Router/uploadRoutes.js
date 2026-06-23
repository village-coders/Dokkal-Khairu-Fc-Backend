"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const auth_1 = require("../Middlewares/auth");
const cloudinary_1 = require("cloudinary");
const router = (0, express_1.Router)();
const UPLOADS_DIR = path_1.default.join(process.cwd(), "frontend", "public", "uploads");
// Ensure upload directory exists for local fallback
if (!fs_1.default.existsSync(UPLOADS_DIR)) {
    fs_1.default.mkdirSync(UPLOADS_DIR, { recursive: true });
}
// Configure Cloudinary if credentials are provided in env
if (process.env.CLOUDINARY_CLOUD_NAME && process.env.CLOUDINARY_API_KEY && process.env.CLOUDINARY_API_SECRET) {
    cloudinary_1.v2.config({
        cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
        api_key: process.env.CLOUDINARY_API_KEY,
        api_secret: process.env.CLOUDINARY_API_SECRET
    });
    console.log("[Upload] Cloudinary configured successfully.");
}
else {
    console.warn("[Upload] Cloudinary credentials missing. Falling back to local disk storage.");
}
router.post("/", auth_1.verifyAdminToken, async (req, res) => {
    try {
        const { imageBase64, filename } = req.body;
        if (!imageBase64) {
            return res.status(400).json({ error: "Missing image file base64 data." });
        }
        // 1. Try Cloudinary if configured
        if (process.env.CLOUDINARY_CLOUD_NAME && process.env.CLOUDINARY_API_KEY && process.env.CLOUDINARY_API_SECRET) {
            try {
                console.log("[Upload] Initiating Cloudinary upload...");
                const uploadRes = await cloudinary_1.v2.uploader.upload(imageBase64, {
                    folder: "dokkal_khairu_fc",
                    resource_type: "auto"
                });
                console.log("[Upload] Cloudinary upload success:", uploadRes.secure_url);
                return res.json({ url: uploadRes.secure_url });
            }
            catch (cloudinaryErr) {
                console.error("[Upload] Cloudinary upload failed, falling back to local:", cloudinaryErr.message || cloudinaryErr);
            }
        }
        // 2. Local upload fallback
        const matches = imageBase64.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/);
        if (!matches || matches.length !== 3) {
            // If it's already a full URL or plain base64
            return res.json({ url: imageBase64 });
        }
        const type = matches[1];
        const buffer = Buffer.from(matches[2], "base64");
        const extension = type.split("/")[1] || "png";
        const newFilename = `${Date.now()}-${filename || "image"}.${extension}`;
        const filePath = path_1.default.join(UPLOADS_DIR, newFilename);
        fs_1.default.writeFileSync(filePath, buffer);
        const returnUrl = `/uploads/${newFilename}`;
        return res.json({ url: returnUrl });
    }
    catch (err) {
        return res.status(500).json({ error: err.message || "Failed to upload image." });
    }
});
exports.default = router;
