import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        bg: "#0A0612",
        ink: "#EDECF7",
        sub: "#B7B3D9",
        brand: {
          50: "#f5f4ff",
          200: "#c7c0ff",
          400: "#8d7bff",
          500: "#6f57ff",
          600: "#5b45e6"
        }
      },
      boxShadow: {
        glow: "0 0 40px 10px rgba(111, 87, 255, 0.25)"
      },
      backgroundImage: {
        "radial-spot":
          "radial-gradient(60rem 40rem at 50% -10%, rgba(111,87,255,.35), transparent 60%)",
        "gradient-orb":
          "conic-gradient(from 180deg at 50% 50%, #6f57ff, #00e0ff, #ff4ecd, #6f57ff)"
      }
    }
  },
  plugins: []
};

export default config;
