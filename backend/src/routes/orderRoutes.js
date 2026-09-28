import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import Offer from "../models/Offer.js";
import Order from "../models/Order.js";
import Product from "../models/Product.js";
import { initiatePhonePePay, verifyPhonePeStatus } from "../utils/phonepe.js";

const router = express.Router();
const GST_RATE = 0.03;
const FREE_DELIVERY_THRESHOLD = 20000;
const DELIVERY_FEE = 249;
// All prices in the DB are stored in INR — no USD conversion needed.

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

function toInrAmount(value, currency = "INR") {
  // All prices are stored in INR — always return as-is.
  return Number(value) || 0;
}

/* ─── PhonePe Webhook Callback (Public) ───────────────────── */
router.post("/phonepe/callback", async (req, res) => {
  try {
    const { response } = req.body || {};
    if (response) {
      const decoded = JSON.parse(Buffer.from(response, "base64").toString("utf-8"));
      const merchantTransactionId = decoded.data?.merchantTransactionId;

      if (merchantTransactionId) {
        const order = await Order.findOne({ merchantTransactionId });
        if (order) {
          if (decoded.code === "PAYMENT_SUCCESS" || decoded.data?.state === "COMPLETED") {
            order.paymentStatus = "paid";
            order.status = "confirmed";
            order.phonepeTransactionId = decoded.data?.transactionId || order.phonepeTransactionId;
            order.paymentDetails = decoded.data || {};
            await order.save();
          }
        }
      }
    }
    return res.status(200).json({ status: "SUCCESS" });
  } catch (error) {
    console.error("PhonePe callback error:", error);
    return res.status(200).json({ status: "ERROR" });
  }
});

/* ─── PhonePe Status Verification ────────────────────────── */
router.get("/phonepe/status/:merchantTransactionId", async (req, res, next) => {
  try {
    const { merchantTransactionId } = req.params;
    const order = await Order.findOne({ merchantTransactionId });

    if (!order) {
      return res.status(404).json({ message: "Order not found for transaction." });
    }

    const phonepeRes = await verifyPhonePeStatus(merchantTransactionId);

    if (phonepeRes.code === "PAYMENT_SUCCESS" || phonepeRes.data?.state === "COMPLETED") {
      order.paymentStatus = "paid";
      if (order.status === "pending") {
        order.status = "confirmed";
      }
      order.phonepeTransactionId = phonepeRes.data?.transactionId || order.phonepeTransactionId;
      order.paymentDetails = phonepeRes.data || {};
      await order.save();
    } else if (phonepeRes.code === "PAYMENT_ERROR" || phonepeRes.data?.state === "FAILED") {
      order.paymentStatus = "pending";
      order.paymentDetails = phonepeRes.data || {};
      await order.save();
    }

    return res.json({
      success: true,
      order,
      phonepeData: phonepeRes.data,
      code: phonepeRes.code,
      message: phonepeRes.message,
    });
  } catch (error) {
    next(error);
  }
});

/* ─── Protected Routes ───────────────────────────────────── */
router.use(protect);

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

    const selectedPaymentMethod = req.body.paymentMethod || "cod";
    const isPhonePe = selectedPaymentMethod === "phonepe" || selectedPaymentMethod === "upi";
    const merchantTransactionId = isPhonePe
      ? `MT${Date.now()}${Math.random().toString(36).substring(2, 6).toUpperCase()}`
      : "";

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
      paymentMethod: selectedPaymentMethod,
      paymentStatus: "pending",
      merchantTransactionId,
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

    // If PhonePe payment, initiate payment with gateway
    if (isPhonePe) {
      try {
        const clientUrl = process.env.CLIENT_URL || "http://localhost:5173";
        const redirectUrl = `${clientUrl}/#cart?payment=check&txnId=${merchantTransactionId}&orderId=${order._id}`;
        const callbackUrl = `${process.env.BACKEND_URL || "http://localhost:5000"}/api/orders/phonepe/callback`;

        const phonepeResult = await initiatePhonePePay({
          merchantTransactionId,
          merchantUserId: req.user._id.toString(),
          amountInRupees: total,
          redirectUrl,
          callbackUrl,
          mobileNumber: req.body.phone || "9999999999",
        });

        return res.status(201).json({
          data: order,
          paymentUrl: phonepeResult.redirectUrl,
          merchantTransactionId,
          message: "Order placed. Redirecting to PhonePe...",
        });
      } catch (phonepeErr) {
        console.error("PhonePe Initiation Error:", phonepeErr);
        return res.status(201).json({
          data: order,
          warning: "Payment gateway initiation delayed. You can retry from your orders.",
          message: "Order created. Please complete payment.",
        });
      }
    }

    res.status(201).json({ data: order, message: "Order placed successfully." });
  } catch (error) {
    next(error);
  }
});

export default router;
