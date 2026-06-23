"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.login = login;
exports.me = me;
exports.logout = logout;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const Admin_1 = require("../model/Admin");
const auth_1 = require("../Middlewares/auth");
async function login(req, res) {
    try {
        const { username, password } = req.body;
        if (!username || !password) {
            return res.status(400).json({ error: "Please provide both username and password." });
        }
        const admin = await Admin_1.Admin.findOne({ username: username.toLowerCase() });
        if (!admin) {
            return res.status(401).json({ error: "Invalid credentials." });
        }
        const match = bcryptjs_1.default.compareSync(password, admin.passwordHash);
        if (!match) {
            return res.status(401).json({ error: "Invalid credentials." });
        }
        const token = (0, auth_1.generateToken)({ id: admin._id.toString(), username: admin.username });
        return res.json({
            token,
            admin: { id: admin._id.toString(), username: admin.username }
        });
    }
    catch (err) {
        return res.status(500).json({ error: err.message || "Login failed." });
    }
}
async function me(req, res) {
    try {
        if (!req.admin) {
            return res.status(401).json({ error: "Unauthorized access." });
        }
        return res.json({ admin: req.admin });
    }
    catch (err) {
        return res.status(500).json({ error: err.message || "Failed to authenticate session." });
    }
}
async function logout(req, res) {
    return res.json({ message: "Logged out successfully" });
}
