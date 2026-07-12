/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        brand: {
          50: "#f5f3ff",
          100: "#ede9fe",
          400: "#a78bfa",
          500: "#8b5cf6",
          600: "#7c3aed",
          700: "#6d28d9",
        },
        ink: {
          900: "#0b0b13",
          800: "#12121c",
          700: "#1a1a28",
          600: "#232336",
        },
      },
      backgroundImage: {
        "grid-fade":
          "radial-gradient(ellipse at top, rgba(124,58,237,0.15), transparent 60%), radial-gradient(ellipse at bottom, rgba(14,165,233,0.12), transparent 60%)",
      },
      boxShadow: {
        glow: "0 0 40px -10px rgba(124,58,237,0.5)",
        card: "0 8px 32px rgba(0,0,0,0.35)",
      },
      fontFamily: {
        sans: ["Inter", "ui-sans-serif", "system-ui"],
      },
      keyframes: {
        float: {
          "0%,100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-8px)" },
        },
        shine: {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
      },
      animation: {
        float: "float 6s ease-in-out infinite",
        shine: "shine 3s linear infinite",
      },
    },
  },
  plugins: [],
};
