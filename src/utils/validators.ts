import { z } from 'zod';

/**
 * Schemas de validación centralizados usando Zod
 * Para prevenir inyecciones, validar entrada del usuario, y asegurar tipo-seguridad
 */

// ===== AUTH VALIDATORS =====
export const loginSchema = z.object({
  email: z.string().email('Email inválido'),
  password: z.string().min(6, 'Contraseña mínimo 6 caracteres'),
});

export const userSchema = z.object({
  id: z.string().uuid(),
  email: z.string().email(),
  name: z.string().min(1, 'Nombre requerido'),
  roleId: z.enum(['super_admin', 'admin', 'consejo', 'propietario', 'arrendatario', 'porteria', 'proveedor']),
  condoId: z.string().uuid().optional(),
  unitId: z.string().uuid().optional(),
  unitIds: z.array(z.string().uuid()).optional(),
  avatar: z.string().url().optional(),
  createdAt: z.date().optional(),
});

// ===== COMMUNICATION VALIDATORS =====
export const communicationPDFSchema = z.object({
  title: z.string().min(1, 'Título requerido').max(200, 'Título máximo 200 caracteres'),
  content: z.string().min(10, 'Contenido mínimo 10 caracteres').max(5000, 'Contenido máximo 5000 caracteres'),
  category: z.string().min(1, 'Categoría requerida'),
  audience: z.string().min(1, 'Audiencia requerida'),
  author: z.string().min(1, 'Autor requerido'),
  date: z.string().datetime(),
  brandImage: z.string().url().optional(),
  adminSignature: z.string().optional(),
  logoUrl: z.string().url().optional(),
});

// ===== IMAGE VALIDATORS =====
export const imageUrlSchema = z.object({
  url: z.string().url('URL inválida'),
  maxWidth: z.number().positive().optional(),
  maxHeight: z.number().positive().optional(),
  fallback: z.string().url().optional(),
});

// ===== SEARCH VALIDATORS =====
export const searchQuerySchema = z.object({
  query: z.string()
    .min(0)
    .max(100)
    .refine(
      (val) => !/<[^>]*>/g.test(val),
      'No se permiten etiquetas HTML'
    )
    .refine(
      (val) => !/[<>"'{};]/g.test(val),
      'Caracteres especiales no permitidos'
    ),
  filters: z.record(z.any()).optional(),
  page: z.number().positive().optional(),
  limit: z.number().positive().max(100).optional(),
});

// ===== PROPERTY VALIDATORS =====
export const propertySchema = z.object({
  id: z.string().uuid(),
  condoId: z.string().uuid(),
  unit: z.string().min(1),
  tower: z.string().min(1),
  area: z.number().positive(),
  owner: z.string().min(1),
  status: z.enum(['occupied', 'vacant', 'maintenance']),
  tenant: z.string().optional(),
  image: z.string().url().optional(),
});

// ===== CONDO VALIDATORS =====
export const condoSchema = z.object({
  id: z.string().uuid(),
  name: z.string().min(1),
  address: z.string().min(1),
  city: z.string().min(1),
  type: z.enum(['residential', 'mixed', 'commercial']).optional(),
  totalUnits: z.number().nonnegative(),
  totalResidents: z.number().nonnegative(),
  totalDebt: z.number().nonnegative(),
  occupancyRate: z.number().min(0).max(100),
  alerts: z.number().nonnegative(),
  image: z.string().url().optional(),
});

// ===== VALIDATION FUNCTIONS =====
export const validateLogin = (data: unknown) => {
  return loginSchema.safeParse(data);
};

export const validateUser = (data: unknown) => {
  return userSchema.safeParse(data);
};

export const validateCommunicationPDF = (data: unknown) => {
  return communicationPDFSchema.safeParse(data);
};

export const validateImageUrl = (data: unknown) => {
  return imageUrlSchema.safeParse(data);
};

export const validateSearchQuery = (data: unknown) => {
  return searchQuerySchema.safeParse(data);
};

export const validateProperty = (data: unknown) => {
  return propertySchema.safeParse(data);
};

export const validateCondo = (data: unknown) => {
  return condoSchema.safeParse(data);
};

// ===== SANITIZATION FUNCTIONS =====
/**
 * Sanitiza strings para prevenir XSS básico
 * NOTA: Para sanitización completa usar DOMPurify
 */
export const sanitizeString = (input: string): string => {
  return input
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
    .replace(/\//g, '&#x2F;');
};

/**
 * Valida que una URL sea del mismo origen
 * Previene ataques de validación de URL
 */
export const isSafeUrl = (url: string, baseUrl: string = window.location.origin): boolean => {
  try {
    const parsedUrl = new URL(url, baseUrl);
    return parsedUrl.origin === baseUrl;
  } catch {
    return false;
  }
};

/**
 * Valida que una URL sea una imagen segura
 */
export const isSafeImageUrl = (url: string): boolean => {
  try {
    const parsed = new URL(url);
    const validOrigins = [
      'images.unsplash.com',
      'via.placeholder.com',
      'cdn.example.com',
      window.location.hostname,
    ];
    return validOrigins.some((origin) => parsed.hostname?.includes(origin));
  } catch {
    return false;
  }
};

export default {
  loginSchema,
  userSchema,
  communicationPDFSchema,
  imageUrlSchema,
  searchQuerySchema,
  propertySchema,
  condoSchema,
  validateLogin,
  validateUser,
  validateCommunicationPDF,
  validateImageUrl,
  validateSearchQuery,
  validateProperty,
  validateCondo,
  sanitizeString,
  isSafeUrl,
  isSafeImageUrl,
};
