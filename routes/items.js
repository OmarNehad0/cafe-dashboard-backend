import express from "express";
import jwt from "jsonwebtoken";
import { loadAllItems, getCategoryItems, saveCategory } from "../utils/fileUtils.js";
import dotenv from "dotenv";

dotenv.config();
const router = express.Router();

// Middleware to protect routes
function auth(req, res, next) {
  const header = req.headers.authorization;
  if (!header) return res.status(401).json({ message: "Missing token" });

  const token = header.split(" ")[1];
  try {
    jwt.verify(token, process.env.JWT_SECRET);
    next();
  } catch {
    res.status(401).json({ message: "Invalid token" });
  }
}

// 🟢 GET all items from all files
router.get("/", async (req, res) => {
  try {
    const items = await loadAllItems();
    res.json(items);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// 🔵 POST create new item
router.post("/", auth, async (req, res) => {
  const { name, price, category, image } = req.body;
  if (!name || !price || !category) return res.status(400).json({ message: "Missing fields" });

  const items = await getCategoryItems(category);
  const newItem = { _id: crypto.randomUUID(), name, price, image, category };
  items.push(newItem);
  await saveCategory(category, items);
  res.json({ item: newItem });
});

// 🟠 PUT update item
router.put("/:id", auth, async (req, res) => {
  const { id } = req.params;
  const { name, price, category, image } = req.body;
  const all = await loadAllItems();
  const item = all.find(i => i._id === id);
  if (!item) return res.status(404).json({ message: "Item not found" });

  // Load its current category file
  const catItems = await getCategoryItems(item.category);
  const idx = catItems.findIndex(i => i._id === id);
  if (idx === -1) return res.status(404).json({ message: "Item not found in category file" });

  const updated = { ...catItems[idx], name, price, image, category: category || item.category };
  catItems[idx] = updated;

  // if category changed
  if (category && category !== item.category) {
    const newCatItems = await getCategoryItems(category);
    newCatItems.push(updated);
    await saveCategory(category, newCatItems);

    // remove from old category
    const filteredOld = catItems.filter(i => i._id !== id);
    await saveCategory(item.category, filteredOld);
  } else {
    await saveCategory(item.category, catItems);
  }

  res.json({ item: updated });
});

// 🔴 DELETE item
router.delete("/:id", auth, async (req, res) => {
  const { id } = req.params;
  const all = await loadAllItems();
  const item = all.find(i => i._id === id);
  if (!item) return res.status(404).json({ message: "Item not found" });

  const items = await getCategoryItems(item.category);
  const newArr = items.filter(i => i._id !== id);
  await saveCategory(item.category, newArr);
  res.json({ message: "Deleted" });
});

export default router;
