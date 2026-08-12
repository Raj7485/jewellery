import express from "express";
import NewsletterSubscriber from "../models/NewsletterSubscriber.js";

const router = express.Router();

router.post("/", async (req, res, next) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ message: "Email is required." });
    }

    const subscriber = await NewsletterSubscriber.create({ email });

    res.status(201).json({
      data: subscriber,
      message: "Thanks for subscribing.",
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(200).json({ message: "You are already subscribed." });
    }

    next(error);
  }
});

export default router;
