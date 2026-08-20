import { useEffect, useMemo, useState } from "react";
import {
  FiCheckCircle,
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
import { createOrder, getActiveOffers } from "../api/catalog";
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
  const [checkoutData, setCheckoutData] = useState({
    phone: "",
    address: "",
    paymentMethod: "cod",
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

    try {
      setIsCheckingOut(true);
      const response = await createOrder({
        name: user?.name,
        email: user?.email,
        phone: checkoutData.phone,
        address: checkoutData.address,
        paymentMethod: checkoutData.paymentMethod,
        couponCode: appliedCoupon?.code || "",
      });
      await refreshSession();
      setAppliedCoupon(null);
      setCouponInput("");
      setCheckoutMessage(
        `${response.data.orderNumber} placed successfully at ${formatINR(response.data.total)}.`
      );
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

      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_390px]">
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
                  clear rupee pricing.
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

            <div className="space-y-3">
              <label className="grid gap-2">
                <span className="text-xs font-semibold uppercase tracking-[0.24em] text-stone-500">
                  Phone
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
                  placeholder="Delivery phone"
                />
              </label>
              <label className="grid gap-2">
                <span className="text-xs font-semibold uppercase tracking-[0.24em] text-stone-500">
                  Address
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
                  placeholder="Delivery address"
                />
              </label>
              <select
                value={checkoutData.paymentMethod}
                onChange={(event) =>
                  setCheckoutData((current) => ({
                    ...current,
                    paymentMethod: event.target.value,
                  }))
                }
                className="h-11 w-full rounded-full border border-black/10 bg-ivory px-4 text-sm outline-none focus:border-gold-300"
              >
                <option value="cod">Cash on delivery</option>
                <option value="upi">UPI</option>
                <option value="card">Card</option>
              </select>
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
              className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-full bg-charcoal px-5 py-3 text-sm font-semibold text-white transition hover:-translate-y-0.5 hover:bg-black disabled:cursor-not-allowed disabled:opacity-40"
            >
              <FiCreditCard />
              {isCheckingOut ? "Placing order..." : "Checkout"}
            </button>
            <button
              type="button"
              onClick={onNavigateFavorites}
              className="mt-3 w-full rounded-full border border-black/10 bg-white px-5 py-3 text-sm font-semibold text-charcoal transition hover:-translate-y-0.5 hover:border-gold-300 hover:text-gold-700"
            >
              View Favorites
            </button>
            {checkoutMessage && (
              <p className="mt-4 rounded-[1rem] bg-emerald-50 p-3 text-sm font-medium text-emerald-700">
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
