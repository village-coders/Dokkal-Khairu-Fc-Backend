import { Request, Response } from "express";
import { Player } from "../Models/Player";

export async function getPlayers(req: Request, res: Response) {
  try {
    const players = await Player.find().sort({ number: 1 });
    return res.json(players);
  } catch (err: any) {
    return res.status(500).json({ error: err.message || "Failed to fetch players." });
  }
}

export async function createPlayer(req: Request, res: Response) {
  try {
    const {
      name,
      number,
      position,
      nationality,
      appearances,
      goals,
      assists,
      cleanSheets,
      imageUrl
    } = req.body;

    if (!name || number === undefined || !position || !nationality) {
      return res.status(400).json({ error: "Please fill all required player details." });
    }

    const newPlayer = await Player.create({
      name,
      number: Number(number),
      position,
      nationality,
      appearances: appearances ? Number(appearances) : 0,
      goals: goals ? Number(goals) : 0,
      assists: assists ? Number(assists) : 0,
      cleanSheets: cleanSheets ? Number(cleanSheets) : 0,
      imageUrl: imageUrl || ""
    });

    return res.status(201).json(newPlayer);
  } catch (err: any) {
    return res.status(500).json({ error: err.message || "Failed to create player." });
  }
}

export async function updatePlayer(req: Request, res: Response) {
  try {
    const { id } = req.params;
    const {
      name,
      number,
      position,
      nationality,
      appearances,
      goals,
      assists,
      cleanSheets,
      imageUrl
    } = req.body;

    const player = await Player.findById(id);
    if (!player) {
      return res.status(404).json({ error: "Player not found." });
    }

    if (name) player.name = name;
    if (number !== undefined) player.number = Number(number);
    if (position) player.position = position;
    if (nationality) player.nationality = nationality;
    if (appearances !== undefined) player.appearances = Number(appearances);
    if (goals !== undefined) player.goals = Number(goals);
    if (assists !== undefined) player.assists = Number(assists);
    if (cleanSheets !== undefined) player.cleanSheets = Number(cleanSheets);
    if (imageUrl !== undefined) player.imageUrl = imageUrl;

    await player.save();
    return res.json(player);
  } catch (err: any) {
    return res.status(500).json({ error: err.message || "Failed to update player." });
  }
}

export async function deletePlayer(req: Request, res: Response) {
  try {
    const { id } = req.params;
    const deleted = await Player.findByIdAndDelete(id);

    if (!deleted) {
      return res.status(404).json({ error: "Player not found." });
    }

    return res.json({ message: "Player deleted successfully." });
  } catch (err: any) {
    return res.status(500).json({ error: err.message || "Failed to delete player." });
  }
}
