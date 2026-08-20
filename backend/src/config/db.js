import mongoose from "mongoose";
import Category from "../models/Category.js";
import Offer from "../models/Offer.js";
import Product from "../models/Product.js";
import User from "../models/User.js";
import { categories, offers, products } from "../data/seedData.js";

export async function connectDB() {
  const mongoUri = process.env.MONGO_URI || "mongodb://127.0.0.1:27017/jewellry";

  await mongoose.connect(mongoUri);
  console.log(`MongoDB connected: ${mongoose.connection.name}`);

  await seedStarterData();
  await ensureAdminUser();
}

async function seedStarterData() {
  const [categoryResult, productResult, offerResult] = await Promise.all([
    Category.bulkWrite(
      categories.map((category) => ({
        updateOne: {
          filter: { slug: category.slug },
          update: { $setOnInsert: category },
          upsert: true,
        },
      }))
    ),
    Product.bulkWrite(
      products.map((product) => ({
        updateOne: {
          filter: { slug: product.slug },
          update: { $setOnInsert: product },
          upsert: true,
        },
      }))
    ),
    Offer.bulkWrite(
      offers.map((offer) => ({
        updateOne: {
          filter: { code: offer.code },
          update: { $setOnInsert: offer },
          upsert: true,
        },
      }))
    ),
  ]);

  if (categoryResult.upsertedCount > 0) {
    console.log(`Seeded ${categoryResult.upsertedCount} starter categories`);
  }

  if (productResult.upsertedCount > 0) {
    console.log(`Seeded ${productResult.upsertedCount} starter products`);
  }

  if (offerResult.upsertedCount > 0) {
    console.log(`Seeded ${offerResult.upsertedCount} starter offers`);
  }
}

async function ensureAdminUser() {
  const adminEmails = (process.env.ADMIN_EMAILS || "")
    .split(",")
    .map((value) => value.trim().toLowerCase())
    .filter(Boolean);

  if (adminEmails.length) {
    await User.updateMany({ email: { $in: adminEmails } }, { $set: { role: "admin" } });
  }

  const adminExists = await User.exists({ role: "admin" });

  if (adminExists) {
    return;
  }

  const firstUser = await User.findOne().sort({ createdAt: 1 });

  if (firstUser) {
    firstUser.role = "admin";
    await firstUser.save();
    console.log(`Promoted ${firstUser.email} to admin`);
  }
}
