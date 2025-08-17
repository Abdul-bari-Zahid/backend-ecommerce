

import express from 'express'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { client } from '../dbConfig.js';
import { ObjectId } from 'mongodb';

const router = express.Router();
const myDB = client.db("myEcommerce");
const Users = myDB.collection("users");

const JWT_SECRET = 'secretkey123' // production me env me rakhna

// Register
router.post('/register', async (req, res) => {
  const { firstName, lastName, phone, email, password } = req.body;

  if (!firstName || !lastName || !phone || !email || !password) {
    return res.send('Please fill out complete form');
  }

  const checkUser = await Users.findOne({ email: email.toLowerCase() });
  if (checkUser) {
    return res.send('Email already exists');
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  await Users.insertOne({
    firstName,
    lastName,
    phone,
    email: email.toLowerCase(),
    password: hashedPassword
  });

  res.send('User registered successfully');
});

// Login
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  const user = await Users.findOne({ email: email.toLowerCase() });
  if (!user) return res.send('Invalid credentials');

  const match = await bcrypt.compare(password, user.password);
  if (!match) return res.send('Invalid credentials');

  // JWT Token generate
  const token = jwt.sign({ id: user._id, email: user.email }, JWT_SECRET, { expiresIn: '1h' });

  res.json({ message: 'Login successful', token });
});

export default router;
