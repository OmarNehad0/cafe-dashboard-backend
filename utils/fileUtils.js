import fs from "fs-extra";
import path from "path";

const dataDir = path.resolve("./data");

export async function loadAllItems() {
  const files = await fs.readdir(dataDir);
  const all = [];

  for (const file of files) {
    if (!file.endsWith(".json")) continue;
    const category = file.replace(".json", "");
    try {
      const arr = await fs.readJson(path.join(dataDir, file));

      if (!Array.isArray(arr)) {
        console.warn(`⚠️ Skipping ${file}: not an array`);
        continue;
      }

      for (const item of arr) {
        item._id = item._id || crypto.randomUUID();
        item.category = category;
        all.push(item);
      }
    } catch (err) {
      console.error(`❌ Failed to load ${file}:`, err.message);
    }
  }

  return all;
}

export async function saveCategory(category, items) {
  const filePath = path.join(dataDir, `${category}.json`);
  await fs.writeJson(filePath, items, { spaces: 2 });
}

export async function getCategoryItems(category) {
  const filePath = path.join(dataDir, `${category}.json`);
  if (!(await fs.pathExists(filePath))) return [];
  return await fs.readJson(filePath);
}
