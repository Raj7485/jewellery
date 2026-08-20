const API_BASE_URL = import.meta.env.VITE_API_URL || "/api";

export function getStoredToken() {
  return localStorage.getItem("luxuryJewelryToken");
}

async function request(path, options = {}) {
  const token = getStoredToken();

  const response = await fetch(`${API_BASE_URL}${path}`, {
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers,
    },
    ...options,
  });

  const payload = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(payload.message || "API request failed.");
  }

  return payload;
}

function buildQuery(params = {}) {
  const query = new URLSearchParams();

  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== "") {
      query.set(key, value);
    }
  });

  const queryString = query.toString();
  return queryString ? `?${queryString}` : "";
}

export function getProducts(params) {
  return request(`/products${buildQuery(params)}`);
}

export function getProduct(slug) {
  return request(`/products/${slug}`);
}

export function getCategories() {
  return request("/categories");
}

export function submitNewsletter(email) {
  return request("/newsletter", {
    method: "POST",
    body: JSON.stringify({ email }),
  });
}

export function submitContactMessage(payload) {
  return request("/contact", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export function registerUser(payload) {
  return request("/auth/register", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export function loginUser(payload) {
  return request("/auth/login", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export function getCurrentUser() {
  return request("/auth/me");
}

export function getFavoriteProducts() {
  return request("/favorites");
}

export function addFavoriteProduct(productId) {
  return request(`/favorites/${productId}`, {
    method: "POST",
  });
}

export function removeFavoriteProduct(productId) {
  return request(`/favorites/${productId}`, {
    method: "DELETE",
  });
}

export function getCart() {
  return request("/cart");
}

export function addCartProduct(productId, quantity = 1) {
  return request("/cart", {
    method: "POST",
    body: JSON.stringify({ productId, quantity }),
  });
}

export function updateCartProduct(productId, quantity) {
  return request(`/cart/${productId}`, {
    method: "PATCH",
    body: JSON.stringify({ quantity }),
  });
}

export function removeCartProduct(productId) {
  return request(`/cart/${productId}`, {
    method: "DELETE",
  });
}

export function clearCartProducts() {
  return request("/cart", {
    method: "DELETE",
  });
}

export function getActiveOffers() {
  return request("/offers");
}

export function createOrder(payload) {
  return request("/orders", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export function checkPhonePePaymentStatus(merchantTransactionId) {
  return request(`/orders/phonepe/status/${merchantTransactionId}`);
}

export function getAdminSummary() {
  return request("/admin/summary");
}

export function getAdminProducts(search = "") {
  return request(`/admin/products${buildQuery({ search })}`);
}

export function createAdminProduct(payload) {
  return request("/admin/products", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export function updateAdminProduct(productId, payload) {
  return request(`/admin/products/${productId}`, {
    method: "PATCH",
    body: JSON.stringify(payload),
  });
}

export function deleteAdminProduct(productId) {
  return request(`/admin/products/${productId}`, {
    method: "DELETE",
  });
}

export function uploadAdminImage(payload) {
  return request("/admin/upload", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export function getAdminOrders() {
  return request("/admin/orders");
}

export function updateAdminOrder(orderId, payload) {
  return request(`/admin/orders/${orderId}`, {
    method: "PATCH",
    body: JSON.stringify(payload),
  });
}

export function getAdminUsers() {
  return request("/admin/users");
}

export function updateAdminUser(userId, payload) {
  return request(`/admin/users/${userId}`, {
    method: "PATCH",
    body: JSON.stringify(payload),
  });
}

export function getAdminOffers() {
  return request("/admin/offers");
}

export function createAdminOffer(payload) {
  return request("/admin/offers", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export function updateAdminOffer(offerId, payload) {
  return request(`/admin/offers/${offerId}`, {
    method: "PATCH",
    body: JSON.stringify(payload),
  });
}

export function deleteAdminOffer(offerId) {
  return request(`/admin/offers/${offerId}`, {
    method: "DELETE",
  });
}
