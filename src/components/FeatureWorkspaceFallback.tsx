import { useMemo, useState } from 'react';
import type { FeatureActionProps } from '@/actions/featureActions';
import {
  FeatureActionButtons,
  FeatureActionShell,
  FeatureMetricGrid,
  FeatureSectionCard,
} from '@/components/features/shared/FeatureActionShell';
import { FeatureWorkspaceTable } from '@/components/features/shared/FeatureWorkspaceTable';
import { Input } from '@/components/ui/input';
import { toast } from '@/hooks/use-toast';
import { formatCurrency } from '@/utils/metrics';
import { CalendarDays, CreditCard, FileCheck2, Layers3 } from 'lucide-react';

type CloseValidationStatus = 'Pendiente' | 'Aprobado' | 'Rechazado';

interface CloseValidationRow {
  id: string;
  validation: string;
  closeDate: string;
  responsible: string;
  status: CloseValidationStatus;
}

interface GenericRow {
  id: string;
  title: string;
  detail: string;
  owner: string;
  date: string;
  status: 'Pendiente' | 'En curso' | 'Listo';
}

const statusPill = (value: string) => {
  const tone =
    value === 'Aprobado' || value === 'Listo'
      ? 'bg-emerald-100 text-emerald-700'
      : value === 'Pendiente' || value === 'En curso'
      ? 'bg-amber-100 text-amber-700'
      : 'bg-rose-100 text-rose-700';

  return <span className={`rounded-full px-3 py-1 text-xs font-semibold ${tone}`}>{value}</span>;
};

const getWorkspaceIcon = (moduleCode: string) => {
  switch (moduleCode) {
    case 'M04':
      return CreditCard;
    case 'M05':
      return FileCheck2;
    case 'M06':
      return CalendarDays;
    default:
      return Layers3;
  }
};

export const FeatureWorkspaceFallback = ({
  featureId,
  accessLevel,
  roleId,
  title,
  moduleCode,
  onClose,
}: FeatureActionProps) => {
  const Icon = getWorkspaceIcon(moduleCode);
  const [filter, setFilter] = useState('');
  const [validations, setValidations] = useState<CloseValidationRow[]>([
    {
      id: 'val-01',
      validation: 'Cruce de bancos de mayo',
      closeDate: '2026-05-30',
      responsible: 'Claudia Mejia',
      status: 'Pendiente',
    },
    {
      id: 'val-02',
      validation: 'Revision de cartera con intereses',
      closeDate: '2026-05-30',
      responsible: 'Felipe Mora',
      status: 'Pendiente',
    },
    {
      id: 'val-03',
      validation: 'Soportes de egresos extraordinarios',
      closeDate: '2026-05-29',
      responsible: 'Diana Rueda',
      status: 'Aprobado',
    },
  ]);
  const [genericRows, setGenericRows] = useState<GenericRow[]>([
    {
      id: 'gen-01',
      title,
      detail: 'Seguimiento operativo del dia con responsables y fechas visibles.',
      owner: roleId === 'admin' ? 'Administracion' : 'Equipo Bunty',
      date: '2026-05-25',
      status: 'Pendiente',
    },
    {
      id: 'gen-02',
      title: `${title} - revision de soporte`,
      detail: 'Registro listo para validar cambios o completar observaciones.',
      owner: 'Carolina Mejia',
      date: '2026-05-26',
      status: 'En curso',
    },
    {
      id: 'gen-03',
      title: `${title} - cierre de actividad`,
      detail: 'Ultimo movimiento confirmado en esta vista.',
      owner: 'Luis Torres',
      date: '2026-05-27',
      status: 'Listo',
    },
  ]);

  const filteredValidations = useMemo(() => {
    const normalized = filter.trim().toLowerCase();
    if (!normalized) {
      return validations;
    }

    return validations.filter(
      (row) =>
        row.validation.toLowerCase().includes(normalized) ||
        row.responsible.toLowerCase().includes(normalized),
    );
  }, [filter, validations]);

  const filteredGenericRows = useMemo(() => {
    const normalized = filter.trim().toLowerCase();
    if (!normalized) {
      return genericRows;
    }

    return genericRows.filter(
      (row) =>
        row.title.toLowerCase().includes(normalized) ||
        row.owner.toLowerCase().includes(normalized),
    );
  }, [filter, genericRows]);

  const handleValidationStatus = (row: CloseValidationRow, status: CloseValidationStatus) => {
    setValidations((current) =>
      current.map((entry) => (entry.id === row.id ? { ...entry, status } : entry)),
    );
    toast({
      title: `Validacion ${status.toLowerCase()}`,
      description: `${row.validation} cambio su estado en la vista.`,
    });
  };

  const handleAdvanceGenericRow = (row: GenericRow) => {
    const nextStatus = row.status === 'Pendiente' ? 'En curso' : 'Listo';

    setGenericRows((current) =>
      current.map((entry) => (entry.id === row.id ? { ...entry, status: nextStatus } : entry)),
    );

    toast({
      title: 'Seguimiento actualizado',
      description: `${row.title} ahora aparece como ${nextStatus.toLowerCase()}.`,
    });
  };

  const summary =
    moduleCode === 'M05'
      ? 'Controla pendientes antes del cierre con responsables, fechas y decisiones visibles.'
      : `Panel operativo de ${title.toLowerCase()} con datos de trabajo y acciones inmediatas.`;

  return (
    <FeatureActionShell
      onClose={onClose}
      title={title}
      summary={summary}
      moduleCode={moduleCode}
      accessLevel={accessLevel}
      icon={Icon}
    >
      <FeatureMetricGrid
        metrics={
          moduleCode === 'M05'
            ? [
                { label: 'Validaciones abiertas', value: String(validations.filter((row) => row.status === 'Pendiente').length), helper: 'Pendientes antes del cierre', tone: 'amber' },
                { label: 'Responsables activos', value: '3', helper: 'Con seguimiento visible', tone: 'blue' },
                { label: 'Cierre objetivo', value: '30 may', helper: 'Corte contable mensual', tone: 'violet' },
                { label: 'Valor revisado', value: formatCurrency(18450000), helper: 'Movimientos conciliados', tone: 'emerald' },
              ]
            : [
                { label: 'Pendientes', value: String(genericRows.filter((row) => row.status === 'Pendiente').length), helper: 'Por revisar hoy', tone: 'amber' },
                { label: 'En curso', value: String(genericRows.filter((row) => row.status === 'En curso').length), helper: 'Con responsable asignado', tone: 'blue' },
                { label: 'Listos', value: String(genericRows.filter((row) => row.status === 'Listo').length), helper: 'Con seguimiento visible', tone: 'emerald' },
                { label: 'Actualizado', value: '25 may', helper: 'Corte de esta vista', tone: 'violet' },
              ]
        }
      />

      <FeatureSectionCard
        title="Filtro rapido"
        description="Busca por responsable, actividad o contexto para concentrarte en lo que sigue."
      >
        <Input
          value={filter}
          onChange={(event) => setFilter(event.target.value)}
          placeholder="Buscar en esta vista..."
          className="max-w-md"
        />
      </FeatureSectionCard>

      {moduleCode === 'M05' ? (
        <FeatureWorkspaceTable
          title="Validaciones previas al cierre"
          description="Cada fila deja visible la fecha de corte, el responsable y la decision tomada."
          rowKey={(row) => row.id}
          rows={filteredValidations}
          columns={[
            {
              key: 'validation',
              header: 'Validacion',
              cell: (row) => (
                <div className="space-y-1">
                  <p className="font-semibold text-slate-900">{row.validation}</p>
                  <p className="text-xs text-slate-500">Cierre {row.closeDate}</p>
                </div>
              ),
            },
            {
              key: 'responsible',
              header: 'Responsable',
              cell: (row) => row.responsible,
            },
            {
              key: 'status',
              header: 'Estado',
              cell: (row) => statusPill(row.status),
            },
            {
              key: 'actions',
              header: 'Acciones',
              cell: (row) => (
                <div className="flex flex-wrap justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => handleValidationStatus(row, 'Aprobado')}
                    className="rounded-lg border border-emerald-200 px-3 py-1 text-xs font-semibold text-emerald-700"
                  >
                    Aprobar
                  </button>
                  <button
                    type="button"
                    onClick={() => handleValidationStatus(row, 'Rechazado')}
                    className="rounded-lg border border-rose-200 px-3 py-1 text-xs font-semibold text-rose-700"
                  >
                    Rechazar
                  </button>
                </div>
              ),
              align: 'right',
            },
          ]}
          emptyState="No hay validaciones que coincidan con la busqueda."
        />
      ) : (
        <FeatureWorkspaceTable
          title="Seguimiento de trabajo"
          description="Aunque esta funcion siga creciendo, aqui ya ves actividad real y puedes moverla de estado."
          rowKey={(row) => row.id}
          rows={filteredGenericRows}
          columns={[
            {
              key: 'title',
              header: 'Actividad',
              cell: (row) => (
                <div className="space-y-1">
                  <p className="font-semibold text-slate-900">{row.title}</p>
                  <p className="text-xs text-slate-500">{row.detail}</p>
                </div>
              ),
            },
            {
              key: 'owner',
              header: 'Responsable',
              cell: (row) => row.owner,
            },
            {
              key: 'date',
              header: 'Fecha',
              cell: (row) => row.date,
            },
            {
              key: 'actions',
              header: 'Estado',
              cell: (row) => (
                <div className="flex flex-wrap justify-end gap-2">
                  {statusPill(row.status)}
                  {row.status !== 'Listo' && (
                    <button
                      type="button"
                      onClick={() => handleAdvanceGenericRow(row)}
                      className="rounded-lg border border-slate-200 px-3 py-1 text-xs font-semibold text-slate-700"
                    >
                      Avanzar
                    </button>
                  )}
                </div>
              ),
              align: 'right',
            },
          ]}
          emptyState="No encontramos actividades con ese filtro."
        />
      )}

      <FeatureSectionCard
        title="Acciones sugeridas"
        description="Estas acciones dejan un resultado visible en la misma vista."
      >
        <FeatureActionButtons
          actions={[
            {
              label: 'Marcar seguimiento del dia',
              variant: 'outline',
              onClick: () =>
                toast({
                  title: 'Seguimiento registrado',
                  description: 'La vista quedo actualizada con el corte del dia.',
                }),
            },
            {
              label: 'Preparar resumen',
              onClick: () =>
                toast({
                  title: 'Resumen listo',
                  description: 'El consolidado de esta funcion quedo preparado.',
                }),
            },
          ]}
        />
      </FeatureSectionCard>
    </FeatureActionShell>
  );
};

export default FeatureWorkspaceFallback;
