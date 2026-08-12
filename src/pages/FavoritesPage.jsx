import { FaStar } from "react-icons/fa";
import CartButton from "../components/CartButton";
import CatalogImage from "../components/CatalogImage";
import FavoriteButton from "../components/FavoriteButton";
import { useAuth } from "../context/AuthContext";
import { formatProductPrice } from "../utils/currency";

export default function FavoritesPage({
  onNavigateHome,
  onNavigateShop,
  onNavigateLogin,
  onNavigateProduct,
}) {
  const { favoriteProducts, isAuthenticated, loading } = useAuth();

  if (!isAuthenticated && !loading) {
    return (
      <section className="mx-auto max-w-4xl px-4 py-16 text-center sm:px-6 lg:px-8">
        <p className="text-xs font-semibold uppercase tracking-[0.3em] text-gold-700">
          Favorites
        </p>
        <h1 className="mt-3 font-display text-4xl font-semibold text-charcoal sm:text-5xl">
          Login to save your favorite pieces
        </h1>
        <p className="mx-auto mt-4 max-w-xl text-sm leading-7 text-stone-600">
          Your wishlist is connected to your account, so you can return to your
          saved rings, necklaces, earrings, and bracelets anytime.
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
          <span className="text-stone-700">Favorites</span>
        </div>

        <button
          type="button"
          onClick={onNavigateShop}
          className="inline-flex items-center justify-center rounded-full border border-black/10 bg-white px-5 py-3 text-sm font-semibold text-charcoal transition hover:-translate-y-0.5 hover:border-gold-300 hover:text-gold-700"
        >
          Continue Shopping
        </button>
      </div>

      <div className="rounded-[1.5rem] border border-black/5 bg-white p-5 shadow-sm sm:p-6">
        <p className="text-xs font-semibold uppercase tracking-[0.3em] text-gold-700">
          Saved pieces
        </p>
        <h1 className="mt-3 font-display text-4xl font-semibold tracking-tight text-charcoal">
          Your Favorite Jewelry
        </h1>
        <p className="mt-3 text-sm leading-7 text-stone-600">
        Timeless jewelry crafted to add elegance and sparkle to every moment.
        </p>
      </div>

      {favoriteProducts.length ? (
        <div className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {favoriteProducts.map((product) => (
            <article
              key={product._id || product.id}
              className="group flex h-full flex-col overflow-hidden rounded-[1.5rem] border border-black/5 bg-white transition hover:-translate-y-1 hover:shadow-luxe"
            >
              <div className="relative overflow-hidden">
                <button
                  type="button"
                  onClick={() => onNavigateProduct?.(product.slug || product._id || product.id)}
                  className="block w-full text-left"
                  aria-label={`View ${product.name} details`}
                >
                  <CatalogImage
                    src={product.image}
                    alt={product.name}
                    category={product.category}
                    className="aspect-[4/5] w-full object-cover transition duration-500 group-hover:scale-105"
                  />
                </button>
                <FavoriteButton
                  product={{ ...product, id: product._id || product.id }}
                  className="absolute right-4 top-4"
                />
              </div>

              <div className="flex flex-1 flex-col space-y-4 p-5">
                <div className="flex items-start justify-between gap-4">
                  <div className="min-w-0">
                    <h3 className="truncate font-display text-xl text-charcoal sm:text-[1.55rem]">
                      {product.name}
                    </h3>
                    <div className="mt-2 flex items-center gap-1 text-gold-500">
                      {Array.from({ length: Math.round(product.rating) }).map((_, index) => (
                        <FaStar key={index} size={13} />
                      ))}
                      <span className="ml-2 text-xs text-stone-500">
                        {product.rating}.0
                      </span>
                    </div>
                  </div>
                  <p className="shrink-0 text-lg font-semibold text-charcoal">
                    {formatProductPrice(product)}
                  </p>
                </div>

                <CartButton
                  product={{ ...product, id: product._id || product.id }}
                  onAuthRequired={onNavigateLogin}
                  className="mt-auto w-full"
                />
                <button
                  type="button"
                  onClick={() => onNavigateProduct?.(product.slug || product._id || product.id)}
                  className="w-full rounded-full border border-black/10 bg-white px-5 py-3 text-sm font-semibold text-charcoal transition hover:-translate-y-0.5 hover:border-gold-300 hover:text-gold-700"
                >
                  View Details
                </button>
              </div>
            </article>
          ))}
        </div>
      ) : (
        <div className="mt-8 rounded-[1.5rem] border border-dashed border-gold-200 bg-white p-8 text-center">
          <h2 className="font-display text-3xl text-charcoal">
            Your favorites list is empty.
          </h2>
          <p className="mt-3 text-sm text-stone-500">
            Tap a heart on any product to save it here.
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
    </section>
  );
}
