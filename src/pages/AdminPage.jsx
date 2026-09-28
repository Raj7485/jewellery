import { useEffect, useMemo, useState } from "react";
import { FaGem } from "react-icons/fa";
import {
  FiAlertTriangle,
  FiBarChart2,
  FiCheckCircle,
  FiDatabase,
  FiEdit3,
  FiImage,
  FiLogOut,
  FiLock,
  FiMail,
  FiMenu,
  FiPackage,
  FiPercent,
  FiPlus,
  FiRefreshCw,
  FiSave,
  FiSearch,
  FiShield,
  FiShoppingBag,
  FiTag,
  FiTrash2,
  FiTrendingUp,
  FiUsers,
  FiX,
  FiStar,
  FiClock,
  FiBox,
} from "react-icons/fi";
import {
  createAdminOffer,
  createAdminProduct,
  deleteAdminOffer,
  deleteAdminProduct,
  getAdminSummary,
  updateAdminOffer,
  updateAdminOrder,
  updateAdminProduct,
  updateAdminUser,
  uploadAdminImage,
} from "../api/catalog";
import CatalogImage from "../components/CatalogImage";
import { useAuth } from "../context/AuthContext";
import { formatINR, toInrAmount } from "../utils/currency";

/* ─── AdminLoginPage ────────────────────────────────────── */

function AdminLoginPage({ onNavigateHome }) {
  const { login } = useAuth();
  const [email, setEmail]       = useState("");
  const [password, setPassword] = useState("");
  const [status, setStatus]     = useState("");
  const [isError, setIsError]   = useState(false);
  const [loading, setLoading]   = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setStatus("");
    setIsError(false);
    try {
      await login({ email, password });
    } catch (err) {
      setIsError(true);
      setStatus(err.message || "Login failed. Please check your credentials.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen w-full bg-[#f7f5f0] flex items-center justify-center p-4 sm:p-6 lg:p-8">
      <div className="w-full max-w-4xl">

        {/* Back link */}
        <button
          type="button"
          onClick={onNavigateHome}
          className="mb-6 inline-flex items-center gap-2 text-sm font-medium text-stone-500 transition hover:text-gold-700"
        >
          <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M19 12H5M5 12l7-7M5 12l7 7"/></svg>
          Back to Store
        </button>

        {/* Card */}
        <div className="overflow-hidden rounded-3xl border border-stone-200 bg-white shadow-2xl shadow-stone-200/60 lg:grid lg:grid-cols-[1fr_1.1fr]">

          {/* Left panel — branding */}
          <div className="relative flex flex-col justify-end bg-charcoal p-8 sm:p-10 min-h-[220px] lg:min-h-0">
            {/* Background texture */}
            <div className="absolute inset-0 bg-gradient-to-br from-stone-900 via-stone-800 to-stone-900 opacity-90" />
            <div
              className="absolute inset-0 opacity-20"
              style={{ backgroundImage: "url('https://images.unsplash.com/photo-1684439673104-f5d22791c71a?w=800&q=70')", backgroundSize: "cover", backgroundPosition: "center" }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-charcoal/95 via-charcoal/50 to-transparent" />

            {/* Content */}
            <div className="relative z-10">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gold-500/20 ring-1 ring-gold-400/30 text-gold-400">
                <FaGem size={20} />
              </div>
              <p className="mt-5 text-[11px] font-bold uppercase tracking-[0.3em] text-gold-400">Admin Panel</p>
              <h1 className="mt-2 font-display text-3xl sm:text-4xl font-semibold text-white leading-tight">
                Welcome to the<br/>Control Centre
              </h1>
              <p className="mt-3 text-sm leading-6 text-stone-400">
                Manage products, orders, customers and offers from one place.
              </p>
              <div className="mt-6 flex items-center gap-2">
                <div className="h-1 w-8 rounded-full bg-gold-500" />
                <div className="h-1 w-4 rounded-full bg-gold-500/40" />
                <div className="h-1 w-2 rounded-full bg-gold-500/20" />
              </div>
            </div>
          </div>

          {/* Right panel — form */}
          <div className="flex flex-col justify-center p-8 sm:p-10">
            {/* Notice */}
            <div className="mb-7 flex items-start gap-3 rounded-2xl bg-gold-50 border border-gold-200 p-4">
              <FiShield className="mt-0.5 shrink-0 text-gold-600" size={16} />
              <p className="text-sm text-gold-900">
                <strong className="font-semibold">Restricted area.</strong> This page is for authorised admin accounts only.
              </p>
            </div>

            <p className="text-[11px] font-bold uppercase tracking-[0.3em] text-gold-600">Admin Access</p>
            <h2 className="mt-1.5 font-display text-2xl sm:text-3xl font-semibold text-charcoal">Sign in to continue</h2>

            <form onSubmit={handleSubmit} className="mt-7 space-y-4">
              {/* Email */}
              <label className="block">
                <span className="mb-1.5 block text-sm font-medium text-stone-700">Email address</span>
                <div className="flex h-12 items-center gap-3 rounded-xl border border-stone-200 bg-stone-50 px-4 transition focus-within:border-gold-400 focus-within:bg-white focus-within:ring-2 focus-within:ring-gold-100">
                  <FiMail className="shrink-0 text-stone-400" size={16} />
                  <input
                    type="email"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    required
                    placeholder="admin@example.com"
                    className="w-full bg-transparent text-sm text-stone-800 outline-none placeholder:text-stone-400"
                  />
                </div>
              </label>

              {/* Password */}
              <label className="block">
                <span className="mb-1.5 block text-sm font-medium text-stone-700">Password</span>
                <div className="flex h-12 items-center gap-3 rounded-xl border border-stone-200 bg-stone-50 px-4 transition focus-within:border-gold-400 focus-within:bg-white focus-within:ring-2 focus-within:ring-gold-100">
                  <FiLock className="shrink-0 text-stone-400" size={16} />
                  <input
                    type="password"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    required
                    minLength={6}
                    placeholder="Your password"
                    className="w-full bg-transparent text-sm text-stone-800 outline-none placeholder:text-stone-400"
                  />
                </div>
              </label>

              {/* Status message */}
              {status && (
                <div className={`flex items-start gap-2 rounded-xl px-4 py-3 text-sm ${
                  isError ? "bg-rose-50 text-rose-700 border border-rose-200" : "bg-emerald-50 text-emerald-700 border border-emerald-200"
                }`}>
                  {isError ? <FiAlertTriangle size={15} className="mt-0.5 shrink-0" /> : <FiCheckCircle size={15} className="mt-0.5 shrink-0" />}
                  <span>{status}</span>
                </div>
              )}

              {/* Submit */}
              <button
                type="submit"
                disabled={loading}
                className="mt-1 inline-flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-charcoal text-sm font-semibold text-white shadow-md shadow-stone-900/20 transition hover:bg-stone-800 disabled:cursor-not-allowed disabled:opacity-60"
              >
                <FiShield size={16} />
                {loading ? "Signing in…" : "Sign in to Admin"}
              </button>
            </form>

            <p className="mt-6 text-center text-xs text-stone-400">
              Not an admin?{" "}
              <button type="button" onClick={onNavigateHome} className="font-semibold text-gold-700 transition hover:text-gold-600">
                Return to store
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ─── constants ─────────────────────────────────────────── */

const emptyProduct = {
  name: "",
  category: "Rings",
  price: "",
  currency: "INR",
  rating: 5,
  image: "",
  badge: "New",
  featured: false,
  stock: 1,
  description: "",
};

const emptyOffer = {
  code: "",
  title: "",
  discountType: "percentage",
  discountValue: 10,
  minSpend: 0,
  maxDiscount: 0,
  status: "active",
};

const NAV_ITEMS = [
  { id: "overview",  label: "Overview",        icon: FiBarChart2,   desc: "Dashboard & metrics" },
  { id: "products",  label: "Products",         icon: FiPackage,     desc: "Catalog management" },
  { id: "orders",    label: "Orders",           icon: FiShoppingBag, desc: "Order management" },
  { id: "users",     label: "Users",            icon: FiUsers,       desc: "Customer accounts" },
  { id: "offers",    label: "Offers & Coupons", icon: FiPercent,     desc: "Discount codes" },
  { id: "data",      label: "Database",         icon: FiDatabase,    desc: "Messages & subscribers" },
];

const ORDER_STATUSES = ["pending", "confirmed", "packed", "shipped", "delivered", "cancelled"];

/* ─── helpers ───────────────────────────────────────────── */

function pid(p) { return p._id || p.id; }

function fmt(value) {
  return value
    ? new Intl.DateTimeFormat("en-IN", { dateStyle: "medium", timeStyle: "short" }).format(new Date(value))
    : "—";
}

function fmtDate(value) {
  return value
    ? new Intl.DateTimeFormat("en-IN", { dateStyle: "medium" }).format(new Date(value))
    : "—";
}

const STATUS_COLORS = {
  active:    "bg-emerald-100 text-emerald-800 ring-emerald-600/20",
  delivered: "bg-emerald-100 text-emerald-800 ring-emerald-600/20",
  shipped:   "bg-blue-100   text-blue-800   ring-blue-600/20",
  packed:    "bg-amber-100  text-amber-800  ring-amber-600/20",
  confirmed: "bg-gold-100   text-gold-900   ring-gold-600/20",
  pending:   "bg-rose-100   text-rose-800   ring-rose-600/20",
  cancelled: "bg-stone-100  text-stone-600  ring-stone-500/20",
  draft:     "bg-stone-100  text-stone-600  ring-stone-500/20",
  expired:   "bg-stone-100  text-stone-500  ring-stone-400/20",
  paid:      "bg-emerald-100 text-emerald-800 ring-emerald-600/20",
  refunded:  "bg-purple-100 text-purple-800 ring-purple-600/20",
  admin:     "bg-gold-100   text-gold-900   ring-gold-600/20",
  customer:  "bg-stone-100  text-stone-700  ring-stone-500/20",
};

function Badge({ label, className = "" }) {
  const base = STATUS_COLORS[label?.toLowerCase()] || STATUS_COLORS.customer;
  return (
    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-[11px] font-semibold uppercase tracking-wider ring-1 ring-inset ${base} ${className}`}>
      {label}
    </span>
  );
}

function Label({ children }) {
  return (
    <label className="block mb-1.5 text-[11px] font-bold uppercase tracking-widest text-stone-400">
      {children}
    </label>
  );
}

function Input({ className = "", ...props }) {
  return (
    <input
      className={`w-full rounded-xl border border-stone-200 bg-white px-4 py-2.5 text-sm text-stone-800 outline-none placeholder:text-stone-400 focus:border-gold-400 focus:ring-2 focus:ring-gold-200 transition-all ${className}`}
      {...props}
    />
  );
}

function Select({ className = "", children, ...props }) {
  return (
    <select
      className={`w-full rounded-xl border border-stone-200 bg-white px-4 py-2.5 text-sm text-stone-800 outline-none focus:border-gold-400 focus:ring-2 focus:ring-gold-200 transition-all ${className}`}
      {...props}
    >
      {children}
    </select>
  );
}

function Textarea({ className = "", ...props }) {
  return (
    <textarea
      className={`w-full rounded-xl border border-stone-200 bg-white px-4 py-2.5 text-sm text-stone-800 outline-none placeholder:text-stone-400 focus:border-gold-400 focus:ring-2 focus:ring-gold-200 transition-all resize-none ${className}`}
      {...props}
    />
  );
}

function Btn({ variant = "primary", className = "", children, ...props }) {
  const variants = {
    primary: "bg-charcoal text-white hover:bg-stone-800 shadow-sm",
    gold:    "bg-gold-500 text-white hover:bg-gold-600 shadow-sm",
    ghost:   "border border-stone-200 bg-white text-stone-700 hover:bg-stone-50",
    danger:  "bg-rose-600 text-white hover:bg-rose-700 shadow-sm",
  };
  return (
    <button
      className={`inline-flex items-center justify-center gap-2 rounded-xl px-5 py-2.5 text-sm font-semibold transition-all disabled:opacity-50 disabled:cursor-not-allowed ${variants[variant]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}

function Card({ className = "", children }) {
  return (
    <div className={`rounded-2xl border border-stone-200 bg-white shadow-sm ${className}`}>
      {children}
    </div>
  );
}

function StatCard({ icon: Icon, label, value, hint, color = "gold" }) {
  const colors = {
    gold:    { bg: "bg-gold-50",    icon: "text-gold-600",    border: "border-gold-200"    },
    emerald: { bg: "bg-emerald-50", icon: "text-emerald-600", border: "border-emerald-200" },
    rose:    { bg: "bg-rose-50",    icon: "text-rose-600",    border: "border-rose-200"    },
    blue:    { bg: "bg-blue-50",    icon: "text-blue-600",    border: "border-blue-200"    },
  };
  const c = colors[color] || colors.gold;
  return (
    <article className={`rounded-2xl border ${c.border} bg-white p-6 shadow-sm hover:shadow-md transition-all group`}>
      <div className="flex items-start justify-between">
        <div className="min-w-0 flex-1">
          <p className="text-xs font-bold uppercase tracking-widest text-stone-400">{label}</p>
          <p className="mt-2 text-3xl font-bold text-charcoal truncate">{value}</p>
          {hint && <p className="mt-1.5 text-xs text-stone-500">{hint}</p>}
        </div>
        <span className={`ml-4 shrink-0 flex h-12 w-12 items-center justify-center rounded-2xl ${c.bg} ${c.icon} group-hover:scale-110 transition-transform`}>
          <Icon size={22} />
        </span>
      </div>
    </article>
  );
}

function SectionHeader({ icon: Icon, title, description, actions }) {
  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-charcoal text-white">
          <Icon size={20} />
        </div>
        <div>
          <h2 className="text-lg font-bold text-charcoal">{title}</h2>
          {description && <p className="text-xs text-stone-500">{description}</p>}
        </div>
      </div>
      {actions && <div className="flex items-center gap-2">{actions}</div>}
    </div>
  );
}

function TableWrap({ children }) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-max text-left text-sm">{children}</table>
    </div>
  );
}

function Th({ children, right }) {
  return (
    <th className={`px-5 py-3.5 text-[11px] font-bold uppercase tracking-widest text-stone-400 ${right ? "text-right" : ""}`}>
      {children}
    </th>
  );
}

function Toggle({ checked, onChange, label }) {
  return (
    <label className="flex items-center gap-3 cursor-pointer select-none">
      <div className="relative">
        <input type="checkbox" checked={checked} onChange={onChange} className="sr-only peer" />
        <div className="h-6 w-11 rounded-full bg-stone-200 peer-checked:bg-gold-500 transition-colors" />
        <div className="absolute left-1 top-1 h-4 w-4 rounded-full bg-white shadow transition-transform peer-checked:translate-x-5" />
      </div>
      <span className="text-sm font-medium text-stone-700">{label}</span>
    </label>
  );
}

/* ─── OrderDetailModal ─────────────────────────────────── */

function OrderDetailModal({ order, onClose }) {
  if (!order) return null;

  const statusStep = ["pending","confirmed","packed","shipped","delivered"];
  const currentStep = statusStep.indexOf(order.status);

  return (
    <div className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center p-0 sm:p-4" role="dialog" aria-modal="true">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full sm:max-w-2xl max-h-[95dvh] sm:max-h-[90vh] overflow-hidden flex flex-col rounded-t-3xl sm:rounded-3xl bg-white shadow-2xl animate-fadeUp">

        {/* Header */}
        <div className="flex items-center justify-between gap-4 border-b border-stone-100 bg-white px-6 py-4 sticky top-0 z-10">
          <div>
            <p className="text-[11px] font-bold uppercase tracking-widest text-gold-600">Order Details</p>
            <h2 className="mt-0.5 font-mono text-lg font-bold text-charcoal">{order.orderNumber}</h2>
          </div>
          <button onClick={onClose} className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-stone-100 text-stone-600 transition hover:bg-stone-200">
            <FiX size={18} />
          </button>
        </div>

        {/* Body */}
        <div className="overflow-y-auto flex-1 px-6 py-5 space-y-6">

          {/* Delivery progress */}
          {order.status !== "cancelled" && (
            <div>
              <p className="mb-3 text-[11px] font-bold uppercase tracking-widest text-stone-400">Delivery Progress</p>
              <div className="flex items-center">
                {statusStep.map((step, i) => (
                  <div key={step} className="flex flex-1 items-center">
                    <div className="flex flex-col items-center gap-1">
                      <div className={`flex h-7 w-7 items-center justify-center rounded-full text-xs font-bold transition ${i <= currentStep ? "bg-gold-500 text-white" : "bg-stone-200 text-stone-400"}`}>
                        {i < currentStep ? <FiCheckCircle size={13}/> : i + 1}
                      </div>
                      <span className={`text-[9px] font-semibold uppercase tracking-wide ${i <= currentStep ? "text-gold-600" : "text-stone-400"}`}>{step}</span>
                    </div>
                    {i < statusStep.length - 1 && (
                      <div className={`flex-1 h-0.5 mb-4 ${i < currentStep ? "bg-gold-400" : "bg-stone-200"}`} />
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
          {order.status === "cancelled" && (
            <div className="flex items-center gap-2 rounded-2xl bg-rose-50 border border-rose-200 px-4 py-3">
              <FiAlertTriangle className="text-rose-500" size={16}/>
              <span className="text-sm font-semibold text-rose-700">This order has been cancelled.</span>
            </div>
          )}

          {/* ── Customer Information — 2 rows ── */}
          <div className="rounded-2xl border border-stone-100 bg-stone-50 p-4">
            <p className="mb-3 text-[11px] font-bold uppercase tracking-widest text-stone-400">Customer Information</p>

            {/* Row 1: Name | Email */}
            <div className="grid grid-cols-2 gap-3 mb-3">
              <div className="rounded-xl bg-white border border-stone-100 px-3 py-2.5 shadow-sm">
                <p className="text-[10px] font-bold uppercase tracking-wider text-stone-400 mb-0.5">Name</p>
                <div className="flex items-center gap-1.5">
                  <FiUsers size={13} className="shrink-0 text-gold-500"/>
                  <p className="text-sm font-semibold text-charcoal truncate">{order.customer?.name || "—"}</p>
                </div>
              </div>
              <div className="rounded-xl bg-white border border-stone-100 px-3 py-2.5 shadow-sm">
                <p className="text-[10px] font-bold uppercase tracking-wider text-stone-400 mb-0.5">Email</p>
                <div className="flex items-center gap-1.5">
                  <FiMail size={13} className="shrink-0 text-gold-500"/>
                  <p className="text-sm font-semibold text-charcoal break-all">{order.customer?.email || "—"}</p>
                </div>
              </div>
            </div>

            {/* Row 2: Phone | Address */}
            <div className="grid grid-cols-2 gap-3">
              <div className="rounded-xl bg-white border border-stone-100 px-3 py-2.5 shadow-sm">
                <p className="text-[10px] font-bold uppercase tracking-wider text-stone-400 mb-0.5">Phone</p>
                <div className="flex items-center gap-1.5">
                  <svg className="shrink-0 text-gold-500" width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 13a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.6 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 9.91a16 16 0 0 0 6.1 6.1l.91-.9a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
                  <p className="text-sm font-semibold text-charcoal">{order.customer?.phone || "—"}</p>
                </div>
              </div>
              <div className="rounded-xl bg-white border border-stone-100 px-3 py-2.5 shadow-sm">
                <p className="text-[10px] font-bold uppercase tracking-wider text-stone-400 mb-0.5">Delivery Address</p>
                <div className="flex items-start gap-1.5">
                  <svg className="mt-0.5 shrink-0 text-gold-500" width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
                  <p className="text-sm font-semibold text-charcoal leading-snug">{order.customer?.address || "—"}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Ordered items */}
          <div>
            <p className="mb-3 text-[11px] font-bold uppercase tracking-widest text-stone-400">Ordered Items</p>
            <div className="space-y-2">
              {(order.items || []).map((item, idx) => (
                <div key={idx} className="flex items-center gap-3 rounded-2xl border border-stone-100 bg-white p-3 shadow-sm">
                  <CatalogImage
                    src={item.image}
                    alt={item.name}
                    category={item.category}
                    className="h-16 w-16 shrink-0 rounded-xl object-cover bg-stone-100"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="truncate text-sm font-semibold text-charcoal">{item.name}</p>
                    <p className="text-[11px] text-stone-400">{item.category} · Qty: {item.quantity}</p>
                  </div>
                  <div className="text-right shrink-0">
                    <p className="text-sm font-bold text-charcoal">{formatINR(item.subtotal || 0)}</p>
                    <p className="text-[11px] text-stone-400">{formatINR(item.price || 0)} each</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-2xl border border-stone-100 bg-stone-50 p-4">
            <p className="mb-3 text-[11px] font-bold uppercase tracking-widest text-stone-400">Price Breakdown</p>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-stone-500">Subtotal</span>
                <span className="font-medium text-charcoal">{formatINR(order.subtotal || 0)}</span>
              </div>
              {order.discount > 0 && (
                <div className="flex justify-between">
                  <span className="text-stone-500">Discount {order.couponCode ? `(${order.couponCode})` : ""}</span>
                  <span className="font-medium text-emerald-600">−{formatINR(order.discount)}</span>
                </div>
              )}
              {order.gst > 0 && (
                <div className="flex justify-between">
                  <span className="text-stone-500">GST</span>
                  <span className="font-medium text-charcoal">{formatINR(order.gst)}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span className="text-stone-500">Delivery</span>
                <span className="font-medium text-charcoal">{order.delivery > 0 ? formatINR(order.delivery) : "Free"}</span>
              </div>
              <div className="my-1 border-t border-stone-200" />
              <div className="flex justify-between">
                <span className="font-bold text-charcoal">Total</span>
                <span className="text-lg font-bold text-charcoal">{formatINR(order.total || 0)}</span>
              </div>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
            <div className="rounded-2xl border border-stone-100 bg-stone-50 p-3 text-center">
              <p className="text-[10px] uppercase tracking-widest text-stone-400">Payment</p>
              <p className="mt-1 text-sm font-bold text-charcoal capitalize flex items-center justify-center gap-1.5">
                {order.paymentMethod === "phonepe" ? (
                  <span className="inline-flex items-center gap-1 rounded bg-purple-100 px-2 py-0.5 text-xs font-bold text-[#5F259F]">
                    PhonePe
                  </span>
                ) : (
                  order.paymentMethod || "—"
                )}
              </p>
            </div>
            <div className="rounded-2xl border border-stone-100 bg-stone-50 p-3 text-center">
              <p className="text-[10px] uppercase tracking-widest text-stone-400">Payment Status</p>
              <p className={`mt-1 text-sm font-bold capitalize ${
                order.paymentStatus === "paid" ? "text-emerald-600" :
                order.paymentStatus === "refunded" ? "text-purple-600" : "text-amber-600"
              }`}>{order.paymentStatus || "pending"}</p>
            </div>
            <div className="rounded-2xl border border-stone-100 bg-stone-50 p-3 text-center col-span-2 sm:col-span-1">
              <p className="text-[10px] uppercase tracking-widest text-stone-400">Placed On</p>
              <p className="mt-1 text-sm font-bold text-charcoal">{fmt(order.createdAt)}</p>
            </div>
          </div>
          {(order.phonepeTransactionId || order.merchantTransactionId) && (
            <div className="rounded-2xl border border-purple-100 bg-purple-50/50 p-3.5 text-xs text-stone-600 space-y-1">
              <div className="flex justify-between items-center">
                <span className="font-semibold text-purple-900">PhonePe Gateway Transaction</span>
                <span className="rounded bg-purple-100 px-1.5 py-0.5 text-[10px] font-bold text-[#5F259F]">UAT Sandbox</span>
              </div>
              {order.phonepeTransactionId && (
                <div className="flex justify-between">
                  <span className="text-stone-500">PhonePe Txn ID:</span>
                  <span className="font-mono font-medium text-charcoal">{order.phonepeTransactionId}</span>
                </div>
              )}
              {order.merchantTransactionId && (
                <div className="flex justify-between">
                  <span className="text-stone-500">Merchant Txn ID:</span>
                  <span className="font-mono font-medium text-stone-500">{order.merchantTransactionId}</span>
                </div>
              )}
            </div>
          )}
          {order.notes && (
            <div className="rounded-2xl border border-amber-100 bg-amber-50 p-4">
              <p className="mb-1 text-[10px] font-bold uppercase tracking-widest text-amber-600">Order Notes</p>
              <p className="text-sm text-amber-900">{order.notes}</p>
            </div>
          )}
        </div>
        <div className="border-t border-stone-100 bg-white px-6 py-4 sticky bottom-0">
          <button onClick={onClose} className="w-full rounded-xl bg-charcoal py-3 text-sm font-semibold text-white transition hover:bg-stone-800">
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

/* ─── main component ─────────────────────────────────────────────── */

export default function AdminPage({ onNavigateHome }) {
  const { isAuthenticated, user } = useAuth();
  const [panel, setPanel] = useState("overview");
  const [summary, setSummary] = useState(null);
  const [query, setQuery] = useState("");
  const [productForm, setProductForm] = useState(emptyProduct);
  const [editingPId, setEditingPId] = useState("");
  const [offerForm, setOfferForm] = useState(emptyOffer);
  const [editingOId, setEditingOId] = useState("");
  const [status, setStatus] = useState(null);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [showProductForm, setShowProductForm] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);

  const products    = summary?.products    || [];
  const orders      = summary?.orders      || [];
  const users       = summary?.users       || [];
  const offers      = summary?.offers      || [];
  const contacts    = summary?.contacts    || [];
  const subscribers = summary?.subscribers || [];
  const metrics     = summary?.metrics     || {};

  const categories = useMemo(
    () => [...new Set(["Rings","Necklaces","Earrings","Bracelets",...products.map(p=>p.category)])],
    [products]
  );

  const filteredProducts = useMemo(() => {
    const t = query.trim().toLowerCase();
    if (!t) return products;
    return products.filter(p =>
      [p.name, p.category, p.badge, p.description].filter(Boolean).some(v => v.toLowerCase().includes(t))
    );
  }, [products, query]);

  const lowStock = products.filter(p => p.stock <= 5 && p.stock > 0).length;
  const outOfStock = products.filter(p => p.stock === 0).length;

  async function loadAdmin() {
    if (!isAuthenticated || user?.role !== "admin") return;
    try {
      setLoading(true);
      const res = await getAdminSummary();
      setSummary(res.data);
    } catch (e) {
      setStatus({ type: "error", msg: e.message || "Failed to load data." });
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { loadAdmin(); }, [isAuthenticated, user?.role]);

  function notify(msg, type = "success") {
    setStatus({ type, msg });
    setTimeout(() => setStatus(null), 4000);
  }

  function setPF(k, v) { setProductForm(f => ({ ...f, [k]: v })); }
  function setOF(k, v) { setOfferForm(f => ({ ...f, [k]: v })); }

  async function handleImageFile(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = async () => {
      try {
        setUploading(true);
        const res = await uploadAdminImage({ filename: file.name, dataUrl: reader.result });
        setPF("image", res.data.url);
        notify("Image uploaded.");
      } catch (err) {
        notify(err.message || "Upload failed.", "error");
      } finally { setUploading(false); }
    };
    reader.readAsDataURL(file);
  }

  async function handleSaveProduct(e) {
    e.preventDefault();
    try {
      setLoading(true);
      const payload = { ...productForm, price: Number(productForm.price), rating: Number(productForm.rating), stock: Number(productForm.stock) };
      if (editingPId) { await updateAdminProduct(editingPId, payload); notify("Product updated."); }
      else            { await createAdminProduct(payload); notify("Product created."); }
      setProductForm(emptyProduct); setEditingPId(""); setShowProductForm(false);
      await loadAdmin();
    } catch (err) {
      notify(err.message || "Save failed.", "error");
    } finally { setLoading(false); }
  }

  function startEditProduct(p) {
    setEditingPId(pid(p));
    setProductForm({ name: p.name||"", category: p.category||"Rings", price: p.price||"", currency: p.currency||"INR", rating: p.rating||5, image: p.image||"", badge: p.badge||"", featured: Boolean(p.featured), stock: p.stock??0, description: p.description||"" });
    setShowProductForm(true);
  }

  async function handleDeleteProduct(id) {
    if (!confirm("Delete this product? This cannot be undone.")) return;
    try { await deleteAdminProduct(id); notify("Product deleted."); await loadAdmin(); }
    catch (err) { notify(err.message || "Delete failed.", "error"); }
  }

  async function handleOrderChange(id, field, value) {
    try { await updateAdminOrder(id, { [field]: value }); notify("Order updated."); await loadAdmin(); }
    catch (err) { notify(err.message || "Update failed.", "error"); }
  }

  async function handleUserRole(id, role) {
    try { await updateAdminUser(id, { role }); notify("Role updated."); await loadAdmin(); }
    catch (err) { notify(err.message || "Update failed.", "error"); }
  }

  async function handleSaveOffer(e) {
    e.preventDefault();
    try {
      setLoading(true);
      if (editingOId) { await updateAdminOffer(editingOId, offerForm); notify("Offer updated."); }
      else            { await createAdminOffer(offerForm); notify("Offer created."); }
      setOfferForm(emptyOffer); setEditingOId("");
      await loadAdmin();
    } catch (err) {
      notify(err.message || "Save failed.", "error");
    } finally { setLoading(false); }
  }

  function startEditOffer(o) {
    setEditingOId(o._id);
    setOfferForm({ code: o.code||"", title: o.title||"", discountType: o.discountType||"percentage", discountValue: o.discountValue||10, minSpend: o.minSpend||0, maxDiscount: o.maxDiscount||0, status: o.status||"active" });
  }

  async function handleDeleteOffer(id) {
    if (!confirm("Delete this offer?")) return;
    try { await deleteAdminOffer(id); notify("Offer deleted."); await loadAdmin(); }
    catch (err) { notify(err.message || "Delete failed.", "error"); }
  }

  /* ── unauthenticated ── */
  if (!isAuthenticated) {
    return <AdminLoginPage onNavigateHome={onNavigateHome} />;
  }

  /* ── not admin ── */
  if (user?.role !== "admin") {
    return (
      <section className="min-h-screen bg-ivory flex flex-col items-center justify-center px-4 text-center">
        <div className="rounded-full bg-rose-100 p-6 mb-4"><FiShield size={40} className="text-rose-500" /></div>
        <h1 className="text-2xl font-bold text-charcoal">Admin Access Required</h1>
        <p className="mt-3 max-w-sm text-sm text-stone-500">Your account does not have admin privileges.</p>
        <button onClick={onNavigateHome} className="mt-6 rounded-xl bg-charcoal px-6 py-3 text-sm font-semibold text-white hover:bg-stone-800 transition-colors">
          Return to Store
        </button>
      </section>
    );
  }

  /* ── admin layout ── */
  return (
    <div className="flex h-screen w-full overflow-hidden bg-[#f7f6f3] font-body">

      {/* Mobile overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-40 bg-black/40 lg:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      {/* ── Sidebar ── */}
      <aside className={`
        fixed inset-y-0 left-0 z-50 flex w-64 flex-col border-r border-stone-200 bg-white
        transition-transform duration-300 ease-in-out
        lg:static lg:translate-x-0
        ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}
      `}>
        {/* Logo */}
        <div className="flex h-16 shrink-0 items-center gap-2.5 border-b border-stone-100 px-5">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-charcoal">
            <FiShield size={16} className="text-gold-400" />
          </div>
          <div>
            <span className="text-sm font-bold text-charcoal">Admin</span>
            <span className="text-sm font-bold text-gold-600">Portal</span>
          </div>
          <button className="ml-auto text-stone-400 hover:text-stone-700 lg:hidden" onClick={() => setSidebarOpen(false)}>
            <FiX size={20} />
          </button>
        </div>

        {/* Nav */}
        <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-0.5">
          {NAV_ITEMS.map(item => (
            <button
              key={item.id}
              onClick={() => { setPanel(item.id); setSidebarOpen(false); }}
              className={`group flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm transition-all
                ${panel === item.id
                  ? "bg-charcoal text-white shadow-sm"
                  : "text-stone-600 hover:bg-stone-100 hover:text-charcoal"
                }`}
            >
              <item.icon size={18} className={panel === item.id ? "text-gold-400" : "text-stone-400 group-hover:text-stone-600"} />
              <div className="min-w-0 text-left">
                <div className="font-semibold leading-tight truncate">{item.label}</div>
                <div className={`text-[11px] truncate ${panel === item.id ? "text-stone-400" : "text-stone-400"}`}>{item.desc}</div>
              </div>
            </button>
          ))}
        </nav>

        {/* Footer */}
        <div className="shrink-0 border-t border-stone-100 p-3">
          <div className="mb-2 flex items-center gap-2.5 rounded-xl bg-stone-50 px-3 py-2.5">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gold-500 text-white text-xs font-bold">
              {user?.name?.charAt(0)?.toUpperCase() || "A"}
            </div>
            <div className="min-w-0">
              <div className="truncate text-sm font-semibold text-charcoal">{user?.name}</div>
              <div className="text-[11px] text-stone-400 truncate">{user?.email}</div>
            </div>
          </div>
          <button onClick={onNavigateHome} className="flex w-full items-center gap-2.5 rounded-xl px-3 py-2 text-sm font-medium text-stone-500 hover:bg-stone-100 hover:text-charcoal transition-colors">
            <FiLogOut size={16} />
            Exit Admin
          </button>
        </div>
      </aside>

      {/* ── Main ── */}
      <div className="flex flex-1 flex-col min-w-0 overflow-hidden">

        {/* Header */}
        <header className="flex h-16 shrink-0 items-center justify-between border-b border-stone-200 bg-white px-4 sm:px-6 shadow-sm z-10">
          <div className="flex items-center gap-3">
            <button onClick={() => setSidebarOpen(true)} className="text-stone-400 hover:text-charcoal lg:hidden">
              <FiMenu size={22} />
            </button>
            <div className="hidden sm:block">
              <h1 className="text-base font-bold text-charcoal">{NAV_ITEMS.find(n=>n.id===panel)?.label}</h1>
              <p className="text-xs text-stone-400">
                {new Date().toLocaleDateString("en-IN",{weekday:"long",year:"numeric",month:"long",day:"numeric"})}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {/* Status indicator */}
            <div className="hidden sm:flex items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700 ring-1 ring-inset ring-emerald-600/20">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
              Live
            </div>
            <button
              onClick={loadAdmin}
              disabled={loading}
              className="flex items-center gap-1.5 rounded-xl border border-stone-200 bg-white px-3 py-1.5 text-xs font-semibold text-stone-600 hover:bg-stone-50 disabled:opacity-50 transition-all"
            >
              <FiRefreshCw size={14} className={loading ? "animate-spin" : ""} />
              Refresh
            </button>
          </div>
        </header>

        {/* Toast */}
        {status && (
          <div className={`flex shrink-0 items-center justify-between gap-3 px-5 py-3 text-sm font-medium
            ${status.type === "error" ? "bg-rose-600 text-white" : "bg-emerald-600 text-white"}`}>
            <div className="flex items-center gap-2">
              {status.type === "error" ? <FiAlertTriangle size={16} /> : <FiCheckCircle size={16} />}
              {status.msg}
            </div>
            <button onClick={() => setStatus(null)} className="opacity-70 hover:opacity-100"><FiX size={16} /></button>
          </div>
        )}

        {/* Content */}
        <main className="flex-1 overflow-y-auto overflow-x-hidden">
          <div className="mx-auto max-w-7xl p-4 sm:p-6 lg:p-8">

            {/* ═══════════════════════════════════════════════════════ */}
            {/* OVERVIEW                                                */}
            {/* ═══════════════════════════════════════════════════════ */}
            {panel === "overview" && (
              <div className="space-y-6 animate-fadeUp">
                <div>
                  <h2 className="text-2xl font-bold text-charcoal">
                    Welcome back, {user?.name?.split(" ")[0]}! 👋
                  </h2>
                  <p className="mt-1 text-sm text-stone-500">Here's what's happening in your store today.</p>
                </div>

                {/* Stat cards */}
                <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                  <StatCard icon={FiTrendingUp}   label="Total Revenue"    value={formatINR(metrics.totalRevenue || 0)}                color="gold"    hint={`${metrics.orderCount || 0} total orders`} />
                  <StatCard icon={FiPackage}       label="Products"         value={metrics.productCount || 0}                           color="blue"    hint={`${metrics.lowStockCount || 0} low stock`} />
                  <StatCard icon={FiUsers}         label="Registered Users" value={metrics.userCount || 0}                             color="emerald" hint="Customers & admins" />
                  <StatCard icon={FiBox}           label="Inventory Value"  value={formatINR(toInrAmount(metrics.inventoryValue || 0))} color="rose"    hint="Total stock value" />
                </div>

                {/* Quick alerts */}
                {(lowStock > 0 || outOfStock > 0) && (
                  <Card className="p-5">
                    <h3 className="mb-3 text-sm font-bold text-charcoal flex items-center gap-2">
                      <FiAlertTriangle className="text-amber-500" size={16} /> Stock Alerts
                    </h3>
                    <div className="flex flex-wrap gap-3">
                      {outOfStock > 0 && (
                        <button onClick={() => setPanel("products")} className="rounded-xl bg-rose-50 border border-rose-200 px-4 py-2 text-sm font-semibold text-rose-700 hover:bg-rose-100 transition-colors">
                          {outOfStock} out of stock →
                        </button>
                      )}
                      {lowStock > 0 && (
                        <button onClick={() => setPanel("products")} className="rounded-xl bg-amber-50 border border-amber-200 px-4 py-2 text-sm font-semibold text-amber-700 hover:bg-amber-100 transition-colors">
                          {lowStock} low stock →
                        </button>
                      )}
                    </div>
                  </Card>
                )}

                {/* Recent orders */}
                <Card>
                  <div className="flex items-center justify-between border-b border-stone-100 px-5 py-4">
                    <h3 className="font-bold text-charcoal">Recent Orders</h3>
                    <button onClick={() => setPanel("orders")} className="text-xs font-semibold text-gold-700 hover:underline">View all →</button>
                  </div>
                  <TableWrap>
                    <thead>
                      <tr className="border-b border-stone-100 bg-stone-50/60">
                        <Th>Order</Th><Th>Customer</Th><Th>Date</Th><Th>Total</Th><Th>Status</Th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-stone-100">
                      {orders.slice(0, 5).map(o => (
                        <tr key={o._id} className="hover:bg-stone-50 transition-colors">
                          <td className="px-5 py-3 font-mono text-xs font-semibold text-gold-700">{o.orderNumber}</td>
                          <td className="px-5 py-3 text-sm font-medium text-charcoal">{o.customer?.name || "—"}</td>
                          <td className="px-5 py-3 text-xs text-stone-500">{fmtDate(o.createdAt)}</td>
                          <td className="px-5 py-3 text-sm font-bold text-charcoal">{formatINR(o.total || 0)}</td>
                          <td className="px-5 py-3"><Badge label={o.status} /></td>
                        </tr>
                      ))}
                      {!orders.length && (
                        <tr><td colSpan={5} className="px-5 py-10 text-center text-sm text-stone-400">No orders yet.</td></tr>
                      )}
                    </tbody>
                  </TableWrap>
                </Card>

                {/* Quick links */}
                <div className="grid gap-3 sm:grid-cols-3">
                  {NAV_ITEMS.filter(n => n.id !== "overview").map(item => (
                    <button key={item.id} onClick={() => setPanel(item.id)} className="flex items-center gap-3 rounded-2xl border border-stone-200 bg-white p-4 text-left hover:border-gold-300 hover:shadow-sm transition-all group">
                      <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-stone-100 text-stone-500 group-hover:bg-gold-50 group-hover:text-gold-700 transition-colors">
                        <item.icon size={18} />
                      </span>
                      <div className="min-w-0">
                        <div className="font-semibold text-charcoal text-sm truncate">{item.label}</div>
                        <div className="text-xs text-stone-400 truncate">{item.desc}</div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* ═══════════════════════════════════════════════════════ */}
            {/* PRODUCTS                                                */}
            {/* ═══════════════════════════════════════════════════════ */}
            {panel === "products" && (
              <div className="space-y-4 animate-fadeUp">
                <SectionHeader
                  icon={FiPackage}
                  title="Products Catalog"
                  description={`${products.length} products · ${lowStock} low stock · ${outOfStock} out of stock`}
                  actions={
                    <Btn variant="gold" onClick={() => { setProductForm(emptyProduct); setEditingPId(""); setShowProductForm(true); }}>
                      <FiPlus size={16} /> Add Product
                    </Btn>
                  }
                />

                <div className="flex flex-col gap-4 xl:flex-row">
                  {/* Product table */}
                  <div className="min-w-0 flex-1">
                    <Card className="flex flex-col">
                      {/* Search bar */}
                      <div className="flex items-center gap-3 border-b border-stone-100 px-4 py-3">
                        <div className="relative flex-1">
                          <FiSearch size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" />
                          <Input
                            value={query}
                            onChange={e => setQuery(e.target.value)}
                            placeholder="Search products…"
                            className="pl-9 py-2 text-xs"
                          />
                        </div>
                        <span className="text-xs font-semibold text-stone-400 whitespace-nowrap">{filteredProducts.length} items</span>
                      </div>
                      {/* Table */}
                      <div className="overflow-x-auto">
                        <table className="w-full text-left text-sm">
                          <thead>
                            <tr className="border-b border-stone-100 bg-stone-50/60">
                              <Th>Product</Th>
                              <Th>Category</Th>
                              <Th>Price</Th>
                              <Th>Stock</Th>
                              <Th>Featured</Th>
                              <Th right>Actions</Th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-stone-100">
                            {filteredProducts.map(p => (
                              <tr key={pid(p)} className="hover:bg-stone-50/80 transition-colors group">
                                <td className="px-5 py-3">
                                  <div className="flex items-center gap-3">
                                    <CatalogImage
                                      src={p.image} alt={p.name} category={p.category}
                                      className="h-10 w-10 shrink-0 rounded-xl object-cover border border-stone-200 bg-stone-100"
                                    />
                                    <div className="min-w-0">
                                      <p className="font-semibold text-charcoal truncate text-xs leading-tight">{p.name}</p>
                                      <p className="text-[11px] text-stone-400 truncate">{p.slug}</p>
                                    </div>
                                  </div>
                                </td>
                                <td className="px-5 py-3 text-xs text-stone-600">{p.category}</td>
                                <td className="px-5 py-3 text-xs font-bold text-charcoal whitespace-nowrap">
                                  {formatINR(toInrAmount(p.price, p.currency))}
                                </td>
                                <td className="px-5 py-3">
                                  <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-[11px] font-semibold
                                    ${p.stock === 0 ? "bg-rose-100 text-rose-700" : p.stock <= 5 ? "bg-amber-100 text-amber-700" : "bg-emerald-100 text-emerald-700"}`}>
                                    {p.stock === 0 ? "Out" : p.stock}
                                  </span>
                                </td>
                                <td className="px-5 py-3">
                                  {p.featured ? (
                                    <span className="flex items-center gap-1 text-[11px] font-semibold text-gold-700">
                                      <FiStar size={12} fill="currentColor" /> Yes
                                    </span>
                                  ) : (
                                    <span className="text-[11px] text-stone-400">—</span>
                                  )}
                                </td>
                                <td className="px-5 py-3">
                                  <div className="flex justify-end gap-1.5">
                                    <button onClick={() => startEditProduct(p)} className="rounded-lg p-1.5 text-stone-400 hover:bg-gold-50 hover:text-gold-700 transition-colors">
                                      <FiEdit3 size={15} />
                                    </button>
                                    <button onClick={() => handleDeleteProduct(pid(p))} className="rounded-lg p-1.5 text-stone-400 hover:bg-rose-50 hover:text-rose-600 transition-colors">
                                      <FiTrash2 size={15} />
                                    </button>
                                  </div>
                                </td>
                              </tr>
                            ))}
                            {!filteredProducts.length && (
                              <tr><td colSpan={6} className="px-5 py-12 text-center text-sm text-stone-400">No products found.</td></tr>
                            )}
                          </tbody>
                        </table>
                      </div>
                    </Card>
                  </div>

                  {/* Product form */}
                  {showProductForm && (
                    <div className="w-full xl:w-80 shrink-0">
                      <Card className="p-5">
                        <div className="mb-4 flex items-center justify-between">
                          <h3 className="font-bold text-charcoal">{editingPId ? "Edit Product" : "New Product"}</h3>
                          <button onClick={() => setShowProductForm(false)} className="text-stone-400 hover:text-stone-700">
                            <FiX size={18} />
                          </button>
                        </div>
                        <form onSubmit={handleSaveProduct} className="space-y-3">
                          {/* Image upload */}
                          <div className="group relative overflow-hidden rounded-xl border-2 border-dashed border-stone-200 bg-stone-50 hover:border-gold-300 transition-colors cursor-pointer">
                            {productForm.image ? (
                              <CatalogImage src={productForm.image} alt="Preview" className="aspect-video w-full object-cover" />
                            ) : (
                              <div className="flex aspect-video flex-col items-center justify-center text-stone-300 group-hover:text-gold-500 transition-colors">
                                <FiImage size={28} className="mb-1.5" />
                                <span className="text-xs font-medium">{uploading ? "Uploading…" : "Click to upload"}</span>
                              </div>
                            )}
                            <input type="file" accept="image/*" onChange={handleImageFile} disabled={uploading} className="absolute inset-0 opacity-0 cursor-pointer" />
                          </div>

                          <div>
                            <Label>Image URL</Label>
                            <Input value={productForm.image} onChange={e => setPF("image", e.target.value)} placeholder="https://..." />
                          </div>
                          <div>
                            <Label>Product Name *</Label>
                            <Input required value={productForm.name} onChange={e => setPF("name", e.target.value)} placeholder="e.g. Aurora Diamond Ring" />
                          </div>
                          <div className="grid grid-cols-2 gap-3">
                            <div>
                              <Label>Category</Label>
                              <Select value={productForm.category} onChange={e => setPF("category", e.target.value)}>
                                {categories.map(c => <option key={c}>{c}</option>)}
                              </Select>
                            </div>
                            <div>
                              <Label>Price (₹ INR) *</Label>
                              <Input required type="number" min="0" step="0.01" value={productForm.price} onChange={e => setPF("price", e.target.value)} placeholder="0.00" />
                            </div>
                          </div>
                          <div className="grid grid-cols-2 gap-3">
                            <div>
                              <Label>Stock Qty</Label>
                              <Input type="number" min="0" value={productForm.stock} onChange={e => setPF("stock", e.target.value)} placeholder="0" />
                            </div>
                            <div>
                              <Label>Badge Label</Label>
                              <Input value={productForm.badge} onChange={e => setPF("badge", e.target.value)} placeholder="New / Sale" />
                            </div>
                          </div>
                          <div>
                            <Label>Description *</Label>
                            <Textarea required rows={3} value={productForm.description} onChange={e => setPF("description", e.target.value)} placeholder="Product description…" />
                          </div>
                          <Toggle
                            checked={productForm.featured}
                            onChange={e => setPF("featured", e.target.checked)}
                            label="Feature on homepage"
                          />
                          <div className="flex gap-2 pt-1">
                            <Btn type="submit" variant="primary" disabled={loading || uploading} className="flex-1">
                              <FiSave size={15} />
                              {editingPId ? "Update" : "Save"}
                            </Btn>
                            <Btn type="button" variant="ghost" onClick={() => { setProductForm(emptyProduct); setEditingPId(""); }}>
                              Clear
                            </Btn>
                          </div>
                        </form>
                      </Card>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* ═══════════════════════════════════════════════════════ */}
            {/* ORDERS                                                  */}
            {/* ═══════════════════════════════════════════════════════ */}
            {panel === "orders" && (
              <div className="space-y-4 animate-fadeUp">
                <SectionHeader
                  icon={FiShoppingBag}
                  title="Orders Management"
                  description={`${orders.length} orders total`}
                />
                <Card>
                  <TableWrap>
                    <thead>
                      <tr className="border-b border-stone-100 bg-stone-50/60">
                        <Th>Order #</Th>
                        <Th>Customer</Th>
                        <Th>Items</Th>
                        <Th>Date</Th>
                        <Th>Total</Th>
                        <Th>Payment</Th>
                        <Th>Status</Th>
                        <Th></Th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-stone-100">
                      {orders.map(o => (
                        <tr key={o._id} className="hover:bg-stone-50/70 transition-colors cursor-pointer group" onClick={() => setSelectedOrder(o)}>
                          <td className="px-5 py-3.5">
                            <button
                              type="button"
                              onClick={e => { e.stopPropagation(); setSelectedOrder(o); }}
                              className="font-mono text-xs font-bold text-gold-700 underline underline-offset-2 decoration-dotted hover:text-gold-500 transition whitespace-nowrap"
                            >
                              {o.orderNumber}
                            </button>
                          </td>
                          <td className="px-5 py-3.5">
                            <div className="text-xs font-semibold text-charcoal whitespace-nowrap">{o.customer?.name || "—"}</div>
                            <div className="text-[11px] text-stone-400 whitespace-nowrap">{o.customer?.email || ""}</div>
                          </td>
                          <td className="px-5 py-3.5 text-xs text-stone-500 whitespace-nowrap">{o.items?.length || 0} item(s)</td>
                          <td className="px-5 py-3.5 text-xs text-stone-500 whitespace-nowrap">{fmtDate(o.createdAt)}</td>
                          <td className="px-5 py-3.5 text-sm font-bold text-charcoal whitespace-nowrap">{formatINR(o.total || 0)}</td>
                          <td className="px-5 py-3.5" onClick={e => e.stopPropagation()}>
                            <Select
                              value={o.paymentStatus || "pending"}
                              onChange={e => handleOrderChange(o._id, "paymentStatus", e.target.value)}
                              className="py-1.5 text-xs w-28"
                            >
                              <option value="pending">Pending</option>
                              <option value="paid">Paid</option>
                              <option value="refunded">Refunded</option>
                            </Select>
                          </td>
                          <td className="px-5 py-3.5" onClick={e => e.stopPropagation()}>
                            <Select
                              value={o.status || "pending"}
                              onChange={e => handleOrderChange(o._id, "status", e.target.value)}
                              className="py-1.5 text-xs w-28"
                            >
                              {ORDER_STATUSES.map(s => <option key={s} value={s}>{s.charAt(0).toUpperCase()+s.slice(1)}</option>)}
                            </Select>
                          </td>
                          <td className="px-5 py-3.5">
                            <button
                              type="button"
                              onClick={e => { e.stopPropagation(); setSelectedOrder(o); }}
                              className="inline-flex items-center gap-1 rounded-lg border border-stone-200 bg-white px-2.5 py-1.5 text-[11px] font-semibold text-stone-600 shadow-sm transition hover:border-gold-300 hover:text-gold-700 hover:bg-gold-50"
                              title="View full order details"
                            >
                              <FiSearch size={11}/> View
                            </button>
                          </td>
                        </tr>
                      ))}
                      {!orders.length && (
                        <tr><td colSpan={8} className="px-5 py-12 text-center text-sm text-stone-400">No orders found.</td></tr>
                      )}
                    </tbody>
                  </TableWrap>
                </Card>
              </div>
            )}

            {/* ═══════════════════════════════════════════════════════ */}
            {/* USERS                                                   */}
            {/* ═══════════════════════════════════════════════════════ */}
            {panel === "users" && (
              <div className="space-y-4 animate-fadeUp">
                <SectionHeader
                  icon={FiUsers}
                  title="User Accounts"
                  description={`${users.length} registered users`}
                />
                <Card>
                  <TableWrap>
                    <thead>
                      <tr className="border-b border-stone-100 bg-stone-50/60">
                        <Th>User</Th>
                        <Th>Email</Th>
                        <Th>Role</Th>
                        <Th>Joined</Th>
                        <Th>Change Role</Th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-stone-100">
                      {users.map(u => (
                        <tr key={u._id} className="hover:bg-stone-50 transition-colors">
                          <td className="px-5 py-3.5">
                            <div className="flex items-center gap-3">
                              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-gold-300 to-gold-600 text-white text-sm font-bold shadow-sm">
                                {u.name?.charAt(0)?.toUpperCase() || "?"}
                              </div>
                              <span className="text-sm font-semibold text-charcoal whitespace-nowrap">{u.name}</span>
                            </div>
                          </td>
                          <td className="px-5 py-3.5 text-xs text-stone-500">{u.email}</td>
                          <td className="px-5 py-3.5"><Badge label={u.role} /></td>
                          <td className="px-5 py-3.5 text-xs text-stone-400 whitespace-nowrap">{fmtDate(u.createdAt)}</td>
                          <td className="px-5 py-3.5">
                            <Select
                              value={u.role}
                              onChange={e => handleUserRole(u._id, e.target.value)}
                              className="py-1.5 text-xs w-32"
                            >
                              <option value="customer">Customer</option>
                              <option value="admin">Admin</option>
                            </Select>
                          </td>
                        </tr>
                      ))}
                      {!users.length && (
                        <tr><td colSpan={5} className="px-5 py-12 text-center text-sm text-stone-400">No users found.</td></tr>
                      )}
                    </tbody>
                  </TableWrap>
                </Card>
              </div>
            )}

            {/* ═══════════════════════════════════════════════════════ */}
            {/* OFFERS                                                  */}
            {/* ═══════════════════════════════════════════════════════ */}
            {panel === "offers" && (
              <div className="space-y-4 animate-fadeUp">
                <SectionHeader
                  icon={FiPercent}
                  title="Offers & Coupons"
                  description={`${offers.filter(o=>o.status==="active").length} active · ${offers.length} total`}
                />
                <div className="flex flex-col gap-4 xl:flex-row">
                  {/* Offers list */}
                  <div className="min-w-0 flex-1 space-y-3">
                    {offers.map(offer => (
                      <Card key={offer._id} className="p-5 group hover:shadow-md transition-all">
                        <div className="flex items-start justify-between gap-3">
                          <div className="min-w-0 flex-1">
                            <div className="flex items-center gap-2 mb-1 flex-wrap">
                              <span className="font-mono text-lg font-black text-charcoal">{offer.code}</span>
                              <Badge label={offer.status} />
                            </div>
                            <p className="text-sm font-medium text-gold-700 truncate">{offer.title}</p>
                            <div className="mt-3 flex flex-wrap gap-x-5 gap-y-1 text-xs text-stone-500">
                              <span><strong className="text-stone-700">Type:</strong> {offer.discountType.replace("_"," ")}</span>
                              <span><strong className="text-stone-700">Value:</strong> {offer.discountValue}{offer.discountType === "percentage" ? "%" : "₹"}</span>
                              {offer.minSpend > 0 && <span><strong className="text-stone-700">Min spend:</strong> ₹{offer.minSpend}</span>}
                              <span><strong className="text-stone-700">Used:</strong> {offer.usageCount || 0}×</span>
                            </div>
                          </div>
                          <div className="flex gap-1.5 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button onClick={() => startEditOffer(offer)} className="rounded-lg p-2 text-stone-400 hover:bg-gold-50 hover:text-gold-700 transition-colors">
                              <FiEdit3 size={15} />
                            </button>
                            <button onClick={() => handleDeleteOffer(offer._id)} className="rounded-lg p-2 text-stone-400 hover:bg-rose-50 hover:text-rose-600 transition-colors">
                              <FiTrash2 size={15} />
                            </button>
                          </div>
                        </div>
                      </Card>
                    ))}
                    {!offers.length && (
                      <Card className="py-12 text-center text-sm text-stone-400">No offers created yet.</Card>
                    )}
                  </div>

                  {/* Offer form */}
                  <div className="w-full xl:w-80 shrink-0">
                    <Card className="p-5">
                      <h3 className="mb-4 font-bold text-charcoal">{editingOId ? "Edit Offer" : "New Offer"}</h3>
                      <form onSubmit={handleSaveOffer} className="space-y-3">
                        <div>
                          <Label>Coupon Code *</Label>
                          <Input required value={offerForm.code} onChange={e => setOF("code", e.target.value.toUpperCase())} placeholder="SUMMER20" className="font-mono font-bold uppercase" />
                        </div>
                        <div>
                          <Label>Title *</Label>
                          <Input required value={offerForm.title} onChange={e => setOF("title", e.target.value)} placeholder="20% Off Summer Sale" />
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                          <div>
                            <Label>Type</Label>
                            <Select value={offerForm.discountType} onChange={e => setOF("discountType", e.target.value)}>
                              <option value="percentage">Percentage</option>
                              <option value="fixed">Fixed ₹</option>
                              <option value="free_shipping">Free Shipping</option>
                            </Select>
                          </div>
                          <div>
                            <Label>Value</Label>
                            <Input type="number" min="0" value={offerForm.discountValue} onChange={e => setOF("discountValue", e.target.value)} placeholder="10" />
                          </div>
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                          <div>
                            <Label>Min Spend (₹)</Label>
                            <Input type="number" min="0" value={offerForm.minSpend} onChange={e => setOF("minSpend", e.target.value)} placeholder="0" />
                          </div>
                          <div>
                            <Label>Max Discount (₹)</Label>
                            <Input type="number" min="0" value={offerForm.maxDiscount} onChange={e => setOF("maxDiscount", e.target.value)} placeholder="0" />
                          </div>
                        </div>
                        <div>
                          <Label>Status</Label>
                          <Select value={offerForm.status} onChange={e => setOF("status", e.target.value)}>
                            <option value="active">Active</option>
                            <option value="draft">Draft</option>
                            <option value="expired">Expired</option>
                          </Select>
                        </div>
                        <div className="flex gap-2 pt-1">
                          <Btn type="submit" variant="primary" disabled={loading} className="flex-1">
                            <FiSave size={15} />
                            {editingOId ? "Update" : "Create"}
                          </Btn>
                          <Btn type="button" variant="ghost" onClick={() => { setOfferForm(emptyOffer); setEditingOId(""); }}>
                            Clear
                          </Btn>
                        </div>
                      </form>
                    </Card>
                  </div>
                </div>
              </div>
            )}

            {/* ═══════════════════════════════════════════════════════ */}
            {/* DATABASE / RECORDS                                      */}
            {/* ═══════════════════════════════════════════════════════ */}
            {panel === "data" && (
              <div className="space-y-4 animate-fadeUp">
                <SectionHeader
                  icon={FiDatabase}
                  title="Database Records"
                  description="Contact messages and newsletter subscribers"
                />
                <div className="grid gap-4 lg:grid-cols-2">
                  {/* Contact messages */}
                  <div className="flex flex-col gap-3">
                    <div className="flex items-center gap-2">
                      <FiMail size={16} className="text-stone-400" />
                      <h3 className="font-bold text-charcoal text-sm">Contact Messages</h3>
                      <span className="ml-auto rounded-full bg-stone-100 px-2.5 py-0.5 text-xs font-semibold text-stone-500">{contacts.length}</span>
                    </div>
                    <div className="space-y-2">
                      {contacts.map(msg => (
                        <Card key={msg._id} className="p-4 hover:shadow-md transition-all">
                          <div className="flex items-start justify-between gap-2 mb-2">
                            <p className="text-sm font-bold text-charcoal leading-snug">{msg.subject || "No subject"}</p>
                            <span className="shrink-0 text-[10px] font-semibold text-stone-400 whitespace-nowrap">{fmtDate(msg.createdAt)}</span>
                          </div>
                          <p className="text-xs text-stone-600 leading-relaxed line-clamp-3">{msg.message}</p>
                          <div className="mt-3 flex items-center gap-2 border-t border-stone-100 pt-2 text-xs text-stone-500">
                            <span className="font-semibold text-charcoal">{msg.name}</span>
                            <span className="text-stone-300">·</span>
                            <span className="truncate">{msg.email}</span>
                          </div>
                        </Card>
                      ))}
                      {!contacts.length && (
                        <Card className="py-10 text-center text-sm text-stone-400">No contact messages yet.</Card>
                      )}
                    </div>
                  </div>

                  {/* Subscribers */}
                  <div className="flex flex-col gap-3">
                    <div className="flex items-center gap-2">
                      <FiTag size={16} className="text-stone-400" />
                      <h3 className="font-bold text-charcoal text-sm">Newsletter Subscribers</h3>
                      <span className="ml-auto rounded-full bg-gold-100 px-2.5 py-0.5 text-xs font-semibold text-gold-700">{subscribers.length} total</span>
                    </div>
                    <Card>
                      <div className="divide-y divide-stone-100">
                        {subscribers.map(sub => (
                          <div key={sub._id} className="flex items-center gap-3 px-4 py-3 hover:bg-stone-50 transition-colors">
                            <FiCheckCircle size={15} className="shrink-0 text-emerald-500" />
                            <span className="min-w-0 flex-1 truncate text-sm font-medium text-stone-700">{sub.email}</span>
                            <span className="text-[11px] text-stone-400 whitespace-nowrap">{fmtDate(sub.createdAt)}</span>
                          </div>
                        ))}
                        {!subscribers.length && (
                          <div className="py-10 text-center text-sm text-stone-400">No subscribers yet.</div>
                        )}
                      </div>
                    </Card>
                  </div>
                </div>
              </div>
            )}

          </div>
        </main>
      </div>

      {/* Order Detail Modal */}
      {selectedOrder && (
        <OrderDetailModal order={selectedOrder} onClose={() => setSelectedOrder(null)} />
      )}
    </div>
  );
}
