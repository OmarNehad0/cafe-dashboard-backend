import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import itemsRoutes from "./routes/items.js";
import authRoutes from "./routes/auth.js";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

app.get("/", (req, res) => res.send("✅ Cafe Dashboard Backend Running"));

app.use("/api/auth", authRoutes);
app.use("/api/items", itemsRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
