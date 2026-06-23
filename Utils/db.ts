import mongoose from "mongoose";
import { seedDataIfEmpty } from "./seed";

export async function connectDB() {
  const MONGO_URI = process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/dokkal_khairu";
  try {
    if (mongoose.connection.readyState >= 1) {
      return;
    }
    
    console.log("Connecting to MongoDB...");
    await mongoose.connect(MONGO_URI);
    console.log("MongoDB connected successfully.");
    
    // Seed default admin if empty
    await seedDefaultAdmin();
    
    // Seed initial news and matches if empty
    await seedDataIfEmpty();
  } catch (err) {
    console.error("MongoDB connection error:", err);
  }
}

async function seedDefaultAdmin() {
  try {
    // Dynamically require Admin model to avoid circular dependency
    const { Admin } = await import("../model/Admin");
    const count = await Admin.countDocuments();
    if (count === 0) {
      const bcrypt = await import("bcryptjs");
      const defaultHash = (bcrypt.default || bcrypt).hashSync("password123", 10);
      await Admin.create({
        username: "admin",
        passwordHash: defaultHash
      });
      console.log("Default admin account ('admin' / 'password123') seeded successfully.");
    }
  } catch (err) {
    console.error("Error seeding default admin:", err);
  }
}
