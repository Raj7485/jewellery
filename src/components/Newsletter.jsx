import { useState } from "react";
import { submitNewsletter } from "../api/catalog";

export default function Newsletter() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      setIsSubmitting(true);
      setStatus("");
      const response = await submitNewsletter(email);
      setStatus(response.message || "Thanks for subscribing.");
      setEmail("");
    } catch (error) {
      setStatus(error.message || "Subscription failed. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="contact" className="py-20 sm:py-24">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        <div className="rounded-[2rem] border border-gold-100 bg-white px-6 py-10 shadow-luxe sm:px-10 sm:py-12">
          <div className="mx-auto max-w-2xl text-center">
            <p className="text-sm font-semibold uppercase tracking-[0.3em] text-gold-700">
              Newsletter
            </p>
            <h2 className="mt-3 font-display text-3xl font-semibold text-charcoal sm:text-4xl">
              Join for Exclusive Drops and Styling Notes
            </h2>
            <p className="mt-4 text-sm leading-7 text-stone-600 sm:text-base">
              Subscribe to receive early access to new collections, private
              offers, and seasonal inspiration.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="mt-8 flex flex-col gap-3 sm:flex-row">
            <label className="sr-only" htmlFor="email">
              Email address
            </label>
            <input
              id="email"
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              required
              className="h-14 flex-1 rounded-full border border-black/10 bg-ivory px-5 text-sm outline-none transition placeholder:text-stone-400 focus:border-gold-300 focus:ring-4 focus:ring-gold-100"
            />
            <button
              type="submit"
              disabled={isSubmitting}
              className="h-14 rounded-full bg-charcoal px-8 text-sm font-semibold text-white transition hover:bg-black"
            >
              {isSubmitting ? "Subscribing..." : "Subscribe"}
            </button>
          </form>
          <p className="mt-4 min-h-5 text-center text-sm text-stone-500">
            {status}
          </p>
        </div>
      </div>
    </section>
  );
}
