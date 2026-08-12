export const realImages = {
  hero:
    "https://images.unsplash.com/photo-1684439673104-f5d22791c71a?ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8amV3ZWxyeSUyMGVhcnJpbmdzfGVufDB8fDB8fHww&ixlib=rb-4.1.0&q=80&w=1600",
  ring:
    "https://images.pexels.com/photos/2849742/pexels-photo-2849742.jpeg?cs=srgb&dl=pexels-danielle-de-angelis-1477621-2849742.jpg&fm=jpg",
  necklace:
    "https://images.pexels.com/photos/14111400/pexels-photo-14111400.jpeg?cs=srgb&dl=pexels-the-glorious-studio-3584518-14111400.jpg&fm=jpg",
  bracelet:
    "https://images.pexels.com/photos/10341191/pexels-photo-10341191.jpeg?cs=srgb&dl=pexels-anastasia-stexova-44737928-10341191.jpg&fm=jpg",
  earrings:
    "https://images.pexels.com/photos/6924156/pexels-photo-6924156.jpeg?cs=srgb&dl=pexels-cottonbro-6924156.jpg&fm=jpg",
};

export const productImages = {
  ringAlt: realImages.ring,
  necklaceAlt: realImages.hero,
  earringsAlt:
    "https://images.pexels.com/photos/10082804/pexels-photo-10082804.jpeg?cs=srgb&dl=pexels-zaid-mohammed-86842527-10082804.jpg&fm=jpg",
  braceletAlt:
    "https://images.pexels.com/photos/37485307/pexels-photo-37485307.jpeg?cs=srgb&dl=pexels-kunal-lakhotia-781256899-37485307.jpg&fm=jpg",
  braceletStack: realImages.bracelet,
  jewelryStillLife: realImages.necklace,
};

export const navLinks = [
  { label: "Home", href: "#home", view: "home" },
  { label: "Shop", href: "#shop", view: "shop" },
  { label: "Collections", href: "#collections", view: "collections" },
  { label: "About", href: "#about", view: "about" },
  { label: "Contact", href: "#contact", view: "contact" },
];

export const categories = [
  {
    name: "Rings",
    image: realImages.ring,
  },
  {
    name: "Necklaces",
    image: realImages.necklace,
  },
  {
    name: "Earrings",
    image: realImages.earrings,
  },
  {
    name: "Bracelets",
    image: realImages.bracelet,
  },
];

export const products = [
  {
    name: "Aurora Diamond Ring",
    price: "$420",
    rating: 5,
    image: realImages.ring,
    category: "Rings",
    badge: "Best Seller",
    featured: true,
    description: "A luminous diamond ring with a refined everyday profile.",
  },
  {
    name: "Pearl Cascade Necklace",
    price: "$560",
    rating: 5,
    image: realImages.necklace,
    category: "Necklaces",
    badge: "New Arrival",
    featured: true,
    description: "Layered pearls shaped for gifting, weddings, and evenings.",
  },
  {
    name: "Golden Halo Earrings",
    price: "$280",
    rating: 4,
    image: realImages.earrings,
    category: "Earrings",
    badge: "Popular",
    featured: true,
    description: "Warm gold hoops with a soft, polished halo finish.",
  },
  {
    name: "Luna Tennis Bracelet",
    price: "$390",
    rating: 5,
    image: realImages.bracelet,
    category: "Bracelets",
    badge: "Best Seller",
    featured: true,
    description: "A clean tennis bracelet made for stacking or solo shine.",
  },
  {
    name: "Celeste Signet Ring",
    price: "$340",
    rating: 4,
    image: realImages.ring,
    category: "Rings",
    badge: "Limited",
    featured: false,
    description: "A modern signet ring with crisp edges and a soft sheen.",
  },
  {
    name: "Moonlight Pendant",
    price: "$480",
    rating: 5,
    image: realImages.necklace,
    category: "Necklaces",
    badge: "Gift Pick",
    featured: false,
    description: "A delicate pendant with a bright focal stone.",
  },
  {
    name: "Opal Arc Earrings",
    price: "$260",
    rating: 4,
    image: realImages.earrings,
    category: "Earrings",
    badge: "Popular",
    featured: false,
    description: "Curved earrings with opal detail and understated color.",
  },
  {
    name: "Radiant Cuff Bracelet",
    price: "$430",
    rating: 5,
    image: realImages.bracelet,
    category: "Bracelets",
    badge: "Editor's Pick",
    featured: false,
    description: "A structured cuff with a bright, sculptural surface.",
  },
];

export const features = [
  {
    title: "Certified Jewelry",
    text: "Every piece is authenticated and quality checked for lasting brilliance.",
  },
  {
    title: "Premium Quality",
    text: "Thoughtfully selected metals and stones for a refined, durable finish.",
  },
  {
    title: "Secure Payment",
    text: "Shop confidently with encrypted checkout and trusted payment methods.",
  },
  {
    title: "Fast Delivery",
    text: "Carefully packed and delivered quickly with premium presentation.",
  },
];

export const testimonials = [
  {
    name: "Ananya Sharma",
    review:
      "The detailing feels incredibly premium. My ring arrived beautifully packaged and exactly as pictured.",
    image: "/demo/avatar-1.svg",
  },
  {
    name: "Maya Kapoor",
    review:
      "Elegant, modern, and easy to shop. I found the perfect necklace for a wedding gift.",
    image: "/demo/avatar-2.svg",
  },
  {
    name: "Sara Khan",
    review:
      "The quality and finish are impressive. This brand really feels like a luxury boutique.",
    image: "/demo/avatar-3.svg",
  },
];

export const galleryImages = [
  realImages.ring,
  realImages.necklace,
  realImages.earrings,
  realImages.bracelet,
  productImages.braceletAlt,
  productImages.jewelryStillLife,
];
