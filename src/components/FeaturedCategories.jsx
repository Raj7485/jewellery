import { FaGem } from "react-icons/fa";
import CatalogImage from "./CatalogImage";
import { useCatalog } from "../hooks/useCatalog";
import SectionHeading from "./SectionHeading";

export default function FeaturedCategories() {
  const { categories, loading, error } = useCatalog();

  return (
    <section id="collections" className="py-20 sm:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow="Featured categories"
          title="Curated Pieces for Every Style"
          description="Explore a handpicked mix of modern and classic jewelry categories, crafted to feel polished, refined, and easy to shop."
        />

        <div className="mt-5 min-h-6 text-center text-sm text-stone-500">
          {loading
            ? "Loading categories..."
            : error
              ? "Showing saved categories while the catalog reconnects."
              : null}
        </div>

        <div className="mt-12 grid gap-6 sm:grid-cols-2 xl:grid-cols-4">
          {categories.map((category) => {
            return (
              <article
                key={category.id}
                className="group overflow-hidden rounded-[1.6rem] border border-black/5 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-luxe"
              >
                <div className="relative aspect-[4/5] overflow-hidden">
                  <CatalogImage
                    src={category.image}
                    alt={category.name}
                    category={category.name}
                    className="h-full w-full object-cover transition duration-500 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-charcoal/60 via-charcoal/10 to-transparent" />
                  <div className="absolute left-5 top-5 grid h-11 w-11 place-items-center rounded-full bg-white/90 text-gold-700 shadow-sm">
                    <FaGem size={18} />
                  </div>
                  <div className="absolute bottom-0 left-0 right-0 p-5 text-white">
                    <h3 className="font-display text-2xl">{category.name}</h3>
                    <p className="mt-1 text-sm text-white/85">
                      Discover signature styles.
                    </p>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
