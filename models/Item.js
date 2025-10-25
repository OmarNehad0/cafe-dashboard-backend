import mongoose from "mongoose";

const itemSchema = new mongoose.Schema({
  name: String,
  category: String,
  price: Number,
  image: String,
  caption: String,
  emoji: String,
});

export default mongoose.model("Item", itemSchema);
