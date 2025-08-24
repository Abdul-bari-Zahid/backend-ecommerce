
import express from "express";
import { client } from "../dbConfig.js";
import { ObjectId } from "mongodb";

const router = express.Router();
const myDB = client.db("myEcommerce");
const Orders = myDB.collection("orders");

// Create Order
router.post("/orders", async (req, res) => {
  try {
    const order = { ...req.body, createdAt: new Date() };
    const response = await Orders.insertOne(order);
    res.json({ message: "Order created", data: response });
  } catch (e) {
    res.status(500).json({ message: "Error creating order", error: e.message });
  }
});

// Get all orders
router.get("/orders", async (req, res) => {
  const orders = await Orders.find().toArray();
  res.json(orders);
});

// Get single order
router.get("/orders/:id", async (req, res) => {
  const order = await Orders.findOne({ _id: new ObjectId(req.params.id) });
  if (!order) return res.status(404).json({ message: "Order not found" });
  res.json(order);
});

// Update order
router.put("/orders/:id", async (req, res) => {
  const result = await Orders.updateOne(
    { _id: new ObjectId(req.params.id) },
    { $set: req.body }
  );
  res.json(result);
});

// Delete order
router.delete("/orders/:id", async (req, res) => {
  const result = await Orders.deleteOne({ _id: new ObjectId(req.params.id) });
  res.json(result);
});

export default router;
