/**
 * Theme Config v1.0 - Central Theme Management
 * Design System Hub + Customizer para SuperAdmin
 */

import { type ColorKey, CSS_VARS, getCssVar } from './designTokens';
import { useAppStore } from '@/store/useAppStore';
import { create } from 'zustand';

export interface ThemeConfig {
  primaryColor: string; // hsl values
  secondaryColor: string;
  themeMode: 'light' | 'dark';
  customRadius: string;
  customShadows: boolean;
  fontScale: 1 | 1.1 | 1.25;
  savedPresets: string[];
}

// Default theme from designTokens
export const DEFAULT_THEME: ThemeConfig = {
  primaryColor: getCssVar('--primary'),
  secondaryColor: getCssVar('--accent'),
  themeMode: 'light',
  customRadius: '0.75rem',
  customShadows: true,
  fontScale: 1,
  savedPresets: [],
};

// Theme store (integrated with useAppStore later)
export const useThemeStore = create((set, get) => ({
  theme: DEFAULT_THEME,
  setPrimaryColor: (color: string) => set({ theme: { ...get().theme, primaryColor: color } }),
  setSecondaryColor: (color: string) => set({ theme: { ...get().theme, secondaryColor: color } }),
  toggleThemeMode: () => {
    const current = get().theme.themeMode;
    set({ theme: { ...get().theme, themeMode: current === 'light' ? 'dark' : 'light' } });
  },
  resetToDefault: () => set({ theme: DEFAULT_THEME }),
  savePreset: (name: string) => {
    const presets = [...get().theme.savedPresets, name];
    set({ theme: { ...get().theme, savedPresets: presets } });
  },
}));

/**
 * Dynamic CSS Vars Generator
 * Updates :root vars based on current theme
 */
export const getDynamicCssVars = (theme: ThemeConfig): Record<string, string> => ({
  ...CSS_VARS,
  '--primary-custom': theme.primaryColor,
  '--secondary-custom': theme.secondaryColor,
  '--radius-custom': theme.customRadius,
  '--font-scale': `${theme.fontScale}`,
});

/**
 * Apply theme to document (called on mount/customize)
 */
export const applyTheme = (theme: ThemeConfig) => {
  const vars = getDynamicCssVars(theme);
  Object.entries(vars).forEach(([key, value]) => {
    document.documentElement.style.setProperty(key, value);
  });
};

/**
 * Preset themes for SuperAdmin
 */
export const THEME_PRESETS = [
  {
    name: 'BUNTY Official',
    primary: getCssVar('--primary'),
    secondary: getCssVar('--accent'),
    radius: '0.75rem',
  },
  {
    name: 'Teal Focus',
    primary: '169 98% 36%',
    secondary: '204 77% 45%',
    radius: '1rem',
  },
  {
    name: 'Dark Mode',
    primary: '217 54% 15%',
    secondary: '169 98% 30%',
    radius: '0.5rem',
  },
] as const;

/**
 * Validate HSL color
 */
export const isValidHsl = (color: string): boolean => {
  return color.match(/^hsl\(\s*\d+\s*,\s*\d+%\s*,\s*\d+%\s*\)$/);
};

/**
 * Color picker HSL converter (for customizer)
 */
export const hexToHsl = (hex: string): string => {
  // Simplified hex → hsl converter for picker
  const r = parseInt(hex.slice(1, 3), 16) / 255;
  const g = parseInt(hex.slice(3, 5), 16) / 255;
  const b = parseInt(hex.slice(5, 7), 16) / 255;
  
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  let h, s, l = (max + min) / 2;

  if (max === min) {
    h = s = 0;
  } else {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    
    switch (max) {
      case r: h = (g - b) / d + (g < b ? 6 : 0); break;
      case g: h = (b - r) / d + 2; break;
      case b: h = (r - g) / d + 4; break;
    }
    h /= 6;
  }

  return `hsl(${Math.round(h * 360)}, ${Math.round(s * 100)}%, ${Math.round(l * 100)}%)`;
};

// Export for SettingsPage Design Hub
export default {
  DEFAULT_THEME,
  THEME_PRESETS,
  useThemeStore,
  applyTheme,
  getDynamicCssVars,
  isValidHsl,
  hexToHsl,
};
