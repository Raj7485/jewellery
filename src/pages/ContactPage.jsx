import { FaEnvelope, FaMapMarkerAlt, FaPhoneAlt, FaRegClock } from "react-icons/fa";
import { useState } from "react";
import { submitContactMessage } from "../api/catalog";
import { realImages } from "../data";

const contactCards = [
  {
    title: "Visit us",
    text: "123 Luxury Avenue, Mumbai",
    Icon: FaMapMarkerAlt,
  },
  {
    title: "Call us",
    text: "+91 98765 43210",
    Icon: FaPhoneAlt,
  },
  {
    title: "Email us",
    text: "support@luxuryjewelry.com",
    Icon: FaEnvelope,
  },
  {
    title: "Hours",
    text: "Mon - Sat, 10:00 AM - 7:00 PM",
    Icon: FaRegClock,
  },
];

export default function ContactPage({ onNavigateHome, onNavigateShop, onNavigateAbout }) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [status, setStatus] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((current) => ({ ...current, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      setIsSubmitting(true);
      setStatus("");
      const response = await submitContactMessage(formData);
      setStatus(response.message || "Message sent successfully.");
      setFormData({ name: "", email: "", subject: "", message: "" });
    } catch (error) {
      setStatus(error.message || "Message failed. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

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
          <span className="text-stone-700">Contact</span>
        </div>

        <div className="flex flex-wrap gap-3">
          <button
            type="button"
            onClick={onNavigateAbout}
            className="inline-flex items-center justify-center rounded-full border border-black/10 bg-white px-5 py-3 text-sm font-semibold text-charcoal transition hover:-translate-y-0.5 hover:border-gold-300 hover:text-gold-700"
          >
            About
          </button>
          <button
            type="button"
            onClick={onNavigateShop}
            className="inline-flex items-center justify-center rounded-full border border-black/10 bg-white px-5 py-3 text-sm font-semibold text-charcoal transition hover:-translate-y-0.5 hover:border-gold-300 hover:text-gold-700"
          >
            Shop
          </button>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1.05fr_0.95fr]">
        <div className="space-y-6">
          <div className="overflow-hidden rounded-[1.5rem] border border-black/5 bg-charcoal shadow-luxe">
            <div className="relative min-h-[280px]">
              <img
                src={realImages.hero}
                alt="Contact luxury jewelry banner"
                className="absolute inset-0 h-full w-full object-cover opacity-80"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-charcoal via-charcoal/75 to-charcoal/25" />
              <div className="relative z-10 flex h-full min-h-[280px] flex-col justify-end p-5 sm:p-6 lg:p-8">
                <p className="text-xs font-semibold uppercase tracking-[0.3em] text-gold-300">
                  Contact
                </p>
                <h1 className="mt-3 max-w-2xl font-display text-4xl font-semibold tracking-tight text-white sm:text-5xl">
                  Let us help you find the right piece
                </h1>
                <p className="mt-4 max-w-xl text-sm leading-7 text-white/75 sm:text-base">
                  Reach out for styling advice, custom requests, gifting support,
                  or store details.
                </p>
              </div>
            </div>
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            {contactCards.map(({ title, text, Icon }) => (
              <article
                key={title}
                className="rounded-[1.25rem] border border-black/5 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-luxe"
              >
                <div className="grid h-11 w-11 place-items-center rounded-full bg-gold-50 text-gold-700">
                  <Icon />
                </div>
                <h2 className="mt-4 font-display text-2xl text-charcoal">{title}</h2>
                <p className="mt-3 text-sm leading-7 text-stone-600">{text}</p>
              </article>
            ))}
          </div>
        </div>

        <div className="space-y-6">
          <div className="rounded-[1.5rem] border border-black/5 bg-white p-5 shadow-sm">
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-gold-700">
              Send a message
            </p>
            <h2 className="mt-3 font-display text-3xl font-semibold text-charcoal">
              We usually reply within one business day.
            </h2>

            <form onSubmit={handleSubmit} className="mt-6 space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <label className="grid gap-2">
                  <span className="text-sm font-medium text-stone-700">Name</span>
                  <input
                    name="name"
                    type="text"
                    placeholder="Your name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="h-12 rounded-full border border-black/10 bg-ivory px-4 text-sm outline-none transition placeholder:text-stone-400 focus:border-gold-300 focus:ring-4 focus:ring-gold-100"
                  />
                </label>
                <label className="grid gap-2">
                  <span className="text-sm font-medium text-stone-700">Email</span>
                  <input
                    name="email"
                    type="email"
                    placeholder="you@example.com"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="h-12 rounded-full border border-black/10 bg-ivory px-4 text-sm outline-none transition placeholder:text-stone-400 focus:border-gold-300 focus:ring-4 focus:ring-gold-100"
                  />
                </label>
              </div>

              <label className="grid gap-2">
                <span className="text-sm font-medium text-stone-700">Subject</span>
                <input
                  name="subject"
                  type="text"
                  placeholder="How can we help?"
                  value={formData.subject}
                  onChange={handleChange}
                  required
                  className="h-12 rounded-full border border-black/10 bg-ivory px-4 text-sm outline-none transition placeholder:text-stone-400 focus:border-gold-300 focus:ring-4 focus:ring-gold-100"
                />
              </label>

              <label className="grid gap-2">
                <span className="text-sm font-medium text-stone-700">Message</span>
                <textarea
                  name="message"
                  rows="6"
                  placeholder="Tell us about the piece you're looking for..."
                  value={formData.message}
                  onChange={handleChange}
                  required
                  className="rounded-[1.25rem] border border-black/10 bg-ivory px-4 py-3 text-sm outline-none transition placeholder:text-stone-400 focus:border-gold-300 focus:ring-4 focus:ring-gold-100"
                />
              </label>

              <button
                type="submit"
                disabled={isSubmitting}
                className="inline-flex w-full items-center justify-center rounded-full bg-charcoal px-6 py-3 text-sm font-semibold text-white transition hover:bg-black"
              >
                {isSubmitting ? "Sending..." : "Send Message"}
              </button>
              <p className="min-h-5 text-center text-sm text-stone-500">
                {status}
              </p>
            </form>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <article className="overflow-hidden rounded-[1.35rem] border border-black/5 bg-white shadow-sm">
              <img
                src={realImages.necklace}
                alt="Contact jewelry detail"
                className="h-full min-h-[220px] w-full object-cover"
              />
            </article>
            <article className="rounded-[1.35rem] border border-black/5 bg-charcoal p-5 text-white shadow-luxe">
              <p className="text-xs font-semibold uppercase tracking-[0.3em] text-gold-300">
                Prefer a call?
              </p>
              <h2 className="mt-3 font-display text-3xl font-semibold">
                We can walk you through sizes, styles, and gifting options.
              </h2>
              <p className="mt-4 text-sm leading-7 text-white/75">
                If you&apos;re choosing an engagement ring, a gift set, or a custom
                piece, we&apos;ll help you narrow it down with care.
              </p>
            </article>
          </div>
        </div>
      </div>
    </section>
  );
}
