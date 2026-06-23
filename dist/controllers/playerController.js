"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getPlayers = getPlayers;
exports.createPlayer = createPlayer;
exports.updatePlayer = updatePlayer;
exports.deletePlayer = deletePlayer;
const Player_1 = require("../Models/Player");
async function getPlayers(req, res) {
    try {
        const players = await Player_1.Player.find().sort({ number: 1 });
        return res.json(players);
    }
    catch (err) {
        return res.status(500).json({ error: err.message || "Failed to fetch players." });
    }
}
async function createPlayer(req, res) {
    try {
        const { name, number, position, nationality, appearances, goals, assists, cleanSheets, imageUrl } = req.body;
        if (!name || number === undefined || !position || !nationality) {
            return res.status(400).json({ error: "Please fill all required player details." });
        }
        const newPlayer = await Player_1.Player.create({
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
    }
    catch (err) {
        return res.status(500).json({ error: err.message || "Failed to create player." });
    }
}
async function updatePlayer(req, res) {
    try {
        const { id } = req.params;
        const { name, number, position, nationality, appearances, goals, assists, cleanSheets, imageUrl } = req.body;
        const player = await Player_1.Player.findById(id);
        if (!player) {
            return res.status(404).json({ error: "Player not found." });
        }
        if (name)
            player.name = name;
        if (number !== undefined)
            player.number = Number(number);
        if (position)
            player.position = position;
        if (nationality)
            player.nationality = nationality;
        if (appearances !== undefined)
            player.appearances = Number(appearances);
        if (goals !== undefined)
            player.goals = Number(goals);
        if (assists !== undefined)
            player.assists = Number(assists);
        if (cleanSheets !== undefined)
            player.cleanSheets = Number(cleanSheets);
        if (imageUrl !== undefined)
            player.imageUrl = imageUrl;
        await player.save();
        return res.json(player);
    }
    catch (err) {
        return res.status(500).json({ error: err.message || "Failed to update player." });
    }
}
async function deletePlayer(req, res) {
    try {
        const { id } = req.params;
        const deleted = await Player_1.Player.findByIdAndDelete(id);
        if (!deleted) {
            return res.status(404).json({ error: "Player not found." });
        }
        return res.json({ message: "Player deleted successfully." });
    }
    catch (err) {
        return res.status(500).json({ error: err.message || "Failed to delete player." });
    }
}
