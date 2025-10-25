// routes/items.js
import express from "express";
import Item from "../models/Item.js";
import { requireAuth } from "../middleware/auth.js";

const router = express.Router();

// GET /api/items  - public if you want, but frontend uses token; we can make it require auth as well
router.get("/", async (req, res) => {
  const items = await Item.find().sort({ category: 1, name: 1 });
  res.json(items);
});

// POST /api/items  - add new (requires auth)
router.post("/", requireAuth, async (req, res) => {
  try {
    const payload = req.body;
    const item = new Item(payload);
    const saved = await item.save();
    // Return { item } to match the frontend expectation (saved.item || saved)
    res.json({ item: saved });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// server.js
import fs from "fs";
import path from "path";

app.get("/api/items", (req, res) => {
  const filePath = path.resolve("./data/items.json"); // adjust path if needed
  const raw = fs.readFileSync(filePath, "utf8");
  const data = JSON.parse(raw);
  res.json(data);
});


// PUT /api/items/:id  - update (requires auth)
router.put("/:id", requireAuth, async (req, res) => {
  try {
    const updated = await Item.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    res.json({ item: updated });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// DELETE /api/items/:id (requires auth)
router.delete("/:id", requireAuth, async (req, res) => {
  try {
    await Item.findByIdAndDelete(req.params.id);
    res.json({ message: "Deleted" });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

export default router;
