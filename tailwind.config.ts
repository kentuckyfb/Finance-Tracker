import type { Config } from "tailwindcss";

export default {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      boxShadow: {
        glow: "0 0 10px 2px rgba(255, 165, 0, 0.5)", // Orange glow
      },
      
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        orange: {
          500: "#FFA500", // Add your orange theme color
        },
      },
    },
  },
  plugins: [],
} satisfies Config;
