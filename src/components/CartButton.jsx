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
  const [status, setStatus] = useState("idle");

  const handleClick = async () => {
    if (!isAuthenticated) {
      onAuthRequired?.();
      return;
    }

    try {
      setStatus("loading");
      await addToCart(product);
      setStatus("added");
      window.setTimeout(() => setStatus("idle"), 1300);
    } catch (_error) {
      setStatus("idle");
    }
  };

  const isLoading = status === "loading";
  const isAdded = status === "added";

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={isLoading}
      className={`group inline-flex items-center justify-center gap-2 overflow-hidden rounded-full px-5 py-3 text-sm font-semibold transition duration-300 ${
        isAdded
          ? "bg-emerald-600 text-white shadow-lg shadow-emerald-900/10"
          : "bg-charcoal text-white hover:-translate-y-0.5 hover:bg-black hover:shadow-luxe"
      } disabled:cursor-wait disabled:opacity-80 ${className}`}
      aria-label={`Add ${product.name} to cart`}
      title={isAuthenticated ? "Add to cart" : "Login to add products"}
    >
      <span
        className={`grid h-5 w-5 place-items-center transition ${
          isLoading ? "animate-spin" : isAdded ? "scale-110" : "group-hover:scale-110"
        }`}
      >
        {isAdded ? <FiCheck /> : <FiShoppingBag />}
      </span>
      {!compact && (
        <span className="whitespace-nowrap">
          {isLoading ? "Adding..." : isAdded ? "Added" : "Add to Cart"}
        </span>
      )}
    </button>
  );
}
