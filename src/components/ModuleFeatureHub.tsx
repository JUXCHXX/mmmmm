import { useEffect, useMemo, useState } from 'react';
import { FEATURE_CATALOG } from '@/constants/featureCatalog';
import type { ModuleId } from '@/types/modules';
import type { AccessLevel, RoleId } from '@/types/roles';
import type { FeatureDefinition, FeatureId, FeaturePreset } from '@/types/features';
import { useAuthStore } from '@/store/useAuthStore';
import { toast } from '@/hooks/use-toast';
import {
  Bot,
  CalendarDays,
  CheckCircle2,
  Download,
  Edit3,
  Filter,
  FileText,
  Layers,
  Plus,
  Search,
  ShieldCheck,
  Trash2,
  Wrench,
} from 'lucide-react';

interface DemoRow {
  id: string;
  title: string;
  subtitle: string;
  status: string;
}

const ACCESS_BADGES: Record<AccessLevel, string> = {
  FULL_ACCESS: 'bg-emerald-500/15 text-emerald-700 border-emerald-200',
  LIMITED: 'bg-amber-500/15 text-amber-700 border-amber-200',
  READ_ONLY: 'bg-sky-500/15 text-sky-700 border-sky-200',
  OWN_DATA_ONLY: 'bg-violet-500/15 text-violet-700 border-violet-200',
  NONE: 'bg-slate-500/15 text-slate-700 border-slate-200',
};

const ACCESS_LABELS: Record<AccessLevel, string> = {
  FULL_ACCESS: 'Completo',
  LIMITED: 'Parcial',
  READ_ONLY: 'Solo lectura',
  OWN_DATA_ONLY: 'Solo propio',
  NONE: 'Sin acceso',
};

const PRESET_STATS: Record<FeaturePreset, string[]> = {
  catalog: ['Registros', 'Actualizaciones', 'Alertas'],
  communication: ['Publicaciones', 'Lecturas', 'Pendientes'],
  finance: ['Monto demo', 'Alertas', 'Casos activos'],
  reservation: ['Solicitudes', 'Disponibilidad', 'Validaciones'],
  ticket: ['Tickets', 'Tiempo medio', 'Semáforos'],
  maintenance: ['Activos', 'OT activas', 'Renovaciones'],
  security: ['Ingresos hoy', 'Validaciones', 'Alertas'],
  documents: ['Documentos', 'Versiones', 'Vigencias'],
  marketplace: ['Servicios', 'Solicitudes', 'Conversión'],
  insights: ['Indicadores', 'Variación', 'Riesgos'],
  ai: ['Consultas', 'Sugerencias', 'Confianza'],
  settings: ['Reglas', 'Parámetros', 'Cambios'],
  support: ['Recursos', 'Ayudas', 'Seguimientos'],
};

const ROLE_SCOPES: Record<RoleId, string> = {
  super_admin: 'Acceso transversal de demo sobre todo el conjunto y parametrización completa.',
  admin: 'Alcance operativo del conjunto con edición amplia y controles administrativos.',
  consejo: 'Alcance estratégico y consultivo con foco en seguimiento, validación y control no destructivo.',
  propietario: 'Alcance sobre unidades, solicitudes y trazabilidad relacionada con su operación.',
  arrendatario: 'Alcance sobre su experiencia de uso, reservas, solicitudes y consultas asociadas.',
  porteria: 'Alcance operativo de registro, validación, check-in y control en tiempo real.',
  proveedor: 'Alcance sobre servicios asignados, avances, evidencias y atención comercial propia.',
};

const MODULE_TITLES: Partial<Record<ModuleId, string>> = {
  properties: 'M01 · Gestión de propiedades y unidades',
  residents: 'M02 · Gestión de residentes y censo',
  communications: 'M03 · Comunicaciones y comunidad',
  payments: 'M04 · Pagos, cartera y recaudo',
  accounting: 'M05 · Contabilidad básica e integración',
  reservations: 'M06 · Reservas de zonas comunes',
  pqrs: 'M07 · Gestión de PQRS y tickets',
  maintenance: 'M08 · Gestión de mantenimiento y activos',
  security: 'M09 · Seguridad y control de acceso',
  documents: 'M10 · Gestión documental',
  marketplace: 'M11 · Marketplace y servicios',
  dashboard: 'M12 · Panel del Administrador',
  ai_copilot: 'M13 · Módulo IA Copiloto PH',
  analytics: 'M14 · Analítica, BI y reportes',
  settings: 'M15 · Configuración y parametrización',
  support: 'M16 · Soporte, ayuda y centro de conocimiento',
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

const seededValue = (seed: string, min: number, span: number) => {
  const total = seed.split('').reduce((accumulator, char) => accumulator + char.charCodeAt(0), 0);
  return min + (total % span);
};

const buildStatValue = (feature: FeatureDefinition, index: number) => {
  const raw = seededValue(`${feature.id}-${index}`, 3, 87);
  if (feature.preset === 'finance') return `$${raw}M`;
  if (feature.preset === 'insights') return `${raw}%`;
  if (feature.preset === 'ai') return `${80 + (raw % 19)}%`;
  if (feature.preset === 'support') return `${raw} pts`;
  return String(raw);
};

const buildRows = (feature: FeatureDefinition): DemoRow[] => [
  {
    id: `${feature.id}-1`,
    title: `${feature.label} · caso principal`,
    subtitle: 'Torre A · Actualizado hace 10 min',
    status: feature.preset === 'finance' ? 'En seguimiento' : 'Activo',
  },
  {
    id: `${feature.id}-2`,
    title: `${feature.label} · revisión interna`,
    subtitle: 'Bloque 2 · Responsable asignado',
    status: feature.preset === 'security' ? 'Validado' : 'Pendiente',
  },
  {
    id: `${feature.id}-3`,
    title: `${feature.label} · excepción controlada`,
    subtitle: 'Flujo mock con datos demo',
    status: feature.preset === 'documents' ? 'Versionado' : 'En análisis',
  },
];

const getLimitedCrud = (preset: FeaturePreset, roleId: RoleId): Array<'create' | 'edit'> => {
  if (roleId === 'admin') return ['create', 'edit'];
  if (roleId === 'consejo') {
    return preset === 'communication' || preset === 'documents' ? ['edit'] : [];
  }
  if (roleId === 'porteria') {
    return preset === 'security' || preset === 'reservation' || preset === 'maintenance'
      ? ['create', 'edit']
      : ['edit'];
  }
  if (roleId === 'proveedor') {
    return preset === 'maintenance' || preset === 'marketplace' ? ['create', 'edit'] : ['edit'];
  }
  if (roleId === 'propietario' || roleId === 'arrendatario') {
    return preset === 'reservation' ||
      preset === 'ticket' ||
      preset === 'communication' ||
      preset === 'support' ||
      preset === 'marketplace' ||
      preset === 'finance'
      ? ['create', 'edit']
      : ['edit'];
  }
  return ['edit'];
};

const getAccessSummary = (accessLevel: AccessLevel, roleId: RoleId) => {
  if (accessLevel === 'FULL_ACCESS') {
    return 'Puedes crear, editar, eliminar y simular el flujo completo con datos mock.';
  }
  if (accessLevel === 'READ_ONLY') {
    return 'Vista visible para consulta. Los botones de crear, editar y eliminar quedan deshabilitados.';
  }
  if (accessLevel === 'LIMITED' || accessLevel === 'OWN_DATA_ONLY') {
    return `Vista parcial para ${roleId.replace('_', ' ')} con acciones limitadas según su alcance operativo.`;
  }
  return 'Sin acceso.';
};

export const ModuleFeatureHub = ({ moduleId }: { moduleId: ModuleId }) => {
  const user = useAuthStore((state) => state.user);
  const roleId = user?.roleId ?? 'propietario';
  const moduleFeatures = (FEATURE_CATALOG as Partial<Record<ModuleId, FeatureDefinition[]>>)[moduleId] ?? [];

  const accessibleFeatures = useMemo(
    () => moduleFeatures.filter((feature) => feature.access[roleId] !== 'NONE'),
    [moduleFeatures, roleId],
  );

  const [search, setSearch] = useState('');
  const [selectedFeatureId, setSelectedFeatureId] = useState<FeatureId | null>(null);
  const [rowsByFeature, setRowsByFeature] = useState<Record<FeatureId, DemoRow[]>>({});
  const [showOnlyHighlighted, setShowOnlyHighlighted] = useState(false);

  const filteredFeatures = useMemo(() => {
    return accessibleFeatures.filter((feature) =>
      feature.label.toLowerCase().includes(search.toLowerCase()),
    );
  }, [accessibleFeatures, search]);

  useEffect(() => {
    if (!filteredFeatures.length) {
      setSelectedFeatureId(null);
      return;
    }

    if (!selectedFeatureId || !filteredFeatures.some((feature) => feature.id === selectedFeatureId)) {
      setSelectedFeatureId(filteredFeatures[0].id);
    }
  }, [filteredFeatures, selectedFeatureId]);

  const selectedFeature = filteredFeatures.find((feature) => feature.id === selectedFeatureId) ?? filteredFeatures[0];
  const accessLevel = selectedFeature?.access[roleId] ?? 'NONE';
  const limitedCrud = selectedFeature ? getLimitedCrud(selectedFeature.preset, roleId) : [];

  useEffect(() => {
    if (!selectedFeature || rowsByFeature[selectedFeature.id]) return;
    setRowsByFeature((current) => ({
      ...current,
      [selectedFeature.id]: buildRows(selectedFeature),
    }));
  }, [selectedFeature, rowsByFeature]);

  if (!user || !moduleFeatures.length || !accessibleFeatures.length || !selectedFeature) {
    return null;
  }

  const rows = rowsByFeature[selectedFeature.id] ?? buildRows(selectedFeature);
  const visibleRows = showOnlyHighlighted ? rows.filter((row) => row.status !== 'Activo') : rows;
  const PresetIcon = PRESET_ICONS[selectedFeature.preset];

  const canCreate = accessLevel === 'FULL_ACCESS' || limitedCrud.includes('create');
  const canEdit = accessLevel === 'FULL_ACCESS' || limitedCrud.includes('edit');
  const canDelete = accessLevel === 'FULL_ACCESS';

  const updateRows = (updater: (currentRows: DemoRow[]) => DemoRow[]) => {
    setRowsByFeature((current) => ({
      ...current,
      [selectedFeature.id]: updater(current[selectedFeature.id] ?? buildRows(selectedFeature)),
    }));
  };

  const handleCreate = () => {
    if (!canCreate) return;
    updateRows((currentRows) => [
      {
        id: `${selectedFeature.id}-${Date.now()}`,
        title: `${selectedFeature.label} · nuevo registro demo`,
        subtitle: `Creado por ${user.name} en modo demo`,
        status: 'Nuevo',
      },
      ...currentRows,
    ]);
    toast({
      title: 'Registro demo creado',
      description: `Se agregó una entrada mock en ${selectedFeature.label}.`,
    });
  };

  const handleEdit = () => {
    if (!canEdit) return;
    updateRows((currentRows) =>
      currentRows.map((row, index) =>
        index === 0
          ? { ...row, title: `${row.title} · ajustado`, status: 'Ajustado' }
          : row,
      ),
    );
    toast({
      title: 'Edición simulada',
      description: `Se actualizó el primer registro mock de ${selectedFeature.label}.`,
    });
  };

  const handleDelete = () => {
    if (!canDelete) return;
    updateRows((currentRows) => currentRows.slice(1));
    toast({
      title: 'Eliminación simulada',
      description: `Se removió el primer registro mock de ${selectedFeature.label}.`,
    });
  };

  const handleExport = () => {
    toast({
      title: 'Exportación demo',
      description: `Se preparó un archivo mock para ${selectedFeature.label}.`,
    });
  };

  return (
    <section className="mt-8 rounded-[28px] border border-black/8 bg-white p-6 shadow-sm">
      <div className="flex flex-col gap-4 border-b border-black/8 pb-6 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#0F7A5C]">Catálogo funcional demo</p>
          <h2 className="mt-2 text-2xl font-bold text-[#0D2654]">{MODULE_TITLES[moduleId] ?? moduleId}</h2>
          <p className="mt-2 max-w-3xl text-sm text-[#52627A]">
            {accessibleFeatures.length} de {moduleFeatures.length} funciones visibles para {user.name}. {ROLE_SCOPES[roleId]}
          </p>
        </div>

        <div className="inline-flex items-center gap-3 rounded-2xl border border-[#0F7A5C]/15 bg-[#0F7A5C]/5 px-4 py-3 text-sm text-[#0D4A3E]">
          <PresetIcon className="h-5 w-5" />
          <span className="font-medium">{selectedFeature.label}</span>
        </div>
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-[320px,1fr]">
        <aside className="rounded-[24px] border border-black/8 bg-[#F8FBFF] p-4">
          <div className="relative mb-4">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#6B7280]" />
            <input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Buscar función"
              className="w-full rounded-2xl border border-black/8 bg-white py-2.5 pl-10 pr-4 text-sm text-[#0D2654] outline-none transition focus:border-[#0F7A5C]/50"
            />
          </div>

          <div className="space-y-2">
            {filteredFeatures.map((feature) => (
              <button
                key={feature.id}
                onClick={() => setSelectedFeatureId(feature.id)}
                className={`w-full rounded-2xl border px-4 py-3 text-left transition ${
                  selectedFeature.id === feature.id
                    ? 'border-[#0F7A5C]/35 bg-[#0F7A5C]/10'
                    : 'border-transparent bg-white hover:border-black/8 hover:bg-[#F4F7FB]'
                }`}
              >
                <div className="flex items-start justify-between gap-3">
                  <span className="text-sm font-semibold text-[#0D2654]">{feature.label}</span>
                  <span className={`rounded-full border px-2 py-1 text-[11px] font-semibold ${ACCESS_BADGES[feature.access[roleId]]}`}>
                    {ACCESS_LABELS[feature.access[roleId]]}
                  </span>
                </div>
              </button>
            ))}
          </div>
        </aside>

        <div className="space-y-6">
          <div className="rounded-[24px] border border-black/8 bg-[#FBFCFE] p-5">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <h3 className="text-xl font-bold text-[#0D2654]">{selectedFeature.label}</h3>
                  <span className={`rounded-full border px-2.5 py-1 text-xs font-semibold ${ACCESS_BADGES[accessLevel]}`}>
                    {ACCESS_LABELS[accessLevel]}
                  </span>
                </div>
                <p className="mt-2 text-sm text-[#52627A]">{selectedFeature.description}</p>
                <p className="mt-3 text-sm font-medium text-[#0D4A3E]">{getAccessSummary(accessLevel, roleId)}</p>
              </div>

              <button
                onClick={() => setShowOnlyHighlighted((current) => !current)}
                className="inline-flex items-center gap-2 rounded-2xl border border-black/8 bg-white px-4 py-2 text-sm font-medium text-[#0D2654] transition hover:bg-[#F4F7FB]"
              >
                <Filter className="h-4 w-4" />
                {showOnlyHighlighted ? 'Ver todo' : 'Resaltar pendientes'}
              </button>
            </div>

            <div className="mt-5 grid gap-3 md:grid-cols-3">
              {PRESET_STATS[selectedFeature.preset].map((statLabel, index) => (
                <div key={statLabel} className="rounded-2xl border border-black/8 bg-white p-4">
                  <p className="text-xs font-semibold uppercase tracking-[0.12em] text-[#6B7280]">{statLabel}</p>
                  <p className="mt-2 text-2xl font-bold text-[#0D2654]">{buildStatValue(selectedFeature, index)}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-[24px] border border-black/8 bg-white p-5">
            <div className="flex flex-wrap gap-3">
              <button
                disabled={!canCreate}
                onClick={handleCreate}
                className="inline-flex items-center gap-2 rounded-2xl bg-[#0F7A5C] px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-[#0c664d] disabled:cursor-not-allowed disabled:bg-slate-300"
              >
                <Plus className="h-4 w-4" />
                Crear
              </button>
              <button
                disabled={!canEdit}
                onClick={handleEdit}
                className="inline-flex items-center gap-2 rounded-2xl border border-[#0F7A5C]/25 bg-[#0F7A5C]/8 px-4 py-2.5 text-sm font-semibold text-[#0D4A3E] transition hover:bg-[#0F7A5C]/12 disabled:cursor-not-allowed disabled:border-slate-200 disabled:bg-slate-100 disabled:text-slate-400"
              >
                <Edit3 className="h-4 w-4" />
                Editar
              </button>
              <button
                disabled={!canDelete}
                onClick={handleDelete}
                className="inline-flex items-center gap-2 rounded-2xl border border-red-200 bg-red-50 px-4 py-2.5 text-sm font-semibold text-red-700 transition hover:bg-red-100 disabled:cursor-not-allowed disabled:border-slate-200 disabled:bg-slate-100 disabled:text-slate-400"
              >
                <Trash2 className="h-4 w-4" />
                Eliminar
              </button>
              <button
                onClick={handleExport}
                className="inline-flex items-center gap-2 rounded-2xl border border-black/8 bg-white px-4 py-2.5 text-sm font-semibold text-[#0D2654] transition hover:bg-[#F4F7FB]"
              >
                <Download className="h-4 w-4" />
                Exportar demo
              </button>
            </div>
          </div>

          <div className="rounded-[24px] border border-black/8 bg-white p-5">
            <div className="mb-4 flex items-center justify-between">
              <div>
                <h4 className="text-lg font-bold text-[#0D2654]">Vista funcional mock</h4>
                <p className="text-sm text-[#52627A]">Interacciones locales sin backend real.</p>
              </div>
              <span className="rounded-full bg-[#E8F6F2] px-3 py-1 text-xs font-semibold text-[#0D4A3E]">
                {visibleRows.length} registros
              </span>
            </div>

            <div className="space-y-3">
              {visibleRows.map((row) => (
                <div key={row.id} className="rounded-2xl border border-black/8 bg-[#FBFCFE] p-4">
                  <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                    <div>
                      <p className="font-semibold text-[#0D2654]">{row.title}</p>
                      <p className="text-sm text-[#52627A]">{row.subtitle}</p>
                    </div>
                    <span className="rounded-full bg-[#EEF4FF] px-3 py-1 text-xs font-semibold text-[#1A4A7A]">
                      {row.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ModuleFeatureHub;
