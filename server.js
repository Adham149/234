import express from "express";
import cors from "cors";
import fetch from "node-fetch";
import dotenv from "dotenv";

dotenv.config();

const app = express();
app.use(cors());

const API_KEY = process.env.API_KEY;
const BASE_URL = "https://v3.football.api-sports.io";

const headers = {
  "x-apisports-key": API_KEY,
};

// ===============================
// ✅ Root
// ===============================
app.get("/", (req, res) => {
  res.json({ status: "Goal+ API is running 🚀" });
});

// ===============================
// ✅ Leagues (فلترة خفيفة)
// ===============================
app.get("/leagues", async (req, res) => {
  try {
    const r = await fetch(`${BASE_URL}/leagues`, { headers });
    const data = await r.json();

    const leagues = data.response.map(l => ({
      id: l.league.id,
      name: l.league.name,
      logo: l.league.logo,
      type: l.league.type,
      country: l.country.name
    }));

    res.json(leagues);
  } catch {
    res.status(500).json({ error: "Failed to load leagues" });
  }
});

// ===============================
// ✅ Competitions (بطولات حالية)
// ===============================
app.get("/competitions", async (req, res) => {
  try {
    const r = await fetch(`${BASE_URL}/leagues?current=true`, { headers });
    const data = await r.json();

    const competitions = data.response.map(l => ({
      id: l.league.id,
      name: l.league.name,
      logo: l.league.logo,
      country: l.country.name
    }));

    res.json(competitions);
  } catch {
    res.status(500).json({ error: "Failed to load competitions" });
  }
});

// ===============================
// ✅ Matches (اليوم فقط + فلترة)
// ===============================
app.get("/matches", async (req, res) => {
  try {
    const today = new Date().toISOString().slice(0, 10);
    const r = await fetch(
      `${BASE_URL}/fixtures?date=${today}`,
      { headers }
    );
    const data = await r.json();

    const matches = data.response.map(m => ({
      id: m.fixture.id,
      date: m.fixture.date,
      status: m.fixture.status.short,
      time: m.fixture.status.elapsed,
      league: {
        name: m.league.name,
        logo: m.league.logo
      },
      home: {
        name: m.teams.home.name,
        logo: m.teams.home.logo,
        goals: m.goals.home
      },
      away: {
        name: m.teams.away.name,
        logo: m.teams.away.logo,
        goals: m.goals.away
      }
    }));

    res.json(matches);
  } catch {
    res.status(500).json({ error: "Failed to load matches" });
  }
});

// ===============================
// ✅ Match Details (مستقبلاً)
// ===============================
app.get("/match/:id", async (req, res) => {
  try {
    const r = await fetch(
      `${BASE_URL}/fixtures?id=${req.params.id}`,
      { headers }
    );
    const data = await r.json();
    const m = data.response[0];

    if (!m) return res.json(null);

    res.json({
      league: m.league.name,
      stadium: m.fixture.venue.name,
      referee: m.fixture.referee,
      home: m.teams.home,
      away: m.teams.away,
      goals: m.goals
    });
  } catch {
    res.status(500).json({ error: "Failed to load match details" });
  }
});

// ===============================
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log("Server running on", PORT);
});
