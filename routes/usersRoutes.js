
import express from "express";
import { client } from "../dbConfig.js";
import { ObjectId } from "mongodb";

const router = express.Router();
const myDB = client.db("myEcommerce");
const Users = myDB.collection("users");

// Create User
router.post("/users", async (req, res) => {
  try {
    const user = req.body;
    if (!user.firstName || !user.email) {
      return res.status(400).json({ error: "firstName and email are required" });
    }
    const response = await Users.insertOne({ ...user, createdAt: new Date() });
    res.status(201).json({ message: "User created successfully", data: response });
  } catch (error) {
    res.status(500).json({ error: "Error creating user", details: error.message });
  }
});

// Get All Users
router.get("/users", async (req, res) => {
  try {
    const users = await Users.find().toArray();
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: "Error fetching users", details: error.message });
  }
});

// Get Single User by ID
router.get("/users/:id", async (req, res) => {
  try {
    const user = await Users.findOne({ _id: new ObjectId(req.params.id) });
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: "Error fetching user", details: error.message });
  }
});

// Update User by ID
router.put("/users/:id", async (req, res) => {
  try {
    const result = await Users.updateOne(
      { _id: new ObjectId(req.params.id) },
      { $set: req.body }
    );
    if (result.matchedCount === 0) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json({ message: "User updated successfully" });
  } catch (error) {
    res.status(500).json({ error: "Error updating user", details: error.message });
  }
});

// Delete User by ID
router.delete("/users/:id", async (req, res) => {
  try {
    const result = await Users.deleteOne({ _id: new ObjectId(req.params.id) });
    if (result.deletedCount === 0) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json({ message: "User deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: "Error deleting user", details: error.message });
  }
});

export default router;
