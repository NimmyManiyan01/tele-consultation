import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./src/**/*.{ts,tsx}",
    "./src/pages/**/*.{ts,tsx}",
    "./src/components/**/*.{ts,tsx}",
    "./src/app/**/*.{ts,tsx}",
  ],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        brand: {
          blue: {
            50: "#EFF6FF",
            100: "#DBEAFE",
            200: "#BFDBFE",
            300: "#93C5FD",
            400: "#3B82F6",
            500: "#146CC6",
            600: "#1158B0",
            700: "#0E4892",
            800: "#0C3B78",
            900: "#0A2F60",
          },
          green: {
            50: "#F5FAF0",
            100: "#E7F3D5",
            200: "#D1E8B0",
            300: "#B4DB80",
            400: "#9ECE55",
            500: "#8AC048",
            600: "#6FA533",
            700: "#548225",
            800: "#3D621A",
            900: "#284311",
          },
          slate: {
            50: "#F8FAFC",
            100: "#F1F5F9",
            200: "#E2E8F0",
            300: "#CBD5E1",
            400: "#94A3B8",
            500: "#64748B",
            600: "#475569",
            700: "#334155",
            800: "#1E293B",
            900: "#0F172A",
          },
        },
        clinical: {
          success: {
            bg: "hsl(var(--clinical-success-bg))",
            fg: "hsl(var(--clinical-success-fg))",
            border: "hsl(var(--clinical-success-border))",
          },
          warning: {
            bg: "hsl(var(--clinical-warning-bg))",
            fg: "hsl(var(--clinical-warning-fg))",
            border: "hsl(var(--clinical-warning-border))",
          },
          error: {
            bg: "hsl(var(--clinical-error-bg))",
            fg: "hsl(var(--clinical-error-fg))",
            border: "hsl(var(--clinical-error-border))",
          },
          info: {
            bg: "hsl(var(--clinical-info-bg))",
            fg: "hsl(var(--clinical-info-fg))",
            border: "hsl(var(--clinical-info-border))",
          },
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      fontFamily: {
        sans: ["var(--font-inter)", "system-ui", "-apple-system", "sans-serif"],
        heading: ["var(--font-jakarta)", "system-ui", "sans-serif"],
        mono: ["var(--font-mono)", "monospace"],
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};

export default config;

