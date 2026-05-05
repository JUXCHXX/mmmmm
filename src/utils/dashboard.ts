/**
 * Centralized Dashboard Constants
 * All dashboard-related constants in one place for easy maintenance
 */

// Chart Colors
export const CHART_COLORS = ['#2563EB', '#60A5FA', '#34D399', '#FBBF24', '#F87171', '#8B5CF6', '#EC4899'];

// Animation Timings (ms)
export const ANIMATION_TIMING = {
  SHORT: 300,
  MEDIUM: 500,
  LONG: 800,
  EXTRA_LONG: 1200,
} as const;

// Delay Increments for Staggered Animations
export const ANIMATION_DELAY = {
  NONE: 0,
  SHORT: 100,
  MEDIUM: 200,
  LONG: 300,
} as const;

// KPI Card Configuration
export const KPI_ANIMATION_DURATION = 2000;
export const KPI_ANIMATION_STEPS = 60;
export const KPI_ANIMATION_DELAY = 500;

// Chart Data Sample
export const SAMPLE_BAR_DATA = [
  { name: 'Ene', value: 42000000 },
  { name: 'Feb', value: 38000000 },
  { name: 'Mar', value: 45000000 },
  { name: 'Abr', value: 41000000 },
  { name: 'May', value: 47000000 },
  { name: 'Jun', value: 50000000 },
];

export const SAMPLE_PIE_DATA = [
  { name: 'Al día', value: 72 },
  { name: 'Moroso', value: 18 },
  { name: 'En acuerdo', value: 10 },
];

export const SAMPLE_LINE_DATA = [
  { name: 'Ene', pqrs: 12, resueltas: 10 },
  { name: 'Feb', pqrs: 18, resueltas: 15 },
  { name: 'Mar', pqrs: 14, resueltas: 13 },
  { name: 'Abr', pqrs: 20, resueltas: 17 },
  { name: 'May', pqrs: 16, resueltas: 14 },
  { name: 'Jun', pqrs: 22, resueltas: 19 },
];

// Role Labels
export const ROLE_DISPLAY_NAMES: Record<string, string> = {
  residential: 'Residencial',
  mixed: 'Mixto',
  commercial: 'Comercial',
};

// Button Search Texts for Screenshot Capture
export const SCREENSHOT_BUTTON_TEXTS = ['Nueva', 'Nuevo', 'Crear', 'Agregar', 'Nueva Unidad', 'Editar'];

// Modal/Close Button Selectors
export const CLOSE_BUTTON_SELECTORS = [
  '[class*="close"]',
  'button:has(> svg[class*="X"])',
  '[aria-label*="Cerrar"]',
];

// Scroll Offsets
export const SCROLL_OFFSETS = {
  TOP: 0,
  VIEWPORT_HALF: 0.5,
  VIEWPORT_FULL: 1,
} as const;

// Screenshot Configuration
export const SCREENSHOT_CONFIG = {
  INITIAL_DELAY: 1000,
  CAPTURE_DELAY: 1500,
  MODAL_DELAY: 1300,
  SCROLL_DELAY: 1200,
  CLOSE_DELAY: 800,
  FINAL_DELAY: 500,
  CLEANUP_DELAY: 2000,
  DOWNLOAD_DELAY: 1500,
  CANVAS_SCALE: 2,
  CANVAS_MARGIN: 0,
  CANVAS_BG_COLOR: '#0f0f0f',
  PNG_QUALITY: 0.95,
} as const;

// Size Limits
export const SIZE_LIMITS = {
  MAX_IMAGE_WIDTH: 4000,
  MAX_IMAGE_HEIGHT: 4000,
  MIN_BLOB_SIZE: 0,
} as const;

// Component Grid Configurations
export const GRID_CONFIG = {
  DASHBOARD_KPI: 'grid-cols-2 sm:grid-cols-3 xl:grid-cols-5',
  ADMIN_KPI: 'grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4',
  CONSEJO_KPI: 'grid-cols-1 sm:grid-cols-2 xl:grid-cols-3',
  RESIDENT_UNITS: 'grid-cols-1 md:grid-cols-2',
  TWO_COLUMN: 'grid-cols-1 lg:grid-cols-2',
  ONE_FULL: 'grid-cols-1',
} as const;

// DEFAULT VALUES
export const DEFAULTS = {
  AVATAR_SIZE: 40,
  ICON_SIZE: 20,
  BORDER_RADIUS: 'rounded-lg',
  SHADOW: 'shadow-md',
} as const;

export default {
  CHART_COLORS,
  ANIMATION_TIMING,
  ANIMATION_DELAY,
  KPI_ANIMATION_DURATION,
  KPI_ANIMATION_STEPS,
  KPI_ANIMATION_DELAY,
  SAMPLE_BAR_DATA,
  SAMPLE_PIE_DATA,
  SAMPLE_LINE_DATA,
  ROLE_DISPLAY_NAMES,
  SCREENSHOT_BUTTON_TEXTS,
  CLOSE_BUTTON_SELECTORS,
  SCROLL_OFFSETS,
  SCREENSHOT_CONFIG,
  SIZE_LIMITS,
  GRID_CONFIG,
  DEFAULTS,
};
