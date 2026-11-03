import type { Config } from "tailwindcss";
import { fontFamily } from "tailwindcss/defaultTheme";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./app/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}",
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
        /* ---------------------------------------------------------------------
           Shadcn UI & CSS Variable Mappings
           --------------------------------------------------------------------- */
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

        /* ---------------------------------------------------------------------
           Kaizentrix Master Brand Scales (Official Logo Grounded)
           --------------------------------------------------------------------- */
        "brand-blue": {
          50: "#EFF6FF",
          100: "#DBEAFE",
          200: "#BFDBFE",
          300: "#93C5FD",
          400: "#3B82F6",
          500: "#146CC6",
          600: "#1158B0", // Official Monogram Body
          700: "#0E4892",
          800: "#0C3B78",
          900: "#082852",
          950: "#051833",
        },
        "kaizen-green": {
          50: "#F4F9EC",
          100: "#E7F3D5",
          200: "#D1E8B0",
          300: "#B6DC83",
          400: "#9ECD58",
          500: "#8AC048", // Official Kaizen Growth Arrow
          600: "#6FA432",
          700: "#538223", // Accessible text on white (4.58:1)
          800: "#3C6119", // Accessible text on white (7.20:1 AAA)
          900: "#284311",
          950: "#152408",
        },
        "ambient-cyan": {
          50: "#F0F9FF",
          100: "#E0F2FE",
          200: "#BAE6FD",
          300: "#7DD3FC",
          400: "#38BDF8",
          500: "#0EA5E9",
          600: "#0284C7",
          700: "#0369A1",
          800: "#075985",
          900: "#0C4A6E",
          950: "#082F49",
        },
        "neutral-slate": {
          50: "#F8FAFC",
          100: "#F1F5F9",
          200: "#E2E8F0",
          300: "#CBD5E1",
          400: "#94A3B8",
          500: "#64748B", // Accessible border (4.76:1)
          600: "#475569",
          700: "#334155",
          800: "#1E293B",
          900: "#0F172A",
          950: "#020617",
        },

        /* ---------------------------------------------------------------------
           Clinical Status Scales (Healthcare Domain)
           --------------------------------------------------------------------- */
        "clinical-warning": {
          50: "#FFFBEB",
          100: "#FEF3C7",
          200: "#FDE68A",
          300: "#FCD34D",
          400: "#FBBF24",
          500: "#F59E0B",
          600: "#D97706",
          700: "#B45309",
          800: "#92400E",
          900: "#78350F",
          950: "#451A03",
        },
        "clinical-error": {
          50: "#FEF2F2",
          100: "#FEE2E2",
          200: "#FECACA",
          300: "#FCA5A5",
          400: "#F87171",
          500: "#EF4444",
          600: "#DC2626", // Primary error button (4.83:1 AA)
          700: "#B91C1C",
          800: "#991B1B",
          900: "#7F1D1D",
          950: "#450A0A",
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
        xs: "2px",
        xl: "12px",
        "2xl": "16px",
      },
      fontFamily: {
        sans: ["var(--font-sans)", "Inter", ...fontFamily.sans],
        mono: ["var(--font-mono)", "JetBrains Mono", ...fontFamily.mono],
        devanagari: ["var(--font-devanagari)", "Noto Sans Devanagari", "sans-serif"],
      },
      boxShadow: {
        "elevation-1": "0 1px 2px 0 rgba(15, 23, 42, 0.05)",
        "elevation-2": "0 1px 3px 0 rgba(15, 23, 42, 0.1), 0 1px 2px -1px rgba(15, 23, 42, 0.1)",
        "elevation-3": "0 4px 6px -1px rgba(15, 23, 42, 0.1), 0 2px 4px -2px rgba(15, 23, 42, 0.1)",
        "elevation-4": "0 10px 15px -3px rgba(15, 23, 42, 0.1), 0 4px 6px -4px rgba(15, 23, 42, 0.1)",
        "elevation-5": "0 20px 25px -5px rgba(15, 23, 42, 0.1), 0 8px 10px -6px rgba(15, 23, 42, 0.1)",
      },
      transitionDuration: {
        fast: "150ms",
        normal: "200ms",
        slow: "300ms",
        deliberate: "500ms",
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
        "pulse-subtle": {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: "0.6" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "pulse-subtle": "pulse-subtle 2s cubic-bezier(0.4, 0, 0.6, 1) infinite",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};

export default config;
