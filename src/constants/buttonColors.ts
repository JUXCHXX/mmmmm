/**
 * Button Colors v2.0 - CSS Vars Integration
 * Paleta profesional usando sistema global de diseño
 * Compatible con hsl(var(--primary)) vars
 */

import { getCssVar } from './designTokens';

export const BUTTON_COLORS = {
  primary: {
    gradient: `linear-gradient(135deg, ${getCssVar('--primary')} 0%, ${getCssVar('--accent')} 100%)`,
    hover: `hsl(var(--primary)/0.8)`,
    text: 'hsl(var(--primary-foreground))',
    border: 'hsl(var(--primary)/0.4)',
  },
  success: {
    gradient: `linear-gradient(135deg, ${getCssVar('--success')} 0%, hsl(169 98% 50%) 100%)`,
    hover: `hsl(var(--success)/0.8)`,
    text: 'hsl(var(--success-foreground))',
    border: 'hsl(var(--success)/0.4)',
  },
  warning: {
    gradient: `linear-gradient(135deg, hsl(var(--warning)) 0%, hsl(42 96% 65%) 100%)`,
    hover: `hsl(var(--warning)/0.8)`,
    text: 'hsl(var(--warning-foreground))',
    border: 'hsl(var(--warning)/0.4)',
  },
  danger: {
    gradient: `linear-gradient(135deg, hsl(var(--destructive)) 0%, hsl(0 84% 65%) 100%)`,
    hover: `hsl(var(--destructive)/0.8)`,
    text: 'hsl(var(--destructive-foreground))',
    border: 'hsl(var(--destructive)/0.4)',
  },
  info: {
    gradient: `linear-gradient(135deg, ${getCssVar('--secondary')} 0%, hsl(204 77% 55%) 100%)`,
    hover: `hsl(var(--secondary)/0.8)`,
    text: 'hsl(var(--secondary-foreground))',
    border: 'hsl(var(--secondary)/0.4)',
  },
  secondary: {
    gradient: `linear-gradient(135deg, hsl(var(--muted)) 0%, hsl(var(--muted-foreground)/0.2) 100%)`,
    hover: `hsl(var(--muted)/0.7)`,
    text: 'hsl(var(--foreground))',
    border: 'hsl(var(--border))',
  },
  accent: {
    gradient: `linear-gradient(135deg, ${getCssVar('--accent')} 0%, hsl(169 98% 50%) 100%)`,
    hover: `hsl(var(--accent)/0.8)`,
    text: 'hsl(var(--accent-foreground))',
    border: 'hsl(var(--accent)/0.4)',
  },
  glass: {
    gradient: 'hsl(0 0% 100% / 0.1)',
    hover: 'hsl(0 0% 100% / 0.2)',
    text: 'hsl(var(--foreground))',
    border: 'hsl(var(--border))',
  },
} as const;

export type ButtonColor = keyof typeof BUTTON_COLORS;

/**
 * CSS Vars Compatible - getButtonClasses('primary')
 */
export const getButtonColor = (name: ButtonColor) => {
  return BUTTON_COLORS[name] || BUTTON_COLORS.primary;
};

/**
 * Generate full Tailwind class string
 */
export const getButtonClasses = (
  colorName: ButtonColor = 'primary',
  size: 'sm' | 'md' | 'lg' = 'md'
): string => {
  const color = getButtonColor(colorName);
  const sizeClasses = {
    sm: 'px-3 py-1.5 text-sm h-9',
    md: 'px-4 py-2 text-base h-10',
    lg: 'px-6 py-3 text-lg h-12',
  }[size];

  return [
    'inline-flex items-center justify-center',
    sizeClasses,
    'font-semibold rounded-[var(--radius)] shadow-md hover:shadow-lg',
    'transition-all duration-[var(--transition-normal)]',
    'hover:scale-[1.02] active:scale-[0.98]',
    'border-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
    `bg-[${color.gradient}] text-[${color.text}] border-[${color.border}]`,
    'hover:brightness-110'
  ].join(' ');
};

/**
 * Quick button utility
 * <button className={getButtonClasses('primary', 'lg')}>Click</button>
 */
export const ButtonVariants = {
  primary: getButtonClasses('primary'),
  success: getButtonClasses('success'),
  warning: getButtonClasses('warning'),
  danger: getButtonClasses('danger'),
} as const;
