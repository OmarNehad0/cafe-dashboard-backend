// models/Item.js
import mongoose from "mongoose";

const itemSchema = new mongoose.Schema({
  name: { type: String, required: true },
  price: { type: Number, required: true, default: 0 },
  category: { type: String, default: "غير مصنف" },
  image: { type: String, default: "" }
}, { timestamps: true });

export default mongoose.model("Item", itemSchema);
