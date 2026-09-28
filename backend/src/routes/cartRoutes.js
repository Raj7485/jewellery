import express from "express";
import mongoose from "mongoose";
import { protect } from "../middleware/authMiddleware.js";
import Product from "../models/Product.js";

const router = express.Router();

router.use(protect);

function productIdFromItem(item) {
  if (!item.product) {
    return "";
  }
  return item.product?._id ? item.product._id.toString() : item.product.toString();
}

function sanitizeQuantity(value, fallback = 1) {
  const quantity = Number.parseInt(value, 10);
  return Number.isFinite(quantity) && quantity > 0 ? quantity : fallback;
}

async function sendCart(user, res, message) {
  await user.populate("cartItems.product");

  const data = user.cartItems
    .filter((item) => item.product)
    .map((item) => ({
      product: item.product,
      quantity: item.quantity,
      subtotal: item.quantity * item.product.price,
    }));

  const totalItems = data.reduce((total, item) => total + item.quantity, 0);
  const total = data.reduce((sum, item) => sum + item.subtotal, 0);

  res.json({
    data,
    totalItems,
    total,
    ...(message ? { message } : {}),
  });
}

/* ─── GET /api/cart ──────────────────────────── */
router.get("/", async (req, res, next) => {
  try {
    await sendCart(req.user, res);
  } catch (error) {
    next(error);
  }
});

/* ─── POST /api/cart ─────────────────────────── */
router.post("/", async (req, res, next) => {
  try {
    const { productId } = req.body;
    const quantity = sanitizeQuantity(req.body.quantity);

    if (!productId) {
      return res.status(400).json({ message: "Product id is required." });
    }

    // Accept MongoDB ObjectId OR slug as productId
    let product = null;

    if (mongoose.Types.ObjectId.isValid(productId)) {
      product = await Product.findById(productId);
    }

    // Fall back to slug lookup if not found by ObjectId
    if (!product) {
      product = await Product.findOne({ slug: String(productId) });
    }

    // Last resort: search by name (handles static fallback data)
    if (!product) {
      product = await Product.findOne({ name: String(productId) });
    }

    if (!product) {
      return res.status(404).json({ message: "Product not found." });
    }

    if (product.stock < 1) {
      return res
        .status(400)
        .json({ message: `${product.name} is out of stock.` });
    }

    const existingItem = req.user.cartItems.find(
      (item) => productIdFromItem(item) === product._id.toString()
    );

    if (existingItem) {
      existingItem.quantity = Math.min(
        existingItem.quantity + quantity,
        product.stock
      );
    } else {
      req.user.cartItems.push({
        product: product._id,
        quantity: Math.min(quantity, product.stock),
      });
    }

    await req.user.save();
    await sendCart(req.user, res, "Added to cart.");
  } catch (error) {
    next(error);
  }
});

/* ─── PATCH /api/cart/:productId ─────────────── */
router.patch("/:productId", async (req, res, next) => {
  try {
    const quantity = sanitizeQuantity(req.body.quantity, 0);
    const cartItem = req.user.cartItems.find(
      (item) => productIdFromItem(item) === req.params.productId
    );

    if (!cartItem) {
      return res.status(404).json({ message: "Cart item not found." });
    }

    if (quantity < 1) {
      req.user.cartItems = req.user.cartItems.filter(
        (item) => productIdFromItem(item) !== req.params.productId
      );
      await req.user.save();
      return sendCart(req.user, res, "Removed from cart.");
    }

    const product = await Product.findById(req.params.productId);

    if (!product) {
      return res.status(404).json({ message: "Product not found." });
    }

    cartItem.quantity = Math.min(quantity, product.stock);
    await req.user.save();
    await sendCart(req.user, res, "Cart updated.");
  } catch (error) {
    next(error);
  }
});

/* ─── DELETE /api/cart/:productId ────────────── */
router.delete("/:productId", async (req, res, next) => {
  try {
    req.user.cartItems = req.user.cartItems.filter(
      (item) => productIdFromItem(item) !== req.params.productId
    );
    await req.user.save();
    await sendCart(req.user, res, "Removed from cart.");
  } catch (error) {
    next(error);
  }
});

/* ─── DELETE /api/cart (clear) ───────────────── */
router.delete("/", async (req, res, next) => {
  try {
    req.user.cartItems = [];
    await req.user.save();
    await sendCart(req.user, res, "Cart cleared.");
  } catch (error) {
    next(error);
  }
});

export default router;
