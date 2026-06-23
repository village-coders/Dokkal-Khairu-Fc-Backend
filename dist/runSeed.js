"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const db_1 = require("./Utils/db");
async function run() {
    console.log("Starting seed script...");
    await (0, db_1.connectDB)();
    console.log("Seed script completed.");
    process.exit(0);
}
run();
