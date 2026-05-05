import type { RoleId, AccessLevel } from './roles';

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

export const MODULE_ACCESS_MAP: Record< ModuleId, Record<RoleId, AccessLevel>> = {
  dashboard:       { super_admin: 'FULL_ACCESS', admin: 'FULL_ACCESS', consejo: 'READ_ONLY', propietario: 'OWN_DATA_ONLY', arrendatario: 'OWN_DATA_ONLY', porteria: 'LIMITED', proveedor: 'FULL_ACCESS' },
  properties:      { super_admin: 'NONE', admin: 'NONE', consejo: 'READ_ONLY', propietario: 'OWN_DATA_ONLY', arrendatario: 'OWN_DATA_ONLY', porteria: 'NONE', proveedor: 'NONE' },
  residents:       { super_admin: 'FULL_ACCESS', admin: 'FULL_ACCESS', consejo: 'READ_ONLY', propietario: 'LIMITED', arrendatario: 'NONE', porteria: 'READ_ONLY', proveedor: 'NONE' },
  communications:  { super_admin: 'FULL_ACCESS', admin: 'FULL_ACCESS', consejo: 'LIMITED', propietario: 'LIMITED', arrendatario: 'LIMITED', porteria: 'READ_ONLY', proveedor: 'NONE' },
  payments:        { super_admin: 'FULL_ACCESS', admin: 'FULL_ACCESS', consejo: 'READ_ONLY', propietario: 'LIMITED', arrendatario: 'NONE', porteria: 'NONE', proveedor: 'NONE' },
  accounting:      { super_admin: 'FULL_ACCESS', admin: 'FULL_ACCESS', consejo: 'READ_ONLY', propietario: 'LIMITED', arrendatario: 'NONE', porteria: 'NONE', proveedor: 'OWN_DATA_ONLY' },
  reservations:    { super_admin: 'FULL_ACCESS', admin: 'FULL_ACCESS', consejo: 'READ_ONLY', propietario: 'LIMITED', arrendatario: 'LIMITED', porteria: 'FULL_ACCESS', proveedor: 'NONE' },
  pqrs:            { super_admin: 'FULL_ACCESS', admin: 'FULL_ACCESS', consejo: 'READ_ONLY', propietario: 'LIMITED', arrendatario: 'LIMITED', porteria: 'NONE', proveedor: 'NONE' },
  maintenance:     { super_admin: 'FULL_ACCESS', admin: 'FULL_ACCESS', consejo: 'READ_ONLY', propietario: 'READ_ONLY', arrendatario: 'READ_ONLY', porteria: 'READ_ONLY', proveedor: 'NONE' },
  security:        { super_admin: 'FULL_ACCESS', admin: 'FULL_ACCESS', consejo: 'READ_ONLY', propietario: 'LIMITED', arrendatario: 'LIMITED', porteria: 'FULL_ACCESS', proveedor: 'NONE' },
  security_control: { super_admin: 'FULL_ACCESS', admin: 'FULL_ACCESS', consejo: 'NONE', propietario: 'NONE', arrendatario: 'NONE', porteria: 'NONE', proveedor: 'NONE' },
  security_config: { super_admin: 'FULL_ACCESS', admin: 'FULL_ACCESS', consejo: 'READ_ONLY', propietario: 'LIMITED', arrendatario: 'LIMITED', porteria: 'FULL_ACCESS', proveedor: 'NONE' },
  documents:       { super_admin: 'FULL_ACCESS', admin: 'FULL_ACCESS', consejo: 'READ_ONLY', propietario: 'READ_ONLY', arrendatario: 'READ_ONLY', porteria: 'READ_ONLY', proveedor: 'FULL_ACCESS' },
  marketplace:     { super_admin: 'FULL_ACCESS', admin: 'FULL_ACCESS', consejo: 'NONE', propietario: 'LIMITED', arrendatario: 'LIMITED', porteria: 'NONE', proveedor: 'NONE' },
  ai_copilot:      { super_admin: 'FULL_ACCESS', admin: 'FULL_ACCESS', consejo: 'READ_ONLY', propietario: 'READ_ONLY', arrendatario: 'NONE', porteria: 'NONE', proveedor: 'NONE' },
  analytics:       { super_admin: 'FULL_ACCESS', admin: 'FULL_ACCESS', consejo: 'READ_ONLY', propietario: 'OWN_DATA_ONLY', arrendatario: 'OWN_DATA_ONLY', porteria: 'NONE', proveedor: 'FULL_ACCESS' },
  settings:        { super_admin: 'FULL_ACCESS', admin: 'FULL_ACCESS', consejo: 'READ_ONLY', propietario: 'LIMITED', arrendatario: 'LIMITED', porteria: 'NONE', proveedor: 'FULL_ACCESS' },
  support:         { super_admin: 'FULL_ACCESS', admin: 'FULL_ACCESS', consejo: 'FULL_ACCESS', propietario: 'FULL_ACCESS', arrendatario: 'FULL_ACCESS', porteria: 'FULL_ACCESS', proveedor: 'FULL_ACCESS' },
  knowledge:       { super_admin: 'NONE', admin: 'NONE', consejo: 'NONE', propietario: 'NONE', arrendatario: 'NONE', porteria: 'NONE', proveedor: 'NONE' },
  audit:           { super_admin: 'FULL_ACCESS', admin: 'FULL_ACCESS', consejo: 'NONE', propietario: 'NONE', arrendatario: 'NONE', porteria: 'NONE', proveedor: 'NONE' },
};

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
  return MODULES.filter(m => hasAccess(m.id, roleId));
}

