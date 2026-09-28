import { useState } from "react";
import { FiCheck, FiShoppingBag } from "react-icons/fi";
import { useAuth } from "../context/AuthContext";

export default function CartButton({
  product,
  onAuthRequired,
  className = "",
  compact = false,
}) {
  const { addToCart, isAuthenticated } = useAuth();
  const [status, setStatus]   = useState("idle");   // idle | loading | added | error
  const [errorMsg, setErrorMsg] = useState("");

  const handleClick = async () => {
    // Not logged in → go to login silently
    if (!isAuthenticated) {
      onAuthRequired?.();
      return;
    }

    if (status === "loading") return;

    try {
      setStatus("loading");
      setErrorMsg("");
      await addToCart(product);
      setStatus("added");
      window.setTimeout(() => setStatus("idle"), 1800);
    } catch (err) {
      // Show the actual error message so the user knows what happened
      const msg = err?.message || "Could not add to cart.";
      setErrorMsg(msg);
      setStatus("error");
      window.setTimeout(() => {
        setStatus("idle");
        setErrorMsg("");
      }, 3000);
    }
  };

  const isLoading = status === "loading";
  const isAdded   = status === "added";
  const isError   = status === "error";

  /* ── colour ── */
  const colourClass = isAdded
    ? "bg-emerald-600 text-white shadow-lg shadow-emerald-900/10"
    : isError
    ? "bg-rose-600 text-white"
    : "bg-charcoal text-white hover:-translate-y-0.5 hover:bg-black hover:shadow-luxe";

  /* ── label ── */
  const label = isLoading
    ? "Adding…"
    : isAdded
    ? "Added ✓"
    : isError
    ? (errorMsg || "Error")
    : "Add to Cart";

  return (
    <button
      type="button"
      id={`add-to-cart-${product._id || product.slug || product.id}`}
      onClick={handleClick}
      disabled={isLoading}
      title={isAuthenticated ? "Add to cart" : "Login to add to cart"}
      className={`group inline-flex items-center justify-center gap-2 overflow-hidden rounded-full px-5 py-3 text-sm font-semibold transition duration-300 ${colourClass} disabled:cursor-wait disabled:opacity-80 ${className}`}
      aria-label={`Add ${product.name} to cart`}
    >
      <span
        className={`grid h-5 w-5 shrink-0 place-items-center transition ${
          isLoading ? "animate-spin" : isAdded ? "scale-110" : "group-hover:scale-110"
        }`}
      >
        {isAdded ? <FiCheck /> : <FiShoppingBag />}
      </span>

      {!compact && (
        <span className="min-w-0 truncate whitespace-nowrap">{label}</span>
      )}
    </button>
  );
}
