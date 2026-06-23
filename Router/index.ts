import { Router } from "express";
import authRoutes from "./authRoutes";
import newsRoutes from "./newsRoutes";
import matchRoutes from "./matchRoutes";
import playerRoutes from "./playerRoutes";
import galleryRoutes from "./galleryRoutes";
import uploadRoutes from "./uploadRoutes";

const router = Router();

router.use("/auth", authRoutes);
router.use("/news", newsRoutes);
router.use("/matches", matchRoutes);
router.use("/players", playerRoutes);
router.use("/gallery", galleryRoutes);
router.use("/upload", uploadRoutes);

export default router;
