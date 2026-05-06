import { Outlet, Navigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '@/store/useAuthStore';
import { useEffect } from 'react';
import TopBar from './TopBar';
import Sidebar from './Sidebar';
import BottomNav from './BottomNav';
import { ACTIVE_CONDO_NAME } from '@/constants/branding';
import ModuleFeatureHub from '@/components/ModuleFeatureHub';
import type { ModuleId } from '@/types/modules';

const MODULE_ROUTE_MAP: Array<{ prefix: string; moduleId: ModuleId }> = [
  { prefix: '/propiedades', moduleId: 'properties' },
  { prefix: '/residentes', moduleId: 'residents' },
  { prefix: '/comunicaciones', moduleId: 'communications' },
  { prefix: '/pagos', moduleId: 'payments' },
  { prefix: '/contabilidad', moduleId: 'accounting' },
  { prefix: '/reservas', moduleId: 'reservations' },
  { prefix: '/pqrs', moduleId: 'pqrs' },
  { prefix: '/mantenimiento', moduleId: 'maintenance' },
  { prefix: '/seguridad', moduleId: 'security' },
  { prefix: '/documentos', moduleId: 'documents' },
  { prefix: '/marketplace', moduleId: 'marketplace' },
  { prefix: '/ia-copiloto', moduleId: 'ai_copilot' },
  { prefix: '/analitica', moduleId: 'analytics' },
  { prefix: '/configuracion', moduleId: 'settings' },
  { prefix: '/soporte', moduleId: 'support' },
  { prefix: '/inicio', moduleId: 'dashboard' },
];

const AppLayout = () => {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const user = useAuthStore((s) => s.user);
  const location = useLocation();

  const currentModule = MODULE_ROUTE_MAP.find((route) => location.pathname.startsWith(route.prefix))?.moduleId;

  // Force re-render cuando cambia user (role switch)
  useEffect(() => {
    console.log('Role changed:', user?.roleId);
  }, [user]);

  if (!isAuthenticated) return <Navigate to="/" replace />;

  return (
    <div className="relative min-h-screen overflow-hidden bg-[#F4F7FB]">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute top-0 left-0 h-72 w-72 rounded-full bg-[#2DC89A]/12 blur-3xl" />
        <div className="absolute top-24 right-0 h-80 w-80 rounded-full bg-[#1A3F8F]/10 blur-3xl" />
      </div>

      {/* Fixed elements */}
      <TopBar />
      <Sidebar />
      <BottomNav />

      {/* Main content - Ajustado para nuevo sidebar compacto */}
      <main className="relative z-[1] min-h-screen pb-28 pt-16 transition-all duration-300 sm:pb-32 lg:ml-56 lg:pb-0">
        <div className="mx-auto max-w-7xl p-4 md:p-6 lg:p-8">
          {/* Role indicator */}
          {user && (
            <div className="mb-6">
              <div className="surface-card inline-flex flex-wrap items-center gap-3 px-4 py-2 text-xs font-medium text-[#52627A]">
                <span className="status-badge-active inline-flex items-center rounded-full px-2.5 py-1 text-[11px] font-semibold uppercase tracking-[0.08em]">
                  {ACTIVE_CONDO_NAME}
                </span>
                <span>
                  Rol activo:{' '}
                  <span className="font-bold text-[#0D2654]">{user.roleId.toUpperCase().replace('_', ' ')}</span>
                </span>
                <span className="text-[#2DC89A]">(Ctrl+M para cambiar)</span>
              </div>
            </div>
          )}

          {currentModule && <ModuleFeatureHub moduleId={currentModule} />}

          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default AppLayout;
