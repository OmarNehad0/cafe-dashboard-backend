// scripts/import_data.js
import fs from "fs";
import path from "path";
import mongoose from "mongoose";
import dotenv from "dotenv";
import Item from "../models/Item.js";

dotenv.config();

const DATA_DIR = path.join(process.cwd(), "data");

async function run() {
  if (!process.env.MONGO_URI) {
    console.error(".env MONGO_URI required");
    process.exit(1);
  }
  await mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true });
  console.log("Connected to MongoDB for seeding");

  const files = fs.readdirSync(DATA_DIR).filter(f => f.endsWith(".json"));
  for (const file of files) {
    const full = path.join(DATA_DIR, file);
    const content = JSON.parse(fs.readFileSync(full, "utf8"));
    if (!Array.isArray(content)) continue;
    console.log(`Seeding ${content.length} items from ${file}`);
    for (const it of content) {
      // Try to find existing by exact name, update if exists else create
      const existing = await Item.findOne({ name: it.name });
      if (existing) {
        await Item.updateOne({ _id: existing._id }, { $set: { price: it.price, category: it.category, image: it.image || "" } });
      } else {
        await Item.create({ name: it.name, price: it.price ?? 0, category: it.category ?? "غير مصنف", image: it.image ?? "" });
      }
    }
  }

  console.log("Seeding complete.");
  await mongoose.disconnect();
  process.exit(0);
}

run().catch(err => { console.error(err); process.exit(1); });
