import fs from "node:fs/promises";
import path from "node:path";
import express from "express";
import { adminOnly, protect } from "../middleware/authMiddleware.js";
import Category from "../models/Category.js";
import ContactMessage from "../models/ContactMessage.js";
import NewsletterSubscriber from "../models/NewsletterSubscriber.js";
import Offer from "../models/Offer.js";
import Order from "../models/Order.js";
import Product from "../models/Product.js";
import User from "../models/User.js";
import { slugify } from "../utils/slugify.js";

const router = express.Router();

router.use(protect, adminOnly);

function parseDataUrl(dataUrl) {
  const match = String(dataUrl || "").match(/^data:(image\/(?:png|jpe?g|webp|gif));base64,(.+)$/);

  if (!match) {
    return null;
  }

  const extensions = {
    "image/png": "png",
    "image/jpeg": "jpg",
    "image/jpg": "jpg",
    "image/webp": "webp",
    "image/gif": "gif",
  };

  return {
    mimeType: match[1],
    extension: extensions[match[1]],
    buffer: Buffer.from(match[2], "base64"),
  };
}

async function uniqueProductSlug(name, currentId) {
  const baseSlug = slugify(name) || `product-${Date.now()}`;
  let slug = baseSlug;
  let counter = 2;

  while (
    await Product.exists({
      slug,
      ...(currentId ? { _id: { $ne: currentId } } : {}),
    })
  ) {
    slug = `${baseSlug}-${counter}`;
    counter += 1;
  }

  return slug;
}

function productPayload(body) {
  return {
    name: body.name,
    category: body.category,
    price: Number(body.price),
    currency: body.currency || "$",
    rating: Number(body.rating) || 5,
    image: body.image,
    badge: body.badge || "Featured",
    featured: Boolean(body.featured),
    stock: Number(body.stock) || 0,
    description: body.description,
  };
}

router.get("/summary", async (_req, res, next) => {
  try {
    const [products, orders, users, offers, contacts, subscribers] = await Promise.all([
      Product.find(),
      Order.find().sort({ createdAt: -1 }).limit(8),
      User.find().sort({ createdAt: -1 }).limit(8),
      Offer.find().sort({ createdAt: -1 }),
      ContactMessage.find().sort({ createdAt: -1 }).limit(8),
      NewsletterSubscriber.find().sort({ createdAt: -1 }).limit(8),
    ]);

    const totalRevenue = orders
      .filter((order) => order.status !== "cancelled")
      .reduce((sum, order) => sum + order.total, 0);
    const inventoryValue = products.reduce(
      (sum, product) => sum + product.price * product.stock,
      0
    );

    res.json({
      data: {
        metrics: {
          totalRevenue,
          orderCount: await Order.countDocuments(),
          productCount: products.length,
          userCount: await User.countDocuments(),
          lowStockCount: products.filter((product) => product.stock <= 5).length,
          inventoryValue,
        },
        products,
        orders,
        users,
        offers,
        contacts,
        subscribers,
      },
    });
  } catch (error) {
    next(error);
  }
});

router.post("/upload", async (req, res, next) => {
  try {
    const parsed = parseDataUrl(req.body.dataUrl);

    if (!parsed) {
      return res.status(400).json({ message: "Upload a valid image file." });
    }

    if (parsed.buffer.length > 4 * 1024 * 1024) {
      return res.status(400).json({ message: "Image must be smaller than 4MB." });
    }

    const uploadDir = path.join(process.cwd(), "uploads");
    await fs.mkdir(uploadDir, { recursive: true });

    const filename = `${Date.now()}-${slugify(req.body.filename || "product")}.${parsed.extension}`;
    await fs.writeFile(path.join(uploadDir, filename), parsed.buffer);

    res.status(201).json({ data: { url: `/uploads/${filename}` } });
  } catch (error) {
    next(error);
  }
});

router.get("/products", async (req, res, next) => {
  try {
    const search = req.query.search;
    const filter = search
      ? {
          $or: [
            { name: { $regex: search, $options: "i" } },
            { category: { $regex: search, $options: "i" } },
            { badge: { $regex: search, $options: "i" } },
          ],
        }
      : {};
    const products = await Product.find(filter).sort({ createdAt: -1 });
    res.json({ data: products });
  } catch (error) {
    next(error);
  }
});

router.post("/products", async (req, res, next) => {
  try {
    const payload = productPayload(req.body);

    if (!payload.name || !payload.category || !payload.image || !payload.description) {
      return res.status(400).json({ message: "Name, category, image, and description are required." });
    }

    payload.slug = await uniqueProductSlug(payload.name);
    const product = await Product.create(payload);
    res.status(201).json({ data: product, message: "Product created." });
  } catch (error) {
    next(error);
  }
});

router.patch("/products/:id", async (req, res, next) => {
  try {
    const payload = productPayload(req.body);

    if (payload.name) {
      payload.slug = await uniqueProductSlug(payload.name, req.params.id);
    }

    const product = await Product.findByIdAndUpdate(req.params.id, payload, {
      new: true,
      runValidators: true,
    });

    if (!product) {
      return res.status(404).json({ message: "Product not found." });
    }

    res.json({ data: product, message: "Product updated." });
  } catch (error) {
    next(error);
  }
});

router.delete("/products/:id", async (req, res, next) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);

    if (!product) {
      return res.status(404).json({ message: "Product not found." });
    }

    res.json({ data: product, message: "Product deleted." });
  } catch (error) {
    next(error);
  }
});

router.get("/categories", async (_req, res, next) => {
  try {
    const categories = await Category.find().sort({ name: 1 });
    res.json({ data: categories });
  } catch (error) {
    next(error);
  }
});

router.get("/orders", async (_req, res, next) => {
  try {
    const orders = await Order.find().sort({ createdAt: -1 }).populate("user", "name email role");
    res.json({ data: orders });
  } catch (error) {
    next(error);
  }
});

router.patch("/orders/:id", async (req, res, next) => {
  try {
    const order = await Order.findByIdAndUpdate(
      req.params.id,
      {
        status: req.body.status,
        paymentStatus: req.body.paymentStatus,
        notes: req.body.notes || "",
      },
      { new: true, runValidators: true }
    );

    if (!order) {
      return res.status(404).json({ message: "Order not found." });
    }

    res.json({ data: order, message: "Order updated." });
  } catch (error) {
    next(error);
  }
});

router.get("/users", async (_req, res, next) => {
  try {
    const users = await User.find().select("-password").sort({ createdAt: -1 });
    res.json({ data: users });
  } catch (error) {
    next(error);
  }
});

router.patch("/users/:id", async (req, res, next) => {
  try {
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { role: req.body.role },
      { new: true, runValidators: true }
    ).select("-password");

    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    res.json({ data: user, message: "User role updated." });
  } catch (error) {
    next(error);
  }
});

router.get("/offers", async (_req, res, next) => {
  try {
    const offers = await Offer.find().sort({ createdAt: -1 });
    res.json({ data: offers });
  } catch (error) {
    next(error);
  }
});

router.post("/offers", async (req, res, next) => {
  try {
    const offer = await Offer.create({
      ...req.body,
      code: String(req.body.code || "").toUpperCase(),
    });
    res.status(201).json({ data: offer, message: "Offer created." });
  } catch (error) {
    next(error);
  }
});

router.patch("/offers/:id", async (req, res, next) => {
  try {
    const offer = await Offer.findByIdAndUpdate(
      req.params.id,
      { ...req.body, code: String(req.body.code || "").toUpperCase() },
      { new: true, runValidators: true }
    );

    if (!offer) {
      return res.status(404).json({ message: "Offer not found." });
    }

    res.json({ data: offer, message: "Offer updated." });
  } catch (error) {
    next(error);
  }
});

router.delete("/offers/:id", async (req, res, next) => {
  try {
    const offer = await Offer.findByIdAndDelete(req.params.id);

    if (!offer) {
      return res.status(404).json({ message: "Offer not found." });
    }

    res.json({ data: offer, message: "Offer deleted." });
  } catch (error) {
    next(error);
  }
});

router.get("/contacts", async (_req, res, next) => {
  try {
    const contacts = await ContactMessage.find().sort({ createdAt: -1 });
    res.json({ data: contacts });
  } catch (error) {
    next(error);
  }
});

router.get("/subscribers", async (_req, res, next) => {
  try {
    const subscribers = await NewsletterSubscriber.find().sort({ createdAt: -1 });
    res.json({ data: subscribers });
  } catch (error) {
    next(error);
  }
});

export default router;
