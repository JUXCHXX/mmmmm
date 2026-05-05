export type RoleId =
  | 'super_admin'
  | 'admin'
  | 'consejo'
  | 'propietario'
  | 'arrendatario'
  | 'porteria'
  | 'proveedor';

export type AccessLevel = 'FULL_ACCESS' | 'READ_ONLY' | 'LIMITED' | 'OWN_DATA_ONLY' | 'NONE';

export interface Role {
  id: RoleId;
  label: string;
  description: string;
  icon: string;
  color: string;
}

export const ROLES: Record<RoleId, Role> = {
  super_admin: {
    id: 'super_admin',
    label: 'Super Administrador',
    description: 'Control total de la plataforma',
    icon: 'Shield',
    color: 'from-violet-500 to-purple-600',
  },
  admin: {
    id: 'admin',
    label: 'Administrador',
    description: 'Gestión operativa del conjunto',
    icon: 'Settings',
    color: 'from-blue-500 to-cyan-500',
  },
  consejo: {
    id: 'consejo',
    label: 'Consejo de Administración',
    description: 'Vista estratégica y ejecutiva',
    icon: 'Users',
    color: 'from-emerald-500 to-teal-500',
  },
  propietario: {
    id: 'propietario',
    label: 'Propietario',
    description: 'Sus unidades, pagos y reservas',
    icon: 'Home',
    color: 'from-amber-500 to-orange-500',
  },
  arrendatario: {
    id: 'arrendatario',
    label: 'Arrendatario',
    description: 'Solo sus datos y servicios básicos',
    icon: 'Key',
    color: 'from-rose-500 to-pink-500',
  },
  porteria: {
    id: 'porteria',
    label: 'Portería / Seguridad',
    description: 'Panel control room',
    icon: 'ShieldCheck',
    color: 'from-slate-500 to-gray-600',
  },
  proveedor: {
    id: 'proveedor',
    label: 'Proveedor',
    description: 'Órdenes de trabajo y servicios',
    icon: 'Wrench',
    color: 'from-indigo-500 to-blue-600',
  },
};
