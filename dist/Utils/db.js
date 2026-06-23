"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.connectDB = connectDB;
const mongoose_1 = __importDefault(require("mongoose"));
const seed_1 = require("./seed");
async function connectDB() {
    const MONGO_URI = process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/dokkal_khairu";
    try {
        if (mongoose_1.default.connection.readyState >= 1) {
            return;
        }
        console.log("Connecting to MongoDB...");
        await mongoose_1.default.connect(MONGO_URI);
        console.log("MongoDB connected successfully.");
        // Seed default admin if empty
        await seedDefaultAdmin();
        // Seed initial news and matches if empty
        await (0, seed_1.seedDataIfEmpty)();
    }
    catch (err) {
        console.error("MongoDB connection error:", err);
    }
}
async function seedDefaultAdmin() {
    try {
        // Dynamically require Admin model to avoid circular dependency
        const { Admin } = await Promise.resolve().then(() => __importStar(require("../model/Admin")));
        const count = await Admin.countDocuments();
        if (count === 0) {
            const bcrypt = await Promise.resolve().then(() => __importStar(require("bcryptjs")));
            const defaultHash = (bcrypt.default || bcrypt).hashSync("password123", 10);
            await Admin.create({
                username: "admin",
                passwordHash: defaultHash
            });
            console.log("Default admin account ('admin' / 'password123') seeded successfully.");
        }
    }
    catch (err) {
        console.error("Error seeding default admin:", err);
    }
}
