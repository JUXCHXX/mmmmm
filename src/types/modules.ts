import { FEATURE_ACCESS_MATRIX } from '@/constants/featureAccessMatrix';
import { FEATURES_BY_MODULE } from '@/constants/featureCatalog';
import type { AccessLevel, RoleId } from './roles';
import { MODULE_CODES } from './features';

export type ModuleId =
  | 'properties'
  | 'residents'
  | 'communications'
  | 'payments'
  | 'accounting'
  | 'reservations'
  | 'pqrs'
  | 'maintenance'
  | 'security'
  | 'security_config'
  | 'security_control'
  | 'documents'
  | 'marketplace'
  | 'dashboard'
  | 'ai_copilot'
  | 'analytics'
  | 'settings'
  | 'support'
  | 'knowledge'
  | 'audit';

export interface ModuleConfig {
  id: ModuleId;
  label: string;
  icon: string;
  path: string;
  category: 'strategic' | 'operative' | 'specialized' | 'advanced';
}

export const MODULES: ModuleConfig[] = [
  { id: 'dashboard', label: 'Dashboard', icon: 'LayoutDashboard', path: '/inicio', category: 'strategic' },
  { id: 'properties', label: 'Conjuntos', icon: 'Building2', path: '/propiedades', category: 'strategic' },
  { id: 'residents', label: 'Residentes', icon: 'Users', path: '/residentes', category: 'operative' },
  { id: 'communications', label: 'Comunicaciones', icon: 'MessageSquare', path: '/comunicaciones', category: 'operative' },
  { id: 'payments', label: 'Pagos y Cartera', icon: 'CreditCard', path: '/pagos', category: 'strategic' },
  { id: 'accounting', label: 'Contabilidad', icon: 'Calculator', path: '/contabilidad', category: 'strategic' },
  { id: 'reservations', label: 'Reservas', icon: 'CalendarDays', path: '/reservas', category: 'operative' },
  { id: 'pqrs', label: 'PQRS', icon: 'ClipboardList', path: '/pqrs', category: 'operative' },
  { id: 'maintenance', label: 'Mantenimiento', icon: 'Wrench', path: '/mantenimiento', category: 'operative' },
  { id: 'security', label: 'Seguridad', icon: 'ShieldCheck', path: '/seguridad', category: 'specialized' },
  { id: 'security_control', label: 'Control de Seguridad', icon: 'Shield', path: '/seguridad-control', category: 'operative' },
  { id: 'security_config', label: 'Config. Seguridad', icon: 'Settings', path: '/config-seguridad', category: 'specialized' },
  { id: 'documents', label: 'Documentos', icon: 'FileText', path: '/documentos', category: 'specialized' },
  { id: 'marketplace', label: 'Marketplace', icon: 'Store', path: '/marketplace', category: 'specialized' },
  { id: 'ai_copilot', label: 'IA Copiloto', icon: 'Bot', path: '/ia-copiloto', category: 'advanced' },
  { id: 'analytics', label: 'Analítica', icon: 'BarChart3', path: '/analitica', category: 'advanced' },
  { id: 'settings', label: 'Configuración', icon: 'Settings', path: '/configuracion', category: 'advanced' },
  { id: 'support', label: 'Soporte', icon: 'LifeBuoy', path: '/soporte', category: 'advanced' },
  { id: 'knowledge', label: 'Centro de Conocimiento', icon: 'FileText', path: '/centro-conocimiento', category: 'advanced' },
  { id: 'audit', label: 'Auditoría y Logs', icon: 'BarChart3', path: '/auditoria-seguridad', category: 'advanced' },
];

const ACCESS_ORDER: Record<AccessLevel, number> = {
  NONE: 0,
  OWN_DATA_ONLY: 1,
  READ_ONLY: 2,
  LIMITED: 3,
  FULL_ACCESS: 4,
};

const ROLES: RoleId[] = [
  'super_admin',
  'admin',
  'consejo',
  'propietario',
  'arrendatario',
  'porteria',
  'proveedor',
];

const DISABLED_DERIVED_MODULES = new Set<ModuleId>([
  'security_control',
  'security_config',
  'knowledge',
  'audit',
]);

const emptyAccessMap = (): Record<RoleId, AccessLevel> => ({
  super_admin: 'NONE',
  admin: 'NONE',
  consejo: 'NONE',
  propietario: 'NONE',
  arrendatario: 'NONE',
  porteria: 'NONE',
  proveedor: 'NONE',
});

const getHighestAccess = (moduleId: ModuleId, roleId: RoleId): AccessLevel => {
  if (DISABLED_DERIVED_MODULES.has(moduleId)) {
    return 'NONE';
  }

  const moduleCode = MODULE_CODES[moduleId];
  const featureIds = FEATURES_BY_MODULE[moduleCode] ?? [];

  return featureIds.reduce<AccessLevel>((highest, featureId) => {
    const current = FEATURE_ACCESS_MATRIX[featureId]?.[roleId] ?? 'NONE';
    return ACCESS_ORDER[current] > ACCESS_ORDER[highest] ? current : highest;
  }, 'NONE');
};

export const MODULE_ACCESS_MAP: Record<ModuleId, Record<RoleId, AccessLevel>> = MODULES.reduce(
  (accumulator, module) => {
    accumulator[module.id] = ROLES.reduce(
      (roleMap, roleId) => {
        roleMap[roleId] = getHighestAccess(module.id, roleId);
        return roleMap;
      },
      emptyAccessMap(),
    );
    return accumulator;
  },
  {} as Record<ModuleId, Record<RoleId, AccessLevel>>,
);

export function getAccessLevel(moduleId: ModuleId, roleId: RoleId): AccessLevel {
  return MODULE_ACCESS_MAP[moduleId]?.[roleId] ?? 'NONE';
}

export function hasAccess(moduleId: ModuleId, roleId: RoleId): boolean {
  return getAccessLevel(moduleId, roleId) !== 'NONE';
}

export function canCreate(moduleId: ModuleId, roleId: RoleId): boolean {
  const level = getAccessLevel(moduleId, roleId);
  return level === 'FULL_ACCESS' || level === 'LIMITED';
}

export function canEdit(moduleId: ModuleId, roleId: RoleId): boolean {
  const level = getAccessLevel(moduleId, roleId);
  return level === 'FULL_ACCESS' || level === 'LIMITED';
}

export function canDelete(moduleId: ModuleId, roleId: RoleId): boolean {
  return getAccessLevel(moduleId, roleId) === 'FULL_ACCESS';
}

export function getModulesForRole(roleId: RoleId): ModuleConfig[] {
  return MODULES.filter((module) => hasAccess(module.id, roleId));
}
