import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import Product from "../models/Product.js";

const router = express.Router();

router.use(protect);

router.get("/", async (req, res, next) => {
  try {
    await req.user.populate("favorites");
    res.json({ data: req.user.favorites });
  } catch (error) {
    next(error);
  }
});

router.post("/:productId", async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.productId);

    if (!product) {
      return res.status(404).json({ message: "Product not found." });
    }

    const favoriteIds = req.user.favorites.map((favorite) =>
      favorite._id ? favorite._id.toString() : favorite.toString()
    );

    if (!favoriteIds.includes(product._id.toString())) {
      req.user.favorites.push(product._id);
      await req.user.save();
    }

    await req.user.populate("favorites");
    res.json({
      data: req.user.favorites,
      message: "Added to favorites.",
    });
  } catch (error) {
    next(error);
  }
});

router.delete("/:productId", async (req, res, next) => {
  try {
    req.user.favorites = req.user.favorites.filter((favorite) => {
      const favoriteId = favorite._id ? favorite._id.toString() : favorite.toString();
      return favoriteId !== req.params.productId;
    });

    await req.user.save();
    await req.user.populate("favorites");

    res.json({
      data: req.user.favorites,
      message: "Removed from favorites.",
    });
  } catch (error) {
    next(error);
  }
});

export default router;
