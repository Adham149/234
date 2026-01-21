import express from "express";
import cors from "cors";
import fetch from "node-fetch";

const app = express();
app.use(cors());

const BASE_URL = "https://www.thesportsdb.com/api/v1/json/1";

// Root
app.get("/", (req, res) => {
  res.json({ status: "Goal+ API V1 running 🚀" });
});

// Leagues
app.get("/leagues", async (req, res) => {
  try {
    const r = await fetch(`${BASE_URL}/all_leagues.php`);
    const data = await r.json();

    if (!data.leagues) {
      return res.json([]);
    }

    const leagues = data.leagues
      .filter(l => l.strSport === "Soccer")
      .map(l => ({
        id: l.idLeague,
        name: l.strLeague,
        sport: l.strSport
      }));

    res.json(leagues);
  } catch (err) {
    res.status(500).json({ error: "Failed to load leagues" });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log("Server running on", PORT);
});
