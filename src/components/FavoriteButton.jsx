import { useState } from "react";
import { FaHeart } from "react-icons/fa";
import { useAuth } from "../context/AuthContext";

export default function FavoriteButton({ product, onAuthRequired, className = "" }) {
  const { favoriteIds, isAuthenticated, toggleFavorite } = useAuth();
  const [pending, setPending] = useState(false);
  const productId = product._id || product.id;
  const isFavorite = favoriteIds.includes(productId);

  const handleClick = async () => {
    if (!isAuthenticated) {
      onAuthRequired?.();
      return;
    }

    try {
      setPending(true);
      await toggleFavorite(product);
    } finally {
      setPending(false);
    }
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={pending}
      className={`grid h-10 w-10 place-items-center rounded-full bg-white/90 shadow-sm transition hover:text-rose-500 ${
        isFavorite ? "text-rose-500" : "text-stone-600"
      } ${pending ? "scale-95 opacity-70" : "hover:-translate-y-0.5"} ${className}`}
      aria-label={`${isFavorite ? "Remove" : "Add"} ${product.name} ${
        isFavorite ? "from" : "to"
      } favorites`}
      title={isAuthenticated ? "Save favorite" : "Login to save favorites"}
    >
      <FaHeart />
    </button>
  );
}
