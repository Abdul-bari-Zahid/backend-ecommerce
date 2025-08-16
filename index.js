

// import express from 'express'
// import authRoutes from './routes/authRoutes.js'
// import userRoutes from './routes/userRoutes.js'
// import usersRoutes from './routes/usersRoutes.js'
// import categoryRoutes from './routes/categoryRoutes.js'
// import orderRoutes from './routes/orderRoutes.js'
// import { client } from './dbConfig.js';
// import { authMiddleware } from './middlewares/authMiddleware.js';

// client.connect();
// console.log("Connected to MongoDB!");

// const app = express();
// const port = process.env.PORT || 3000;
// app.use(express.json());

// app.use(authRoutes);

// // ↓↓↓ Ye lagao sirf secure routes ke liye ↓↓↓
// app.use(authMiddleware);

// // Secure routes
// app.use(userRoutes);
// app.use(usersRoutes);
// app.use(categoryRoutes);
// app.use(orderRoutes);

// app.listen(port, () => {
//   console.log(`Server running on port ${port}`)
// });


// import express from 'express';
// import cors from 'cors';

// import authRoutes from './routes/authRoutes.js';
// import userRoutes from './routes/userRoutes.js';
// import usersRoutes from './routes/usersRoutes.js';
// import categoryRoutes from './routes/categoryRoutes.js';
// import orderRoutes from './routes/orderRoutes.js';

// import { client } from './dbConfig.js';
// import { authMiddleware } from './middlewares/authMiddleware.js';

// client.connect();
// console.log("Connected to MongoDB!");

// const app = express();
// const port = process.env.PORT || 3001;

// app.use(cors()); // allow frontend requests
// app.use(express.json());

// // public
// app.use("/api/auth", authRoutes);

// // protected
// app.use(authMiddleware);
// app.use("/api", userRoutes);
// app.use("/api", usersRoutes);
// app.use("/api", categoryRoutes);
// app.use("/api", orderRoutes);

// app.listen(port, () => {
//   console.log(`Server running on port ${port}`)
// });


import express from "express";
import cors from "cors";

import authRoutes from "./routes/authRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import usersRoutes from "./routes/usersRoutes.js";
import categoryRoutes from "./routes/categoryRoutes.js";
import orderRoutes from "./routes/orderRoutes.js";

import { client } from "./dbConfig.js";
import { authMiddleware } from "./middlewares/authMiddleware.js";

// MongoDB connect
client.connect()
  .then(() => console.log("✅ Connected to MongoDB"))
  .catch((err) => console.error("❌ MongoDB connection failed:", err));

const app = express();
const port = process.env.PORT || 3001;

app.use(cors()); // Allow frontend requests
app.use(express.json());

// ---------------- PUBLIC ROUTES ----------------
app.use("/api/auth", authRoutes); // Register + Login

// ---------------- PROTECTED ROUTES ----------------
app.use("/api", authMiddleware); // middleware for all /api/* routes
app.use("/api", userRoutes);
app.use("/api", usersRoutes);
app.use("/api", categoryRoutes);
app.use("/api", orderRoutes);

// ---------------- SERVER START ----------------
app.listen(port, () => {
  console.log(`🚀 Server running on http://localhost:${port}`);
});
