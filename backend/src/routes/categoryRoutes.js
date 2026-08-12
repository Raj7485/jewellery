import express from "express";
import Category from "../models/Category.js";

const router = express.Router();

router.get("/", async (_req, res, next) => {
  try {
    const categories = await Category.find().sort({ name: 1 });
    res.json({ data: categories });
  } catch (error) {
    next(error);
  }
});

export default router;
