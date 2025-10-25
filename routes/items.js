// routes/items.js
import express from "express";
import fs from "fs";
import path from "path";
import { requireAuth } from "../middleware/auth.js";

const router = express.Router();
const filePath = path.resolve("./data/items.json");

// GET all items
router.get("/", async (req, res) => {
  try {
    const data = JSON.parse(fs.readFileSync(filePath, "utf8"));
    res.json(data);
  } catch (err) {
    console.error("❌ Error reading items.json:", err);
    res.status(500).json({ message: "Failed to load items." });
  }
});

// PUT to update a price or item
router.put("/", requireAuth, async (req, res) => {
  try {
    const updatedData = req.body;
    fs.writeFileSync(filePath, JSON.stringify(updatedData, null, 2), "utf8");
    res.json({ message: "Items updated successfully!" });
  } catch (err) {
    console.error("❌ Error writing items.json:", err);
    res.status(500).json({ message: "Failed to save items." });
  }
});

export default router;

