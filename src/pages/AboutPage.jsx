import {
  FaCertificate,
  FaGem,
  FaHeart,
  FaShippingFast,
  FaShieldAlt,
} from "react-icons/fa";
import { realImages } from "../data";

const principles = [
  {
    title: "Crafted with care",
    text: "Every piece is chosen for finish, balance, and the quiet elegance it brings to everyday wear.",
    Icon: FaGem,
  },
  {
    title: "Certified quality",
    text: "We focus on verified materials and a precise final check before anything reaches you.",
    Icon: FaCertificate,
  },
  {
    title: "Secure shopping",
    text: "A calm buying experience supported by secure checkout and careful order handling.",
    Icon: FaShieldAlt,
  },
  {
    title: "Gift-ready delivery",
    text: "Premium packaging and fast fulfillment so special moments arrive feeling complete.",
    Icon: FaShippingFast,
  },
];

const milestones = [
  { year: "1998", title: "Founded", text: "Started as a small luxury atelier with a focus on timeless pieces." },
  { year: "2008", title: "Boutique growth", text: "Expanded into curated collections for modern, everyday elegance." },
  { year: "2018", title: "Digital boutique", text: "Built a smoother online experience with premium presentation." },
  { year: "Today", title: "Signature edit", text: "A refined jewelry destination for gifts, milestones, and daily wear." },
];

export default function AboutPage({ onNavigateHome, onNavigateShop }) {
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
          <span className="text-stone-700">About</span>
        </div>

        <button
          type="button"
          onClick={onNavigateShop}
          className="inline-flex items-center justify-center rounded-full border border-black/10 bg-white px-5 py-3 text-sm font-semibold text-charcoal transition hover:-translate-y-0.5 hover:border-gold-300 hover:text-gold-700"
        >
          Visit Shop
        </button>
      </div>

      <div className="grid gap-6 lg:grid-cols-[320px_minmax(0,1fr)]">
        <aside className="space-y-5 lg:sticky lg:top-24 lg:h-fit">
          <div className="rounded-[1.5rem] border border-black/5 bg-white p-5 shadow-sm">
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-gold-700">
              About us
            </p>
            <h1 className="mt-3 font-display text-4xl font-semibold tracking-tight text-charcoal">
              Jewelry with warmth, detail, and quiet luxury.
            </h1>
            <p className="mt-3 text-sm leading-7 text-stone-600">
              We curate pieces that feel refined without feeling distant, made to
              move naturally between gifting, celebration, and everyday wear.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <article className="rounded-[1.25rem] border border-black/5 bg-ivory p-4">
              <p className="text-2xl font-semibold text-charcoal">25+</p>
              <p className="mt-1 text-xs uppercase tracking-[0.2em] text-stone-500">
                Years of craft
              </p>
            </article>
            <article className="rounded-[1.25rem] border border-black/5 bg-ivory p-4">
              <p className="text-2xl font-semibold text-charcoal">10k+</p>
              <p className="mt-1 text-xs uppercase tracking-[0.2em] text-stone-500">
                Happy customers
              </p>
            </article>
          </div>

          <div className="rounded-[1.5rem] border border-black/5 bg-charcoal p-5 text-white shadow-luxe">
            <div className="flex items-center gap-2 text-gold-300">
              <FaHeart />
              <h2 className="text-sm font-semibold uppercase tracking-[0.26em]">
                Our promise
              </h2>
            </div>
            <p className="mt-4 text-sm leading-7 text-white/75">
              Luxury should feel calm, thoughtful, and easy to trust. That is
              the standard behind every collection we share.
            </p>
          </div>
        </aside>

        <div className="space-y-8">
          <div className="overflow-hidden rounded-[1.5rem] border border-black/5 bg-charcoal shadow-luxe">
            <div className="relative min-h-[260px]">
              <img
                src={realImages.hero}
                alt="Luxury jewelry about banner"
                className="absolute inset-0 h-full w-full object-cover opacity-80"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-charcoal via-charcoal/70 to-charcoal/25" />
              <div className="relative z-10 flex h-full min-h-[260px] flex-col justify-end p-5 sm:p-6 lg:p-8">
                <p className="text-xs font-semibold uppercase tracking-[0.3em] text-gold-300">
                  Our story
                </p>
                <h2 className="mt-3 max-w-2xl font-display text-4xl font-semibold tracking-tight text-white sm:text-5xl">
                  A boutique built around timeless pieces and modern ease
                </h2>
                <p className="mt-4 max-w-xl text-sm leading-7 text-white/75 sm:text-base">
                  From signature rings to evening-ready necklaces, our collections
                  are designed to feel personal, elegant, and lasting.
                </p>
              </div>
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            {principles.map(({ title, text, Icon }) => (
              <article
                key={title}
                className="rounded-[1.35rem] border border-black/5 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-luxe"
              >
                <div className="grid h-11 w-11 place-items-center rounded-full bg-gold-50 text-gold-700">
                  <Icon />
                </div>
                <h3 className="mt-4 font-display text-2xl text-charcoal">{title}</h3>
                <p className="mt-3 text-sm leading-7 text-stone-600">{text}</p>
              </article>
            ))}
          </div>

          <div className="rounded-[1.5rem] border border-black/5 bg-white p-5 shadow-sm">
            <div className="flex items-center gap-2">
              <FaGem className="text-gold-700" />
              <h2 className="text-sm font-semibold uppercase tracking-[0.26em] text-charcoal">
                Our journey
              </h2>
            </div>

            <div className="mt-5 grid gap-4 md:grid-cols-2">
              {milestones.map((item) => (
                <article
                  key={item.year}
                  className="rounded-[1.2rem] border border-black/5 bg-ivory p-4"
                >
                  <p className="text-xs font-semibold uppercase tracking-[0.28em] text-gold-700">
                    {item.year}
                  </p>
                  <h3 className="mt-2 font-display text-2xl text-charcoal">
                    {item.title}
                  </h3>
                  <p className="mt-3 text-sm leading-7 text-stone-600">
                    {item.text}
                  </p>
                </article>
              ))}
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-[1.1fr_0.9fr]">
            <article className="overflow-hidden rounded-[1.5rem] border border-black/5 bg-white shadow-sm">
              <img
                src={realImages.necklace}
                alt="About jewelry detail"
                className="h-full min-h-[260px] w-full object-cover"
              />
            </article>
            <article className="rounded-[1.5rem] border border-black/5 bg-charcoal p-6 text-white shadow-luxe">
              <p className="text-xs font-semibold uppercase tracking-[0.3em] text-gold-300">
                What we value
              </p>
              <h2 className="mt-3 font-display text-3xl font-semibold text-white">
                Elegant, dependable, and made to be remembered
              </h2>
              <p className="mt-4 text-sm leading-7 text-white/75">
                We keep the experience simple and premium: considered materials,
                secure ordering, graceful packaging, and a presentation that feels
                worthy of the pieces themselves.
              </p>
              <button
                type="button"
                onClick={onNavigateShop}
                className="mt-6 inline-flex items-center justify-center rounded-full bg-gold-400 px-6 py-3 text-sm font-semibold text-charcoal transition hover:-translate-y-0.5 hover:bg-gold-300"
              >
                Explore Shop
              </button>
            </article>
          </div>
        </div>
      </div>
    </section>
  );
}
