import { Router } from "express";
import { getNews, getNewsBySlugOrId, createNews, updateNews, deleteNews } from "../controllers/newsController";
import { verifyAdminToken } from "../Middlewares/auth";

const router = Router();

router.get("/", getNews);
router.get("/:id", getNewsBySlugOrId);
router.post("/", verifyAdminToken, createNews);
router.put("/:id", verifyAdminToken, updateNews);
router.delete("/:id", verifyAdminToken, deleteNews);

export default router;
