import express from "express";
import cors from "cors";
import path from "path";
import dotenv from "dotenv";
dotenv.config();

import authRoutes from "./routes/authRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import usersRoutes from "./routes/usersRoutes.js";
import categoryRoutes from "./routes/categoryRoutes.js";
// import orderRoutes from "./routes/ordersRoutes.js"; // NOTE: file name matches
import orderRoutes from "./routes/orderRoutes.js";

import { client } from "./dbConfig.js";
import { authMiddleware } from "./middlewares/authMiddleware.js";

const app = express();
const port = process.env.PORT || 3001;
 
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/uploads", express.static(path.join(process.cwd(), "uploads")));

client
  .connect()
  .then(() => {
    console.log("Connected to MongoDB");

    // Public auth routes
    app.use("/api/auth", authRoutes);

    app.use("/api", authMiddleware);

    app.use("/api", userRoutes);
    app.use("/api", usersRoutes);
    app.use("/api", categoryRoutes);
    app.use("/api", orderRoutes);

    app.get("/", (_req, res) => res.send("API is running ✔"));
    app.listen(port, () => console.log(`Server running at http://localhost:${port}`));
  })
  .catch((err) => console.error("MongoDB connection failed:", err));
