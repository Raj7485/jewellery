import express from "express";
import ContactMessage from "../models/ContactMessage.js";

const router = express.Router();

router.post("/", async (req, res, next) => {
  try {
    const { name, email, subject, message } = req.body;

    if (!name || !email || !subject || !message) {
      return res.status(400).json({ message: "Please fill in all contact fields." });
    }

    const contactMessage = await ContactMessage.create({
      name,
      email,
      subject,
      message,
    });

    res.status(201).json({
      data: contactMessage,
      message: "Message sent successfully.",
    });
  } catch (error) {
    next(error);
  }
});

export default router;
