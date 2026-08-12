import { FaQuoteLeft } from "react-icons/fa";
import { testimonials } from "../data";
import SectionHeading from "./SectionHeading";

export default function Testimonials() {
  return (
    <section className="bg-white/65 py-20 sm:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow="Testimonials"
          title="Loved by Customers Who Value Elegance"
          description="A premium brand is felt in the small moments: the unboxing, the polish, and the way it makes people feel when they wear it."
        />

        <div className="mt-12 grid gap-6 lg:grid-cols-3">
          {testimonials.map((testimonial) => (
            <article
              key={testimonial.name}
              className="rounded-[1.6rem] border border-black/5 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-luxe"
            >
              <FaQuoteLeft className="text-gold-300" size={24} />
              <p className="mt-5 text-sm leading-7 text-stone-600">
                {testimonial.review}
              </p>
              <div className="mt-6 flex items-center gap-4">
                <img
                  src={testimonial.image}
                  alt={testimonial.name}
                  className="h-14 w-14 rounded-full object-cover ring-2 ring-gold-100"
                />
                <div>
                  <h3 className="font-semibold text-charcoal">
                    {testimonial.name}
                  </h3>
                  <p className="text-sm text-stone-500">Verified buyer</p>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
