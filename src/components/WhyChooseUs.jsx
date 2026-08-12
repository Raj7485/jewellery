import { FaCertificate, FaGem, FaShippingFast, FaShieldAlt } from "react-icons/fa";
import { features } from "../data";
import SectionHeading from "./SectionHeading";

const icons = [FaCertificate, FaGem, FaShieldAlt, FaShippingFast];

export default function WhyChooseUs() {
  return (
    <section id="about" className="py-20 sm:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow="Why choose us"
          title="The Details That Make It Feel Exceptional"
          description="We pair premium materials with a refined shopping experience so every part of the journey feels considered."
        />

        <div className="mt-12 grid gap-5 md:grid-cols-2 xl:grid-cols-4">
          {features.map((feature, index) => {
            const Icon = icons[index];

            return (
              <article
                key={feature.title}
                className="rounded-[1.4rem] border border-black/5 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-luxe"
              >
                <div className="grid h-14 w-14 place-items-center rounded-2xl bg-gold-50 text-gold-700">
                  <Icon size={24} />
                </div>
                <h3 className="mt-5 font-display text-2xl text-charcoal">
                  {feature.title}
                </h3>
                <p className="mt-3 text-sm leading-7 text-stone-600">
                  {feature.text}
                </p>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
