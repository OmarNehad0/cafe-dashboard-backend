// routes/auth.js
import express from "express";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import bcrypt from "bcrypt";

dotenv.config();
const router = express.Router();

// Simple admin login using env variables.
// For production you might use hashed password in DB.
// We will compare provided credentials to ADMIN_USER and ADMIN_PASS from .env
router.post("/login", async (req, res) => {
  const { username, password } = req.body || {};
  if (!username || !password) return res.status(400).json({ message: "Missing credentials" });

  // If you store admin pass as plain text in env (simple), compare directly
  // for slightly more secure: you can store bcrypt hashed ADMIN_PASS and compare
  const adminUser = process.env.ADMIN_USER;
  const adminPass = process.env.ADMIN_PASS;

  if (username === adminUser && password === adminPass) {
    const token = jwt.sign({ username }, process.env.JWT_SECRET, { expiresIn: "12h" });
    return res.json({ token });
  }

  return res.status(401).json({ message: "Invalid credentials" });
});

export default router;
