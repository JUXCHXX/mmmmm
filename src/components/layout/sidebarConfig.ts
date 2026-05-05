import type { ElementType } from 'react';
import type { ModuleConfig } from '@/types/modules';
import type { RoleId } from '@/types/roles';
import {
  LayoutDashboard,
  Building2,
  Users,
  MessageSquare,
  CreditCard,
  Calculator,
  CalendarDays,
  ClipboardList,
  Wrench,
  ShieldCheck,
  FileText,
  Store,
  Bot,
  BarChart3,
  Settings,
  LifeBuoy,
  LayoutGrid,
  Settings2,
  FolderOpen,
  BrainCircuit,
  UserCog,
} from 'lucide-react';

export type SidebarSectionId =
  | 'plataforma'
  | 'operacion'
  | 'documentos'
  | 'inteligencia'
  | 'administracion';

export interface SidebarSectionConfig {
  id: SidebarSectionId;
  label: string;
  icon: ElementType;
  modules: ModuleConfig['id'][];
}

export const MODULE_ICON_MAP: Record<string, ElementType> = {
  LayoutDashboard,
  Building2,
  Users,
  MessageSquare,
  CreditCard,
  Calculator,
  CalendarDays,
  ClipboardList,
  Wrench,
  ShieldCheck,
  FileText,
  Store,
  Bot,
  BarChart3,
  Settings,
  LifeBuoy,
};

export const SIDEBAR_SECTIONS: SidebarSectionConfig[] = [
  {
    id: 'plataforma',
    label: 'PLATAFORMA',
    icon: LayoutGrid,
    modules: ['dashboard', 'properties', 'residents'],
  },
  {
    id: 'operacion',
    label: 'OPERACION',
    icon: Settings2,
    modules: ['communications', 'payments', 'accounting', 'reservations', 'pqrs', 'maintenance', 'security', 'security_control'],
  },
  {
    id: 'documentos',
    label: 'DOCUMENTOS',
    icon: FolderOpen,
    modules: ['documents', 'marketplace'],
  },
  {
    id: 'inteligencia',
    label: 'INTELIGENCIA',
    icon: BrainCircuit,
    modules: ['ai_copilot', 'analytics'],
  },
  {
    id: 'administracion',
    label: 'ADMINISTRACION',
    icon: UserCog,
    modules: ['settings', 'support'],
  },
];

export const SIDEBAR_DEFAULT_SECTION: SidebarSectionId = 'plataforma';

const ROLE_MODULE_LABELS: Partial<Record<RoleId, Partial<Record<ModuleConfig['id'], string>>>> = {
  super_admin: {
    dashboard: 'Dashboard Corporativo',
    ai_copilot: 'IA Copiloto PH',
    settings: 'Configuracion Global',
    support: 'Soporte Global',
  },
  admin: {
    dashboard: 'Dashboard del Conjunto',
    settings: 'Configuracion del Conjunto',
    support: 'Centro de Ayuda',
  },
};

export const getSidebarModuleLabel = (
  roleId: RoleId,
  moduleId: ModuleConfig['id'],
  fallbackLabel: string,
): string => {
  return ROLE_MODULE_LABELS[roleId]?.[moduleId] ?? fallbackLabel;
};
