import { useState } from "react";
import {
  FiHeart,
  FiLogOut,
  FiMenu,
  FiSearch,
  FiShield,
  FiShoppingBag,
  FiUser,
  FiX,
} from "react-icons/fi";
import { useAuth } from "../context/AuthContext";
import { navLinks } from "../data";

export default function Navbar({ currentView, onNavigate }) {
  const [open, setOpen] = useState(false);
  const { cartCount, favoriteIds, isAuthenticated, logout, user } = useAuth();

  const handleNavigate = (link) => {
    setOpen(false);
    onNavigate(link);
  };

  const handleLogout = () => {
    logout();
    handleNavigate({ href: "#home", view: "home" });
  };

  return (
    <header className="sticky top-0 z-50 border-b border-black/5 bg-ivory/95 backdrop-blur-md">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
        <button
          type="button"
          onClick={() => handleNavigate({ href: "#home", view: "home" })}
          className="flex items-center gap-3 text-left"
        >
          <span className="grid h-11 w-11 place-items-center rounded-full bg-charcoal text-sm font-semibold text-gold-300 shadow-luxe">
            LJ
          </span>
          <span>
            <span className="block font-display text-xl font-semibold tracking-wide text-charcoal">
              Luxury Jewelry
            </span>
            <span className="block text-xs uppercase tracking-[0.28em] text-stone-500">
              Fine pieces, modern grace
            </span>
          </span>
        </button>

        <nav className="hidden items-center gap-8 lg:flex" aria-label="Primary">
          {navLinks.map((link) => (
            <button
              type="button"
              key={link.label}
              onClick={() => handleNavigate(link)}
              className={`text-sm font-medium transition ${
                currentView === link.view ? "text-gold-700" : "text-stone-700 hover:text-gold-700"
              }`}
            >
              {link.label}
            </button>
          ))}
        </nav>

        <div className="hidden items-center gap-3 lg:flex">
          <button
            type="button"
            className="relative grid h-11 w-11 place-items-center rounded-full border border-black/10 bg-white text-stone-700 transition hover:-translate-y-0.5 hover:border-gold-300 hover:text-gold-700"
            aria-label="Search"
          >
            <FiSearch />
          </button>
          <button
            type="button"
            onClick={() => handleNavigate({ href: "#favorites", view: "favorites" })}
            className="relative grid h-11 w-11 place-items-center rounded-full border border-black/10 bg-white text-stone-700 transition hover:-translate-y-0.5 hover:border-gold-300 hover:text-gold-700"
            aria-label="Favorites"
          >
            <FiHeart />
            {favoriteIds.length > 0 && (
              <span className="absolute -right-1 -top-1 grid h-5 min-w-5 place-items-center rounded-full bg-gold-400 px-1 text-[0.65rem] font-bold text-charcoal">
                {favoriteIds.length}
              </span>
            )}
          </button>
          <button
            type="button"
            onClick={() => handleNavigate({ href: "#cart", view: "cart" })}
            className="relative grid h-11 w-11 place-items-center rounded-full border border-black/10 bg-white text-stone-700 transition hover:-translate-y-0.5 hover:border-gold-300 hover:text-gold-700"
            aria-label="Cart"
          >
            <FiShoppingBag />
            {cartCount > 0 && (
              <span className="absolute -right-1 -top-1 grid h-5 min-w-5 place-items-center rounded-full bg-charcoal px-1 text-center text-[0.65rem] font-bold leading-none text-white ring-2 ring-ivory">
                {cartCount}
              </span>
            )}
          </button>
          {isAuthenticated ? (
            <>
              <button
                type="button"
                onClick={() => handleNavigate({ href: "/admin", view: "admin" })}
                className={`grid h-11 w-11 place-items-center rounded-full border border-black/10 bg-white transition hover:-translate-y-0.5 hover:border-gold-300 hover:text-gold-700 ${
                  currentView === "admin" ? "text-gold-700" : "text-stone-700"
                }`}
                aria-label="Admin"
              >
                <FiShield />
              </button>
              <button
                type="button"
                onClick={() => handleNavigate({ href: "#favorites", view: "favorites" })}
                className="inline-flex h-11 items-center gap-2 rounded-full border border-black/10 bg-white px-4 text-sm font-semibold text-stone-700 transition hover:-translate-y-0.5 hover:border-gold-300 hover:text-gold-700"
              >
                <FiUser />
                {user?.name?.split(" ")[0] || "Account"}
              </button>
              <button
                type="button"
                onClick={handleLogout}
                className="grid h-11 w-11 place-items-center rounded-full bg-charcoal text-white transition hover:bg-black"
                aria-label="Logout"
              >
                <FiLogOut />
              </button>
            </>
          ) : (
            <button
              type="button"
              onClick={() => handleNavigate({ href: "#login", view: "login" })}
              className="inline-flex h-11 items-center gap-2 rounded-full bg-charcoal px-5 text-sm font-semibold text-white transition hover:-translate-y-0.5 hover:bg-black"
            >
              <FiUser />
              Login
            </button>
          )}
        </div>

        <button
          type="button"
          className="grid h-11 w-11 place-items-center rounded-full border border-black/10 bg-white text-stone-700 transition hover:border-gold-300 hover:text-gold-700 lg:hidden"
          onClick={() => setOpen((value) => !value)}
          aria-label="Toggle menu"
          aria-expanded={open}
        >
          {open ? <FiX /> : <FiMenu />}
        </button>
      </div>

      <div
        className={`overflow-hidden border-t border-black/5 bg-ivory transition-all duration-300 lg:hidden ${
          open ? "max-h-96" : "max-h-0"
        }`}
      >
        <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6">
          <div className="grid gap-2">
            {navLinks.map((link) => (
              <button
                type="button"
                key={link.label}
                onClick={() => handleNavigate(link)}
                className={`rounded-2xl px-4 py-3 text-left text-sm font-medium transition hover:bg-white hover:text-gold-700 ${
                  currentView === link.view ? "bg-white text-gold-700" : "text-stone-700"
                }`}
              >
                {link.label}
              </button>
            ))}
          </div>
          <div className="mt-4 flex gap-3">
            <button
              type="button"
              className="flex flex-1 items-center justify-center gap-2 rounded-full border border-black/10 bg-white px-4 py-3 text-sm text-stone-700"
              aria-label="Search"
            >
              <FiSearch />
              Search
            </button>
            <button
              type="button"
              onClick={() => handleNavigate({ href: "#favorites", view: "favorites" })}
              className="flex flex-1 items-center justify-center gap-2 rounded-full border border-black/10 bg-white px-4 py-3 text-sm text-stone-700"
              aria-label="Favorites"
            >
              <FiHeart />
              Favorites {favoriteIds.length ? `(${favoriteIds.length})` : ""}
            </button>
          </div>
          <div className="mt-3 flex gap-3">
            <button
              type="button"
              onClick={() => handleNavigate({ href: "#cart", view: "cart" })}
              className="flex flex-1 items-center justify-center gap-2 rounded-full border border-black/10 bg-white px-4 py-3 text-sm text-stone-700"
              aria-label="Cart"
            >
              <FiShoppingBag />
              Cart {cartCount ? `(${cartCount})` : ""}
            </button>
            {isAuthenticated ? (
              <>
                <button
                  type="button"
                  onClick={() => handleNavigate({ href: "/admin", view: "admin" })}
                  className="flex flex-1 items-center justify-center gap-2 rounded-full border border-black/10 bg-white px-4 py-3 text-sm text-stone-700"
                >
                  <FiShield />
                  Admin
                </button>
                <button
                  type="button"
                  onClick={handleLogout}
                  className="flex flex-1 items-center justify-center gap-2 rounded-full bg-charcoal px-4 py-3 text-sm font-semibold text-white"
                >
                  <FiLogOut />
                  Logout
                </button>
              </>
            ) : (
              <button
                type="button"
                onClick={() => handleNavigate({ href: "#login", view: "login" })}
                className="flex flex-1 items-center justify-center gap-2 rounded-full bg-charcoal px-4 py-3 text-sm font-semibold text-white"
              >
                <FiUser />
                Login
              </button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
