import { Router } from "express";
import { getMatches, createMatch, updateMatch, updateMatchScore, deleteMatch } from "../controllers/matchController";
import { verifyAdminToken } from "../Middlewares/auth";

const router = Router();

router.get("/", getMatches);
router.post("/", verifyAdminToken, createMatch);
router.put("/:id", verifyAdminToken, updateMatch);
router.put("/:id/score", verifyAdminToken, updateMatchScore);
router.delete("/:id", verifyAdminToken, deleteMatch);

export default router;
