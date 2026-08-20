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

export function toInrAmount(value, currency = "INR") {
  const amount = numericAmount(value);
  // All prices are stored in INR — no conversion needed
  return amount;
}

export function formatINR(value) {
  return inrFormatter.format(Math.round(Number(value) || 0));
}

export function formatProductPrice(product = {}) {
  return formatINR(toInrAmount(product.price, "INR"));
}
