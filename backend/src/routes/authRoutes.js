import express from "express";
import User from "../models/User.js";
import { protect } from "../middleware/authMiddleware.js";
import { createToken } from "../utils/createToken.js";

const router = express.Router();

function toAuthResponse(user) {
  return {
    token: createToken(user._id),
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      favorites: (user.favorites || []).map((favorite) =>
        favorite._id ? favorite._id.toString() : favorite.toString()
      ),
      cartItems: user.cartItems || [],
    },
  };
}

router.post("/register", async (req, res, next) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: "Name, email, and password are required." });
    }

    if (password.length < 6) {
      return res.status(400).json({ message: "Password must be at least 6 characters." });
    }

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(409).json({ message: "An account with this email already exists." });
    }

    const adminEmails = (process.env.ADMIN_EMAILS || "")
      .split(",")
      .map((value) => value.trim().toLowerCase())
      .filter(Boolean);
    const existingUsers = await User.estimatedDocumentCount();
    const role =
      existingUsers === 0 || adminEmails.includes(email.toLowerCase())
        ? "admin"
        : "customer";

    const user = await User.create({ name, email, password, role });
    res.status(201).json(toAuthResponse(user));
  } catch (error) {
    next(error);
  }
});

router.post("/login", async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required." });
    }

    const user = await User.findOne({ email }).select("+password");

    if (!user || !(await user.comparePassword(password))) {
      return res.status(401).json({ message: "Invalid email or password." });
    }

    res.json(toAuthResponse(user));
  } catch (error) {
    next(error);
  }
});

router.get("/me", protect, (req, res) => {
  const cartItems = (req.user.cartItems || [])
    .filter((item) => item.product)
    .map((item) => ({
      product: item.product,
      quantity: item.quantity,
      subtotal: item.quantity * item.product.price,
    }));

  const totalItems = cartItems.reduce((total, item) => total + item.quantity, 0);
  const total = cartItems.reduce((sum, item) => sum + item.subtotal, 0);

  res.json({
    data: {
      id: req.user._id,
      name: req.user.name,
      email: req.user.email,
      role: req.user.role,
      favorites: req.user.favorites,
      cartItems,
      cartTotalItems: totalItems,
      cartTotal: total,
    },
  });
});

export default router;
