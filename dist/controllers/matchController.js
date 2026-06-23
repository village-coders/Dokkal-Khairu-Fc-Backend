"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getMatches = getMatches;
exports.createMatch = createMatch;
exports.updateMatch = updateMatch;
exports.updateMatchScore = updateMatchScore;
exports.deleteMatch = deleteMatch;
const Match_1 = require("../model/Match");
async function getMatches(req, res) {
    try {
        const { status } = req.query;
        const query = {};
        if (status) {
            query.status = status;
        }
        const matches = await Match_1.Match.find(query).sort({ matchDate: -1 });
        return res.json(matches);
    }
    catch (err) {
        return res.status(500).json({ error: err.message || "Failed to fetch matches." });
    }
}
async function createMatch(req, res) {
    try {
        const { homeTeamName, homeTeamLogoUrl, awayTeamName, awayTeamLogoUrl, venue, matchDate, competition, status = "upcoming", matchweek, highlights } = req.body;
        if (!homeTeamName || !awayTeamName || !venue || !matchDate || !competition) {
            return res.status(400).json({ error: "Please fill all required match details." });
        }
        const newMatch = await Match_1.Match.create({
            homeTeam: {
                name: homeTeamName,
                logo: { url: homeTeamLogoUrl || "", publicId: "" }
            },
            awayTeam: {
                name: awayTeamName,
                logo: { url: awayTeamLogoUrl || "", publicId: "" }
            },
            homeScore: null,
            awayScore: null,
            venue,
            matchDate: new Date(matchDate),
            competition,
            status,
            matchweek: matchweek ? parseInt(matchweek.toString()) : undefined,
            highlights
        });
        return res.status(201).json(newMatch);
    }
    catch (err) {
        return res.status(500).json({ error: err.message || "Failed to create match fixture." });
    }
}
async function updateMatch(req, res) {
    try {
        const { id } = req.params;
        const { homeTeamName, homeTeamLogoUrl, awayTeamName, awayTeamLogoUrl, venue, matchDate, competition, status, matchweek, highlights, homeScore, awayScore } = req.body;
        const match = await Match_1.Match.findById(id);
        if (!match) {
            return res.status(404).json({ error: "Match not found." });
        }
        if (homeTeamName)
            match.homeTeam.name = homeTeamName;
        if (homeTeamLogoUrl !== undefined)
            match.homeTeam.logo.url = homeTeamLogoUrl;
        if (awayTeamName)
            match.awayTeam.name = awayTeamName;
        if (awayTeamLogoUrl !== undefined)
            match.awayTeam.logo.url = awayTeamLogoUrl;
        if (venue)
            match.venue = venue;
        if (matchDate)
            match.matchDate = new Date(matchDate);
        if (competition)
            match.competition = competition;
        if (status)
            match.status = status;
        if (matchweek !== undefined) {
            match.matchweek = matchweek ? parseInt(matchweek.toString()) : undefined;
        }
        if (highlights !== undefined)
            match.highlights = highlights;
        if (homeScore !== undefined) {
            match.homeScore = (homeScore !== "" && homeScore !== null && homeScore !== undefined) ? parseInt(homeScore.toString()) : null;
        }
        if (awayScore !== undefined) {
            match.awayScore = (awayScore !== "" && awayScore !== null && awayScore !== undefined) ? parseInt(awayScore.toString()) : null;
        }
        await match.save();
        return res.json(match);
    }
    catch (err) {
        return res.status(500).json({ error: err.message || "Failed to update match." });
    }
}
async function updateMatchScore(req, res) {
    try {
        const { id } = req.params;
        const { homeScore, awayScore, status } = req.body;
        if (status === "completed" && (homeScore === undefined || awayScore === undefined)) {
            return res.status(400).json({ error: "Scores are required to complete a match." });
        }
        const match = await Match_1.Match.findById(id);
        if (!match) {
            return res.status(404).json({ error: "Match not found." });
        }
        match.homeScore = (homeScore !== null && homeScore !== undefined) ? parseInt(homeScore.toString()) : null;
        match.awayScore = (awayScore !== null && awayScore !== undefined) ? parseInt(awayScore.toString()) : null;
        match.status = status;
        await match.save();
        return res.json(match);
    }
    catch (err) {
        return res.status(500).json({ error: err.message || "Failed to update score." });
    }
}
async function deleteMatch(req, res) {
    try {
        const { id } = req.params;
        const deleted = await Match_1.Match.findByIdAndDelete(id);
        if (!deleted) {
            return res.status(404).json({ error: "Match not found." });
        }
        return res.json({ message: "Match deleted successfully." });
    }
    catch (err) {
        return res.status(500).json({ error: err.message || "Failed to delete match." });
    }
}
