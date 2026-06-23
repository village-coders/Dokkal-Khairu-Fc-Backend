import { Router } from "express";
import { login, me, logout } from "../controllers/authController";
import { verifyAdminToken } from "../Middlewares/auth";

const router = Router();

router.post("/login", login);
router.get("/me", verifyAdminToken, me);
router.post("/logout", logout);

export default router;
