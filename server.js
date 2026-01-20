import express from "express";
import cors from "cors";
import fetch from "node-fetch";
import dotenv from "dotenv";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const API_BASE = "https://v3.football.api-sports.io";
const API_KEY = process.env.API_FOOTBALL_KEY;

const headers = {
  "x-apisports-key": API_KEY
};

app.get("/", (req, res) => {
  res.json({ status: "Goal+ API is running 🚀" });
});

app.get("/api/leagues", async (req, res) => {
  try {
    const r = await fetch(`${API_BASE}/leagues`, { headers });
    const data = await r.json();

    res.json(
      data.response.map(l => ({
        id: l.league.id,
        name: l.league.name,
        logo: l.league.logo,
        country: l.country.name
      }))
    );
  } catch (e) {
    res.status(500).json({ error: "Failed to load leagues" });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log("Server running on", PORT);
});
