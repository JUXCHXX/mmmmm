import { create } from 'zustand';
import type { RoleId } from '@/types/roles';

interface User {
  id: string;
  name: string;
  email: string;
  avatar: string;
  roleId: RoleId;
  condoId?: string;
  condoName?: string;
  unitId?: string;
  unitIds?: string[];
  providerName?: string;
}

const MOCK_USERS: Record<RoleId, User> = {
  super_admin: { id: '1', name: 'Carlos Mendoza', email: 'demo.superadmin@example.com', avatar: 'CM', roleId: 'super_admin' },
  admin: { id: '2', name: 'María López', email: 'demo.admin@example.com', avatar: 'ML', roleId: 'admin', condoId: 'CONDO1', unitIds: ['P1', 'P2', 'P3', 'P4', 'P5', 'P6', 'P11', 'P12', 'P13'] },
  consejo: { id: '3', name: 'Roberto Díaz', email: 'demo.consejo@example.com', avatar: 'RD', roleId: 'consejo', condoId: 'CONDO1' },
  propietario: { id: '4', name: 'Ana García', email: 'demo.propietario@example.com', avatar: 'AG', roleId: 'propietario', unitId: 'P4', condoId: 'CONDO1', unitIds: ['P4', 'P6'] },
  arrendatario: { id: '5', name: 'Luis Torres', email: 'demo.arrendatario@example.com', avatar: 'LT', roleId: 'arrendatario', unitId: 'P6', condoId: 'CONDO1' },
  porteria: { id: '6', name: 'Pedro Ramírez', email: 'demo.porteria@example.com', avatar: 'PR', roleId: 'porteria', condoId: 'CONDO1' },
  proveedor: { id: '7', name: 'ServiFix S.A.S', email: 'demo.proveedor@example.com', avatar: 'SF', roleId: 'proveedor', providerName: 'ServiFix S.A.S' },
};

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  login: (email?: string, password?: string, roleId?: RoleId) => void;
  logout: () => void;
  switchRole: (roleId: RoleId) => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isAuthenticated: false,
  login: (email = 'demo@example.com', password = 'password', roleId?: RoleId) => {
    // Auto-detect role from email or use provided roleId
    let detectedRole = roleId;
    if (!detectedRole) {
      detectedRole = email.includes('superadmin') ? 'super_admin' :
                     email.includes('admin') ? 'admin' :
                     email.includes('porteria') ? 'porteria' :
                     email.includes('propietario') ? 'propietario' :
                     email.includes('arrendatario') ? 'arrendatario' :
                     'consejo' as RoleId;
    }
    
    if (MOCK_USERS[detectedRole]) {
      set({ user: MOCK_USERS[detectedRole], isAuthenticated: true });
    }
  },
  logout: () => set({ user: null, isAuthenticated: false }),
  switchRole: (roleId: RoleId) => set({ 
    user: MOCK_USERS[roleId] || null,
    isAuthenticated: !!MOCK_USERS[roleId]
  }),
}));

