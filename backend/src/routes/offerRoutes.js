import express from "express";
import Offer from "../models/Offer.js";

const router = express.Router();

router.get("/", async (_req, res, next) => {
  try {
    const now = new Date();
    const offers = await Offer.find({
      status: "active",
      $and: [
        { $or: [{ startsAt: { $exists: false } }, { startsAt: { $lte: now } }] },
        { $or: [{ endsAt: { $exists: false } }, { endsAt: { $gte: now } }] },
      ],
    }).sort({ createdAt: -1 });

    res.json({ data: offers });
  } catch (error) {
    next(error);
  }
});

export default router;
