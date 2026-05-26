import { useEffect, useMemo, useState } from 'react';
import { FEATURE_CATALOG } from '@/constants/featureCatalog';
import type { ModuleId } from '@/types/modules';
import type { AccessLevel, RoleId } from '@/types/roles';
import type { FeatureDefinition, FeatureId, FeaturePreset } from '@/types/features';
import { useAuthStore } from '@/store/useAuthStore';
import { useRoleAccess } from '@/hooks/useRoleAccess';
import { useFeatureAction } from '@/hooks/useFeatureAction';
import { getFeatureActionComponent } from '@/actions/featureActions';
import { toast } from '@/hooks/use-toast';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';
import {
  ArrowRight,
  Bot,
  CalendarDays,
  CheckCircle2,
  Download,
  Edit3,
  Filter,
  FileText,
  Layers,
  Plus,
  RefreshCw,
  Search,
  ShieldCheck,
  Trash2,
  Wrench,
  Zap,
  Lock,
  Unlock,
  Eye,
} from 'lucide-react';
import { FeatureWorkspaceFallback } from '@/components/FeatureWorkspaceFallback';

interface FeatureRecord {
  id: string;
  title: string;
  detail: string;
  status: string;
}

interface FeatureCapabilities {
  canCreate: boolean;
  canEdit: boolean;
  canDelete: boolean;
}

interface FeatureGroup {
  id: string;
  label: string;
  features: FeatureDefinition[];
}

const ACCESS_LABELS: Record<AccessLevel, string> = {
  FULL_ACCESS: 'Acceso completo',
  LIMITED: 'Acceso parcial',
  READ_ONLY: 'Solo lectura',
  OWN_DATA_ONLY: 'Solo tus datos',
  NONE: 'Sin acceso',
};

const PRESET_LABELS: Record<FeaturePreset, string> = {
  catalog: 'Catalogo',
  communication: 'Comunicacion',
  finance: 'Finanzas',
  reservation: 'Reservas',
  ticket: 'Tickets',
  maintenance: 'Mantenimiento',
  security: 'Seguridad',
  documents: 'Documentos',
  marketplace: 'Marketplace',
  insights: 'Analitica',
  ai: 'IA',
  settings: 'Configuracion',
  support: 'Soporte',
};

const PRESET_ICONS: Record<FeaturePreset, typeof Layers> = {
  catalog: Layers,
  communication: FileText,
  finance: Download,
  reservation: CalendarDays,
  ticket: FileText,
  maintenance: Wrench,
  security: ShieldCheck,
  documents: FileText,
  marketplace: Layers,
  insights: Filter,
  ai: Bot,
  settings: Edit3,
  support: CheckCircle2,
};

const FEATURE_GROUP_ORDER = [
  { id: 'operation', label: '⚙️ Operación' },
  { id: 'control', label: '🔍 Control' },
  { id: 'automation', label: '🤖 Automatización' },
  { id: 'configuration', label: '⚡ Configuración' },
  { id: 'analysis', label: '📊 Análisis' },
] as const;

const getAccessColor = (accessLevel: AccessLevel) => {
  const colors: Record<AccessLevel, { bg: string; border: string; text: string; dot: string; icon: string }> = {
    FULL_ACCESS: { bg: 'bg-emerald-50', border: 'border-emerald-200', text: 'text-emerald-700', dot: 'bg-emerald-500', icon: 'text-emerald-500' },
    LIMITED: { bg: 'bg-blue-50', border: 'border-blue-200', text: 'text-blue-700', dot: 'bg-blue-500', icon: 'text-blue-500' },
    READ_ONLY: { bg: 'bg-amber-50', border: 'border-amber-200', text: 'text-amber-700', dot: 'bg-amber-500', icon: 'text-amber-500' },
    OWN_DATA_ONLY: { bg: 'bg-purple-50', border: 'border-purple-200', text: 'text-purple-700', dot: 'bg-purple-500', icon: 'text-purple-500' },
    NONE: { bg: 'bg-gray-50', border: 'border-gray-200', text: 'text-gray-700', dot: 'bg-gray-400', icon: 'text-gray-400' },
  };
  return colors[accessLevel];
};

const FeatureCard = ({
  feature,
  roleId,
  onSelect,
  isSelected,
  pendingCount,
  onExecuteAction,
}: {
  feature: FeatureDefinition;
  roleId: RoleId;
  onSelect: () => void;
  isSelected: boolean;
  pendingCount: number;
  onExecuteAction: ReturnType<typeof useFeatureAction>['executeAction'];
}) => {
  const accessLevel = feature.access[roleId] ?? 'NONE';
  const Icon = PRESET_ICONS[feature.preset];
  const colors = getAccessColor(accessLevel);
  const isLocked = accessLevel === 'NONE';

  const handleClick = () => {
    onSelect();
    if (accessLevel !== 'NONE') {
      onExecuteAction({
        featureId: feature.id,
        accessLevel,
        title: feature.label,
      });
    } else {
      onExecuteAction({
        featureId: feature.id,
        accessLevel: 'NONE',
        title: feature.label,
      });
    }
  };

  return (
    <motion.button
      layout
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      whileHover={!isLocked ? { y: -6 } : {}}
      whileTap={!isLocked ? { scale: 0.98 } : {}}
      onClick={handleClick}
      disabled={isLocked}
      className={cn(
        'group relative rounded-xl p-4 border-2 transition-all text-left overflow-hidden',
        isSelected
          ? 'border-[#1E7EC8] bg-gradient-to-br from-[#1E7EC8]/15 to-[#00B5A0]/5 shadow-lg ring-2 ring-[#1E7EC8]/20'
          : isLocked
          ? `${colors.bg} border-gray-300 opacity-60 cursor-not-allowed`
          : `${colors.bg} ${colors.border} border hover:shadow-md hover:border-[#1E7EC8]/40`,
        'disabled:cursor-not-allowed'
      )}
    >
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-white/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

      {/* Content */}
      <div className="relative z-10">
        {/* Header */}
        <div className="flex items-start justify-between mb-3 gap-2">
          <motion.div
            whileHover={{ scale: 1.1, rotate: 5 }}
            className={cn(
              'h-10 w-10 rounded-lg flex items-center justify-center transition-all flex-shrink-0',
              isSelected
                ? 'bg-[#1E7EC8] text-white shadow-lg'
                : isLocked
                ? 'bg-gray-200 text-gray-500'
                : `${colors.bg} ${colors.icon}`
            )}
          >
            {isLocked ? (
              <Lock className="h-5 w-5" />
            ) : (
              <Icon className="h-5 w-5" />
            )}
          </motion.div>

          <div className="flex items-center gap-2">
            {pendingCount > 0 && !isLocked && (
              <motion.span
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="inline-flex items-center justify-center h-5 w-5 rounded-full bg-orange-500 text-white text-xs font-bold shadow-md"
              >
                {pendingCount}
              </motion.span>
            )}
            {isSelected && !isLocked && (
              <motion.div
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                className="h-5 w-5 rounded-full bg-emerald-500 flex items-center justify-center text-white shadow-md"
              >
                <CheckCircle2 className="h-4 w-4" />
              </motion.div>
            )}
          </div>
        </div>

        {/* Title */}
        <h3
          className={cn(
            'font-bold text-sm leading-tight mb-2 line-clamp-2 transition-colors h-8 flex items-start',
            isSelected ? 'text-[#0D2B4E]' : isLocked ? 'text-gray-600' : 'text-gray-800'
          )}
        >
          {feature.label}
        </h3>

        {/* Access Status */}
        <div className="flex items-center gap-2 mb-3">
          <motion.div
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
            className={cn('h-2 w-2 rounded-full', colors.dot)}
          />
          <span className={cn('text-xs font-semibold', colors.text)}>
            {ACCESS_LABELS[accessLevel]}
          </span>
        </div>

        {/* Badges */}
        <div className="flex flex-wrap gap-1 mb-3">
          <span className="text-xs px-2 py-1 rounded-md bg-white/80 text-gray-700 font-medium shadow-sm">
            {feature.moduleCode}
          </span>
          <span className="text-xs px-2 py-1 rounded-md bg-white/80 text-gray-600 shadow-sm">
            {PRESET_LABELS[feature.preset]}
          </span>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between pt-3 border-t border-gray-200/40">
          <span className="text-xs text-gray-500 font-medium">
            {accessLevel === 'FULL_ACCESS' ? '✓ Operativo' : accessLevel === 'NONE' ? 'Bloqueado' : 'Disponible'}
          </span>
          <ArrowRight
            className={cn(
              'h-4 w-4 transition-all duration-300',
              isSelected ? 'text-[#1E7EC8] translate-x-1' : 'text-gray-400 group-hover:translate-x-0.5 group-hover:text-[#1E7EC8]'
            )}
          />
        </div>
      </div>

      {/* Selection ring animation */}
      {isSelected && (
        <motion.div
          layoutId="featureRing"
          className="absolute inset-0 rounded-xl pointer-events-none"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        />
      )}
    </motion.button>
  );
};

const getFeatureGroupId = (feature: FeatureDefinition) => {
  const label = feature.label.toLowerCase();

  if (feature.preset === 'insights') return 'analysis';
  if (feature.preset === 'ai') return 'automation';

  if (
    label.includes('config') ||
    label.includes('politic') ||
    label.includes('regla') ||
    label.includes('plantilla') ||
    label.includes('feature flag') ||
    label.includes('catalog') ||
    label.includes('calendario') ||
    label.includes('integraci')
  ) {
    return 'configuration';
  }

  if (
    label.includes('alert') ||
    label.includes('historial') ||
    label.includes('trazabilidad') ||
    label.includes('seguimiento') ||
    label.includes('control') ||
    label.includes('validaci') ||
    label.includes('vencim') ||
    label.includes('bloque') ||
    label.includes('bitacora')
  ) {
    return 'control';
  }

  if (
    label.includes('auto') ||
    label.includes('programaci') ||
    label.includes('simulador') ||
    label.includes('predic') ||
    label.includes('ocr') ||
    label.includes('api') ||
    label.includes('digital')
  ) {
    return 'automation';
  }

  if (
    label.includes('analit') ||
    label.includes('analisis') ||
    label.includes('dashboard') ||
    label.includes('indicador') ||
    label.includes('comparativo')
  ) {
    return 'analysis';
  }

  return 'operation';
};

export const EnhancedModuleFeatureHub = ({ moduleId }: { moduleId: ModuleId }) => {
  if (moduleId === 'dashboard') {
    return null;
  }

  const user = useAuthStore((state) => state.user);
  const roleId = user?.roleId ?? 'propietario';
  const moduleFeatures = (FEATURE_CATALOG as Partial<Record<ModuleId, FeatureDefinition[]>>)[moduleId] ?? [];
  const { executeAction, modalState, closeModal } = useFeatureAction();

  const [search, setSearch] = useState('');
  const [selectedFeatureId, setSelectedFeatureId] = useState<FeatureId | null>(null);

  const filteredFeatures = useMemo(() => {
    const normalized = search.trim().toLowerCase();
    if (!normalized) return moduleFeatures;

    return moduleFeatures.filter((feature) => feature.label.toLowerCase().includes(normalized));
  }, [moduleFeatures, search]);

  const groupedFeatures = useMemo<FeatureGroup[]>(() => {
    const groups = new Map<string, FeatureDefinition[]>();

    filteredFeatures.forEach((feature) => {
      const groupId = getFeatureGroupId(feature);
      const current = groups.get(groupId) ?? [];
      current.push(feature);
      groups.set(groupId, current);
    });

    return FEATURE_GROUP_ORDER
      .map((group) => ({
        id: group.id,
        label: group.label,
        features: groups.get(group.id) ?? [],
      }))
      .filter((group) => group.features.length > 0);
  }, [filteredFeatures]);

  useEffect(() => {
    if (!moduleFeatures.length) {
      setSelectedFeatureId(null);
      return;
    }

    if (!selectedFeatureId || !moduleFeatures.some((feature) => feature.id === selectedFeatureId)) {
      setSelectedFeatureId(moduleFeatures[0]?.id ?? null);
    }
  }, [moduleFeatures, selectedFeatureId]);

  if (!user || !moduleFeatures.length) {
    return null;
  }

  const accessibleCount = moduleFeatures.filter((f) => f.access[roleId] !== 'NONE').length;
  const ActiveActionComponent = modalState.featureId
    ? getFeatureActionComponent(modalState.featureId)
    : null;

  return (
    <>
      <section className="mb-8 space-y-4">
        {/* Header Section */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="surface-card p-5 md:p-6 rounded-2xl"
        >
          <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
            <div>
              <h2 className="text-2xl font-bold bg-gradient-to-r from-[#0D2B4E] to-[#1E7EC8] bg-clip-text text-transparent">
                📦 Funciones del Módulo
              </h2>
              <p className="mt-2 text-sm text-[#52627A]">
                {accessibleCount} de {moduleFeatures.length} funciones disponibles • Selecciona cada una para acceder
              </p>
            </div>

            <div className="relative w-full xl:max-w-md">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#6B7280]" />
              <Input
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Buscar función..."
                className="h-11 rounded-xl border-2 border-[#D8E4F2] bg-white pl-10 shadow-sm placeholder:text-[#8A94A6] focus:border-[#1E7EC8]"
              />
            </div>
          </div>
        </motion.div>

        {/* Features Grid */}
        <motion.div
          layout
          className="surface-card p-5 md:p-6 rounded-2xl"
        >
          <div className="space-y-6">
            {groupedFeatures.map((group, groupIndex) => (
              <motion.div
                key={group.id}
                layout
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: groupIndex * 0.05 }}
                className="space-y-4"
              >
                {/* Group Header */}
                <div className="flex items-center gap-3 px-2">
                  <div className="h-px flex-1 bg-gradient-to-r from-[#E3EBF5] to-transparent" />
                  <span className="text-sm font-bold uppercase tracking-wider text-[#7B8797] px-3 py-1 rounded-full bg-gradient-to-r from-[#1E7EC8]/5 to-transparent">
                    {group.label} ({group.features.length})
                  </span>
                  <div className="h-px flex-1 bg-gradient-to-l from-[#E3EBF5] to-transparent" />
                </div>

                {/* Features Grid */}
                <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5">
                  {group.features.map((feature, index) => {
                    const isSelected = feature.id === selectedFeatureId;
                    const pendingCount = Math.random() > 0.7 ? Math.floor(Math.random() * 3) + 1 : 0;

                    return (
                      <FeatureCard
                        key={feature.id}
                        feature={feature}
                        roleId={roleId}
                        onSelect={() => setSelectedFeatureId(feature.id)}
                        isSelected={isSelected}
                        pendingCount={pendingCount}
                        onExecuteAction={executeAction}
                      />
                    );
                  })}
                </div>
              </motion.div>
            ))}

            {!filteredFeatures.length && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="rounded-2xl border-2 border-dashed border-[#D8E4F2] bg-[#F8FBFF] px-6 py-12 text-center"
              >
                <Search className="h-12 w-12 mx-auto text-[#CBD8EA] mb-3" />
                <p className="text-sm font-semibold text-[#52627A]">No encontramos esa función</p>
                <p className="text-xs text-[#8A94A6] mt-1">Intenta con otros términos de búsqueda</p>
              </motion.div>
            )}
          </div>
        </motion.div>

        {/* Info Footer */}
        {accessibleCount < moduleFeatures.length && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="surface-card p-4 md:p-5 rounded-xl bg-blue-50 border border-blue-200"
          >
            <div className="flex items-start gap-3">
              <Unlock className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold text-blue-900 text-sm">
                  {moduleFeatures.length - accessibleCount} funciones bloqueadas
                </p>
                <p className="text-xs text-blue-700 mt-1">
                  Según tu perfil, algunas funciones están restringidas o en modo consulta.
                </p>
              </div>
            </div>
          </motion.div>
        )}
      </section>

      {/* Feature Modal */}
      {modalState.isOpen && ActiveActionComponent && modalState.featureId ? (
        <ActiveActionComponent
          featureId={modalState.featureId}
          title={modalState.title}
          accessLevel={modalState.accessLevel}
          moduleCode={modalState.moduleCode}
          roleId={roleId}
          onClose={closeModal}
        />
      ) : null}

      {modalState.isOpen && !ActiveActionComponent && modalState.featureId && (
        <FeatureWorkspaceFallback
          featureId={modalState.featureId}
          title={modalState.title}
          accessLevel={modalState.accessLevel}
          moduleCode={modalState.moduleCode}
          roleId={roleId}
          onClose={closeModal}
        />
      )}
    </>
  );
};

export default EnhancedModuleFeatureHub;
