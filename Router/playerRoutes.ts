import { Router } from "express";
import { getPlayers, createPlayer, updatePlayer, deletePlayer } from "../controllers/playerController";
import { verifyAdminToken } from "../Middlewares/auth";

const router = Router();

router.get("/", getPlayers);
router.post("/", verifyAdminToken, createPlayer);
router.put("/:id", verifyAdminToken, updatePlayer);
router.delete("/:id", verifyAdminToken, deletePlayer);

export default router;
