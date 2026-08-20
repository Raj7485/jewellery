import { useEffect, useMemo, useState } from "react";
import {
  FiArrowLeft,
  FiAward,
  FiCheckCircle,
  FiPackage,
  FiShield,
  FiTruck,
} from "react-icons/fi";
import { FaStar } from "react-icons/fa";
import { getProduct, getProducts } from "../api/catalog";
import CartButton from "../components/CartButton";
import CatalogImage from "../components/CatalogImage";
import FavoriteButton from "../components/FavoriteButton";
import { categories as fallbackCategories, galleryImages, products as fallbackProducts } from "../data";
import { formatProductPrice, toInrAmount } from "../utils/currency";

function normalizeProduct(product) {
  return {
    ...product,
    id: product._id || product.id || product.slug || product.name,
    slug: product.slug || product.id || product._id,
    priceLabel: formatProductPrice(product),
    priceAmount: toInrAmount(product.price, product.currency || "INR"),
    rating: Number(product.rating) || 5,
  };
}

function productSlug(product) {
  return product.slug || product.id || product._id || product.name;
}

function productGallery(product) {
  const categoryImage = fallbackCategories.find(
    (category) => category.name === product.category
  )?.image;

  return [product.image, categoryImage, ...galleryImages]
    .filter(Boolean)
    .filter((image, index, images) => images.indexOf(image) === index)
    .slice(0, 5);
}

export default function ProductDetailsPage({
  slug,
  onNavigateHome,
  onNavigateShop,
  onNavigateLogin,
  onNavigateProduct,
}) {
  const fallbackProduct = useMemo(
    () =>
      fallbackProducts.find((product) => product.slug === slug) ||
      fallbackProducts[0],
    [slug]
  );
  const [product, setProduct] = useState(() => normalizeProduct(fallbackProduct));
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [activeImage, setActiveImage] = useState(product.image);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let isActive = true;

    async function loadProductDetails() {
      try {
        setLoading(true);
        setError("");

        const productResponse = await getProduct(slug);
        const nextProduct = normalizeProduct(productResponse.data);
        const relatedResponse = await getProducts({ category: nextProduct.category });

        if (!isActive) {
          return;
        }

        setProduct(nextProduct);
        setActiveImage(nextProduct.image);
        setRelatedProducts(
          (relatedResponse.data || [])
            .map(normalizeProduct)
            .filter((item) => productSlug(item) !== productSlug(nextProduct))
            .slice(0, 4)
        );
      } catch (apiError) {
        if (!isActive) {
          return;
        }

        const nextProduct = normalizeProduct(fallbackProduct);
        setProduct(nextProduct);
        setActiveImage(nextProduct.image);
        setRelatedProducts(
          fallbackProducts
            .map(normalizeProduct)
            .filter(
              (item) =>
                item.category === nextProduct.category &&
                productSlug(item) !== productSlug(nextProduct)
            )
            .slice(0, 4)
        );
        setError(apiError.message);
      } finally {
        if (isActive) {
          setLoading(false);
        }
      }
    }

    loadProductDetails();

    return () => {
      isActive = false;
    };
  }, [fallbackProduct, slug]);

  const images = useMemo(() => productGallery(product), [product]);
  const details = [
    { label: "Category", value: product.category },
    { label: "Stock", value: `${Number(product.stock) || 1} pieces` },
    { label: "Rating", value: `${product.rating}.0 / 5` },
    { label: "SKU", value: String(product.slug || product.id).slice(0, 18) },
  ];

  const highlights = [
    "Hand-finished shine with a luxury boutique profile.",
    "Packed in premium gift-ready presentation.",
    "Easy to pair with everyday and occasion looks.",
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
          <button
            type="button"
            onClick={onNavigateShop}
            className="font-medium text-gold-800 transition hover:text-gold-700"
          >
            Shop
          </button>
          <span>/</span>
          <span className="text-stone-700">Details</span>
        </div>

        <button
          type="button"
          onClick={onNavigateShop}
          className="inline-flex items-center justify-center gap-2 rounded-full border border-black/10 bg-white px-5 py-3 text-sm font-semibold text-charcoal transition hover:-translate-y-0.5 hover:border-gold-300 hover:text-gold-700"
        >
          <FiArrowLeft />
          Back to Shop
        </button>
      </div>

      <div className="grid gap-6 lg:grid-cols-[minmax(0,1.05fr)_0.95fr]">
        <div className="space-y-4">
          <div className="overflow-hidden rounded-[1.5rem] border border-black/5 bg-white shadow-luxe">
            <CatalogImage
              src={activeImage}
              alt={product.name}
              category={product.category}
              className="aspect-square w-full object-cover sm:aspect-[5/4] lg:aspect-square"
            />
          </div>

          <div className="grid grid-cols-5 gap-2 sm:gap-3">
            {images.map((image) => (
              <button
                type="button"
                key={image}
                onClick={() => setActiveImage(image)}
                className={`overflow-hidden rounded-[1rem] border bg-white transition hover:-translate-y-0.5 ${
                  activeImage === image ? "border-gold-400 shadow-glow" : "border-black/5"
                }`}
                aria-label={`View ${product.name} image`}
              >
                <CatalogImage
                  src={image}
                  alt={product.name}
                  category={product.category}
                  className="aspect-square w-full object-cover"
                />
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-5">
          <div className="rounded-[1.5rem] border border-black/5 bg-white p-5 shadow-sm sm:p-6 lg:p-8">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <span className="rounded-full bg-gold-50 px-4 py-2 text-xs font-semibold uppercase tracking-[0.24em] text-gold-800">
                {product.badge || "Featured"}
              </span>
              <FavoriteButton product={product} onAuthRequired={onNavigateLogin} />
            </div>

            <p className="mt-6 text-xs font-semibold uppercase tracking-[0.3em] text-gold-700">
              {product.category}
            </p>
            <h1 className="mt-3 font-display text-4xl font-semibold leading-tight text-charcoal sm:text-5xl">
              {product.name}
            </h1>
            <div className="mt-4 flex flex-wrap items-center gap-4">
              <p className="font-display text-4xl font-semibold text-charcoal">
                {product.priceLabel}
              </p>
              <div className="flex items-center gap-1 text-gold-500">
                {Array.from({ length: Math.round(product.rating) }).map((_, index) => (
                  <FaStar key={index} size={14} />
                ))}
                <span className="ml-2 text-sm font-medium text-stone-500">
                  {product.rating}.0 rating
                </span>
              </div>
            </div>

            <p className="mt-5 text-sm leading-7 text-stone-600 sm:text-base">
              {product.description} This piece is selected for a polished finish,
              balanced proportions, and an elegant wear-anywhere look. Style it
              solo for a clean statement or layer it with matching pieces from
              the same collection.
            </p>

            <div className="mt-6 grid gap-3 sm:grid-cols-2">
              {details.map((item) => (
                <div
                  key={item.label}
                  className="rounded-[1rem] border border-black/5 bg-ivory p-4"
                >
                  <p className="text-xs uppercase tracking-[0.2em] text-stone-500">
                    {item.label}
                  </p>
                  <p className="mt-1 font-semibold text-charcoal">{item.value}</p>
                </div>
              ))}
            </div>

            <div className="mt-6 flex flex-col gap-3 sm:flex-row">
              <CartButton
                product={product}
                onAuthRequired={onNavigateLogin}
                className="w-full sm:flex-1"
              />
              <button
                type="button"
                onClick={onNavigateShop}
                className="inline-flex w-full items-center justify-center rounded-full border border-black/10 bg-white px-5 py-3 text-sm font-semibold text-charcoal transition hover:-translate-y-0.5 hover:border-gold-300 hover:text-gold-700 sm:flex-1"
              >
                Explore More
              </button>
            </div>

            <p className="mt-4 min-h-5 text-sm text-stone-500">
              {loading
                ? "Loading latest product details..."
                : error
                  ? "Showing saved product details while the catalog reconnects."
                  : "Live catalog details loaded."}
            </p>
          </div>

          <div className="grid gap-3 sm:grid-cols-3">
            {[
              { icon: FiTruck, title: "Insured Delivery", text: "Fast, trackable shipping." },
              { icon: FiShield, title: "Secure Payment", text: "Protected checkout flow." },
              { icon: FiPackage, title: "Gift Packed", text: "Premium box included." },
            ].map((item) => {
              const Icon = item.icon;
              return (
                <div
                  key={item.title}
                  className="rounded-[1.25rem] border border-black/5 bg-charcoal p-4 text-white"
                >
                  <Icon className="text-xl text-gold-300" />
                  <h3 className="mt-3 text-sm font-semibold">{item.title}</h3>
                  <p className="mt-1 text-xs leading-5 text-white/70">{item.text}</p>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <section className="mt-8 rounded-[1.5rem] border border-black/5 bg-white p-5 shadow-sm sm:p-6 lg:p-8">
        <div className="grid gap-6 lg:grid-cols-[0.8fr_1.2fr]">
          <div>
            <div className="flex items-center gap-2">
              <FiAward className="text-gold-700" />
              <p className="text-xs font-semibold uppercase tracking-[0.28em] text-gold-700">
                Full description
              </p>
            </div>
            <h2 className="mt-3 font-display text-3xl font-semibold text-charcoal">
              Crafted for lasting shine
            </h2>
          </div>
          <div className="space-y-4 text-sm leading-7 text-stone-600 sm:text-base">
            <p>
              {product.name} brings together refined styling, comfortable wear,
              and a luxury finish that works beautifully for gifting, weddings,
              celebrations, and daily elegance.
            </p>
            <div className="grid gap-3 sm:grid-cols-3">
              {highlights.map((item) => (
                <div key={item} className="flex gap-3 rounded-[1rem] bg-ivory p-4">
                  <FiCheckCircle className="mt-1 shrink-0 text-gold-700" />
                  <p className="text-sm leading-6 text-stone-600">{item}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="mt-10">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-gold-700">
              Relevant products
            </p>
            <h2 className="mt-2 font-display text-3xl font-semibold text-charcoal">
              More from {product.category}
            </h2>
          </div>
          <button
            type="button"
            onClick={onNavigateShop}
            className="rounded-full border border-black/10 bg-white px-5 py-3 text-sm font-semibold text-charcoal transition hover:-translate-y-0.5 hover:border-gold-300 hover:text-gold-700"
          >
            View all
          </button>
        </div>

        <div className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {relatedProducts.map((item) => (
            <article
              key={item.id}
              className="group flex h-full flex-col overflow-hidden rounded-[1.5rem] border border-black/5 bg-white transition hover:-translate-y-1 hover:shadow-luxe"
            >
              <button
                type="button"
                onClick={() => onNavigateProduct(item.slug)}
                className="relative block w-full overflow-hidden text-left"
                aria-label={`View ${item.name} details`}
              >
                <CatalogImage
                  src={item.image}
                  alt={item.name}
                  category={item.category}
                  className="aspect-[4/5] w-full object-cover transition duration-500 group-hover:scale-105"
                />
                <span className="absolute left-4 top-4 rounded-full bg-charcoal/85 px-3 py-1 text-xs font-semibold uppercase tracking-[0.22em] text-white">
                  {item.badge || "Featured"}
                </span>
              </button>

              <div className="flex flex-1 flex-col gap-4 p-5">
                <div className="flex items-start justify-between gap-4">
                  <div className="min-w-0">
                    <h3 className="truncate font-display text-xl text-charcoal">
                      {item.name}
                    </h3>
                    <p className="mt-1 text-sm text-stone-500">{item.category}</p>
                  </div>
                  <p className="shrink-0 text-lg font-semibold text-charcoal">
                    {item.priceLabel}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => onNavigateProduct(item.slug)}
                  className="mt-auto rounded-full border border-black/10 bg-white px-5 py-3 text-sm font-semibold text-charcoal transition hover:-translate-y-0.5 hover:border-gold-300 hover:text-gold-700"
                >
                  View Details
                </button>
              </div>
            </article>
          ))}
        </div>
      </section>
    </section>
  );
}
