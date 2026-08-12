import jwt from "jsonwebtoken";
import User from "../models/User.js";

export async function protect(req, res, next) {
  try {
    const authHeader = req.headers.authorization || "";
    const token = authHeader.startsWith("Bearer ")
      ? authHeader.slice(7)
      : null;

    if (!token) {
      return res.status(401).json({ message: "Please log in first." });
    }

    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET || "development-jewelry-secret"
    );

    const user = await User.findById(decoded.userId)
      .populate("favorites")
      .populate("cartItems.product");

    if (!user) {
      return res.status(401).json({ message: "User account no longer exists." });
    }

    req.user = user;
    next();
  } catch (_error) {
    res.status(401).json({ message: "Your session expired. Please log in again." });
  }
}
