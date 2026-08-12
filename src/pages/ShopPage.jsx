import {
  FaStar,
} from "react-icons/fa";
import { useMemo, useState } from "react";
import { FiChevronDown, FiSearch, FiSliders } from "react-icons/fi";
import CartButton from "../components/CartButton";
import CatalogImage from "../components/CatalogImage";
import FavoriteButton from "../components/FavoriteButton";
import { realImages } from "../data";
import { useCatalog } from "../hooks/useCatalog";

export default function ShopPage({ onNavigateHome, onNavigateLogin, onNavigateProduct }) {
  const { categories, products, loading, error } = useCatalog();
  const [searchTerm, setSearchTerm] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");
  const [sortMode, setSortMode] = useState("Featured");

  const shopFilters = useMemo(
    () => ["All", ...categories.map((category) => category.name)],
    [categories]
  );

  const visibleProducts = useMemo(() => {
    const normalizedSearch = searchTerm.trim().toLowerCase();

    return products
      .filter((product) => {
        const matchesCategory =
          activeCategory === "All" || product.category === activeCategory;
        const matchesSearch =
          !normalizedSearch ||
          [product.name, product.category, product.description]
            .filter(Boolean)
            .some((value) => value.toLowerCase().includes(normalizedSearch));

        return matchesCategory && matchesSearch;
      })
      .sort((first, second) => {
        if (sortMode === "Popular") {
          return second.rating - first.rating;
        }

        return Number(second.featured) - Number(first.featured);
      });
  }, [activeCategory, products, searchTerm, sortMode]);

  const averageRating = products.length
    ? (
        products.reduce((total, product) => total + product.rating, 0) /
        products.length
      ).toFixed(1)
    : "5.0";

  const stats = [
    { label: "Curated pieces", value: `${products.length}+` },
    { label: "Categories", value: categories.length },
    { label: "Average rating", value: `${averageRating}/5` },
    { label: "Gift-ready orders", value: "24h" },
  ];

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
          <span className="text-stone-700">Shop</span>
        </div>

        <button
          type="button"
          onClick={onNavigateHome}
          className="inline-flex items-center justify-center rounded-full border border-black/10 bg-white px-5 py-3 text-sm font-semibold text-charcoal transition hover:-translate-y-0.5 hover:border-gold-300 hover:text-gold-700"
        >
          Back to Home
        </button>
      </div>

      <div className="grid gap-6 lg:grid-cols-[300px_minmax(0,1fr)]">
        <aside className="space-y-5 lg:sticky lg:top-24 lg:h-fit">
          <div className="rounded-[1.5rem] border border-black/5 bg-white p-5 shadow-sm">
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-gold-700">
              Shop
            </p>
            <h1 className="mt-3 font-display text-4xl font-semibold tracking-tight text-charcoal">
              Browse the Full Jewelry Collection
            </h1>
            <p className="mt-3 text-sm leading-7 text-stone-600">
              Explore rings, necklaces, earrings, and bracelets with a refined
              luxury presentation.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-3">
            {stats.map((item) => (
              <article
                key={item.label}
                className="rounded-[1.25rem] border border-black/5 bg-ivory p-4"
              >
                <p className="text-2xl font-semibold text-charcoal">{item.value}</p>
                <p className="mt-1 text-xs uppercase tracking-[0.2em] text-stone-500">
                  {item.label}
                </p>
              </article>
            ))}
          </div>

        </aside>

        <div className="space-y-8">
          <div className="rounded-[1.5rem] border border-black/5 bg-white p-5 shadow-sm">
            <div className="flex flex-col gap-3 xl:flex-row xl:items-center xl:justify-between">
              <div className="flex flex-1 items-center gap-3 rounded-full border border-black/10 bg-ivory px-4 py-3">
                <FiSearch className="text-stone-500" />
                <input
                  type="text"
                  placeholder="Search products"
                  value={searchTerm}
                  onChange={(event) => setSearchTerm(event.target.value)}
                  className="w-full bg-transparent text-sm outline-none placeholder:text-stone-400"
                />
              </div>

              <div className="flex flex-wrap items-center gap-3">
                <div className="inline-flex rounded-full border border-black/10 bg-ivory p-1">
                  <button
                    type="button"
                    onClick={() => setSortMode("Featured")}
                    className={`rounded-full px-4 py-2 text-sm font-medium transition ${
                      sortMode === "Featured"
                        ? "bg-white text-charcoal shadow-sm"
                        : "text-stone-500 hover:text-charcoal"
                    }`}
                  >
                    Featured
                  </button>
                  <button
                    type="button"
                    onClick={() => setSortMode("Popular")}
                    className={`rounded-full px-4 py-2 text-sm font-medium transition ${
                      sortMode === "Popular"
                        ? "bg-white text-charcoal shadow-sm"
                        : "text-stone-500 hover:text-charcoal"
                    }`}
                  >
                    Popular
                  </button>
                </div>

                <button
                  type="button"
                  className="inline-flex items-center gap-2 rounded-full border border-black/10 bg-white px-4 py-3 text-sm font-medium text-stone-700 transition hover:border-gold-300 hover:text-gold-700"
                >
                  Sort by
                  <FiChevronDown />
                </button>
              </div>
            </div>

            <div className="mt-4 flex flex-wrap gap-2">
              {shopFilters.map((item) => (
                <button
                  type="button"
                  key={item}
                  onClick={() => setActiveCategory(item)}
                  className={`rounded-full px-4 py-2 text-sm font-medium ${
                    activeCategory === item
                      ? "bg-charcoal text-white"
                      : "bg-gold-50 text-gold-800"
                  }`}
                >
                  {item}
                </button>
              ))}
            </div>

            <p className="mt-4 min-h-5 text-sm text-stone-500">
              {loading
                ? "Loading live catalog..."
                : error
                  ? "Showing saved catalog while the backend reconnects."
                  : `${visibleProducts.length} pieces found`}
            </p>
          </div>

          <div className="rounded-[1.5rem] border border-black/5 bg-white p-5 shadow-sm">
            <div className="flex items-center gap-2">
              <FiSliders className="text-gold-700" />
              <h2 className="text-sm font-semibold uppercase tracking-[0.26em] text-charcoal">
                Browse By Category
              </h2>
            </div>

            <div className="mt-5 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
              {categories.map((category) => (
                <button
                  type="button"
                  key={category.id}
                  onClick={() => setActiveCategory(category.name)}
                  className="group flex items-center gap-3 rounded-[1.1rem] border border-black/5 bg-ivory p-3 text-left transition hover:-translate-y-0.5 hover:border-gold-200 hover:bg-white"
                >
                  <CatalogImage
                    src={category.image}
                    alt={category.name}
                    category={category.name}
                    className="h-14 w-14 rounded-[0.9rem] object-cover"
                  />
                  <span className="font-medium text-charcoal">{category.name}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="overflow-hidden rounded-[1.5rem] border border-black/5 bg-charcoal shadow-luxe">
            <div className="relative min-h-[240px]">
              <img
                src={realImages.hero}
                alt="Luxury jewelry shop banner"
                className="absolute inset-0 h-full w-full object-cover opacity-80"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-charcoal via-charcoal/75 to-charcoal/20" />
              <div className="relative z-10 flex h-full min-h-[240px] flex-col justify-end p-5 sm:p-6 lg:p-8">
                <p className="text-xs font-semibold uppercase tracking-[0.3em] text-gold-300">
                  New arrivals
                </p>
                <h2 className="mt-3 max-w-2xl font-display text-4xl font-semibold tracking-tight text-white sm:text-5xl">
                  A structured boutique view for effortless browsing
                </h2>
                <p className="mt-4 max-w-xl text-sm leading-7 text-white/75 sm:text-base">
                  Use the filters, scan the categories, and shop the edit with a
                  calmer, more editorial layout.
                </p>
              </div>
            </div>
          </div>

          <div className="space-y-8 pb-8 sm:pb-10 lg:pb-12">
            <div className="flex items-end justify-between gap-4">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.3em] text-gold-700">
                  Product gallery
                </p>
                <h2 className="mt-2 font-display text-2xl font-semibold text-charcoal sm:text-3xl">
                  Uniform cards across the entire shop
                </h2>
              </div>
              <p className="hidden text-sm text-stone-500 md:block">
                Clean, repeatable layout for easy comparison.
              </p>
            </div>

            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
              {visibleProducts.map((product) => (
                <article
                  key={product.id}
                  className="group flex h-full flex-col overflow-hidden rounded-[1.5rem] border border-black/5 bg-white transition hover:-translate-y-1 hover:shadow-luxe"
                >
                  <div className="relative overflow-hidden">
                    <button
                      type="button"
                      onClick={() => onNavigateProduct?.(product.slug || product.id)}
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
                      product={product}
                      onAuthRequired={onNavigateLogin}
                      className="absolute right-4 top-4"
                    />
                    <span className="absolute left-4 top-4 rounded-full bg-charcoal/85 px-3 py-1 text-xs font-semibold uppercase tracking-[0.22em] text-white">
                      {product.badge || "Featured"}
                    </span>
                  </div>

                  <div className="flex flex-1 flex-col space-y-4 p-5">
                    <div className="flex items-start justify-between gap-4">
                      <div className="min-w-0">
                        <h3 className="truncate font-display text-xl text-charcoal sm:text-[1.55rem]">
                          {product.name}
                        </h3>
                        <div className="mt-2 flex items-center gap-1 text-gold-500">
                          {Array.from({ length: Math.round(product.rating) }).map((_, starIndex) => (
                            <FaStar key={starIndex} size={13} />
                          ))}
                          <span className="ml-2 text-xs text-stone-500">
                            {product.rating}.0
                          </span>
                        </div>
                      </div>
                      <p className="shrink-0 text-lg font-semibold text-charcoal sm:text-xl">
                        {product.price}
                      </p>
                    </div>

                    <CartButton
                      product={product}
                      onAuthRequired={onNavigateLogin}
                      className="mt-auto w-full"
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

            {!visibleProducts.length && (
              <div className="rounded-[1.25rem] border border-dashed border-gold-200 bg-white p-8 text-center">
                <h3 className="font-display text-2xl text-charcoal">
                  No pieces match your search.
                </h3>
                <p className="mt-2 text-sm text-stone-500">
                  Try a different category or search term.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
