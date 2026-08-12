import { useEffect, useMemo, useState } from "react";
import { getCategories, getProducts } from "../api/catalog";
import {
  categories as fallbackCategories,
  products as fallbackProducts,
} from "../data";
import { formatProductPrice, toInrAmount } from "../utils/currency";

function normalizeProduct(product) {
  const sourceCurrency = product.currency || "USD";

  return {
    ...product,
    id: product._id || product.id || product.slug || product.name,
    price: formatProductPrice(product),
    priceAmount: toInrAmount(product.price, sourceCurrency),
    currency: "INR",
    rating: Number(product.rating) || 5,
  };
}

function normalizeCategory(category) {
  return {
    ...category,
    id: category._id || category.id || category.slug || category.name,
  };
}

export function useCatalog({ featured = false } = {}) {
  const initialProducts = useMemo(() => {
    const products = featured
      ? fallbackProducts.filter((product) => product.featured !== false).slice(0, 4)
      : fallbackProducts;

    return products.map(normalizeProduct);
  }, [featured]);

  const [products, setProducts] = useState(initialProducts);
  const [categories, setCategories] = useState(
    fallbackCategories.map(normalizeCategory)
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let isActive = true;

    async function loadCatalog() {
      try {
        setLoading(true);
        setError("");

        const [productResponse, categoryResponse] = await Promise.all([
          getProducts(featured ? { featured: "true" } : undefined),
          getCategories(),
        ]);

        if (!isActive) {
          return;
        }

        setProducts((productResponse.data || []).map(normalizeProduct));
        setCategories((categoryResponse.data || []).map(normalizeCategory));
      } catch (apiError) {
        if (isActive) {
          setError(apiError.message);
          setProducts(initialProducts);
          setCategories(fallbackCategories.map(normalizeCategory));
        }
      } finally {
        if (isActive) {
          setLoading(false);
        }
      }
    }

    loadCatalog();

    return () => {
      isActive = false;
    };
  }, [featured, initialProducts]);

  return { products, categories, loading, error };
}
