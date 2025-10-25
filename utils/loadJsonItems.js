import fs from "fs-extra";
import path from "path";
import crypto from "crypto";

const dataDir = path.resolve("./data");

export async function loadAllJsonItems() {
  const files = await fs.readdir(dataDir);
  const allItems = [];

  for (const file of files) {
    if (!file.endsWith(".json")) continue;

    const category = file.replace(".json", "");
    try {
      const arr = await fs.readJson(path.join(dataDir, file));

      if (!Array.isArray(arr)) {
        console.warn(`⚠️ Skipping ${file}: Not an array`);
        continue;
      }

      for (const boss of arr) {
        for (const item of boss.items || []) {
          allItems.push({
            _id: crypto.randomUUID(),
            name: item.name,
            category,
            caption: boss.caption || "",
            price: item.price,
            image: item.image,
            emoji: boss.emoji || "🦄",
          });
        }
      }
    } catch (err) {
      console.error(`❌ Failed to parse ${file}:`, err.message);
    }
  }

  return allItems;
}
