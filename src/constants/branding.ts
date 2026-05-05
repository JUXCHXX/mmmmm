export const ACTIVE_CONDO_NAME = 'Torres del Parque Residencial';
export const BUNTY_SLOGAN = 'Todo en orden, todo Bunty.';
export const SUPPORT_EMAIL = 'soporte@bunty.co';
export const BUNTY_LOGO_SRC = '/images/LOGO_BUNTY.png';

export const getUserInitials = (name?: string, fallback = 'BU') => {
  if (!name) return fallback;

  const initials = name
    .split(' ')
    .map((part) => part.trim())
    .filter(Boolean)
    .map((part) => part[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();

  return initials || fallback;
};
