import { createContext, useContext, useEffect, useMemo, useState } from "react";
import {
  addCartProduct,
  addFavoriteProduct,
  clearCartProducts,
  getCart,
  getCurrentUser,
  getFavoriteProducts,
  loginUser,
  registerUser,
  removeCartProduct,
  removeFavoriteProduct,
  updateCartProduct,
} from "../api/catalog";

const AuthContext = createContext(null);
const tokenKey = "luxuryJewelryToken";

function favoriteIdsFromUser(user) {
  return (user?.favorites || []).map((favorite) =>
    favorite._id || favorite.id || favorite
  );
}

function normalizeCartItems(items = []) {
  return items
    .filter((item) => item.product)
    .map((item) => ({
      ...item,
      product: {
        ...item.product,
        id: item.product._id || item.product.id,
      },
      quantity: Number(item.quantity) || 1,
      subtotal:
        typeof item.subtotal === "number"
          ? item.subtotal
          : (Number(item.product.price) || 0) * (Number(item.quantity) || 1),
    }));
}

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => localStorage.getItem(tokenKey));
  const [user, setUser] = useState(null);
  const [favoriteProducts, setFavoriteProducts] = useState([]);
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(Boolean(token));

  const favoriteIds = useMemo(
    () => favoriteProducts.map((product) => product._id || product.id),
    [favoriteProducts]
  );

  const cartCount = useMemo(
    () => cartItems.reduce((total, item) => total + item.quantity, 0),
    [cartItems]
  );

  const cartTotal = useMemo(
    () => cartItems.reduce((total, item) => total + item.subtotal, 0),
    [cartItems]
  );

  useEffect(() => {
    let isActive = true;

    async function restoreSession() {
      if (!token) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const response = await getCurrentUser();

        if (!isActive) {
          return;
        }

        setUser({
          ...response.data,
          favorites: favoriteIdsFromUser(response.data),
        });
        setFavoriteProducts(response.data.favorites || []);
        setCartItems(normalizeCartItems(response.data.cartItems || []));
      } catch (_error) {
        if (isActive) {
          localStorage.removeItem(tokenKey);
          setToken(null);
          setUser(null);
          setFavoriteProducts([]);
          setCartItems([]);
        }
      } finally {
        if (isActive) {
          setLoading(false);
        }
      }
    }

    restoreSession();

    return () => {
      isActive = false;
    };
  }, [token]);

  const applyAuthResponse = (payload) => {
    localStorage.setItem(tokenKey, payload.token);
    setToken(payload.token);
    setUser({
      ...payload.user,
      favorites: favoriteIdsFromUser(payload.user),
    });
  };

  const register = async (payload) => {
    const response = await registerUser(payload);
    applyAuthResponse(response);
    setFavoriteProducts([]);
    setCartItems([]);
    return response;
  };

  const login = async (payload) => {
    const response = await loginUser(payload);
    applyAuthResponse(response);
    const [favoritesResponse, cartResponse] = await Promise.all([
      getFavoriteProducts(),
      getCart(),
    ]);
    setFavoriteProducts(favoritesResponse.data || []);
    setCartItems(normalizeCartItems(cartResponse.data || []));
    return response;
  };

  const logout = () => {
    localStorage.removeItem(tokenKey);
    setToken(null);
    setUser(null);
    setFavoriteProducts([]);
    setCartItems([]);
  };

  const toggleFavorite = async (product) => {
    if (!user) {
      throw new Error("Please login to save favorites.");
    }

    const productId = product._id || product.id;
    const isFavorite = favoriteIds.includes(productId);
    const response = isFavorite
      ? await removeFavoriteProduct(productId)
      : await addFavoriteProduct(productId);

    const nextFavorites = response.data || [];
    setFavoriteProducts(nextFavorites);
    setUser((current) =>
      current
        ? {
            ...current,
            favorites: nextFavorites.map((favorite) => favorite._id || favorite.id),
          }
        : current
    );

    return response;
  };

  const applyCartResponse = (response) => {
    const nextCartItems = normalizeCartItems(response.data || []);
    setCartItems(nextCartItems);
    return response;
  };

  const refreshSession = async () => {
    const response = await getCurrentUser();
    setUser({
      ...response.data,
      favorites: favoriteIdsFromUser(response.data),
    });
    setFavoriteProducts(response.data.favorites || []);
    setCartItems(normalizeCartItems(response.data.cartItems || []));
    return response;
  };

  const addToCart = async (product, quantity = 1) => {
    if (!user) {
      throw new Error("Please login to add products to your cart.");
    }

    const productId = product._id || product.id;
    const response = await addCartProduct(productId, quantity);
    return applyCartResponse(response);
  };

  const updateCartQuantity = async (productId, quantity) => {
    if (!user) {
      throw new Error("Please login to update your cart.");
    }

    const response = await updateCartProduct(productId, quantity);
    return applyCartResponse(response);
  };

  const removeFromCart = async (productId) => {
    if (!user) {
      throw new Error("Please login to update your cart.");
    }

    const response = await removeCartProduct(productId);
    return applyCartResponse(response);
  };

  const clearCart = async () => {
    if (!user) {
      throw new Error("Please login to update your cart.");
    }

    const response = await clearCartProducts();
    return applyCartResponse(response);
  };

  const value = {
    token,
    user,
    loading,
    favoriteProducts,
    favoriteIds,
    cartItems,
    cartCount,
    cartTotal,
    isAuthenticated: Boolean(user),
    register,
    login,
    logout,
    toggleFavorite,
    addToCart,
    updateCartQuantity,
    removeFromCart,
    clearCart,
    refreshSession,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used inside AuthProvider");
  }

  return context;
}
