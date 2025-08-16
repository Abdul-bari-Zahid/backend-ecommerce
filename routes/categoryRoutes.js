import express from 'express'
import { client } from '../dbConfig.js';
import { ObjectId } from 'mongodb';

const router = express.Router();
const myDB = client.db("myEcommerce");
const Categories = myDB.collection("categories");

// Create Category
router.post('/categories', async (req, res) => {
  const category = req.body;
  const response = await Categories.insertOne(category);
  res.send(response);
});

// Get all categories
router.get('/categories', async (req, res) => {
  const categories = await Categories.find().toArray();
  res.send(categories);
});

// Get single category
router.get('/categories/:id', async (req, res) => {
  const category = await Categories.findOne({ _id: new ObjectId(req.params.id) });
  res.send(category);
});

// Update category
router.put('/categories/:id', async (req, res) => {
  const result = await Categories.updateOne(
    { _id: new ObjectId(req.params.id) },
    { $set: req.body }
  );
  res.send(result);
});

// Delete category
router.delete('/categories/:id', async (req, res) => {
  const result = await Categories.deleteOne({ _id: new ObjectId(req.params.id) });
  res.send(result);
});

export default router;
