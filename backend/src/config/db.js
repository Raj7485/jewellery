import mongoose from "mongoose";
import Category from "../models/Category.js";
import Product from "../models/Product.js";
import { categories, products } from "../data/seedData.js";

export async function connectDB() {
  const mongoUri = process.env.MONGO_URI || "mongodb://127.0.0.1:27017/jewellry";

  await mongoose.connect(mongoUri);
  console.log(`MongoDB connected: ${mongoose.connection.name}`);

  await seedStarterData();
}

async function seedStarterData() {
  const [categoryResult, productResult] = await Promise.all([
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
  ]);

  if (categoryResult.upsertedCount > 0) {
    console.log(`Seeded ${categoryResult.upsertedCount} starter categories`);
  }

  if (productResult.upsertedCount > 0) {
    console.log(`Seeded ${productResult.upsertedCount} starter products`);
  }
}
