// server.js
import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";

// Routes
import authRoutes from "./routes/auth.js";
import itemsRoutes from "./routes/items.js";

// Initialize environment variables
dotenv.config();

// Create Express app
const app = express();

// === Middleware ===
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// === CORS Setup ===
// Allow requests from your Vercel frontend
const allowedOrigins = [
  "https://dashboard-gules-nine-32.vercel.app", // your frontend
  "http://localhost:5173", // local dev
];

app.use(
  cors({
    origin: (origin, callback) => {
      // allow no-origin (like Postman or curl)
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
  })
);

// === Database Connection ===
mongoose
  .connect(process.env.MONGO_URI, {
    serverSelectionTimeoutMS: 5000,
  })
  .then(() => console.log("✅ MongoDB connected successfully"))
  .catch((err) => console.error("❌ MongoDB connection error:", err));

// === Routes ===
app.use("/api/auth", authRoutes);
app.use("/api/items", itemsRoutes);

// === Health Check ===
app.get("/", (req, res) => {
  res.send("☕ Cafe Dashboard Backend Running Successfully!");
});

// === Global Error Handler (for clean debugging) ===
app.use((err, req, res, next) => {
  console.error("🔥 Error:", err.message);
  res.status(500).json({ error: "Internal server error", details: err.message });
});

// === Start Server ===
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
