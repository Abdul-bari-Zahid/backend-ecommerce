import express from 'express'
import { client } from '../dbConfig.js';
import { ObjectId } from 'mongodb';

const router = express.Router();
const myDB = client.db("myEcommerce");
const Orders = myDB.collection("orders");

// Create Order
router.post('/orders', async (req, res) => {
  const order = req.body;
  const response = await Orders.insertOne(order);
  res.send(response);
});

// Get all orders
router.get('/orders', async (req, res) => {
  const orders = await Orders.find().toArray();
  res.send(orders);
});

// Get single order
router.get('/orders/:id', async (req, res) => {
  const order = await Orders.findOne({ _id: new ObjectId(req.params.id) });
  res.send(order);
});

// Update order
router.put('/orders/:id', async (req, res) => {
  const result = await Orders.updateOne(
    { _id: new ObjectId(req.params.id) },
    { $set: req.body }
  );
  res.send(result);
});

// Delete order
router.delete('/orders/:id', async (req, res) => {
  const result = await Orders.deleteOne({ _id: new ObjectId(req.params.id) });
  res.send(result);
});

export default router;
