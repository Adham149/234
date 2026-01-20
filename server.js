require("dotenv").config();
const express = require("express");
const cors = require("cors");
const fetch = require("node-fetch");

const app = express();
app.use(cors());

const API_KEY = process.env.API_KEY;
const BASE_URL = "https://v3.football.api-sports.io";

const headers = {
  "x-apisports-key": API_KEY,
};

// ✅ الصفحة الرئيسية
app.get("/", (req, res) => {
  res.json({ status: "GoalPlus API is running ✅" });
});

// ✅ الدوريات
app.get("/leagues", async (req, res) => {
  try {
    const r = await fetch(`${BASE_URL}/leagues`, { headers });
    const data = await r.json();
    res.json(data.response);
  } catch (e) {
    res.status(500).json({ error: "Failed to load leagues" });
  }
});

// ✅ المباريات (اليوم)
app.get("/matches", async (req, res) => {
  try {
    const today = new Date().toISOString().slice(0, 10);
    const r = await fetch(
      `${BASE_URL}/fixtures?date=${today}`,
      { headers }
    );
    const data = await r.json();
    res.json(data.response);
  } catch (e) {
    res.status(500).json({ error: "Failed to load matches" });
  }
});

// ✅ البطولات (مواسم)
app.get("/competitions", async (req, res) => {
  try {
    const r = await fetch(`${BASE_URL}/leagues?current=true`, { headers });
    const data = await r.json();
    res.json(data.response);
  } catch (e) {
    res.status(500).json({ error: "Failed to load competitions" });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log("Server running on", PORT);
});
