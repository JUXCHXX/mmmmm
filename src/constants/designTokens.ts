/**
 * Design Tokens - BUNTY Professional Color System v4.0 GLOBAL CSS INTEGRATION
 * Sistema cromático profesional: Azul Profundo (#0D2B4E) + Teal Énfasis (#00B5A0)
 * INTEGRADO CON TAILWIND/CSS VARS
 */

// ============================================
// COLORES PRINCIPALES - IDENTIDAD BUNTY v4
// ============================================

export const COLORS = {
  // Azules (Identidad Principal)
  azulProfundo: "217 54% 20%",              // #0D2B4E - Sidebar, estructura
  azulAccento: "204 77% 45%",               // #1E7EC8 - Botones principales
  azulSuperficies: "209 62% 30%",           // #1A4A7A - Superficies secundarias
  azulClaro: "210 29% 94%",                 // Fondos alternativos suave

  // Teal Énfasis / Highlights
  tealEnfasis: "169 98% 36%",               // #00B5A0 - Estados positivos, énfasis
  tealPastel: "169 98% 70%",                // Fondos secundarios alternativos
  tealSuave: "170 80% 70%",                 // Hover states

  // Neutros Premium
  fondoGeneral: "210 29% 97%",              // #F4F7FB - Fondo principal
  blancoPuro: "0 0% 100%",                  // Blanco puro
  blancoHumo: "210 29% 94%",                // Fondos alternativos muy claros
  grisAzuladoSuave: "210 14% 88%",          // Separadores, bordes suaves
  grisClaro: "210 14% 83%",                 // Inputs, campos de texto
  grisMedio: "217 12% 50%",                 // Texto secundario
  grisOscuro: "217 33% 18%",                // Texto primario
};

// ============================================
// COLORES DE ESTADOS Y SEMÁNTICA
// ============================================

export const STATES = {
  success: "169 98% 36%",                   // Teal - Éxito, positivo
  successLight: "169 98% 85%",              // Fondo de success suave
  info: "204 77% 45%",                      // Azul acento - Información
  infoLight: "204 77% 90%",                 // Fondo de info suave
  warning: "42 96% 56%",                    // Ámbar suave - Advertencia
  warningLight: "42 96% 85%",               // Fondo de warning suave
  error: "0 84% 60%",                       // Rojo - Error, crítico
  errorLight: "0 84% 90%",                  // Fondo de error suave
};

// ============================================
// CSS VARIABLES MAPPING - GLOBAL INTEGRATION
// ============================================

export const CSS_VARS = {
  // Backgrounds & Surfaces
  '--background': `hsl(${COLORS.fondoGeneral})`,
  '--foreground': `hsl(${COLORS.grisOscuro})`,
  '--card': `hsl(${COLORS.blancoHumo})`,
  '--card-foreground': `hsl(${COLORS.grisOscuro})`,
  '--popover': `hsl(${COLORS.blancoPuro})`,
  '--popover-foreground': `hsl(${COLORS.grisOscuro})`,

  // Primary System
  '--primary': `hsl(${COLORS.azulProfundo})`,
  '--primary-foreground': `hsl(${COLORS.blancoPuro})`,

  // Secondary System  
  '--secondary': `hsl(${COLORS.azulAccento})`,
  '--secondary-foreground': `hsl(${COLORS.blancoPuro})`,

  // Muted & Accent
  '--muted': `hsl(${COLORS.grisClaro})`,
  '--muted-foreground': `hsl(${COLORS.grisMedio})`,
  '--accent': `hsl(${COLORS.tealEnfasis})`,
  '--accent-foreground': `hsl(${COLORS.blancoPuro})`,

  // Sidebar System
  '--sidebar-background': `hsl(${COLORS.azulProfundo})`,
  '--sidebar-foreground': `hsl(${COLORS.blancoPuro})`,
  '--sidebar-primary': `hsl(${COLORS.tealEnfasis})`,
  '--sidebar-primary-foreground': `hsl(${COLORS.blancoPuro})`,

  // States
  '--success': `hsl(${STATES.success})`,
  '--success-foreground': `hsl(${COLORS.blancoPuro})`,
  '--warning': `hsl(${STATES.warning})`,
  '--warning-foreground': `hsl(${COLORS.azulProfundo})`,
  '--destructive': `hsl(${STATES.error})`,
  '--destructive-foreground': `hsl(${COLORS.blancoPuro})`,

  // Borders & Input
  '--border': `hsl(${COLORS.grisAzuladoSuave})`,
  '--input': `hsl(${COLORS.blancoHumo})`,
  '--ring': `hsl(${COLORS.azulAccento})`,

  // Radius
  '--radius': '1rem',
};

// ============================================
// UTILITY FUNCTIONS - CSS VAR GENERATOR
// ============================================

/**
 * Get CSS var string: getCssVar('primary') -> 'hsl(var(--primary))'
 */
export const getCssVar = (varName: string): string => {
  return `hsl(var(${varName}))`;
};

/**
 * Get raw HSL value
 */
export const getRawHsl = (key: keyof typeof COLORS): string => {
  return COLORS[key as keyof typeof COLORS];
};

// ============================================
// GRADIENTES PREDEFINIDOS (CSS var compatible)
// ============================================

export const GRADIENTS = {
  sidebarGradient: `linear-gradient(180deg, ${getCssVar('--sidebar-background')} 0%, hsl(217 54% 18%) 100%)`,
  headerGradient: `linear-gradient(135deg, ${getCssVar('--primary')} 0%, ${getCssVar('--accent')} 100%)`,
  buttonPrimaryGradient: `linear-gradient(135deg, ${getCssVar('--primary')} 0%, ${getCssVar('--accent')} 100%)`,
};

// ============================================
// TIPOGRAFÍA - CSS READY
// ============================================

export const TYPOGRAPHY = {
  h1: { size: "clamp(1.875rem, 5vw, 3.75rem)", weight: 700, lineHeight: "1.2", tracking: "-0.02em" },
  h2: { size: "clamp(1.5rem, 4vw, 2.5rem)", weight: 600, lineHeight: "1.3", tracking: "-0.01em" },
  h3: { size: "clamp(1.25rem, 3vw, 1.875rem)", weight: 600, lineHeight: "1.4", tracking: "0" },
  bodyLarge: { size: "1.125rem", weight: 400, lineHeight: "1.75", tracking: "0" },
  body: { size: "1rem", weight: 400, lineHeight: "1.6", tracking: "0" },
  bodySmall: { size: "0.875rem", weight: 400, lineHeight: "1.5", tracking: "0" },
  label: { size: "0.75rem", weight: 500, lineHeight: "1.25", tracking: "0.1em" },
};

// ============================================
// ESPACIADO, BORDES, SOMBRAS - Tailwind Ready
// ============================================

export const SPACING = {
  '0': '0px', '0.5': '0.125rem', '1': '0.25rem', '1.5': '0.375rem',
  '2': '0.5rem', '2.5': '0.625rem', '3': '0.75rem', '3.5': '0.875rem',
  '4': '1rem', '5': '1.25rem', '6': '1.5rem', '7': '1.75rem', '8': '2rem',
  '9': '2.25rem', '10': '2.5rem', '12': '3rem', '16': '4rem', '20': '5rem', '24': '6rem'
} as const;

export const BORDER_RADIUS = {
  sm: "0.5rem", md: "0.75rem", lg: "1rem", xl: "1.25rem", "2xl": "1.75rem"
} as const;

export const SHADOWS = {
  sm: "0 1px 2px 0 hsl(var(--primary)/.05)",
  md: "0 4px 6px -1px hsl(var(--primary)/.1), 0 2px 4px -1px hsl(var(--primary)/.06)",
  lg: "0 10px 15px -3px hsl(var(--primary)/.1), 0 4px 6px -2px hsl(var(--primary)/.05)",
  xl: "0 20px 25px -5px hsl(var(--primary)/.1), 0 10px 10px -5px hsl(var(--primary)/.04)",
  elevation: "0 25px 50px -12px hsl(var(--primary)/.25)"
} as const;

// ============================================
// TYPE EXPORTS
// ============================================

export type ColorKey = keyof typeof COLORS;
export type SpacingKey = keyof typeof SPACING;
export type CssVarKey = keyof typeof CSS_VARS;
