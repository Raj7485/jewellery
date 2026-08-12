import { FaFacebookF, FaInstagram, FaPinterestP, FaTwitter } from "react-icons/fa";
import { navLinks } from "../data";

export default function Footer({ onNavigate }) {
  const socialLinks = [
    { Icon: FaInstagram, label: "Instagram", href: "https://instagram.com" },
    { Icon: FaFacebookF, label: "Facebook", href: "https://facebook.com" },
    { Icon: FaPinterestP, label: "Pinterest", href: "https://pinterest.com" },
    { Icon: FaTwitter, label: "Twitter", href: "https://twitter.com" },
  ];

  return (
    <footer className="border-t border-black/5 bg-charcoal text-white">
      <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
        <div className="grid gap-10 lg:grid-cols-[1.2fr_0.8fr_0.8fr_1fr]">
          <div>
            <h2 className="font-display text-3xl font-semibold">Luxury Jewelry</h2>
            <p className="mt-4 max-w-md text-sm leading-7 text-white/70">
              Elegant jewelry pieces with a premium digital experience designed
              for modern shoppers.
            </p>
          </div>

          <div>
            <h3 className="text-sm font-semibold uppercase tracking-[0.28em] text-gold-300">
              Quick Links
            </h3>
            <div className="mt-4 grid gap-3">
              {navLinks.map((link) => (
                <button
                  type="button"
                  key={link.label}
                  onClick={() => onNavigate(link)}
                  className="text-left text-sm text-white/70 transition hover:text-gold-300"
                >
                  {link.label}
                </button>
              ))}
            </div>
          </div>

          <div>
            <h3 className="text-sm font-semibold uppercase tracking-[0.28em] text-gold-300">
              Contact Details
            </h3>
            <div className="mt-4 grid gap-3 text-sm text-white/70">
              <p>123 Luxury Avenue, Mumbai</p>
              <p>support@luxuryjewelry.com</p>
              <p>+91 98765 43210</p>
            </div>
          </div>

          <div>
            <h3 className="text-sm font-semibold uppercase tracking-[0.28em] text-gold-300">
              Social Media
            </h3>
            <div className="mt-4 flex gap-3">
              {socialLinks.map(({ Icon, label, href }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noreferrer"
                  className="grid h-11 w-11 place-items-center rounded-full border border-white/10 bg-white/5 text-white/80 transition hover:-translate-y-0.5 hover:bg-gold-400 hover:text-charcoal"
                  aria-label={label}
                >
                  <Icon />
                </a>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-12 border-t border-white/10 pt-6 text-sm text-white/55">
          Copyright 2026 Luxury Jewelry. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
