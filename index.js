

import express from "express";
import cors from "cors";
import authRoutes from './routes/authRoutes.js';
// import authRoutes from "./routes/authRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import usersRoutes from "./routes/usersRoutes.js";
import categoryRoutes from "./routes/categoryRoutes.js";
import orderRoutes from "./routes/orderRoutes.js";

import { client } from "./dbConfig.js";
import { authMiddleware } from "./middlewares/authMiddleware.js";


client.connect()
  .then(() => console.log("Connected to MongoDB"))


  .catch((err) => console.error(" MongoDB connection failed:", err));

const app = express();
const port = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

app.use("/api/auth", authRoutes); 

app.use("/api", authMiddleware); 
app.use("/api", userRoutes);
app.use("/api", usersRoutes);
app.use("/api", categoryRoutes);
app.use("/api", orderRoutes);

app.listen(port, () => {
  console.log(` Server running on http://localhost:${port}`);
});
