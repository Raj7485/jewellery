import { useEffect, useMemo, useState } from "react";
import {
  FiAlertCircle,
  FiCheckCircle,
  FiClock,
  FiCreditCard,
  FiGift,
  FiMinus,
  FiPlus,
  FiShield,
  FiShoppingBag,
  FiTag,
  FiTrash2,
  FiTruck,
  FiX,
} from "react-icons/fi";
import CatalogImage from "../components/CatalogImage";
import FavoriteButton from "../components/FavoriteButton";
import {
  checkPhonePePaymentStatus,
  createOrder,
  getActiveOffers,
} from "../api/catalog";
import { useAuth } from "../context/AuthContext";
import { formatINR, toInrAmount } from "../utils/currency";

const GST_RATE = 0.03;
const FREE_DELIVERY_THRESHOLD = 20000;
const DELIVERY_FEE = 249;

const fallbackCoupons = {
  JEWEL10: {
    code: "JEWEL10",
    label: "10% off up to ₹5,000",
    minSpend: 20000,
    discount: (subtotal) => Math.min(subtotal * 0.1, 5000),
  },
  SPARKLE15: {
    code: "SPARKLE15",
    label: "15% off up to ₹9,000",
    minSpend: 50000,
    discount: (subtotal) => Math.min(subtotal * 0.15, 9000),
  },
  WELCOME500: {
    code: "WELCOME500",
    label: "₹500 off",
    minSpend: 5000,
    discount: () => 500,
  },
};

function couponFromOffer(offer) {
  return {
    code: offer.code,
    label:
      offer.discountType === "free_shipping"
        ? "Free shipping"
        : offer.discountType === "fixed"
          ? `${formatINR(offer.discountValue)} off`
          : `${offer.discountValue}% off${
              offer.maxDiscount ? ` up to ${formatINR(offer.maxDiscount)}` : ""
            }`,
    minSpend: offer.minSpend || 0,
    discount:
      offer.discountType === "fixed"
        ? () => offer.discountValue || 0
        : offer.discountType === "free_shipping"
          ? () => 0
          : (subtotal) => {
              const discount = subtotal * ((offer.discountValue || 0) / 100);
              return offer.maxDiscount ? Math.min(discount, offer.maxDiscount) : discount;
            },
  };
}

function getProductId(product) {
  return product._id || product.id;
}

/* ─── PhonePe Logo SVG ──────────────────────────────────── */
function PhonePeBadge() {
  return (
    <div className="inline-flex items-center gap-1.5 rounded-full bg-[#5F259F] px-2.5 py-1 text-xs font-bold text-white shadow-sm">
      <svg className="h-3.5 w-3.5" viewBox="0 0 48 48" fill="none">
        <circle cx="24" cy="24" r="24" fill="#5F259F" />
        <path
          d="M26.4 12H19.2C17.43 12 16 13.43 16 15.2V32.8C16 34.57 17.43 36 19.2 36H26.4C28.17 36 29.6 34.57 29.6 32.8V15.2C29.6 13.43 28.17 12 26.4 12Z"
          fill="white"
        />
        <path
          d="M22.5 16.5H25.5C26.33 16.5 27 17.17 27 18C27 18.83 26.33 19.5 25.5 19.5H22.5V16.5ZM22.5 21H24.5C25.33 21 26 21.67 26 22.5C26 23.33 25.33 24 24.5 24H22.5V21ZM19.5 14V34H22.5V25.5H24.5C26.98 25.5 29 23.48 29 21C29 19.7 28.45 18.52 27.56 17.72C28.44 16.92 29 15.74 29 14.5C29 12.02 26.98 10 24.5 10H19.5V14Z"
          fill="#5F259F"
        />
      </svg>
      <span>PhonePe</span>
    </div>
  );
}

/* ─── Payment Result Modal ──────────────────────────────── */
function PaymentResultModal({ result, onClose, onNavigateHome }) {
  if (!result) return null;

  const isSuccess =
    result.code === "PAYMENT_SUCCESS" ||
    result.order?.paymentStatus === "paid" ||
    result.order?.paymentMethod === "cod";
  const isPending =
    result.code === "PAYMENT_PENDING" ||
    result.order?.paymentStatus === "pending";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-lg overflow-hidden rounded-3xl bg-white p-6 shadow-2xl animate-fadeUp sm:p-8">
        <button
          onClick={onClose}
          className="absolute right-4 top-4 flex h-9 w-9 items-center justify-center rounded-full bg-stone-100 text-stone-600 transition hover:bg-stone-200"
        >
          <FiX size={18} />
        </button>

        <div className="text-center">
          <div
            className={`mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full ${
              isSuccess
                ? "bg-emerald-100 text-emerald-600"
                : isPending
                  ? "bg-amber-100 text-amber-600"
                  : "bg-rose-100 text-rose-600"
            }`}
          >
            {isSuccess ? (
              <FiCheckCircle size={36} />
            ) : isPending ? (
              <FiClock size={36} />
            ) : (
              <FiAlertCircle size={36} />
            )}
          </div>

          <p className="text-xs font-bold uppercase tracking-widest text-gold-600">
            {isSuccess
              ? "Payment Completed"
              : isPending
                ? "Payment Processing"
                : "Payment Incomplete"}
          </p>
          <h2 className="mt-1 font-display text-2xl font-bold text-charcoal sm:text-3xl">
            {isSuccess
              ? "Order Confirmed!"
              : isPending
                ? "Awaiting Confirmation"
                : "Payment Could Not Be Completed"}
          </h2>
          <p className="mt-2 text-sm text-stone-500">
            {result.message ||
              (isSuccess
                ? "Your order has been successfully placed."
                : "Please check your transaction status or try again.")}
          </p>
        </div>

        {result.order && (
          <div className="mt-6 rounded-2xl border border-stone-100 bg-stone-50 p-4 space-y-2.5 text-sm">
            <div className="flex justify-between items-center">
              <span className="text-stone-500">Order Number</span>
              <span className="font-mono font-bold text-charcoal">
                {result.order.orderNumber}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-stone-500">Amount Paid</span>
              <span className="font-bold text-charcoal">
                {formatINR(result.order.total || 0)}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-stone-500">Payment Gateway</span>
              <span className="font-semibold text-charcoal flex items-center gap-1.5">
                {result.order.paymentMethod === "phonepe" ? (
                  <>
                    <span className="h-2 w-2 rounded-full bg-[#5F259F]" /> PhonePe Sandbox
                  </>
                ) : (
                  result.order.paymentMethod?.toUpperCase()
                )}
              </span>
            </div>
            {result.order.phonepeTransactionId && (
              <div className="flex justify-between items-center">
                <span className="text-stone-500">PhonePe Txn ID</span>
                <span className="font-mono text-xs font-medium text-stone-700">
                  {result.order.phonepeTransactionId}
                </span>
              </div>
            )}
            {result.order.merchantTransactionId && (
              <div className="flex justify-between items-center">
                <span className="text-stone-500">Merchant Txn ID</span>
                <span className="font-mono text-xs text-stone-500">
                  {result.order.merchantTransactionId}
                </span>
              </div>
            )}
            <div className="flex justify-between items-center">
              <span className="text-stone-500">Payment Status</span>
              <span
                className={`rounded-full px-2.5 py-0.5 text-xs font-bold uppercase tracking-wide ${
                  result.order.paymentStatus === "paid"
                    ? "bg-emerald-100 text-emerald-700"
                    : "bg-amber-100 text-amber-700"
                }`}
              >
                {result.order.paymentStatus}
              </span>
            </div>
          </div>
        )}

        <div className="mt-6 flex flex-col gap-2.5 sm:flex-row">
          <button
            onClick={() => {
              onClose();
              if (onNavigateHome) onNavigateHome();
            }}
            className="flex-1 rounded-xl bg-charcoal py-3 text-sm font-semibold text-white transition hover:bg-stone-800"
          >
            Continue Shopping
          </button>
          <button
            onClick={onClose}
            className="rounded-xl border border-stone-200 bg-white px-5 py-3 text-sm font-semibold text-stone-700 transition hover:bg-stone-50"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

/* ─── CartPage Component ────────────────────────────────── */
export default function CartPage({
  onNavigateHome,
  onNavigateShop,
  onNavigateLogin,
  onNavigateFavorites,
}) {
  const {
    cartCount,
    cartItems,
    cartTotal,
    clearCart,
    isAuthenticated,
    loading,
    removeFromCart,
    refreshSession,
    updateCartQuantity,
    user,
  } = useAuth();
  const [pendingId, setPendingId] = useState("");
  const [clearing, setClearing] = useState(false);
  const [couponInput, setCouponInput] = useState("");
  const [appliedCoupon, setAppliedCoupon] = useState(null);
  const [couponMessage, setCouponMessage] = useState("");
  const [checkoutMessage, setCheckoutMessage] = useState("");
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [coupons, setCoupons] = useState(fallbackCoupons);
  const [paymentResult, setPaymentResult] = useState(null);
  const [isVerifyingPayment, setIsVerifyingPayment] = useState(false);

  const [checkoutData, setCheckoutData] = useState({
    phone: "",
    address: "",
    paymentMethod: "phonepe",
  });

  const subtotal = useMemo(() => toInrAmount(cartTotal), [cartTotal]);
  const couponDiscount = useMemo(() => {
    if (!appliedCoupon || subtotal < appliedCoupon.minSpend) {
      return 0;
    }

    return Math.min(appliedCoupon.discount(subtotal), subtotal);
  }, [appliedCoupon, subtotal]);
  const taxableAmount = Math.max(subtotal - couponDiscount, 0);
  const gst = taxableAmount * GST_RATE;
  const delivery = taxableAmount > 0 && taxableAmount < FREE_DELIVERY_THRESHOLD ? DELIVERY_FEE : 0;
  const grandTotal = taxableAmount + gst + delivery;
  const savingsToFreeDelivery = Math.max(FREE_DELIVERY_THRESHOLD - taxableAmount, 0);

  // Load Offers
  useEffect(() => {
    let isActive = true;

    async function loadOffers() {
      try {
        const response = await getActiveOffers();
        const activeCoupons = Object.fromEntries(
          (response.data || []).map((offer) => [offer.code, couponFromOffer(offer)])
        );

        if (isActive && Object.keys(activeCoupons).length) {
          setCoupons(activeCoupons);
        }
      } catch (_error) {
        if (isActive) {
          setCoupons(fallbackCoupons);
        }
      }
    }

    loadOffers();

    return () => {
      isActive = false;
    };
  }, []);

  // Check PhonePe redirect returns (auto-verify payment status)
  useEffect(() => {
    const searchParams = new URLSearchParams(window.location.search);
    let txnId = searchParams.get("txnId");
    let isCheck = searchParams.get("payment") === "check";

    if (!txnId && window.location.hash.includes("txnId=")) {
      const hashPart = window.location.hash.split("?")[1] || "";
      const hashParams = new URLSearchParams(hashPart);
      txnId = hashParams.get("txnId");
      isCheck = hashParams.get("payment") === "check" || Boolean(txnId);
    }

    if (txnId && isCheck) {
      setIsVerifyingPayment(true);
      checkPhonePePaymentStatus(txnId)
        .then((res) => {
          setPaymentResult(res);
          refreshSession();
        })
        .catch((err) => {
          setPaymentResult({
            success: false,
            code: "VERIFICATION_FAILED",
            message: err.message || "Failed to verify PhonePe transaction status.",
          });
        })
        .finally(() => {
          setIsVerifyingPayment(false);
          // Clean URL without reload
          const cleanUrl = window.location.pathname + "#cart";
          window.history.replaceState({}, document.title, cleanUrl);
        });
    }
  }, [refreshSession]);

  const handleQuantity = async (productId, quantity) => {
    setPendingId(productId);
    setCheckoutMessage("");
    try {
      await updateCartQuantity(productId, quantity);
    } finally {
      setPendingId("");
    }
  };

  const handleRemove = async (productId) => {
    setPendingId(productId);
    setCheckoutMessage("");
    try {
      await removeFromCart(productId);
    } finally {
      setPendingId("");
    }
  };

  const handleClear = async () => {
    setClearing(true);
    setCheckoutMessage("");
    try {
      await clearCart();
      setAppliedCoupon(null);
      setCouponInput("");
      setCouponMessage("");
    } finally {
      setClearing(false);
    }
  };

  const handleApplyCoupon = (event) => {
    event.preventDefault();

    const code = couponInput.trim().toUpperCase();
    const coupon = coupons[code];

    if (!coupon) {
      setAppliedCoupon(null);
      setCouponMessage(`Available: ${Object.keys(coupons).join(", ")}.`);
      return;
    }

    if (subtotal < coupon.minSpend) {
      setAppliedCoupon(null);
      setCouponMessage(`Add ${formatINR(coupon.minSpend - subtotal)} more to use ${code}.`);
      return;
    }

    setAppliedCoupon(coupon);
    setCouponInput(code);
    setCouponMessage(`${code} applied. ${coupon.label}`);
  };

  const handleCheckout = async () => {
    if (!cartItems.length) {
      return;
    }

    if (!checkoutData.phone.trim()) {
      setCheckoutMessage("Please enter your contact phone number.");
      return;
    }
    if (!checkoutData.address.trim()) {
      setCheckoutMessage("Please enter your delivery address.");
      return;
    }

    try {
      setIsCheckingOut(true);
      setCheckoutMessage("");
      const response = await createOrder({
        name: user?.name,
        email: user?.email,
        phone: checkoutData.phone,
        address: checkoutData.address,
        paymentMethod: checkoutData.paymentMethod,
        couponCode: appliedCoupon?.code || "",
      });

      // If PhonePe paymentUrl is returned, redirect to PhonePe Sandbox Simulator
      if (response.paymentUrl) {
        setCheckoutMessage("Redirecting to PhonePe Sandbox Payment Gateway...");
        window.location.href = response.paymentUrl;
        return;
      }

      await refreshSession();
      setAppliedCoupon(null);
      setCouponInput("");
      setCheckoutMessage(
        `${response.data.orderNumber} placed successfully at ${formatINR(response.data.total)}.`
      );
      setPaymentResult({
        success: true,
        order: response.data,
        message: "Order placed successfully.",
      });
    } catch (error) {
      setCheckoutMessage(error.message || "Checkout failed. Please try again.");
    } finally {
      setIsCheckingOut(false);
    }
  };

  if (!isAuthenticated && !loading) {
    return (
      <section className="mx-auto max-w-4xl px-4 py-16 text-center sm:px-6 lg:px-8">
        <p className="text-xs font-semibold uppercase tracking-[0.3em] text-gold-700">
          Shopping bag
        </p>
        <h1 className="mt-3 font-display text-4xl font-semibold text-charcoal sm:text-5xl">
          Login to build your cart
        </h1>
        <p className="mx-auto mt-4 max-w-xl text-sm leading-7 text-stone-600">
          Your cart is saved to your account, so every selected jewelry piece is
          waiting when you return.
        </p>
        <button
          type="button"
          onClick={onNavigateLogin}
          className="mt-8 rounded-full bg-charcoal px-7 py-3 text-sm font-semibold text-white transition hover:bg-black"
        >
          Login or Register
        </button>
      </section>
    );
  }

  return (
    <section className="mx-auto max-w-7xl px-4 py-8 pb-16 sm:px-6 sm:py-10 sm:pb-20 lg:px-8 lg:py-12 lg:pb-24">
      {/* Verification Overlay */}
      {isVerifyingPayment && (
        <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-black/60 backdrop-blur-sm text-white">
          <div className="h-12 w-12 animate-spin rounded-full border-4 border-white/20 border-t-[#5F259F]" />
          <p className="mt-4 text-base font-semibold">Verifying PhonePe Payment...</p>
          <p className="text-xs text-stone-300">Checking transaction status with gateway</p>
        </div>
      )}

      {/* Payment Result Modal */}
      <PaymentResultModal
        result={paymentResult}
        onClose={() => setPaymentResult(null)}
        onNavigateHome={onNavigateHome}
      />

      <div className="mb-6 flex flex-wrap items-center justify-between gap-3 sm:mb-7">
        <div className="flex items-center gap-2 text-sm text-stone-500">
          <button
            type="button"
            onClick={onNavigateHome}
            className="font-medium text-gold-800 transition hover:text-gold-700"
          >
            Home
          </button>
          <span>/</span>
          <span className="text-stone-700">Cart</span>
        </div>

        <button
          type="button"
          onClick={onNavigateShop}
          className="inline-flex items-center justify-center gap-2 rounded-full border border-black/10 bg-white px-5 py-3 text-sm font-semibold text-charcoal transition hover:-translate-y-0.5 hover:border-gold-300 hover:text-gold-700"
        >
          <FiShoppingBag />
          Continue Shopping
        </button>
      </div>

      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_420px]">
        <div className="space-y-5">
          <div className="overflow-hidden rounded-[1.5rem] border border-black/5 bg-white shadow-luxe">
            <div className="grid gap-0 md:grid-cols-[1fr_260px]">
              <div className="bg-charcoal p-6 text-white sm:p-8">
                <p className="text-xs font-semibold uppercase tracking-[0.3em] text-gold-300">
                  checkout
                </p>
                <h1 className="mt-3 font-display text-4xl font-semibold tracking-tight sm:text-5xl">
                  Your Cart
                </h1>
                <p className="mt-3 max-w-xl text-sm leading-7 text-white/70">
                  Review quantities, apply a coupon, see GST, and checkout with
                  secure PhonePe or Cash on Delivery.
                </p>
              </div>
              <div className="grid grid-cols-3 gap-px bg-black/5 text-center md:grid-cols-1">
                {[
                  { label: "Items", value: cartCount },
                  { label: "Subtotal", value: formatINR(subtotal) },
                  { label: "GST", value: "3%" },
                ].map((item) => (
                  <div key={item.label} className="bg-ivory px-3 py-5">
                    <p className="text-lg font-semibold text-charcoal">{item.value}</p>
                    <p className="mt-1 text-[0.68rem] font-semibold uppercase tracking-[0.18em] text-stone-500">
                      {item.label}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {cartItems.length ? (
            <div className="space-y-4">
              {cartItems.map((item) => {
                const product = item.product;
                const productId = getProductId(product);
                const isPending = pendingId === productId;
                const stock = Number(product.stock) || 1;
                const itemSubtotal = toInrAmount(item.subtotal);

                return (
                  <article
                    key={productId}
                    className={`group grid gap-4 rounded-[1.5rem] border border-black/5 bg-white p-3 shadow-sm transition duration-300 hover:-translate-y-0.5 hover:shadow-luxe sm:grid-cols-[136px_minmax(0,1fr)] sm:p-4 ${
                      isPending ? "opacity-70" : ""
                    }`}
                  >
                    <div className="relative overflow-hidden rounded-[1.1rem] bg-ivory">
                      <CatalogImage
                        src={product.image}
                        alt={product.name}
                        category={product.category}
                        className="aspect-square w-full object-cover transition duration-500 group-hover:scale-105 sm:h-full"
                      />
                      <FavoriteButton
                        product={product}
                        onAuthRequired={onNavigateLogin}
                        className="absolute right-3 top-3 h-9 w-9"
                      />
                    </div>

                    <div className="flex min-w-0 flex-col justify-between gap-4">
                      <div className="flex items-start justify-between gap-3">
                        <div className="min-w-0">
                          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-gold-700">
                            {product.category}
                          </p>
                          <h2 className="mt-2 truncate font-display text-2xl font-semibold text-charcoal">
                            {product.name}
                          </h2>
                          <p className="mt-2 line-clamp-2 text-sm leading-6 text-stone-500">
                            {product.description}
                          </p>
                        </div>
                        <button
                          type="button"
                          onClick={() => handleRemove(productId)}
                          disabled={isPending}
                          className="grid h-10 w-10 shrink-0 place-items-center rounded-full border border-black/10 text-stone-500 transition hover:border-rose-200 hover:bg-rose-50 hover:text-rose-500 disabled:cursor-wait"
                          aria-label={`Remove ${product.name} from cart`}
                        >
                          <FiX />
                        </button>
                      </div>

                      <div className="flex flex-wrap items-center justify-between gap-4">
                        <div>
                          <div className="inline-flex items-center rounded-full border border-black/10 bg-ivory p-1">
                            <button
                              type="button"
                              onClick={() => handleQuantity(productId, item.quantity - 1)}
                              disabled={isPending}
                              className="grid h-9 w-9 place-items-center rounded-full text-stone-600 transition hover:bg-white hover:text-charcoal disabled:cursor-wait"
                              aria-label={`Decrease ${product.name} quantity`}
                            >
                              <FiMinus />
                            </button>
                            <span className="grid h-9 min-w-12 place-items-center px-2 text-sm font-semibold text-charcoal">
                              {item.quantity}
                            </span>
                            <button
                              type="button"
                              onClick={() => handleQuantity(productId, item.quantity + 1)}
                              disabled={isPending || item.quantity >= stock}
                              className="grid h-9 w-9 place-items-center rounded-full text-stone-600 transition hover:bg-white hover:text-charcoal disabled:cursor-not-allowed disabled:opacity-40"
                              aria-label={`Increase ${product.name} quantity`}
                            >
                              <FiPlus />
                            </button>
                          </div>
                          <p className="mt-2 text-xs text-stone-500">
                            {stock} in stock
                          </p>
                        </div>

                        <div className="text-right">
                          <p className="text-xs uppercase tracking-[0.22em] text-stone-400">
                            Item total
                          </p>
                          <p className="mt-1 text-xl font-semibold text-charcoal">
                            {formatINR(itemSubtotal)}
                          </p>
                        </div>
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
          ) : (
            <div className="rounded-[1.5rem] border border-dashed border-gold-200 bg-white p-8 text-center shadow-sm">
              <FiShoppingBag className="mx-auto text-4xl text-gold-600" />
              <h2 className="mt-4 font-display text-3xl text-charcoal">
                Your cart is empty.
              </h2>
              <p className="mx-auto mt-3 max-w-md text-sm leading-7 text-stone-500">
                Add rings, necklaces, earrings, or bracelets from the shop and
                they will appear here instantly.
              </p>
              <button
                type="button"
                onClick={onNavigateShop}
                className="mt-6 rounded-full bg-charcoal px-7 py-3 text-sm font-semibold text-white transition hover:bg-black"
              >
                Browse Products
              </button>
            </div>
          )}
        </div>

        {/* Checkout Sidebar */}
        <aside className="space-y-4 lg:sticky lg:top-24 lg:h-fit">
          <div className="rounded-[1.5rem] border border-black/5 bg-white p-5 shadow-sm sm:p-6">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.3em] text-gold-700">
                  Summary
                </p>
                <h2 className="mt-2 font-display text-3xl font-semibold text-charcoal">
                  Order Details
                </h2>
              </div>
              {cartItems.length > 0 && (
                <button
                  type="button"
                  onClick={handleClear}
                  disabled={clearing}
                  className="grid h-10 w-10 place-items-center rounded-full border border-black/10 text-stone-500 transition hover:border-rose-200 hover:bg-rose-50 hover:text-rose-500 disabled:cursor-wait"
                  aria-label="Clear cart"
                >
                  <FiTrash2 />
                </button>
              )}
            </div>

            <form onSubmit={handleApplyCoupon} className="mt-6">
              <label className="text-xs font-semibold uppercase tracking-[0.24em] text-stone-500">
                Coupon code
              </label>
              <div className="mt-2 flex gap-2 rounded-full border border-black/10 bg-ivory p-1.5">
                <div className="flex min-w-0 flex-1 items-center gap-2 px-3">
                  <FiTag className="shrink-0 text-gold-700" />
                  <input
                    type="text"
                    value={couponInput}
                    onChange={(event) => setCouponInput(event.target.value)}
                    placeholder="Apply Coupon code"
                    className="min-w-0 flex-1 bg-transparent text-sm font-medium uppercase outline-none placeholder:text-stone-400"
                  />
                </div>
                <button
                  type="submit"
                  disabled={!cartItems.length}
                  className="rounded-full bg-charcoal px-4 py-2 text-sm font-semibold text-white transition hover:bg-black disabled:cursor-not-allowed disabled:opacity-40"
                >
                  Apply
                </button>
              </div>
              <p className="mt-2 min-h-5 text-xs leading-5 text-stone-500">
                {couponMessage || `Available: ${Object.keys(coupons).join(", ")}`}
              </p>
              {appliedCoupon && (
                <button
                  type="button"
                  onClick={() => {
                    setAppliedCoupon(null);
                    setCouponMessage("Coupon removed.");
                  }}
                  className="mt-1 text-xs font-semibold text-rose-600 transition hover:text-rose-700"
                >
                  Remove coupon
                </button>
              )}
            </form>

            <div className="mt-6 space-y-3 text-sm text-stone-600">
              {[
                ["Items", cartCount],
                ["Subtotal", formatINR(subtotal)],
                ["Coupon discount", couponDiscount ? `-${formatINR(couponDiscount)}` : formatINR(0)],
                ["GST (3%)", formatINR(gst)],
                ["Delivery", delivery ? formatINR(delivery) : "Free"],
              ].map(([label, value]) => (
                <div key={label} className="grid grid-cols-[1fr_auto] items-center gap-6">
                  <span>{label}</span>
                  <span className="min-w-20 text-right font-semibold tabular-nums text-charcoal">
                    {value}
                  </span>
                </div>
              ))}
            </div>

            {cartItems.length > 0 && savingsToFreeDelivery > 0 && (
              <div className="mt-5 rounded-[1rem] bg-gold-50 p-4 text-sm text-gold-900">
                Add {formatINR(savingsToFreeDelivery)} more for free insured delivery.
              </div>
            )}

            <div className="my-5 h-px bg-black/10" />

            <div className="space-y-4">
              <label className="grid gap-2">
                <span className="text-xs font-semibold uppercase tracking-[0.24em] text-stone-500">
                  Phone *
                </span>
                <input
                  value={checkoutData.phone}
                  onChange={(event) =>
                    setCheckoutData((current) => ({
                      ...current,
                      phone: event.target.value,
                    }))
                  }
                  className="h-11 rounded-full border border-black/10 bg-ivory px-4 text-sm outline-none focus:border-gold-300"
                  placeholder="Delivery phone number"
                />
              </label>
              <label className="grid gap-2">
                <span className="text-xs font-semibold uppercase tracking-[0.24em] text-stone-500">
                  Delivery Address *
                </span>
                <textarea
                  value={checkoutData.address}
                  onChange={(event) =>
                    setCheckoutData((current) => ({
                      ...current,
                      address: event.target.value,
                    }))
                  }
                  className="min-h-20 resize-none rounded-[1rem] border border-black/10 bg-ivory px-4 py-3 text-sm outline-none focus:border-gold-300"
                  placeholder="Full street address, city, pincode"
                />
              </label>

              {/* Payment Method Selector */}
              <div>
                <span className="mb-2 block text-xs font-semibold uppercase tracking-[0.24em] text-stone-500">
                  Select Payment Method
                </span>
                <div className="grid gap-2.5">
                  {/* PhonePe Option */}
                  <label
                    className={`flex cursor-pointer items-center justify-between rounded-2xl border p-3.5 transition ${
                      checkoutData.paymentMethod === "phonepe"
                        ? "border-[#5F259F] bg-purple-50/50 shadow-sm"
                        : "border-black/10 bg-ivory hover:border-purple-200"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <input
                        type="radio"
                        name="paymentMethod"
                        value="phonepe"
                        checked={checkoutData.paymentMethod === "phonepe"}
                        onChange={(e) =>
                          setCheckoutData((c) => ({ ...c, paymentMethod: e.target.value }))
                        }
                        className="accent-[#5F259F]"
                      />
                      <div>
                        <div className="flex items-center gap-2">
                          <PhonePeBadge />
                          <span className="rounded bg-purple-100 px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-[#5F259F]">
                            Sandbox Test
                          </span>
                        </div>
                        <p className="mt-0.5 text-[11px] text-stone-500">
                          UPI, QR Code, Cards & NetBanking via PhonePe Gateway
                        </p>
                      </div>
                    </div>
                  </label>

                  {/* Cash on Delivery */}
                  <label
                    className={`flex cursor-pointer items-center justify-between rounded-2xl border p-3.5 transition ${
                      checkoutData.paymentMethod === "cod"
                        ? "border-gold-500 bg-gold-50/40 shadow-sm"
                        : "border-black/10 bg-ivory hover:border-gold-200"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <input
                        type="radio"
                        name="paymentMethod"
                        value="cod"
                        checked={checkoutData.paymentMethod === "cod"}
                        onChange={(e) =>
                          setCheckoutData((c) => ({ ...c, paymentMethod: e.target.value }))
                        }
                        className="accent-gold-600"
                      />
                      <div>
                        <p className="text-sm font-semibold text-charcoal">Cash on Delivery (COD)</p>
                        <p className="text-[11px] text-stone-500">Pay in cash when your jewelry arrives</p>
                      </div>
                    </div>
                  </label>

                  {/* Card Payment */}
                  <label
                    className={`flex cursor-pointer items-center justify-between rounded-2xl border p-3.5 transition ${
                      checkoutData.paymentMethod === "card"
                        ? "border-gold-500 bg-gold-50/40 shadow-sm"
                        : "border-black/10 bg-ivory hover:border-gold-200"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <input
                        type="radio"
                        name="paymentMethod"
                        value="card"
                        checked={checkoutData.paymentMethod === "card"}
                        onChange={(e) =>
                          setCheckoutData((c) => ({ ...c, paymentMethod: e.target.value }))
                        }
                        className="accent-gold-600"
                      />
                      <div>
                        <p className="text-sm font-semibold text-charcoal">Debit / Credit Card</p>
                        <p className="text-[11px] text-stone-500">Visa, Mastercard, RuPay</p>
                      </div>
                    </div>
                  </label>
                </div>
              </div>
            </div>

            <div className="my-5 h-px bg-black/10" />

            <div className="grid grid-cols-[1fr_auto] items-end gap-6">
              <span className="text-sm font-medium text-stone-500">Payable total</span>
              <span className="text-right font-display text-4xl font-semibold tabular-nums text-charcoal">
                {formatINR(grandTotal)}
              </span>
            </div>

            <button
              type="button"
              onClick={handleCheckout}
              disabled={!cartItems.length || isCheckingOut}
              className={`mt-6 inline-flex w-full items-center justify-center gap-2 rounded-full py-3.5 text-sm font-semibold text-white transition hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-40 ${
                checkoutData.paymentMethod === "phonepe"
                  ? "bg-[#5F259F] hover:bg-[#4d1d82] shadow-md shadow-purple-900/20"
                  : "bg-charcoal hover:bg-black"
              }`}
            >
              {checkoutData.paymentMethod === "phonepe" ? (
                <>
                  <PhonePeBadge />
                  <span>{isCheckingOut ? "Connecting to PhonePe..." : `Pay ${formatINR(grandTotal)} with PhonePe`}</span>
                </>
              ) : (
                <>
                  <FiCreditCard />
                  <span>{isCheckingOut ? "Placing order..." : `Place Order • ${formatINR(grandTotal)}`}</span>
                </>
              )}
            </button>

            <button
              type="button"
              onClick={onNavigateFavorites}
              className="mt-3 w-full rounded-full border border-black/10 bg-white px-5 py-3 text-sm font-semibold text-charcoal transition hover:-translate-y-0.5 hover:border-gold-300 hover:text-gold-700"
            >
              View Favorites
            </button>

            {checkoutMessage && (
              <p className="mt-4 rounded-[1rem] bg-amber-50 p-3 text-sm font-medium text-amber-800 border border-amber-200">
                {checkoutMessage}
              </p>
            )}
          </div>

          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-1">
            {[
              {
                icon: FiTruck,
                title: "Insured delivery",
                text: "Free over ₹20,000 with tamper-safe luxury packaging.",
              },
              {
                icon: FiShield,
                title: "Secure account cart",
                text: "Your pieces are saved to your login in the database.",
              },
              {
                icon: FiGift,
                title: "Gift ready",
                text: "Premium box, care card, and invoice-ready checkout.",
              },
              {
                icon: FiCheckCircle,
                title: "Transparent taxes",
                text: "GST is calculated before you move ahead.",
              },
            ].map((item) => {
              const Icon = item.icon;
              return (
                <div
                  key={item.title}
                  className="rounded-[1.25rem] border border-black/5 bg-ivory p-4"
                >
                  <Icon className="text-xl text-gold-700" />
                  <h3 className="mt-3 text-sm font-semibold text-charcoal">
                    {item.title}
                  </h3>
                  <p className="mt-1 text-xs leading-5 text-stone-500">{item.text}</p>
                </div>
              );
            })}
          </div>
        </aside>
      </div>
    </section>
  );
}
