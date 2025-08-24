







import express from "express";
import { client } from "../dbConfig.js";
import { ObjectId } from "mongodb";
import { upload } from "../middlewares/uploadMiddleware.js";
import fs from "fs";
import path from "path";

const router = express.Router();
const myDB = client.db("myEcommerce");
const Products = myDB.collection("products");

/** Create product with single image (field name: image) */
router.post("/user/product", upload.single("image"), async (req, res) => {
  try {
    const product = {
      title: req.body.title,
      description: req.body.description,
      price: Number(req.body.price),
      image: req.file ? `/uploads/${req.file.filename}` : null,
      createdAt: new Date()
    };

    const response = await Products.insertOne(product);
    return res.json({ message: "Product added successfully", data: response });
  } catch (error) {
    return res.status(500).json({ error: "Error adding product", details: error.message });
  }
});

/** (Optional) Multiple images */
router.post("/user/product-multi", upload.array("images", 5), async (req, res) => {
  try {
    const product = {
      title: req.body.title,
      description: req.body.description,
      price: Number(req.body.price),
      images: (req.files || []).map(f => `/uploads/${f.filename}`),
      createdAt: new Date()
    };
    const response = await Products.insertOne(product);
    return res.json({ message: "Product added successfully", data: response });
  } catch (e) {
    return res.status(500).json({ error: "Error adding product", details: e.message });
  }
});

router.get("/user/products", async (req, res) => {
  const response = await Products.find().sort({ createdAt: -1 }).toArray();
  if (response.length > 0) return res.json(response);
  return res.json([]);
});

router.get("/user/product/:id", async (req, res) => {
  const product = await Products.findOne({ _id: new ObjectId(req.params.id) });
  if (product) return res.json(product);
  return res.status(404).json({ message: "Product not found" });
});

/** Update product (title/description) + optionally replace image */
router.put("/user/product/:id", upload.single("image"), async (req, res) => {
  try {
    const id = new ObjectId(req.params.id);
    const prev = await Products.findOne({ _id: id });
    if (!prev) return res.status(404).json({ message: "Product not found" });

    let image = prev.image;
    if (req.file) {
      // delete old file if exists & it's a local upload path
      if (image && image.startsWith("/uploads/")) {
        const oldPath = path.join(process.cwd(), image);
        fs.existsSync(oldPath) && fs.unlinkSync(oldPath);
      }
      image = `/uploads/${req.file.filename}`;
    }

    const result = await Products.updateOne(
      { _id: id },
      {
        $set: {
          title: req.body.title ?? prev.title,
          description: req.body.description ?? prev.description,
          price: req.body.price ? Number(req.body.price) : prev.price,
          image
        }
      }
    );
    return res.json({ message: "Product updated successfully", data: result });
  } catch (e) {
    return res.status(500).json({ message: "Update failed", error: e.message });
  }
});

router.delete("/user/product/:id", async (req, res) => {
  try {
    const id = new ObjectId(req.params.id);
    const prev = await Products.findOne({ _id: id });
    if (!prev) return res.status(404).json({ message: "Product not found" });

    if (prev.image && prev.image.startsWith("/uploads/")) {
      const p = path.join(process.cwd(), prev.image);
      if (fs.existsSync(p)) fs.unlinkSync(p);
    }

    const del = await Products.deleteOne({ _id: id });
    return res.json({ message: "Product deleted", data: del });
  } catch (e) {
    return res.status(500).json({ message: "Delete failed", error: e.message });
  }
});

/** Placeholder cart/checkout (as in your original) */
router.post("/user/cart/:productId/:userId", (req, res) => {
  const cart = false; // example placeholder
  if (cart) res.send("removed cart");
  else res.send("added to cart");
});

router.get("/user/cart/:userId", (req, res) => {
  res.send("this is user cart");
});

router.post("/user/checkout/:cartId", (req, res) => {
  res.send("order placed successfully");
});

export default router;
