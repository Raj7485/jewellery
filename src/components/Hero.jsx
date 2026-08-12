import { realImages } from "../data";

export default function Hero() {
  return (
    <section id="home" className="relative overflow-hidden">
      <div className="hero-glow absolute inset-0" />
      <div className="absolute inset-x-0 top-0 h-px gold-line" />

      <div className="mx-auto grid min-h-[calc(100vh-88px)] max-w-7xl items-center gap-12 px-4 py-16 sm:px-6 lg:grid-cols-[0.95fr_1.05fr] lg:px-8">
        <div className="relative z-10 max-w-2xl animate-fadeUp">
          <p className="mb-5 inline-flex items-center rounded-full border border-gold-200 bg-white/80 px-4 py-2 text-xs font-semibold uppercase tracking-[0.28em] text-gold-800 shadow-sm">
            Crafted in luxury
          </p>
          <h1 className="font-display text-5xl leading-tight font-semibold tracking-tight text-charcoal sm:text-6xl lg:text-7xl">
            Timeless Elegance, Crafted for You
          </h1>
          <p className="mt-6 max-w-xl text-base leading-8 text-stone-600 sm:text-lg">
            Discover refined rings, luminous necklaces, statement earrings, and
            handcrafted bracelets designed to elevate every occasion with quiet
            sophistication.
          </p>
          <div className="mt-8 flex flex-col gap-4 sm:flex-row">
            <a
              href="#shop"
              className="inline-flex items-center justify-center rounded-full bg-charcoal px-7 py-4 text-sm font-semibold text-white shadow-luxe transition hover:-translate-y-0.5 hover:bg-black"
            >
              Shop Now
            </a>
            <a
              href="#collections"
              className="inline-flex items-center justify-center rounded-full border border-black/10 bg-white px-7 py-4 text-sm font-semibold text-charcoal transition hover:-translate-y-0.5 hover:border-gold-300 hover:text-gold-700"
            >
              Explore Collection
            </a>
          </div>
        </div>

        <div className="relative z-10">
          <div className="relative aspect-[4/5] overflow-hidden rounded-[2rem] border border-white/60 bg-white shadow-luxe sm:aspect-[5/4] lg:aspect-square">
            <img
              src={realImages.hero}
              alt="Luxury jewelry hero banner"
              className="h-full w-full object-cover object-center"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-charcoal/55 via-charcoal/10 to-transparent" />
            <div className="absolute bottom-0 left-0 right-0 p-6 sm:p-8">
              <div className="max-w-sm rounded-3xl border border-white/20 bg-black/25 p-5 text-white backdrop-blur-md">
                <p className="text-xs uppercase tracking-[0.3em] text-gold-200">
                  Signature collection
                </p>
                <p className="mt-2 text-xl font-semibold">
                  Modern luxury for daily rituals and special moments.
                </p>
              </div>
            </div>
          </div>
          <div className="absolute -bottom-5 -left-5 hidden rounded-3xl border border-gold-200 bg-white p-4 shadow-glow lg:block animate-float">
            <p className="text-xs uppercase tracking-[0.28em] text-stone-500">
              Since 1998
            </p>
            <p className="font-display text-2xl text-charcoal">Exclusive</p>
          </div>
        </div>
      </div>
    </section>
  );
}
