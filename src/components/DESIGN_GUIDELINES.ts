/**
 * DESIGN SYSTEM BUNTY v4.0 - UNIFICADO
 * Sistema oficial: #0D2B4E (Azul Profundo) + #00B5A0 (Teal)
 */

export const DESIGN_GUIDELINES = {
  // UNIFICADO con designTokens.ts
  palette: {
    primary: 'hsl(var(--primary))',     // #0D2B4E
    secondary: 'hsl(var(--accent))',    // #00B5A0
    foreground: 'hsl(var(--foreground))',
  },
  
  // Modal standards
  modal: {
    barGradient: 'linear-gradient(to right, hsl(var(--primary)), hsl(var(--accent)), hsl(var(--primary)))',
    headerBg: 'hsl(var(--background)/0.8)',
    border: 'hsl(var(--border))',
  },

  // Component sizes
  sizes: {
    lg: 'max-w-4xl',  // ⭐ RECOMMENDED
    xl: 'max-w-5xl',
  },

  // Typography (from tokens)
  typography: {
    h1: 'font-h1',
    h2: 'font-h2',
  },

  // Shadows
  shadows: {
    card: 'shadow-custom-sm',
    elevated: 'shadow-elevation',
  },
  
  // Animation
  animation: {
    spring: 'damping-20 stiffness-300',
  },
} satisfies Record<string, any>;
