import express from "express";
import { loadAllJsonItems } from "../utils/loadJsonItems.js";
import Item from "../models/Item.js";

const router = express.Router();

// ✅ Load all items from JSON files (like your bot logic)
router.get("/load-json", async (req, res) => {
  try {
    const allItems = await loadAllJsonItems();
    res.json(allItems);
  } catch (err) {
    console.error("❌ Error loading JSON items:", err);
    res.status(500).json({ message: "Failed to load items." });
  }
});

// ✅ Populate MongoDB with JSON items
router.post("/import-json", async (req, res) => {
  try {
    const allItems = await loadAllJsonItems();

    await Item.deleteMany({}); // optional: clear existing
    await Item.insertMany(allItems);

    res.json({ message: "✅ JSON data imported successfully!", count: allItems.length });
  } catch (err) {
    console.error("❌ Import failed:", err);
    res.status(500).json({ message: "Failed to import JSON files." });
  }
});

// ✅ Normal endpoint for frontend to get all Mongo items
router.get("/", async (req, res) => {
  try {
    const items = await Item.find();
    res.json(items);
  } catch (err) {
    console.error("❌ Fetch error:", err);
    res.status(500).json({ message: "Failed to load items." });
  }
});

export default router;
