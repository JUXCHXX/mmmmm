import { useEffect, useMemo, useState } from 'react';
import { FEATURE_CATALOG } from '@/constants/featureCatalog';
import type { ModuleId } from '@/types/modules';
import type { AccessLevel, RoleId } from '@/types/roles';
import type { FeatureDefinition, FeatureId, FeaturePreset } from '@/types/features';
import { useAuthStore } from '@/store/useAuthStore';
import { toast } from '@/hooks/use-toast';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  ArrowRight,
  Bot,
  CalendarDays,
  CheckCircle2,
  Download,
  Edit3,
  Eye,
  Filter,
  FileText,
  Layers,
  Plus,
  Search,
  ShieldCheck,
  Trash2,
  Wrench,
} from 'lucide-react';

interface FeatureRecord {
  id: string;
  title: string;
  detail: string;
  status: string;
}

const ACCESS_LABELS: Record<AccessLevel, string> = {
  FULL_ACCESS: 'Completo',
  LIMITED: 'Parcial',
  READ_ONLY: 'Solo lectura',
  OWN_DATA_ONLY: 'Solo propio',
  NONE: 'Sin acceso',
};

const ACCESS_BADGE_VARIANTS: Record<
  AccessLevel,
  'success' | 'warning' | 'default' | 'secondary' | 'outline'
> = {
  FULL_ACCESS: 'success',
  LIMITED: 'warning',
  READ_ONLY: 'default',
  OWN_DATA_ONLY: 'secondary',
  NONE: 'outline',
};

const PRESET_STATS: Record<FeaturePreset, string[]> = {
  catalog: ['Registros', 'Cambios', 'Alertas'],
  communication: ['Envios', 'Lecturas', 'Pendientes'],
  finance: ['Monto', 'Alertas', 'Casos'],
  reservation: ['Solicitudes', 'Disponibles', 'Validaciones'],
  ticket: ['Tickets', 'SLA', 'Escalados'],
  maintenance: ['Activos', 'OT', 'Renovaciones'],
  security: ['Ingresos', 'Validaciones', 'Alertas'],
  documents: ['Documentos', 'Versiones', 'Vigencias'],
  marketplace: ['Servicios', 'Solicitudes', 'Leads'],
  insights: ['Indicadores', 'Variacion', 'Riesgos'],
  ai: ['Consultas', 'Hallazgos', 'Confianza'],
  settings: ['Reglas', 'Parametros', 'Cambios'],
  support: ['Recursos', 'Ayudas', 'Seguimientos'],
};

const PRESET_STATUSES: Record<FeaturePreset, string[]> = {
  catalog: ['Activo', 'Revision', 'Bloqueado'],
  communication: ['Publicado', 'Programado', 'Pendiente'],
  finance: ['Conciliado', 'En gestion', 'Pendiente'],
  reservation: ['Confirmada', 'En espera', 'Check-in'],
  ticket: ['Abierto', 'Escalado', 'Resuelto'],
  maintenance: ['Programado', 'En ejecucion', 'Cerrado'],
  security: ['Validado', 'Alerta', 'En verificacion'],
  documents: ['Vigente', 'Por aprobar', 'Version nueva'],
  marketplace: ['Publicado', 'Cotizando', 'Seguimiento'],
  insights: ['Actualizado', 'Seguimiento', 'Riesgo'],
  ai: ['Disponible', 'Analizando', 'Sugerido'],
  settings: ['Activo', 'Revision', 'Aplicado'],
  support: ['Disponible', 'Asignado', 'Atendido'],
};

const PRESET_CONTEXT: Record<FeaturePreset, string[]> = {
  catalog: ['Torre A - corte operativo', 'Unidad prioritaria', 'Validacion de estructura'],
  communication: ['Segmento general del conjunto', 'Campana programada', 'Respuesta pendiente'],
  finance: ['Corte del dia', 'Seguimiento de cartera', 'Movimiento en revision'],
  reservation: ['Salon comunal', 'Piscina principal', 'Agenda especial'],
  ticket: ['Caso con responsable', 'Seguimiento interno', 'Cierre validado'],
  maintenance: ['Activo principal', 'Ruta preventiva', 'Evidencia de cierre'],
  security: ['Porteria principal', 'Acceso vehicular', 'Control restringido'],
  documents: ['Carpeta institucional', 'Flujo documental', 'Version activa'],
  marketplace: ['Servicio publicado', 'Proveedor asignado', 'Solicitud en curso'],
  insights: ['Tablero ejecutivo', 'Revision semanal', 'Indicador critico'],
  ai: ['Consulta contextual', 'Respuesta generada', 'Sugerencia aplicada'],
  settings: ['Politica activa', 'Regla parametrizada', 'Cambio reciente'],
  support: ['Centro de ayuda', 'Ruta guiada', 'Incidente en seguimiento'],
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
  const raw = seededValue(`${feature.id}-${index}`, 4, 91);
  if (feature.preset === 'finance') return `$${raw}M`;
  if (feature.preset === 'insights') return `${raw}%`;
  if (feature.preset === 'ai') return `${80 + (raw % 19)}%`;
  return String(raw);
};

const buildRows = (feature: FeatureDefinition, ownerName: string): FeatureRecord[] => {
  const statusSet = PRESET_STATUSES[feature.preset];
  const contextSet = PRESET_CONTEXT[feature.preset];

  return [
    {
      id: `${feature.id}-1`,
      title: feature.label,
      detail: `${contextSet[0]} - actualizado hace 12 min`,
      status: statusSet[0],
    },
    {
      id: `${feature.id}-2`,
      title: `${feature.label} - seguimiento`,
      detail: `${contextSet[1]} - responsable ${ownerName}`,
      status: statusSet[1],
    },
    {
      id: `${feature.id}-3`,
      title: `${feature.label} - control`,
      detail: `${contextSet[2]} - ultima revision del turno`,
      status: statusSet[2],
    },
  ];
};

const getLimitedCrud = (preset: FeaturePreset, roleId: RoleId): Array<'create' | 'edit'> => {
  if (roleId === 'admin') return ['create', 'edit'];

  if (roleId === 'consejo') {
    return preset === 'communication' || preset === 'documents' || preset === 'insights'
      ? ['edit']
      : [];
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
      preset === 'finance' ||
      preset === 'ai'
      ? ['create', 'edit']
      : ['edit'];
  }

  return ['edit'];
};

const getAccessMessage = (
  accessLevel: AccessLevel,
  canCreate: boolean,
  canEdit: boolean,
  canDelete: boolean,
) => {
  if (accessLevel === 'FULL_ACCESS') {
    return 'Funcion habilitada para operacion completa dentro del modulo.';
  }

  if (accessLevel === 'READ_ONLY') {
    return 'Funcion visible para consulta. Crear, editar y eliminar permanecen bloqueados.';
  }

  if (accessLevel === 'LIMITED' || accessLevel === 'OWN_DATA_ONLY') {
    const actions = [
      canCreate ? 'crear' : null,
      canEdit ? 'editar' : null,
      canDelete ? 'eliminar' : null,
    ].filter(Boolean);

    return actions.length
      ? `Funcion visible con alcance parcial. Puedes ${actions.join(', ')} segun tu perfil.`
      : 'Funcion visible con alcance parcial y sin acciones de cambio disponibles.';
  }

  return 'Sin acceso.';
};

const isHighlightedStatus = (status: string) => {
  return !['Activo', 'Publicado', 'Conciliado', 'Confirmada', 'Resuelto', 'Cerrado', 'Validado', 'Vigente', 'Disponible', 'Aplicado', 'Atendido', 'Actualizado'].includes(status);
};

export const ModuleFeatureHub = ({ moduleId }: { moduleId: ModuleId }) => {
  if (moduleId === 'dashboard') {
    return null;
  }

  const user = useAuthStore((state) => state.user);
  const roleId = user?.roleId ?? 'propietario';
  const moduleFeatures = (FEATURE_CATALOG as Partial<Record<ModuleId, FeatureDefinition[]>>)[moduleId] ?? [];

  const accessibleFeatures = useMemo(
    () => moduleFeatures.filter((feature) => feature.access[roleId] !== 'NONE'),
    [moduleFeatures, roleId],
  );

  const [search, setSearch] = useState('');
  const [selectedFeatureId, setSelectedFeatureId] = useState<FeatureId | null>(null);
  const [rowsByFeature, setRowsByFeature] = useState<Record<FeatureId, FeatureRecord[]>>({});
  const [showOnlyHighlighted, setShowOnlyHighlighted] = useState(false);

  const filteredFeatures = useMemo(() => {
    const normalized = search.trim().toLowerCase();
    if (!normalized) return accessibleFeatures;

    return accessibleFeatures.filter((feature) => feature.label.toLowerCase().includes(normalized));
  }, [accessibleFeatures, search]);

  useEffect(() => {
    if (!accessibleFeatures.length) {
      setSelectedFeatureId(null);
      return;
    }

    if (!selectedFeatureId || !accessibleFeatures.some((feature) => feature.id === selectedFeatureId)) {
      setSelectedFeatureId(accessibleFeatures[0].id);
    }
  }, [accessibleFeatures, selectedFeatureId]);

  const selectedFeature =
    accessibleFeatures.find((feature) => feature.id === selectedFeatureId) ?? accessibleFeatures[0];

  useEffect(() => {
    if (!selectedFeature) return;

    setRowsByFeature((current) =>
      current[selectedFeature.id]
        ? current
        : {
            ...current,
            [selectedFeature.id]: buildRows(selectedFeature, user?.name ?? 'usuario'),
          },
    );
  }, [selectedFeature, user?.name]);

  if (!user || !moduleFeatures.length || !accessibleFeatures.length || !selectedFeature) {
    return null;
  }

  const accessLevel = selectedFeature.access[roleId] ?? 'NONE';
  const limitedCrud = getLimitedCrud(selectedFeature.preset, roleId);
  const canCreate = accessLevel === 'FULL_ACCESS' || limitedCrud.includes('create');
  const canEdit = accessLevel === 'FULL_ACCESS' || limitedCrud.includes('edit');
  const canDelete = accessLevel === 'FULL_ACCESS';
  const rows = rowsByFeature[selectedFeature.id] ?? buildRows(selectedFeature, user.name);
  const visibleRows = showOnlyHighlighted ? rows.filter((row) => isHighlightedStatus(row.status)) : rows;
  const PresetIcon = PRESET_ICONS[selectedFeature.preset];

  const updateRows = (updater: (currentRows: FeatureRecord[]) => FeatureRecord[]) => {
    setRowsByFeature((current) => ({
      ...current,
      [selectedFeature.id]: updater(current[selectedFeature.id] ?? buildRows(selectedFeature, user.name)),
    }));
  };

  const handleCreate = () => {
    if (!canCreate) return;

    updateRows((currentRows) => [
      {
        id: `${selectedFeature.id}-${Date.now()}`,
        title: `${selectedFeature.label} - nuevo registro`,
        detail: `Creado por ${user.name} durante la sesion actual`,
        status: 'Nuevo',
      },
      ...currentRows,
    ]);

    toast({
      title: 'Registro creado',
      description: `${selectedFeature.label} ya tiene un nuevo elemento operativo.`,
    });
  };

  const handleEdit = () => {
    if (!canEdit) return;

    updateRows((currentRows) =>
      currentRows.map((row, index) =>
        index === 0
          ? {
              ...row,
              title: `${row.title} - actualizado`,
              status: 'Actualizado',
            }
          : row,
      ),
    );

    toast({
      title: 'Registro actualizado',
      description: `Se aplicaron cambios sobre ${selectedFeature.label}.`,
    });
  };

  const handleDelete = () => {
    if (!canDelete) return;

    updateRows((currentRows) => currentRows.slice(1));

    toast({
      title: 'Registro eliminado',
      description: `Se retiro un elemento de ${selectedFeature.label}.`,
    });
  };

  const handleExport = () => {
    toast({
      title: 'Exportacion preparada',
      description: `Se genero la salida de ${selectedFeature.label}.`,
    });
  };

  const handleQuickTrack = () => {
    toast({
      title: 'Seguimiento registrado',
      description: `Se marco un seguimiento rapido para ${selectedFeature.label}.`,
    });
  };

  return (
    <section className="mb-6 overflow-hidden rounded-[34px] border border-[#D8E4F2] bg-[linear-gradient(135deg,#ffffff_0%,#f8fbff_52%,#eef9f4_100%)] shadow-[0_20px_60px_rgba(13,38,84,0.08)]">
      <div className="border-b border-[#D8E4F2] px-5 py-5 md:px-6">
        <div className="flex flex-col gap-5 xl:flex-row xl:items-start xl:justify-between">
          <div className="flex min-w-0 flex-1 items-start gap-4">
            <div className="rounded-[24px] bg-[#0D2654] p-3 text-white shadow-[0_16px_34px_rgba(13,38,84,0.2)]">
              <PresetIcon className="h-6 w-6" />
            </div>
            <div className="min-w-0">
              <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[#0F7A5C]">
                Centro de trabajo
              </p>
              <div className="mt-2 flex flex-wrap items-center gap-2">
                <h2 className="text-2xl font-bold text-[#0D2654]">{selectedFeature.label}</h2>
                <Badge variant={ACCESS_BADGE_VARIANTS[accessLevel]}>{ACCESS_LABELS[accessLevel]}</Badge>
              </div>
              <p className="mt-2 max-w-3xl text-sm text-[#52627A]">
                {getAccessMessage(accessLevel, canCreate, canEdit, canDelete)}
              </p>
            </div>
          </div>

          <div className="flex flex-wrap gap-2 xl:max-w-[420px] xl:justify-end">
            <Button onClick={handleCreate} disabled={!canCreate}>
              <Plus className="h-4 w-4" />
              Crear
            </Button>
            <Button variant="outline" onClick={handleEdit} disabled={!canEdit}>
              <Edit3 className="h-4 w-4" />
              Editar
            </Button>
            <Button variant="outline" onClick={handleDelete} disabled={!canDelete}>
              <Trash2 className="h-4 w-4" />
              Eliminar
            </Button>
            <Button variant="secondary" onClick={handleExport}>
              <Download className="h-4 w-4" />
              Exportar
            </Button>
          </div>
        </div>

        <div className="mt-5 grid gap-4 xl:grid-cols-[minmax(0,1fr)_320px]">
          <div>
            <div className="relative">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#6B7280]" />
              <Input
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Buscar funcion o herramienta"
                className="h-12 rounded-2xl border-[#D8E4F2] bg-white/85 pl-10 shadow-sm"
              />
            </div>

            <div className="mt-4 flex flex-wrap gap-2">
              {filteredFeatures.map((feature) => (
                <button
                  key={feature.id}
                  onClick={() => setSelectedFeatureId(feature.id)}
                  className={`inline-flex items-center gap-2 rounded-full border px-4 py-2.5 text-sm font-semibold transition ${
                    selectedFeature.id === feature.id
                      ? 'border-[#0F7A5C]/25 bg-[#0F7A5C] text-white shadow-[0_12px_28px_rgba(15,122,92,0.26)]'
                      : 'border-[#D8E4F2] bg-white/85 text-[#0D2654] hover:bg-[#F3F8FE] hover:shadow-sm'
                  }`}
                >
                  <span>{feature.label}</span>
                  {selectedFeature.id === feature.id && <CheckCircle2 className="h-4 w-4" />}
                </button>
              ))}
            </div>

            {!filteredFeatures.length && (
              <div className="mt-4 rounded-[24px] border border-dashed border-[#D8E4F2] bg-white/75 px-4 py-6 text-center text-sm text-[#6B7280]">
                No encontramos una funcion con esa busqueda.
              </div>
            )}
          </div>

          <div className="rounded-[28px] border border-[#D8E4F2] bg-white/82 p-4 shadow-sm backdrop-blur">
            <div className="mb-3 flex items-center gap-2">
              <Eye className="h-4 w-4 text-[#0F7A5C]" />
              <h3 className="text-sm font-bold text-[#0D2654]">Vista rapida</h3>
            </div>
            <div className="grid gap-3 sm:grid-cols-3 xl:grid-cols-1">
              {PRESET_STATS[selectedFeature.preset].map((statLabel, index) => (
                <div key={statLabel} className="rounded-2xl bg-[#F8FBFF] p-4">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-[#6B7280]">
                    {statLabel}
                  </p>
                  <p className="mt-2 text-2xl font-bold text-[#0D2654]">
                    {buildStatValue(selectedFeature, index)}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="grid gap-4 px-5 py-5 md:px-6 xl:grid-cols-[minmax(0,1.45fr)_340px]">
        <div className="rounded-[30px] border border-white/70 bg-white/88 p-5 shadow-sm">
          <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h3 className="text-lg font-bold text-[#0D2654]">Actividad activa</h3>
              <p className="text-sm text-[#52627A]">
                Registros y estado operativo de la funcion seleccionada.
              </p>
            </div>

            <Button variant="ghost" onClick={() => setShowOnlyHighlighted((current) => !current)}>
              <Filter className="h-4 w-4" />
              {showOnlyHighlighted ? 'Ver todo' : 'Solo pendientes'}
            </Button>
          </div>

          <div className="space-y-3">
            {visibleRows.map((row) => (
              <div
                key={row.id}
                className={`rounded-[24px] border p-4 transition ${
                  isHighlightedStatus(row.status)
                    ? 'border-[#F4D06F] bg-[#FFF8E7]'
                    : 'border-[#E3EBF5] bg-[#FBFCFE]'
                }`}
              >
                <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                  <div>
                    <p className="font-semibold text-[#0D2654]">{row.title}</p>
                    <p className="text-sm text-[#52627A]">{row.detail}</p>
                  </div>
                  <Badge
                    variant={isHighlightedStatus(row.status) ? 'warning' : 'secondary'}
                    className="w-fit"
                  >
                    {row.status}
                  </Badge>
                </div>
              </div>
            ))}

            {!visibleRows.length && (
              <div className="rounded-[24px] border border-dashed border-[#D8E4F2] bg-[#FBFCFE] px-4 py-8 text-center text-sm text-[#6B7280]">
                No hay registros para el filtro actual.
              </div>
            )}
          </div>
        </div>

        <div className="space-y-4">
          <div className="rounded-[30px] border border-white/70 bg-white/88 p-5 shadow-sm">
            <div className="mb-4 flex items-center gap-2">
              <Layers className="h-4 w-4 text-[#0F7A5C]" />
              <h3 className="text-lg font-bold text-[#0D2654]">Alcance actual</h3>
            </div>

            <div className="space-y-3">
              <div className="rounded-2xl bg-[#F8FBFF] px-4 py-3">
                <span className="text-xs uppercase tracking-[0.14em] text-[#6B7280]">Rol</span>
                <p className="mt-1 text-sm font-semibold text-[#0D2654]">{roleId.replace('_', ' ')}</p>
              </div>
              <div className="rounded-2xl bg-[#F8FBFF] px-4 py-3">
                <span className="text-xs uppercase tracking-[0.14em] text-[#6B7280]">Codigo</span>
                <p className="mt-1 text-sm font-semibold text-[#0D2654]">{selectedFeature.moduleCode}</p>
              </div>
              <div className="rounded-2xl bg-[#F8FBFF] px-4 py-3">
                <span className="text-xs uppercase tracking-[0.14em] text-[#6B7280]">Modo</span>
                <p className="mt-1 text-sm font-semibold text-[#0D2654]">{selectedFeature.preset}</p>
              </div>
            </div>
          </div>

          <div className="rounded-[30px] border border-white/70 bg-white/88 p-5 shadow-sm">
            <div className="mb-4 flex items-center gap-2">
              <ArrowRight className="h-4 w-4 text-[#0F7A5C]" />
              <h3 className="text-lg font-bold text-[#0D2654]">Acciones rapidas</h3>
            </div>

            <div className="space-y-3">
              <Button variant="outline" className="w-full justify-between" onClick={handleQuickTrack}>
                Registrar seguimiento
                <ArrowRight className="h-4 w-4" />
              </Button>
              <Button variant="outline" className="w-full justify-between" onClick={handleExport}>
                Generar salida
                <ArrowRight className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                className="w-full justify-between"
                onClick={() =>
                  toast({
                    title: 'Vista actualizada',
                    description: `Se refresco la vista de ${selectedFeature.label}.`,
                  })
                }
              >
                Refrescar vista
                <ArrowRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ModuleFeatureHub;
