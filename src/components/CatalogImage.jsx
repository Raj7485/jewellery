import { useEffect, useMemo, useState } from "react";
import { realImages } from "../data";

const imageByCategory = {
  Rings: realImages.ring,
  Necklaces: realImages.necklace,
  Earrings: realImages.earrings,
  Bracelets: realImages.bracelet,
};

function getFallbackImage(category, fallbackSrc) {
  return fallbackSrc || imageByCategory[category] || realImages.hero;
}

export default function CatalogImage({
  src,
  alt,
  category,
  fallbackSrc,
  className,
  ...props
}) {
  const fallbackImage = useMemo(
    () => getFallbackImage(category, fallbackSrc),
    [category, fallbackSrc]
  );
  const [currentSrc, setCurrentSrc] = useState(src || fallbackImage);

  useEffect(() => {
    setCurrentSrc(src || fallbackImage);
  }, [fallbackImage, src]);

  return (
    <img
      src={currentSrc}
      alt={alt}
      className={className}
      onError={() => {
        if (currentSrc !== fallbackImage) {
          setCurrentSrc(fallbackImage);
        }
      }}
      {...props}
    />
  );
}
