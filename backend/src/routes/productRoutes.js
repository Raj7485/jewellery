import express from "express";
import Product from "../models/Product.js";

const router = express.Router();

router.get("/", async (req, res, next) => {
  try {
    const { category, featured, search } = req.query;
    const filter = {};

    if (category && category !== "All") {
      filter.category = category;
    }

    if (featured === "true") {
      filter.featured = true;
    }

    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: "i" } },
        { category: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
      ];
    }

    const products = await Product.find(filter).sort({ featured: -1, createdAt: -1 });
    res.json({ data: products });
  } catch (error) {
    next(error);
  }
});

router.get("/:slug", async (req, res, next) => {
  try {
    const product = await Product.findOne({ slug: req.params.slug });

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.json({ data: product });
  } catch (error) {
    next(error);
  }
});

export default router;
