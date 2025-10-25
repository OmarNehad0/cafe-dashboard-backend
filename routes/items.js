// routes/items.js
import express from "express";
import fs from "fs";
import path from "path";
import { requireAuth } from "../middleware/auth.js";

const router = express.Router();

// Path to data file
const dataPath = path.resolve("./data/items.json");

// === GET /api/items ===
router.get("/", async (req, res) => {
  try {
    const raw = fs.readFileSync(dataPath, "utf8");
    const items = JSON.parse(raw);
    res.json(items);
  } catch (err) {
    console.error("❌ Error reading items.json:", err);
    res.status(500).json({ message: "Failed to load items." });
  }
});

// === POST /api/items ===
router.post("/", requireAuth, async (req, res) => {
  try {
    const raw = fs.readFileSync(dataPath, "utf8");
    const items = JSON.parse(raw);

    const newItem = req.body;
    items.push(newItem);

    fs.writeFileSync(dataPath, JSON.stringify(items, null, 2));
    res.json({ item: newItem });
  } catch (err) {
    console.error("❌ Error writing to items.json:", err);
    res.status(500).json({ message: "Failed to save item." });
  }
});

export default router;


