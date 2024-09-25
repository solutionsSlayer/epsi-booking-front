import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#FEF7FF",
        secondary: "#FFD700",
        accent: "#FF6347",
        nav: "#FFD762"
      },
    },
  },
  plugins: [],
};
export default config;
