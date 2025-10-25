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
router.post("/login", (req, res) => {
  const { username, password } = req.body;
  
  console.log("Login Attempt:", username, password);
  console.log("Expected:", process.env.ADMIN_USER, process.env.ADMIN_PASS);


  if (
    username === process.env.ADMIN_USER &&
    password === process.env.ADMIN_PASS
  ) {
    const token = jwt.sign({ username }, process.env.JWT_SECRET, { expiresIn: "1d" });
    res.json({ token });
  } else {
    res.status(401).json({ message: "Invalid credentials" });
  }
});

export default router;
