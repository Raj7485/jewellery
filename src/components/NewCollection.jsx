import { realImages } from "../data";

export default function NewCollection() {
  return (
    <section className="py-20 sm:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="relative overflow-hidden rounded-[2rem] border border-black/5 bg-charcoal text-white shadow-luxe">
          <img
            src={realImages.hero}
            alt="New collection promotion"
            className="absolute inset-0 h-full w-full object-cover opacity-35"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-charcoal via-charcoal/80 to-charcoal/30" />
          <div className="relative z-10 grid gap-10 px-6 py-16 sm:px-10 lg:grid-cols-[1.2fr_0.8fr] lg:px-14 lg:py-20">
            <div className="max-w-2xl">
              <p className="text-xs font-semibold uppercase tracking-[0.3em] text-gold-300">
                New collection
              </p>
              <h2 className="mt-4 font-display text-4xl font-semibold tracking-tight sm:text-5xl">
                A New Chapter of Luxury, Designed to Shine
              </h2>
              <p className="mt-5 max-w-xl text-sm leading-7 text-white/80 sm:text-base">
                Discover statement pieces and everyday treasures with luminous
                finishes, sculpted silhouettes, and a modern editorial feel.
              </p>
              <a
                href="#shop"
                className="mt-8 inline-flex items-center justify-center rounded-full bg-gold-400 px-7 py-4 text-sm font-semibold text-charcoal transition hover:-translate-y-0.5 hover:bg-gold-300"
              >
                Shop the collection
              </a>
            </div>

            <div className="flex items-end justify-start lg:justify-end">
              <div className="grid gap-4 rounded-[1.5rem] border border-white/10 bg-white/10 p-5 backdrop-blur-sm">
                <p className="text-xs uppercase tracking-[0.28em] text-gold-200">
                  Limited release
                </p>
                <p className="text-2xl font-semibold">Up to 20% off select pieces</p>
                <p className="text-sm text-white/75">
                  A seasonal edit curated for gifting and celebrations.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
