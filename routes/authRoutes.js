

import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { client } from "../dbConfig.js";
import { ObjectId } from "mongodb";
import dotenv from "dotenv";
import { sendMail } from "../utils/mailer.js";
import { authMiddleware } from "../middlewares/authMiddleware.js";
dotenv.config();

const router = express.Router();
const myDB = client.db("myEcommerce");
const Users = myDB.collection("users");
const JWT_SECRET = process.env.JWT_SECRET;

// Register
router.post("/register", async (req, res) => {
  try {
    const { firstName, lastName, phone, email, password } = req.body;
    if (!firstName || !lastName || !phone || !email || !password) {
      return res.status(400).json({ message: "Please fill out complete form" });
    }
    const lowerEmail = email.toLowerCase();
    const checkUser = await Users.findOne({ email: lowerEmail });
    if (checkUser) return res.status(409).json({ message: "Email already exists" });

    const hashedPassword = await bcrypt.hash(password, 10);
    const insert = await Users.insertOne({
      firstName,
      lastName,
      phone,
      email: lowerEmail,
      password: hashedPassword,
      createdAt: new Date()
    });
    return res.json({ message: "User registered successfully", id: insert.insertedId });
  } catch (e) {
    return res.status(500).json({ message: "Registration failed", error: e.message });
  }
});

// Login
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const lowerEmail = email?.toLowerCase();
    const user = await Users.findOne({ email: lowerEmail });
    if (!user) return res.status(400).json({ message: "Invalid credentials" });

    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(400).json({ message: "Invalid credentials" });

    const token = jwt.sign({ id: user._id, email: user.email }, JWT_SECRET, { expiresIn: "1h" });
    return res.json({ message: "Login successful", token });
  } catch (e) {
    return res.status(500).json({ message: "Login failed", error: e.message });
  }
});

/** Forget password -> email reset link */
router.post("/forget-password", async (req, res) => {
  try {
    const { email } = req.body;
    const lowerEmail = email?.toLowerCase();
    const user = await Users.findOne({ email: lowerEmail });
    if (!user) return res.status(404).json({ message: "User not found" });

    const token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: "15m" });
    const clientUrl = process.env.CLIENT_URL || "http://localhost:5173";
    const resetLink = `${clientUrl}/reset-password/${token}`;

    await sendMail({
      to: user.email,
      subject: "Password Reset",
      html: `<p>Click <a href="${resetLink}">here</a> to reset your password. This link expires in 15 minutes.</p>`
    });

    return res.json({ message: "Password reset link sent to your email" });
  } catch (e) {
    return res.status(500).json({ message: "Error sending reset link", error: e.message });
  }
});

/** Reset password -> with token from email */
router.post("/reset-password/:token", async (req, res) => {
  try {
    const { token } = req.params;
    const { newPassword } = req.body;

    if (!newPassword || newPassword.length < 6) {
      return res.status(400).json({ message: "Password must be at least 6 characters" });
    }

    const decoded = jwt.verify(token, JWT_SECRET); // throws if invalid/expired
    const hashed = await bcrypt.hash(newPassword, 10);

    await Users.updateOne({ _id: new ObjectId(decoded.id) }, { $set: { password: hashed } });
    return res.json({ message: "Password updated successfully" });
  } catch (e) {
    return res.status(400).json({ message: "Invalid or expired token", error: e.message });
  }
});

/** Update password -> logged-in user */
router.post("/update-password", authMiddleware, async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    if (!currentPassword || !newPassword)
      return res.status(400).json({ message: "currentPassword and newPassword are required" });

    const me = await Users.findOne({ _id: new ObjectId(req.user.id) });
    if (!me) return res.status(404).json({ message: "User not found" });

    const ok = await bcrypt.compare(currentPassword, me.password);
    if (!ok) return res.status(400).json({ message: "Current password is incorrect" });

    const hashed = await bcrypt.hash(newPassword, 10);
    await Users.updateOne({ _id: me._id }, { $set: { password: hashed } });

    return res.json({ message: "Password changed successfully" });
  } catch (e) {
    return res.status(500).json({ message: "Error updating password", error: e.message });
  }
});

export default router;
