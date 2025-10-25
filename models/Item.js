import mongoose from "mongoose";

const itemSchema = new mongoose.Schema({
  name: String,
  category: String,
  caption: String,
  price: Number,
  image: String,
  emoji: String,
});

export default mongoose.model("Item", itemSchema);

