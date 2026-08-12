import { FaStar } from "react-icons/fa";
import CatalogImage from "./CatalogImage";
import CartButton from "./CartButton";
import FavoriteButton from "./FavoriteButton";
import { useCatalog } from "../hooks/useCatalog";
import SectionHeading from "./SectionHeading";

export default function FeaturedProducts({ onNavigateLogin, onNavigateProduct }) {
  const { products, loading, error } = useCatalog({ featured: true });

  return (
    <section id="shop" className="bg-white/65 py-20 sm:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow="Featured products"
          title="Luxury That Feels Personal"
          description="Elegant product cards with price, rating, wishlist actions, and clear calls to add each piece to your collection."
        />

        <div className="mt-5 min-h-6 text-center text-sm text-stone-500">
          {loading
            ? "Loading latest pieces..."
            : error
              ? "Showing saved pieces while the catalog reconnects."
              : null}
        </div>

        <div className="mt-12 grid gap-6 sm:grid-cols-2 xl:grid-cols-4">
          {products.map((product) => (
            <article
              key={product.id}
              className="group rounded-[1.5rem] border border-black/5 bg-white p-3 shadow-sm transition hover:-translate-y-1 hover:shadow-luxe"
            >
              <div className="relative overflow-hidden rounded-[1.2rem]">
                <CatalogImage
                  src={product.image}
                  alt={product.name}
                  category={product.category}
                  className="aspect-[4/5] w-full object-cover transition duration-500 group-hover:scale-105"
                />
                <FavoriteButton
                  product={product}
                  onAuthRequired={onNavigateLogin}
                  className="absolute right-4 top-4"
                />
              </div>

              <div className="space-y-3 p-4">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h3 className="font-display text-xl text-charcoal">
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
                  <p className="text-lg font-semibold text-charcoal">
                    {product.price}
                  </p>
                </div>

                <CartButton
                  product={product}
                  onAuthRequired={onNavigateLogin}
                  className="w-full"
                />
                <button
                  type="button"
                  onClick={() => onNavigateProduct?.(product.slug || product.id)}
                  className="w-full rounded-full border border-black/10 bg-white px-5 py-3 text-sm font-semibold text-charcoal transition hover:-translate-y-0.5 hover:border-gold-300 hover:text-gold-700"
                >
                  View Details
                </button>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
