/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        gold: {
          50: "#fff9ea",
          100: "#fef3c7",
          200: "#fde68a",
          300: "#fcd34d",
          400: "#f5c242",
          500: "#d4a43d",
          600: "#b88720",
          700: "#8b6914",
          800: "#5f470f",
          900: "#3d2f0a",
        },
        ivory: "#faf7f2",
        charcoal: "#111111",
      },
      boxShadow: {
        luxe: "0 20px 60px rgba(17, 17, 17, 0.12)",
        glow: "0 10px 40px rgba(212, 164, 61, 0.22)",
      },
      keyframes: {
        float: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-10px)" },
        },
        fadeUp: {
          "0%": { opacity: "0", transform: "translateY(24px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        shimmer: {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
      },
      animation: {
        float: "float 6s ease-in-out infinite",
        fadeUp: "fadeUp 0.8s ease-out both",
        shimmer: "shimmer 2.2s linear infinite",
      },
      fontFamily: {
        display: ["Cormorant Garamond", "Georgia", "serif"],
        body: ["Inter", "ui-sans-serif", "system-ui", "sans-serif"],
      },
    },
  },
  plugins: [],
};
