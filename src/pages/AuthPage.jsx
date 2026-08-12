import { useEffect, useState } from "react";
import { FaGem } from "react-icons/fa";
import { FiArrowRight, FiLock, FiMail, FiUser } from "react-icons/fi";
import { realImages } from "../data";
import { useAuth } from "../context/AuthContext";

export default function AuthPage({ mode = "login", onNavigateHome, onSwitchMode, onSuccess }) {
  const isRegister = mode === "register";
  const { isAuthenticated, login, register, user } = useAuth();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [status, setStatus] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (isAuthenticated) {
      setStatus(`Welcome, ${user?.name || "shopper"}.`);
    }
  }, [isAuthenticated, user]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((current) => ({ ...current, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      setIsSubmitting(true);
      setStatus("");

      if (isRegister) {
        await register(formData);
      } else {
        await login({
          email: formData.email,
          password: formData.password,
        });
      }

      setStatus(isRegister ? "Account created successfully." : "Login successful.");
      onSuccess?.();
    } catch (error) {
      setStatus(error.message || "Authentication failed. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="mx-auto max-w-7xl px-4 py-8 pb-16 sm:px-6 sm:py-10 sm:pb-20 lg:px-8 lg:py-12 lg:pb-24">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2 text-sm text-stone-500">
          <button
            type="button"
            onClick={onNavigateHome}
            className="font-medium text-gold-800 transition hover:text-gold-700"
          >
            Home
          </button>
          <span>/</span>
          <span className="text-stone-700">{isRegister ? "Register" : "Login"}</span>
        </div>

        <button
          type="button"
          onClick={onSwitchMode}
          className="inline-flex items-center justify-center rounded-full border border-black/10 bg-white px-5 py-3 text-sm font-semibold text-charcoal transition hover:-translate-y-0.5 hover:border-gold-300 hover:text-gold-700"
        >
          {isRegister ? "Already have an account?" : "Create account"}
        </button>
      </div>

      <div className="grid overflow-hidden rounded-[1.5rem] border border-black/5 bg-white shadow-luxe lg:grid-cols-[0.95fr_1.05fr]">
        <div className="relative min-h-[320px] bg-charcoal">
          <img
            src={realImages.hero}
            alt="Luxury jewelry account"
            className="absolute inset-0 h-full w-full object-cover opacity-75"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-charcoal via-charcoal/70 to-charcoal/10" />
          <div className="relative z-10 flex h-full min-h-[320px] flex-col justify-end p-6 text-white sm:p-8 lg:p-10">
            <div className="grid h-12 w-12 place-items-center rounded-full bg-white/90 text-gold-700">
              <FaGem />
            </div>
            <p className="mt-6 text-xs font-semibold uppercase tracking-[0.32em] text-gold-300">
              Member access
            </p>
            <h1 className="mt-3 max-w-xl font-display text-4xl font-semibold tracking-tight sm:text-5xl">
              {isRegister ? "Create your jewelry profile" : "Welcome back to your edit"}
            </h1>
            <p className="mt-4 max-w-lg text-sm leading-7 text-white/75">
              Save favorite pieces, keep your wishlist close, and return to the
              styles you love.
            </p>
          </div>
        </div>

        <div className="p-5 sm:p-8 lg:p-10">
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-gold-700">
            {isRegister ? "Register" : "Login"}
          </p>
          <h2 className="mt-3 font-display text-3xl font-semibold text-charcoal">
            {isRegister ? "Start your account" : "Access your account"}
          </h2>

          <form onSubmit={handleSubmit} className="mt-7 space-y-4">
            {isRegister && (
              <label className="grid gap-2">
                <span className="text-sm font-medium text-stone-700">Name</span>
                <div className="flex h-12 items-center gap-3 rounded-full border border-black/10 bg-ivory px-4 focus-within:border-gold-300 focus-within:ring-4 focus-within:ring-gold-100">
                  <FiUser className="text-stone-500" />
                  <input
                    name="name"
                    type="text"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    placeholder="Your name"
                    className="w-full bg-transparent text-sm outline-none placeholder:text-stone-400"
                  />
                </div>
              </label>
            )}

            <label className="grid gap-2">
              <span className="text-sm font-medium text-stone-700">Email</span>
              <div className="flex h-12 items-center gap-3 rounded-full border border-black/10 bg-ivory px-4 focus-within:border-gold-300 focus-within:ring-4 focus-within:ring-gold-100">
                <FiMail className="text-stone-500" />
                <input
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  placeholder="you@example.com"
                  className="w-full bg-transparent text-sm outline-none placeholder:text-stone-400"
                />
              </div>
            </label>

            <label className="grid gap-2">
              <span className="text-sm font-medium text-stone-700">Password</span>
              <div className="flex h-12 items-center gap-3 rounded-full border border-black/10 bg-ivory px-4 focus-within:border-gold-300 focus-within:ring-4 focus-within:ring-gold-100">
                <FiLock className="text-stone-500" />
                <input
                  name="password"
                  type="password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  minLength="6"
                  placeholder="Minimum 6 characters"
                  className="w-full bg-transparent text-sm outline-none placeholder:text-stone-400"
                />
              </div>
            </label>

            <button
              type="submit"
              disabled={isSubmitting}
              className="inline-flex h-12 w-full items-center justify-center gap-2 rounded-full bg-charcoal px-6 text-sm font-semibold text-white transition hover:bg-black disabled:cursor-not-allowed disabled:opacity-70"
            >
              {isSubmitting
                ? isRegister
                  ? "Creating account..."
                  : "Logging in..."
                : isRegister
                  ? "Create Account"
                  : "Login"}
              <FiArrowRight />
            </button>
          </form>

          <p className="mt-5 min-h-5 text-sm text-stone-500">{status}</p>

          <button
            type="button"
            onClick={onSwitchMode}
            className="mt-4 text-sm font-semibold text-gold-800 transition hover:text-gold-700"
          >
            {isRegister
              ? "Login with an existing account"
              : "New here? Create your account"}
          </button>
        </div>
      </div>
    </section>
  );
}
