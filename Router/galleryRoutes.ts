import { Router } from "express";
import { getGalleryItems, createGalleryItem, updateGalleryItem, deleteGalleryItem } from "../controllers/galleryController";
import { verifyAdminToken } from "../Middlewares/auth";

const router = Router();

router.get("/", getGalleryItems);
router.post("/", verifyAdminToken, createGalleryItem);
router.put("/:id", verifyAdminToken, updateGalleryItem);
router.delete("/:id", verifyAdminToken, deleteGalleryItem);

export default router;
