import fs from "fs";
import path from "path";
import mongoose from "mongoose";
import Item from "./models/Item.js";
import dotenv from "dotenv";

dotenv.config();
const __dirname = path.resolve();

const MONGO_URI = process.env.MONGO_URI;

await mongoose.connect(MONGO_URI);
console.log("✅ Connected to MongoDB");

const dataDir = path.join(__dirname, "data");

for (const file of fs.readdirSync(dataDir)) {
  if (!file.endsWith(".json")) continue;
  const category = file.replace(".json", "");
  const content = JSON.parse(fs.readFileSync(path.join(dataDir, file), "utf-8"));

  for (const boss of content) {
    const itemData = boss.items[0];
    const item = {
      name: boss.name,
      category,
      price: itemData.price,
      image: itemData.image,
      caption: boss.caption,
      emoji: boss.emoji,
    };

    await Item.findOneAndUpdate(
      { name: item.name, category },
      item,
      { upsert: true }
    );
  }

  console.log(`✅ Imported category: ${category}`);
}

console.log("🎉 All data imported successfully!");
await mongoose.disconnect();

