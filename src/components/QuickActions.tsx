import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '@/store/useAuthStore';
import { getModulesForRole } from '@/types/modules';
import { LayoutDashboard, Building2, Users, MessageSquare, CreditCard, Calculator, CalendarDays, ClipboardList, Wrench, ShieldCheck, FileText, Store, Bot, BarChart3, Settings, LifeBuoy } from 'lucide-react';
import { memo } from 'react';

const ICON_MAP: Record<string, React.ElementType> = {
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

// Color scheme for each module - diverse and professional
const MODULE_COLORS: Record<string, { from: string; to: string }> = {
  dashboard: { from: '#0D4A3E', to: '#14B8A6' }, // Primary + Teal accent
  properties: { from: '#0D4A3E', to: '#219EBC' }, // Primary + Blue
  residents: { from: '#219EBC', to: '#0D4A3E' }, // Blue + Primary
  communications: { from: '#FB8500', to: '#FFB703' }, // Orange + Amber
  payments: { from: '#2563EB', to: '#1D4ED8' }, // Blue shades
  accounting: { from: '#7C3AED', to: '#6D28D9' }, // Purple shades
  reservations: { from: '#EC4899', to: '#DB2777' }, // Pink shades
  pqrs: { from: '#EF4444', to: '#DC2626' }, // Red shades
  maintenance: { from: '#F59E0B', to: '#D97706' }, // Yellow shades
  security: { from: '#10B981', to: '#059669' }, // Green shades
  documents: { from: '#8B5CF6', to: '#7C3AED' }, // Purple shades
  marketplace: { from: '#06B6D4', to: '#0891B2' }, // Cyan shades
  ai_copilot: { from: '#6366F1', to: '#4F46E5' }, // Indigo shades
  analytics: { from: '#F97316', to: '#EA580C' }, // Orange shades
  settings: { from: '#6B7280', to: '#4B5563' }, // Gray shades
  support: { from: '#14B8A6', to: '#0D9488' }, // Teal shades
};

export const QuickActions = () => {
  const navigate = useNavigate();
  const user = useAuthStore((s) => s.user);

  if (!user) return null;

  const modules = getModulesForRole(user.roleId);
  // Show modules that are NOT in the main navigation (hidden modules from 3-dot menu)
  const hiddenModules = modules.filter(m =>
    !['dashboard', 'properties', 'residents', 'communications', 'payments'].includes(m.id)
  );

  const quickModules = hiddenModules.length > 0 ? hiddenModules.slice(0, 4) : modules.slice(0, 4);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2, duration: 0.5 }}
      className="mb-8"
    >
      <h3 className="text-lg font-semibold text-foreground mb-4">
        {hiddenModules.length > 0 ? 'Opciones Adicionales' : 'Acciones Rápidas'}
      </h3>
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-3">
        {quickModules.map((module, index) => {
          const IconComponent = ICON_MAP[module.icon] || LayoutDashboard;
          const colors = MODULE_COLORS[module.id] || MODULE_COLORS.dashboard;

          return (
            <motion.button
              key={module.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.1 + index * 0.05 }}
              onClick={() => navigate(module.path)}
              whileHover={{ scale: 1.08, y: -4 }}
              whileTap={{ scale: 0.95 }}
              className="relative flex h-[90px] flex-col items-center justify-center gap-2 overflow-hidden rounded-[16px] border border-white/20 p-4 font-semibold text-white shadow-lg transition-all duration-200 hover:shadow-2xl"
              style={{
                backgroundImage: `linear-gradient(135deg, ${colors.from} 0%, ${colors.to} 100%)`,
              }}
            >
              {/* Background decorative */}
              <div className="absolute inset-0 bg-white/0 group-hover:bg-white/15 transition-all duration-300" />

              {/* Professional icon */}
              <div className="relative z-10 w-9 h-9 flex items-center justify-center rounded-lg bg-white/20 backdrop-blur-sm">
                <IconComponent className="w-5 h-5" />
              </div>

              {/* Label */}
              <span className="text-center text-xs leading-tight font-medium relative z-10 line-clamp-2">{module.label}</span>
            </motion.button>
          );
        })}
      </div>
    </motion.div>
  );
};

export default memo(QuickActions);
