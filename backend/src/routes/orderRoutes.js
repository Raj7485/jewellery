import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import Offer from "../models/Offer.js";
import Order from "../models/Order.js";
import Product from "../models/Product.js";

const router = express.Router();
const GST_RATE = 0.03;
const FREE_DELIVERY_THRESHOLD = 20000;
const DELIVERY_FEE = 249;
const USD_TO_INR_RATE = 83;

router.use(protect);

function getProductId(product) {
  return product?._id ? product._id.toString() : product?.toString();
}

function calculateOfferDiscount(offer, subtotal) {
  if (!offer || offer.status !== "active" || subtotal < offer.minSpend) {
    return 0;
  }

  if (offer.discountType === "free_shipping") {
    return 0;
  }

  if (offer.discountType === "fixed") {
    return Math.min(offer.discountValue, subtotal);
  }

  const discount = subtotal * (offer.discountValue / 100);
  return offer.maxDiscount ? Math.min(discount, offer.maxDiscount) : discount;
}

function toInrAmount(value, currency = "$") {
  const amount = Number(value) || 0;
  const normalizedCurrency = String(currency || "$").toUpperCase();

  if (normalizedCurrency === "INR" || currency === "₹") {
    return amount;
  }

  return amount * USD_TO_INR_RATE;
}

router.get("/mine", async (req, res, next) => {
  try {
    const orders = await Order.find({ user: req.user._id }).sort({ createdAt: -1 });
    res.json({ data: orders });
  } catch (error) {
    next(error);
  }
});

router.post("/", async (req, res, next) => {
  try {
    const cartItems = req.user.cartItems.filter((item) => item.product);

    if (!cartItems.length) {
      return res.status(400).json({ message: "Your cart is empty." });
    }

    const productIds = cartItems.map((item) => getProductId(item.product));
    const products = await Product.find({ _id: { $in: productIds } });
    const productMap = new Map(products.map((product) => [product._id.toString(), product]));

    const orderItems = [];

    for (const item of cartItems) {
      const productId = getProductId(item.product);
      const product = productMap.get(productId);
      const quantity = Number(item.quantity) || 1;

      if (!product) {
        return res.status(404).json({ message: "A product in your cart no longer exists." });
      }

      if (product.stock < quantity) {
        return res.status(400).json({
          message: `${product.name} only has ${product.stock} item(s) in stock.`,
        });
      }

      const unitPrice = toInrAmount(product.price, product.currency);

      orderItems.push({
        product: product._id,
        name: product.name,
        image: product.image,
        category: product.category,
        price: unitPrice,
        quantity,
        subtotal: unitPrice * quantity,
      });
    }

    const subtotal = orderItems.reduce((sum, item) => sum + item.subtotal, 0);
    const couponCode = String(req.body.couponCode || "").trim().toUpperCase();
    const offer = couponCode ? await Offer.findOne({ code: couponCode }) : null;
    const discount = calculateOfferDiscount(offer, subtotal);
    const taxableAmount = Math.max(subtotal - discount, 0);
    const freeShipping = offer?.discountType === "free_shipping" && subtotal >= offer.minSpend;
    const delivery =
      taxableAmount > 0 && taxableAmount < FREE_DELIVERY_THRESHOLD && !freeShipping
        ? DELIVERY_FEE
        : 0;
    const gst = taxableAmount * GST_RATE;
    const total = taxableAmount + gst + delivery;
    const orderNumber = `LJ-${Date.now().toString().slice(-7)}`;

    const order = await Order.create({
      orderNumber,
      user: req.user._id,
      customer: {
        name: req.body.name || req.user.name,
        email: req.body.email || req.user.email,
        phone: req.body.phone || "",
        address: req.body.address || "",
      },
      items: orderItems,
      subtotal,
      discount,
      gst,
      delivery,
      total,
      couponCode,
      paymentMethod: req.body.paymentMethod || "cod",
      notes: req.body.notes || "",
    });

    await Promise.all(
      orderItems.map((item) =>
        Product.findByIdAndUpdate(item.product, { $inc: { stock: -item.quantity } })
      )
    );

    if (offer) {
      offer.usageCount += 1;
      await offer.save();
    }

    req.user.cartItems = [];
    await req.user.save();

    res.status(201).json({ data: order, message: "Order placed successfully." });
  } catch (error) {
    next(error);
  }
});

export default router;
