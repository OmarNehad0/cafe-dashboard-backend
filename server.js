// server.js
import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import bodyParser from "body-parser";
import authRoutes from "./routes/auth.js";
import itemsRoutes from "./routes/items.js";

dotenv.config();
const app = express();
const PORT = process.env.PORT || 3000;

// CORS - allow your Vercel frontend (set via env CORS_ORIGIN) or allow all in dev
const corsOptions = {
  origin: process.env.CORS_ORIGIN ? process.env.CORS_ORIGIN.split(",") : "*",
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
};
app.use(cors(corsOptions));
app.use(bodyParser.json());

// basic health route
app.get("/api/health", (req, res) => res.json({ ok: true, now: Date.now() }));

// routes
app.use("/api/auth", authRoutes);
app.use("/api/items", itemsRoutes);

// connect to MongoDB
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true, useUnifiedTopology: true
}).then(() => {
  console.log("✅ Connected to MongoDB");
  app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
}).catch(err => {
  console.error("MongoDB connection error:", err);
  process.exit(1);
});
