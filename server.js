import express from "express";
import cors from "cors";
import fetch from "node-fetch";
import dotenv from "dotenv";

dotenv.config();

const app = express();
app.use(cors());

const BASE_URL = "https://www.thesportsdb.com/api/v1/json/1";

// ===============================
// Root
// ===============================
app.get("/", (req, res) => {
  res.json({ status: "Goal+ API V2 running 🚀" });
});

// ===============================
// Leagues
// ===============================
app.get("/leagues", async (req, res) => {
  try {
    const r = await fetch(`${BASE_URL}/all_leagues.php`);
    const data = await r.json();

    const leagues = (data.leagues || [])
      .filter(l => l.strSport === "Soccer")
      .map(l => ({
        id: l.idLeague,
        name: l.strLeague,
        sport: l.strSport
      }));

    res.json(leagues);
  } catch {
    res.status(500).json({ error: "Failed to load leagues" });
  }
});

// ===============================
// Teams by League
// ===============================
app.get("/teams", async (req, res) => {
  try {
    const league = req.query.league;
    if (!league) {
      return res.json([]);
    }

    const r = await fetch(
      `${BASE_URL}/search_all_teams.php?l=${encodeURIComponent(league)}`
    );
    const data = await r.json();

    const teams = (data.teams || []).map(t => ({
      id: t.idTeam,
      name: t.strTeam,
      logo: t.strTeamBadge,
      stadium: t.strStadium,
      country: t.strCountry
    }));

    res.json(teams);
  } catch {
    res.status(500).json({ error: "Failed to load teams" });
  }
});

// ===============================
// Events (Last Matches)
// ===============================
app.get("/events", async (req, res) => {
  try {
    const teamId = req.query.teamId;
    if (!teamId) {
      return res.json([]);
    }

    const r = await fetch(
      `${BASE_URL}/eventslast.php?id=${teamId}`
    );
    const data = await r.json();

    const events = (data.results || []).map(e => ({
      id: e.idEvent,
      date: e.dateEvent,
      league: e.strLeague,
      home: e.strHomeTeam,
      away: e.strAwayTeam,
      homeScore: e.intHomeScore,
      awayScore: e.intAwayScore
    }));

    res.json(events);
  } catch {
    res.status(500).json({ error: "Failed to load events" });
  }
});

// ===============================
const PORT = process.env.PORT || 10000;
app.listen(PORT, () => {
  console.log("Server running on", PORT);
});
