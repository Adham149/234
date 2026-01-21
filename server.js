import express from "express";
import cors from "cors";
import fetch from "node-fetch";
import dotenv from "dotenv";

dotenv.config();

const app = express();
app.use(cors());

const API_KEY = process.env.API_KEY;

if (!API_KEY) {
  console.error("❌ API_KEY is missing");
}

const BASE_URL = "https://v3.football.api-sports.io";

const headers = {
  "x-apisports-key": API_KEY,
};

// Root
app.get("/", (req, res) => {
  res.json({ status: "Goal+ API is running" });
});

// Leagues
app.get("/leagues", async (req, res) => {
  try {
    const r = await fetch(`${BASE_URL}/leagues`, { headers });
    const data = await r.json();

    if (data.errors && Object.keys(data.errors).length > 0) {
      return res.status(401).json(data);
    }

    const leagues = data.response.map(l => ({
      id: l.league.id,
      name: l.league.name,
      logo: l.league.logo,
      country: l.country.name,
      type: l.league.type
    }));

    res.json(leagues);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

const PORT = process.env.PORT || 10000;
app.listen(PORT, () => {
  console.log("✅ Server running on", PORT);
});
