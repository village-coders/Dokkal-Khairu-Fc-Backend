import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import { Admin } from "../model/Admin";
import { generateToken } from "../Middlewares/auth";

export async function login(req: Request, res: Response) {
  try {
    const { username, password } = req.body;
    if (!username || !password) {
      return res.status(400).json({ error: "Please provide both username and password." });
    }

    const admin = await (Admin as any).findOne({ username: username.toLowerCase() });
    if (!admin) {
      return res.status(401).json({ error: "Invalid credentials." });
    }

    const match = bcrypt.compareSync(password, admin.passwordHash);
    if (!match) {
      return res.status(401).json({ error: "Invalid credentials." });
    }

    const token = generateToken({ id: admin._id.toString(), username: admin.username });

    return res.json({
      token,
      admin: { id: admin._id.toString(), username: admin.username }
    });
  } catch (err: any) {
    return res.status(500).json({ error: err.message || "Login failed." });
  }
}

export async function me(req: any, res: Response) {
  try {
    if (!req.admin) {
      return res.status(401).json({ error: "Unauthorized access." });
    }
    return res.json({ admin: req.admin });
  } catch (err: any) {
    return res.status(500).json({ error: err.message || "Failed to authenticate session." });
  }
}

export async function logout(req: Request, res: Response) {
  return res.json({ message: "Logged out successfully" });
}
