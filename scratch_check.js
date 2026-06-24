const mongoose = require("mongoose");

const MONGODB_URI = "mongodb+srv://villagecoders7_db_user:pivuMD8k1rqkaXZC@dokkalkhairufc.alamel7.mongodb.net/?appName=DokkalKhairuFc";

async function checkMatches() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log("Connected to MongoDB.");
    
    // Find all matches
    const Match = mongoose.model("Match", new mongoose.Schema({}, { strict: false }), "matches");
    const matches = await Match.find({});
    
    console.log(`Found ${matches.length} matches.`);
    for (const match of matches) {
      console.log(`\nMatch: ${match.homeTeam?.name} vs ${match.awayTeam?.name}`);
      console.log(`Status: ${match.status}`);
      console.log(`Date: ${match.matchDate}`);
      console.log(`countdownBanner: ${match.countdownBanner}`);
    }
    
    await mongoose.disconnect();
    console.log("Disconnected.");
  } catch (err) {
    console.error("Error:", err);
  }
}

checkMatches();
