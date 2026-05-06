import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useEffect, useState } from 'react';
import { useAuthStore } from '@/store/useAuthStore';
import { getModulesForRole } from '@/types/modules';
import { LayoutDashboard, LogOut } from 'lucide-react';
import {
  MODULE_ICON_MAP,
  SIDEBAR_DEFAULT_SECTION,
  SIDEBAR_SECTIONS,
  getSidebarModuleLabel,
  type SidebarSectionId,
} from './sidebarConfig';

const Sidebar = () => {
  const user = useAuthStore((s) => s.user);
  const logout = useAuthStore((s) => s.logout);
  const navigate = useNavigate();
  const location = useLocation();
  const [collapsed] = useState(false);
  const [expandedSection, setExpandedSection] = useState<SidebarSectionId | null>(SIDEBAR_DEFAULT_SECTION);

  if (!user) return null;

  let modules = getModulesForRole(user.roleId);

  if (user.roleId === 'super_admin') {
    modules = modules.filter((m) => !['knowledge', 'audit'].includes(m.id));
  }

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const getCurrentSection = (): SidebarSectionId => {
    for (const section of SIDEBAR_SECTIONS) {
      const hasModule = section.modules.some((moduleId) => {
        const module = modules.find((mod) => mod.id === moduleId);
        return module && location.pathname.includes(module.path);
      });

      if (hasModule) return section.id;
    }

    return SIDEBAR_DEFAULT_SECTION;
  };

  const toggleSection = (sectionId: SidebarSectionId) => {
    setExpandedSection((previous) => (previous === sectionId ? null : sectionId));
  };

  useEffect(() => {
    const currentSection = getCurrentSection();
    setExpandedSection((previous) => previous ?? currentSection);
  }, [location.pathname]);

  return (
    <motion.aside
      initial={{ x: -80 }}
      animate={{ x: 0, width: collapsed ? 80 : 220 }}
      transition={{ duration: 0.3 }}
      className="hidden lg:flex flex-col h-screen fixed left-0 top-0 z-40 bg-[#0D2B4E] border-r border-white/10"
    >
      <div className="flex flex-col items-center justify-center px-3 py-4 border-b border-white/10">
        {!collapsed && (
          <motion.h2
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.1 }}
            className="text-sm font-bold text-white tracking-widest"
          >
            BUNTY
          </motion.h2>
        )}
      </div>

      <nav className="flex-1 overflow-visible py-8 px-0 flex flex-col items-center justify-center space-y-12">
        {SIDEBAR_SECTIONS.map((section) => {
          const SectionIcon = section.icon;
          const sectionModules = section.modules
            .map((moduleId) => modules.find((module) => module.id === moduleId))
            .filter((module): module is (typeof modules)[number] => Boolean(module));
          const isExpanded = expandedSection === section.id;
          const hasActiveRoute = sectionModules.some((module) => location.pathname.includes(module.path));

          if (sectionModules.length === 0) return null;

          return (
            <div key={section.id} className="relative flex-none">
              <motion.button
                onClick={() => toggleSection(section.id)}
                className={`w-16 h-16 flex flex-none items-center justify-center rounded-full transition-all duration-200 relative border-2
                  ${isExpanded || hasActiveRoute
                    ? 'bg-[#00B5A0]/30 text-white shadow-lg scale-105 border-[#00B5A0]'
                    : 'bg-white/10 text-white/75 hover:text-white hover:bg-white/15 border-white/40 hover:border-white/60'
                  }
                `}
                title={section.label}
                whileHover={{ scale: 1.08 }}
                whileTap={{ scale: 0.96 }}
              >
                <SectionIcon className="w-10 h-10 flex-shrink-0" />
              </motion.button>

              <AnimatePresence>
                {isExpanded && (
                  <motion.span
                    initial={{ opacity: 0, scaleY: 0.6 }}
                    animate={{ opacity: 1, scaleY: 1 }}
                    exit={{ opacity: 0, scaleY: 0.6 }}
                    transition={{ duration: 0.15, ease: 'easeInOut' }}
                    className="absolute left-1/2 -translate-x-1/2 top-full mt-1 h-3 w-1 rounded-full bg-[#00B5A0]/80 shadow-[0_0_10px_rgba(0,181,160,0.5)] z-40"
                  />
                )}
              </AnimatePresence>

              <AnimatePresence>
                {isExpanded && (
                  <motion.div
                    initial={{ opacity: 0, y: -10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -10, scale: 0.95 }}
                    transition={{ duration: 0.2, ease: 'easeInOut' }}
                    className="absolute left-[calc(50%+68px)] top-full mt-5 w-[min(22rem,calc(100vw-2rem))] max-h-96 overflow-auto rounded-xl bg-white border border-black/8 shadow-lg z-50 p-3 -translate-x-1/2"
                  >
                    <div className="space-y-1">
                      <div className="px-2 py-2 text-center border-b border-black/8 mb-3">
                        <p className="text-sm font-bold text-slate-800 uppercase tracking-wider">
                          {section.label}
                        </p>
                      </div>

                      {sectionModules.map((module) => {
                        const Icon = MODULE_ICON_MAP[module.icon] || LayoutDashboard;
                        const displayLabel = getSidebarModuleLabel(user.roleId, module.id, module.label);

                        return (
                          <NavLink
                            key={module.id}
                            to={module.path}
                            className={({ isActive }) =>
                              `flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-semibold transition-all duration-200 group hover:scale-[1.02]
                              ${isActive
                                ? 'bg-[#14B8A6] text-white shadow-md'
                                : 'text-[#374151] bg-transparent hover:bg-[#F9FAFB] rounded-lg'
                              }
                            `
                            }
                          >
                            <Icon className="w-5 h-5 flex-shrink-0 opacity-85 group-hover:opacity-100" />
                            <span className="truncate">{displayLabel}</span>
                          </NavLink>
                        );
                      })}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}
      </nav>

      <div className="border-t border-white/10" />

      <div className="p-3 flex justify-center">
        <motion.button
          whileHover={{ scale: 1.08 }}
          whileTap={{ scale: 0.96 }}
          onClick={handleLogout}
          className="w-14 h-14 flex items-center justify-center rounded-full bg-red-500/20 text-red-200 hover:bg-red-500/30 hover:text-white transition-all border border-red-400/50 hover:border-red-400"
          title="Cerrar Sesion"
        >
          <LogOut className="w-7 h-7 flex-shrink-0" />
        </motion.button>
      </div>
    </motion.aside>
  );
};

export default Sidebar;
