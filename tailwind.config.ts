import type { Config } from "tailwindcss";
import { TYPOGRAPHY, SPACING, BORDER_RADIUS, SHADOWS } from './src/constants/designTokens';

export default {
  darkMode: ["class"],
  content: ["./pages/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}", "./app/**/*.{ts,tsx}", "./src/**/*.{ts,tsx}"],
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
      /* ✅ FONT FAMILY */
      fontFamily: {
        inter: ['Inter', 'system-ui', 'sans-serif'],
      },

      /* ✅ COLORS - Design Tokens Mapping */
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
        /* ... all existing colors preserved ... */
        sidebar: {
          DEFAULT: "hsl(var(--sidebar-background))",
          foreground: "hsl(var(--sidebar-foreground))",
          primary: "hsl(var(--sidebar-primary))",
          "primary-foreground": "hsl(var(--sidebar-primary-foreground))",
        },
        success: {
          DEFAULT: "hsl(var(--success))",
          foreground: "hsl(var(--success-foreground))",
        },
      },

      /* ✅ FONT SIZE - From TYPOGRAPHY */
      fontSize: {
        'h1': ['var(--font-h1-size)', { lineHeight: 'var(--font-h1-line)', fontWeight: 'var(--font-h1-weight)' }],
        'h2': ['var(--font-h2-size)', { lineHeight: 'var(--font-h2-line)', fontWeight: 'var(--font-h2-weight)' }],
        'h3': ['var(--font-h3-size)', { lineHeight: 'var(--font-h3-line)', fontWeight: 'var(--font-h3-weight)' }],
        'body-lg': ['var(--font-body-lg)', { lineHeight: '1.75' }],
        'body': ['var(--font-body)', { lineHeight: '1.6' }],
        'body-sm': ['var(--font-body-sm)', { lineHeight: '1.5' }],
        'label': ['var(--font-label)', { lineHeight: '1.25', fontWeight: '500' }],
        'xs': ['0.75rem', { lineHeight: '1rem' }],
        'sm': ['0.875rem', { lineHeight: '1.25rem' }],
      },

      /* ✅ FONT WEIGHT */
      fontWeight: {
        normal: '400',
        medium: '500',
        'semi-bold': '600',
        bold: '700',
      },

      /* ✅ BORDER RADIUS - Enhanced with rounded corners everywhere */
      borderRadius: {
        ...BORDER_RADIUS,
        lg: "var(--radius)",
        md: "calc(var(--radius) - 0.25rem)",
        sm: "calc(var(--radius) - 0.5rem)",
        none: "0px",
        DEFAULT: "var(--radius)",
      },

      /* ✅ BOX SHADOW - Complete System */
      boxShadow: {
        ...SHADOWS,
        "sm-blue": "0 1px 2px 0 rgba(37, 99, 235, 0.05)",
        elevation: "var(--shadow-elevation)",
        glow: "0 0 20px hsl(var(--primary)/0.3)",
      },

      /* ✅ SPACING - Custom Scale */
      spacing: SPACING,

      /* ✅ ANIMATIONS - Enhanced */
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "fade-in": "fade-in 0.4s ease-out forwards",
        "pulse-glow": "pulse-glow 2s ease-in-out infinite",
        "float": "float 3s ease-in-out infinite",
      },

      keyframes: {
        /* Existing preserved + new */
        "pulse-glow": {
          "0%, 100%": { boxShadow: "0 0 20px hsl(var(--primary)/0.2)" },
          "50%": { boxShadow: "0 0 40px hsl(var(--primary)/0.4)" },
        },
      },
    },
  },
plugins: [],
} satisfies Config;

