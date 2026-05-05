/**
 * Image Utilities
 * Validación segura de URLs de imagen y manejo de fallbacks
 */

interface ImageValidationOptions {
  allowedDomains?: string[];
  maxWidth?: number;
  maxHeight?: number;
  fallback?: string;
}

// Dominios permitidos por por defecto para las imágenes
const DEFAULT_ALLOWED_DOMAINS = [
  'images.unsplash.com',
  'via.placeholder.com',
  'cdn.jsdelivr.net',
  'raw.githubusercontent.com',
  window.location.hostname,
];

const DEFAULT_FALLBACK = 'https://via.placeholder.com/400x300?text=Imagen+no+disponible';

/**
 * Valida si una URL de imagen es segura
 */
export const isValidImageUrl = (
  url: string,
  options: ImageValidationOptions = {}
): boolean => {
  if (!url || typeof url !== 'string') {
    return false;
  }

  try {
    const parsed = new URL(url);
    const allowedDomains = options.allowedDomains || DEFAULT_ALLOWED_DOMAINS;

    // Validar que sea HTTPS o data URL
    if (parsed.protocol !== 'https:' && !url.startsWith('data:')) {
      return false;
    }

    // Validar dominio
    const isAllowedDomain = allowedDomains.some((domain) =>
      parsed.hostname?.includes(domain)
    );

    if (!isAllowedDomain && !url.startsWith('data:')) {
      return false;
    }

    return true;
  } catch {
    return false;
  }
};

/**
 * Obtiene la URL de imagen segura o un fallback
 */
export const getSafeImageUrl = (
  url: string,
  options: ImageValidationOptions = {}
): string => {
  const fallback = options.fallback || DEFAULT_FALLBACK;

  if (isValidImageUrl(url, options)) {
    return url;
  }

  return fallback;
};

/**
 * Carga una imagen con validación y manejo de errores
 */
export const loadImageWithFallback = (
  imageElement: HTMLImageElement,
  url: string,
  fallbackUrl: string = DEFAULT_FALLBACK
): Promise<string> => {
  return new Promise((resolve) => {
    if (!isValidImageUrl(url)) {
      imageElement.src = fallbackUrl;
      resolve(fallbackUrl);
      return;
    }

    const img = new Image();

    img.onload = () => {
      imageElement.src = url;
      resolve(url);
    };

    img.onerror = () => {
      imageElement.src = fallbackUrl;
      resolve(fallbackUrl);
    };

    img.src = url;
  });
};

/**
 * Crea atributos seguros para elementos img
 */
export const createSafeImageAttributes = (
  url: string,
  options: ImageValidationOptions = {}
): {
  src: string;
  alt: string;
  onError?: (e: React.SyntheticEvent<HTMLImageElement>) => void;
} => {
  const safeUrl = getSafeImageUrl(url, options);

  return {
    src: safeUrl,
    alt: 'Imagen',
    onError: (e) => {
      const fallback = options.fallback || DEFAULT_FALLBACK;
      (e.target as HTMLImageElement).src = fallback;
    },
  };
};

/**
 * Valida dimensiones de imagen
 */
export const validateImageDimensions = (
  file: File,
  maxWidth: number = 4000,
  maxHeight: number = 4000
): Promise<boolean> => {
  return new Promise((resolve) => {
    const url = URL.createObjectURL(file);
    const img = new Image();

    img.onload = () => {
      URL.revokeObjectURL(url);
      resolve(img.width <= maxWidth && img.height <= maxHeight);
    };

    img.onerror = () => {
      URL.revokeObjectURL(url);
      resolve(false);
    };

    img.src = url;
  });
};

/**
 * Convierte una imagen a data URL
 */
export const imageToDataUrl = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = (e) => {
      resolve(e.target?.result as string);
    };

    reader.onerror = (e) => {
      reject(new Error('Error al leer archivo de imagen'));
    };

    reader.readAsDataURL(file);
  });
};

/**
 * Sanità URL de imagen para prevenir inyecciones
 */
export const sanitizeImageUrl = (url: string): string => {
  try {
    // Remover javascript: y data: schemes peligrosos
    if (url.toLowerCase().startsWith('javascript:')) {
      return DEFAULT_FALLBACK;
    }

    // Base64 data URLs son seguras después de validación
    if (url.startsWith('data:image/')) {
      return url;
    }

    // Validar URL normal
    const parsed = new URL(url);
    if (parsed.protocol === 'https:') {
      return url;
    }

    return DEFAULT_FALLBACK;
  } catch {
    return DEFAULT_FALLBACK;
  }
};

/**
 * React component prop para manejo seguro de imágenes
 */
export const useImageUrl = (
  url: string,
  options: ImageValidationOptions = {}
) => {
  return getSafeImageUrl(url, options);
};

export default {
  isValidImageUrl,
  getSafeImageUrl,
  loadImageWithFallback,
  createSafeImageAttributes,
  validateImageDimensions,
  imageToDataUrl,
  sanitizeImageUrl,
  useImageUrl,
};
