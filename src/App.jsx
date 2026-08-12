import { useEffect, useState } from "react";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import HomePage from "./pages/HomePage";
import ShopPage from "./pages/ShopPage";
import CollectionsPage from "./pages/CollectionsPage";
import AboutPage from "./pages/AboutPage";
import ContactPage from "./pages/ContactPage";
import AuthPage from "./pages/AuthPage";
import FavoritesPage from "./pages/FavoritesPage";
import CartPage from "./pages/CartPage";
import ProductDetailsPage from "./pages/ProductDetailsPage";

export default function App() {
  const getRouteFromHash = () => {
    const hash = window.location.hash;

    if (hash.startsWith("#product/")) {
      return {
        view: "product",
        productSlug: decodeURIComponent(hash.replace("#product/", "")),
      };
    }

    return {
      view:
        hash === "#shop"
          ? "shop"
          : hash === "#collections"
            ? "collections"
            : hash === "#about"
              ? "about"
              : hash === "#contact"
                ? "contact"
                : hash === "#login"
                  ? "login"
                  : hash === "#register"
                    ? "register"
                    : hash === "#favorites"
                      ? "favorites"
                      : hash === "#cart"
                        ? "cart"
                        : "home",
      productSlug: "",
    };
  };

  const [route, setRoute] = useState(getRouteFromHash);
  const { view: currentView, productSlug } = route;

  useEffect(() => {
    const handleHashChange = () => {
      setRoute(getRouteFromHash());
    };

    window.addEventListener("hashchange", handleHashChange);
    return () => window.removeEventListener("hashchange", handleHashChange);
  }, []);

  useEffect(() => {
    if (currentView !== "home") {
      window.scrollTo(0, 0);
    }
  }, [currentView, productSlug]);

  const handleNavigate = (link) => {
    if (
      [
        "shop",
        "collections",
        "about",
        "contact",
        "login",
        "register",
        "favorites",
        "cart",
      ].includes(link.view)
    ) {
      window.location.hash = link.view;
      setRoute({ view: link.view, productSlug: "" });
      return;
    }

    window.location.hash = link.href;
    setRoute({ view: "home", productSlug: "" });
  };

  const handleNavigateProduct = (slug) => {
    const nextSlug = encodeURIComponent(slug);
    window.location.hash = `product/${nextSlug}`;
    setRoute({ view: "product", productSlug: slug });
  };

  return (
    <div className="luxury-grid min-h-screen overflow-x-hidden">
      <Navbar currentView={currentView} onNavigate={handleNavigate} />
      <main>
        {currentView === "shop" ? (
          <ShopPage
            onNavigateHome={() => handleNavigate({ href: "#home", view: "home" })}
            onNavigateLogin={() => handleNavigate({ href: "#login", view: "login" })}
            onNavigateProduct={handleNavigateProduct}
          />
        ) : currentView === "collections" ? (
          <CollectionsPage
            onNavigateHome={() => handleNavigate({ href: "#home", view: "home" })}
            onNavigateShop={() => handleNavigate({ href: "#shop", view: "shop" })}
          />
        ) : currentView === "about" ? (
          <AboutPage
            onNavigateHome={() => handleNavigate({ href: "#home", view: "home" })}
            onNavigateShop={() => handleNavigate({ href: "#shop", view: "shop" })}
          />
        ) : currentView === "contact" ? (
          <ContactPage
            onNavigateHome={() => handleNavigate({ href: "#home", view: "home" })}
            onNavigateShop={() => handleNavigate({ href: "#shop", view: "shop" })}
            onNavigateAbout={() => handleNavigate({ href: "#about", view: "about" })}
          />
        ) : currentView === "login" ? (
          <AuthPage
            mode="login"
            onNavigateHome={() => handleNavigate({ href: "#home", view: "home" })}
            onSwitchMode={() => handleNavigate({ href: "#register", view: "register" })}
            onSuccess={() => handleNavigate({ href: "#shop", view: "shop" })}
          />
        ) : currentView === "register" ? (
          <AuthPage
            mode="register"
            onNavigateHome={() => handleNavigate({ href: "#home", view: "home" })}
            onSwitchMode={() => handleNavigate({ href: "#login", view: "login" })}
            onSuccess={() => handleNavigate({ href: "#shop", view: "shop" })}
          />
        ) : currentView === "favorites" ? (
          <FavoritesPage
            onNavigateHome={() => handleNavigate({ href: "#home", view: "home" })}
            onNavigateShop={() => handleNavigate({ href: "#shop", view: "shop" })}
            onNavigateLogin={() => handleNavigate({ href: "#login", view: "login" })}
            onNavigateProduct={handleNavigateProduct}
          />
        ) : currentView === "cart" ? (
          <CartPage
            onNavigateHome={() => handleNavigate({ href: "#home", view: "home" })}
            onNavigateShop={() => handleNavigate({ href: "#shop", view: "shop" })}
            onNavigateLogin={() => handleNavigate({ href: "#login", view: "login" })}
            onNavigateFavorites={() =>
              handleNavigate({ href: "#favorites", view: "favorites" })
            }
          />
        ) : currentView === "product" ? (
          <ProductDetailsPage
            slug={productSlug}
            onNavigateHome={() => handleNavigate({ href: "#home", view: "home" })}
            onNavigateShop={() => handleNavigate({ href: "#shop", view: "shop" })}
            onNavigateLogin={() => handleNavigate({ href: "#login", view: "login" })}
            onNavigateProduct={handleNavigateProduct}
          />
        ) : (
          <HomePage
            onNavigateLogin={() => handleNavigate({ href: "#login", view: "login" })}
            onNavigateProduct={handleNavigateProduct}
          />
        )}
      </main>
      <Footer onNavigate={handleNavigate} />
    </div>
  );
}
