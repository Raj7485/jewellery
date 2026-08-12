import express from "express";
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

router.get("/", async (req, res, next) => {
  try {
    await sendCart(req.user, res);
  } catch (error) {
    next(error);
  }
});

router.post("/", async (req, res, next) => {
  try {
    const { productId } = req.body;
    const quantity = sanitizeQuantity(req.body.quantity);

    if (!productId) {
      return res.status(400).json({ message: "Product id is required." });
    }

    const product = await Product.findById(productId);

    if (!product) {
      return res.status(404).json({ message: "Product not found." });
    }

    if (product.stock < 1) {
      return res.status(400).json({ message: "This product is currently out of stock." });
    }

    const existingItem = req.user.cartItems.find(
      (item) => productIdFromItem(item) === product._id.toString()
    );

    if (existingItem) {
      existingItem.quantity = Math.min(existingItem.quantity + quantity, product.stock);
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
