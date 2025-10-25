import express from "express";
import Item from "../models/Item.js";

const router = express.Router();

router.get("/api/items", async (req, res) => {
  try {
    const items = await Item.find();
    res.json(items);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.post("/api/items", async (req, res) => {
  try {
    const { name, category, price, image, caption, emoji } = req.body;
    const item = new Item({ name, category, price, image, caption, emoji });
    await item.save();
    res.status(201).json(item);
  } catch (err) {
    res.status(500).json({ message: "Failed to add item." });
  }
});

export default router;
