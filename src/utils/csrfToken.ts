/**
 * CSRF Token Management
 * Sistema básico de protección contra ataques CSRF
 */

interface CSRFTokenStore {
  token: string | null;
  expiresAt: number | null;
}

const CSRF_TOKEN_DURATION = 1 * 60 * 60 * 1000; // 1 hora
const CSRF_STORAGE_KEY = 'bunty_csrf_token';

/**
 * Genera un token CSRF aleatorio
 */
const generateCSRFToken = (): string => {
  const array = new Uint8Array(32);
  crypto.getRandomValues(array);
  return Array.from(array, (byte) => byte.toString(16).padStart(2, '0')).join('');
};

/**
 * Obtiene o crea un token CSRF
 */
export const getCSRFToken = (): string => {
  try {
    const stored = localStorage.getItem(CSRF_STORAGE_KEY);

    if (stored) {
      const parsed: CSRFTokenStore = JSON.parse(stored);

      // Verificar si el token aún es válido
      if (parsed.expiresAt && parsed.expiresAt > Date.now() && parsed.token) {
        return parsed.token;
      }
    }

    // Crear nuevo token
    const newToken = generateCSRFToken();
    const tokenStore: CSRFTokenStore = {
      token: newToken,
      expiresAt: Date.now() + CSRF_TOKEN_DURATION,
    };

    localStorage.setItem(CSRF_STORAGE_KEY, JSON.stringify(tokenStore));
    return newToken;
  } catch (error) {
    console.error('Error al generar token CSRF:', error);
    // Fallback: generar en memoria si localStorage no está disponible
    return generateCSRFToken();
  }
};

/**
 * Valida un token CSRF
 */
export const validateCSRFToken = (token: string): boolean => {
  try {
    const stored = localStorage.getItem(CSRF_STORAGE_KEY);

    if (!stored) {
      return false;
    }

    const parsed: CSRFTokenStore = JSON.parse(stored);

    // Verificar que el token coincida y no haya expirado
    if (
      parsed.token === token &&
      parsed.expiresAt &&
      parsed.expiresAt > Date.now()
    ) {
      return true;
    }

    return false;
  } catch (error) {
    console.error('Error al validar token CSRF:', error);
    return false;
  }
};

/**
 * Refresca el token CSRF
 */
export const refreshCSRFToken = (): string => {
  localStorage.removeItem(CSRF_STORAGE_KEY);
  return getCSRFToken();
};

/**
 * Limpia el token CSRF (logout)
 */
export const clearCSRFToken = (): void => {
  try {
    localStorage.removeItem(CSRF_STORAGE_KEY);
  } catch (error) {
    console.error('Error al limpiar token CSRF:', error);
  }
};

/**
 * Hook para React que maneja el token CSRF
 */
export const useCSRFToken = () => {
  return {
    getToken: getCSRFToken,
    validate: validateCSRFToken,
    refresh: refreshCSRFToken,
    clear: clearCSRFToken,
  };
};

export default {
  getCSRFToken,
  validateCSRFToken,
  refreshCSRFToken,
  clearCSRFToken,
  useCSRFToken,
};
