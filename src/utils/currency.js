export const USD_TO_INR_RATE = 83;

const inrFormatter = new Intl.NumberFormat("en-IN", {
  style: "currency",
  currency: "INR",
  maximumFractionDigits: 0,
});

function numericAmount(value) {
  if (typeof value === "number") {
    return value;
  }

  const parsed = Number(String(value || "").replace(/[^0-9.-]/g, ""));
  return Number.isFinite(parsed) ? parsed : 0;
}

export function toInrAmount(value, currency = "USD") {
  const amount = numericAmount(value);
  const normalizedCurrency = String(currency || "USD").toUpperCase();

  if (normalizedCurrency === "INR" || currency === "₹") {
    return amount;
  }

  return amount * USD_TO_INR_RATE;
}

export function formatINR(value) {
  return inrFormatter.format(Math.round(Number(value) || 0));
}

export function formatProductPrice(product = {}) {
  const sourceCurrency =
    product.currency || (String(product.price || "").includes("₹") ? "INR" : "USD");

  return formatINR(toInrAmount(product.price, sourceCurrency));
}
