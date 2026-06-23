import dotenv from "dotenv";
dotenv.config();
import { connectDB } from "./Utils/db";
import mongoose from "mongoose";

async function run() {
  console.log("Starting seed script...");
  await connectDB();
  console.log("Seed script completed.");
  process.exit(0);
}

run();
