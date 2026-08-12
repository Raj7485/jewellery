import { FaArrowRight, FaGem } from "react-icons/fa";
import { realImages } from "../data";
import { useCatalog } from "../hooks/useCatalog";

export default function CollectionsPage({ onNavigateHome, onNavigateShop }) {
  const { categories: collections, loading, error } = useCatalog();

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
          <span className="text-stone-700">Collections</span>
        </div>

        <button
          type="button"
          onClick={onNavigateShop}
          className="inline-flex items-center justify-center rounded-full border border-black/10 bg-white px-5 py-3 text-sm font-semibold text-charcoal transition hover:-translate-y-0.5 hover:border-gold-300 hover:text-gold-700"
        >
          Shop Now
        </button>
      </div>

      <div className="space-y-8">
        <section className="overflow-hidden rounded-[1.5rem] border border-black/5 bg-charcoal shadow-luxe">
          <div className="relative min-h-[320px]">
            <img
              src={realImages.hero}
              alt="Collections hero"
              className="absolute inset-0 h-full w-full object-cover opacity-75"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-charcoal via-charcoal/70 to-charcoal/20" />
            <div className="relative z-10 flex h-full min-h-[320px] flex-col justify-end p-6 sm:p-8 lg:p-10">
              <p className="text-xs font-semibold uppercase tracking-[0.35em] text-gold-300">
                Collections
              </p>
              <h1 className="mt-4 max-w-2xl font-display text-5xl font-semibold tracking-tight text-white sm:text-6xl">
                Simple category cards, made easy to explore.
              </h1>
              <p className="mt-5 max-w-xl text-sm leading-7 text-white/75 sm:text-base">
                Tap any collection image to jump into the shop and browse the
                matching pieces.
              </p>
            </div>
          </div>
        </section>

        <section className="rounded-[1.5rem] border border-black/5 bg-white p-5 shadow-sm">
          <div className="flex items-center gap-2">
            <FaGem className="text-gold-700" />
            <h2 className="text-sm font-semibold uppercase tracking-[0.28em] text-charcoal">
              Collection cards
            </h2>
          </div>
          <p className="mt-3 max-w-2xl text-sm leading-7 text-stone-600">
            Clean category cards are loaded from MongoDB, so adding a new
            collection in the database can flow into the storefront.
          </p>
          <p className="mt-3 min-h-5 text-sm text-stone-500">
            {loading
              ? "Loading collections..."
              : error
                ? "Showing saved collections while the catalog reconnects."
                : null}
          </p>
        </section>

        <section className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
          {collections.map((collection) => (
            <article
              key={collection.id}
              className="group overflow-hidden rounded-[1.35rem] border border-black/5 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-luxe"
            >
              <button
                type="button"
                onClick={onNavigateShop}
                className="block w-full text-left"
                aria-label={`Open shop for ${collection.name}`}
              >
                <div className="relative overflow-hidden">
                  <img
                    src={collection.image}
                    alt={collection.name}
                    className="aspect-[4/5] w-full object-cover transition duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-charcoal/55 via-transparent to-transparent" />
                  <div className="absolute left-4 top-4 rounded-full bg-white/90 px-3 py-1 text-xs font-semibold uppercase tracking-[0.22em] text-charcoal">
                    Click image
                  </div>
                </div>
              </button>

              <div className="flex flex-col gap-4 p-5">
                <div>
                  <h3 className="font-display text-2xl text-charcoal">
                    {collection.name}
                  </h3>
                  <p className="mt-2 text-sm leading-7 text-stone-600">
                    {collection.description}
                  </p>
                </div>

                <button
                  type="button"
                  onClick={onNavigateShop}
                  className="inline-flex items-center justify-center gap-2 rounded-full bg-charcoal px-5 py-3 text-sm font-semibold text-white transition hover:bg-black"
                >
                  Explore {collection.name}
                  <FaArrowRight />
                </button>
              </div>
            </article>
          ))}
        </section>

        <section className="grid gap-4 md:grid-cols-[1fr_0.85fr]">
          <article className="rounded-[1.5rem] border border-black/5 bg-charcoal p-6 text-white shadow-luxe">
            <p className="text-xs font-semibold uppercase tracking-[0.32em] text-gold-300">
              Quick note
            </p>
            <h2 className="mt-3 font-display text-3xl font-semibold text-white">
              Tap a card, browse the matching edit.
            </h2>
            <p className="mt-4 text-sm leading-7 text-white/75">
              The page keeps a simple layout so the categories are easy to scan
              and the images do the heavy lifting.
            </p>
          </article>

          <article className="overflow-hidden rounded-[1.5rem] border border-black/5 bg-white shadow-sm">
            <img
              src={realImages.necklace}
              alt="Collection closing detail"
              className="h-full min-h-[240px] w-full object-cover"
            />
          </article>
        </section>
      </div>
    </section>
  );
}
