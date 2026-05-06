import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FEATURE_CATALOG } from '@/constants/featureCatalog';
import type { ReactNode } from 'react';
import type { FeatureDefinition } from '@/types/features';
import type { AccessLevel, RoleId } from '@/types/roles';
import { useAuthStore } from '@/store/useAuthStore';
import { useAppStore } from '@/store/useAppStore';
import { toast } from '@/hooks/use-toast';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Progress } from '@/components/ui/progress';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import type { LucideIcon } from 'lucide-react';
import {
  Activity,
  BarChart3,
  Bell,
  Building2,
  CalendarDays,
  ChevronRight,
  ClipboardList,
  Clock,
  CreditCard,
  Layers,
  ShieldCheck,
  Target,
  Users,
  Wrench,
} from 'lucide-react';

type ComparisonRange = '30d' | '90d' | '12m';
type ComparisonMetric = 'payments' | 'pqrs' | 'occupancy';
type SummaryMode = 'daily' | 'weekly';
type HeatmapWindow = 'today' | 'week';
type PortfolioFilter = 'overdue' | 'agreements' | 'all';
type ProductivityWindow = 'week' | 'month';
type RiskMode = 'critical' | 'balanced';

interface PanelTask {
  id: string;
  label: string;
  done: boolean;
}

interface PanelAlert {
  id: string;
  title: string;
  detail: string;
  severity: 'Critica' | 'Alta' | 'Media';
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

const FEATURE_HINTS: Record<string, string> = {
  m12_priority_alerts: 'Casillas para revisar, limpiar y crear alertas.',
  m12_historical_comparatives: 'Compara cartera, PQRS y ocupacion por periodo.',
  m12_daily_weekly_summary: 'Genera el resumen operativo del dia o de la semana.',
  m12_drill_down_by_module: 'Abre el detalle de cada modulo desde el panel.',
  m12_risk_ranking: 'Ordena los riesgos y marca seguimientos.',
  m12_operational_heatmap: 'Visualiza las zonas mas cargadas del sistema.',
  m12_pending_tasks: 'Checklist operativo con alta rapida de tareas.',
  m12_sla_semaphores: 'Semaforos activos para tiempos de respuesta.',
  m12_portfolio_board: 'Gestiona cobro y seguimiento de cartera.',
  m12_security_board: 'Monitorea novedades y accesos de seguridad.',
  m12_maintenance_productivity: 'Controla avance y carga de mantenimiento.',
  m12_provider_status: 'Revisa estado y seguimiento de proveedores.',
  m12_digital_adoption: 'Activa recordatorios y campanas de adopcion.',
};

const FEATURE_ICONS: Record<string, LucideIcon> = {
  m12_priority_alerts: Bell,
  m12_historical_comparatives: BarChart3,
  m12_daily_weekly_summary: CalendarDays,
  m12_drill_down_by_module: Layers,
  m12_risk_ranking: Target,
  m12_operational_heatmap: Activity,
  m12_pending_tasks: ClipboardList,
  m12_sla_semaphores: Clock,
  m12_portfolio_board: CreditCard,
  m12_security_board: ShieldCheck,
  m12_maintenance_productivity: Wrench,
  m12_provider_status: Building2,
  m12_digital_adoption: Users,
};

const MODULE_ROUTES = {
  Pagos: '/pagos',
  PQRS: '/pqrs',
  Mantenimiento: '/mantenimiento',
  Seguridad: '/seguridad',
  Reservas: '/reservas',
} as const;

const canManage = (access: AccessLevel) => access === 'FULL_ACCESS' || access === 'LIMITED';

const isFullAccess = (access: AccessLevel) => access === 'FULL_ACCESS';

const badgeForSeverity = (severity: PanelAlert['severity']) => {
  if (severity === 'Critica') return 'destructive';
  if (severity === 'Alta') return 'warning';
  return 'secondary';
};

const formatCurrency = (value: number) =>
  new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: 'COP',
    maximumFractionDigits: 0,
  }).format(value);

const intensityColor = (value: number) => {
  if (value >= 70) return 'rgba(239, 68, 68, 0.16)';
  if (value >= 45) return 'rgba(245, 158, 11, 0.16)';
  return 'rgba(45, 200, 154, 0.16)';
};

const FeatureCard = ({
  feature,
  accessLevel,
  summary,
  children,
}: {
  feature: FeatureDefinition;
  accessLevel: AccessLevel;
  summary: string;
  children: ReactNode;
}) => {
  const Icon = FEATURE_ICONS[feature.id] ?? Layers;

  return (
    <article className="rounded-[28px] border border-black/8 bg-white p-5 shadow-sm">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-start gap-3">
          <div className="rounded-2xl bg-[#0F7A5C]/10 p-3 text-[#0F7A5C]">
            <Icon className="h-5 w-5" />
          </div>
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <h3 className="text-base font-bold text-[#0D2654]">{feature.label}</h3>
              <Badge variant={ACCESS_BADGE_VARIANTS[accessLevel]}>{ACCESS_LABELS[accessLevel]}</Badge>
            </div>
            <p className="mt-1 text-sm text-[#52627A]">{summary}</p>
          </div>
        </div>
      </div>

      <p className="mt-3 rounded-2xl bg-[#F8FBFF] px-4 py-3 text-xs text-[#52627A]">
        {FEATURE_HINTS[feature.id] ?? 'Funcion operativa disponible en este panel.'}
      </p>

      <div className="mt-4 space-y-4">{children}</div>
    </article>
  );
};

export const DashboardFeatureWorkbench = () => {
  const navigate = useNavigate();
  const user = useAuthStore((state) => state.user);
  const roleId: RoleId = user?.roleId ?? 'propietario';
  const condos = useAppStore((state) => state.condos);
  const payments = useAppStore((state) => state.payments);
  const pqrs = useAppStore((state) => state.pqrs);
  const maintenance = useAppStore((state) => state.maintenance);
  const accessLogs = useAppStore((state) => state.accessLogs);
  const providers = useAppStore((state) => state.providers);
  const workOrders = useAppStore((state) => state.workOrders);
  const residents = useAppStore((state) => state.residents);
  const reservations = useAppStore((state) => state.reservations);
  const communications = useAppStore((state) => state.communications);
  const updatePaymentStatus = useAppStore((state) => state.updatePaymentStatus);
  const updateMaintenanceStatus = useAppStore((state) => state.updateMaintenanceStatus);

  const dashboardFeatures = useMemo(
    () => FEATURE_CATALOG.dashboard.filter((feature) => feature.access[roleId] !== 'NONE'),
    [roleId],
  );

  const overduePayments = useMemo(
    () => payments.filter((payment) => payment.status === 'overdue'),
    [payments],
  );
  const agreementPayments = useMemo(
    () => payments.filter((payment) => payment.status === 'agreement'),
    [payments],
  );
  const openPqrs = useMemo(
    () => pqrs.filter((item) => item.status !== 'resolved' && item.status !== 'closed'),
    [pqrs],
  );
  const unauthorizedAccess = useMemo(
    () => accessLogs.filter((log) => !log.authorized),
    [accessLogs],
  );
  const pendingMaintenance = useMemo(
    () => maintenance.filter((item) => item.status !== 'completed'),
    [maintenance],
  );
  const openWorkOrders = useMemo(
    () => workOrders.filter((order) => order.status !== 'completed' && order.status !== 'cancelled'),
    [workOrders],
  );
  const completedWorkOrders = useMemo(
    () => workOrders.filter((order) => order.status === 'completed'),
    [workOrders],
  );
  const activeProviders = useMemo(
    () => providers.filter((provider) => provider.status === 'active'),
    [providers],
  );
  const averageOccupancy = useMemo(() => {
    if (!condos.length) return 0;
    return Math.round(
      condos.reduce((total, condo) => total + (condo.occupancyRate || 0), 0) / condos.length,
    );
  }, [condos]);
  const averageProviderRating = useMemo(() => {
    if (!providers.length) return 0;
    return Number(
      (
        providers.reduce((total, provider) => total + (provider.rating || 0), 0) / providers.length
      ).toFixed(1),
    );
  }, [providers]);
  const adoptionBase = useMemo(() => {
    if (!residents.length) return 0;
    const engaged = communications.filter((item) => !item.archived).length + reservations.length;
    return Math.min(100, Math.round((engaged / (residents.length * 2)) * 100));
  }, [communications, reservations, residents.length]);

  const alertItems = useMemo<PanelAlert[]>(
    () => [
      {
        id: 'portfolio',
        title: 'Mora concentrada',
        detail: `${overduePayments.length} pagos vencidos requieren gestion inmediata.`,
        severity: overduePayments.length > 3 ? 'Critica' : 'Alta',
      },
      {
        id: 'pqrs',
        title: 'PQRS por revisar',
        detail: `${openPqrs.length} casos siguen abiertos en el flujo operativo.`,
        severity: openPqrs.length > 4 ? 'Alta' : 'Media',
      },
      {
        id: 'security',
        title: 'Novedades de seguridad',
        detail: `${unauthorizedAccess.length} ingresos con novedad necesitan validacion.`,
        severity: unauthorizedAccess.length > 1 ? 'Critica' : 'Alta',
      },
      {
        id: 'maintenance',
        title: 'Mantenimientos pendientes',
        detail: `${pendingMaintenance.length} ordenes aun no cierran el ciclo.`,
        severity: pendingMaintenance.length > 2 ? 'Alta' : 'Media',
      },
    ],
    [openPqrs.length, overduePayments.length, pendingMaintenance.length, unauthorizedAccess.length],
  );

  const moduleInsights = useMemo(
    () => ({
      Pagos: {
        total: overduePayments.length,
        detail: 'casos con seguimiento activo',
      },
      PQRS: {
        total: openPqrs.length,
        detail: 'tickets esperando movimiento',
      },
      Mantenimiento: {
        total: pendingMaintenance.length,
        detail: 'ordenes en ejecucion o pendientes',
      },
      Seguridad: {
        total: unauthorizedAccess.length,
        detail: 'novedades en control de acceso',
      },
      Reservas: {
        total: reservations.filter((item) => item.status === 'pending').length,
        detail: 'solicitudes listas para revision',
      },
    }),
    [openPqrs.length, overduePayments.length, pendingMaintenance.length, reservations, unauthorizedAccess.length],
  );

  const initialTasks = useMemo<PanelTask[]>(
    () => [
      {
        id: 'task-1',
        label: `Contactar ${Math.max(overduePayments.length, 1)} casos de mora prioritaria`,
        done: false,
      },
      {
        id: 'task-2',
        label: `Revisar ${Math.max(openPqrs.length, 1)} PQRS del dia`,
        done: false,
      },
      {
        id: 'task-3',
        label: `Cerrar seguimiento a ${Math.max(pendingMaintenance.length, 1)} mantenimientos`,
        done: false,
      },
    ],
    [openPqrs.length, overduePayments.length, pendingMaintenance.length],
  );

  const [reviewedAlertIds, setReviewedAlertIds] = useState<string[]>([]);
  const [dismissedAlertIds, setDismissedAlertIds] = useState<string[]>([]);
  const [comparisonRange, setComparisonRange] = useState<ComparisonRange>('30d');
  const [comparisonMetric, setComparisonMetric] = useState<ComparisonMetric>('payments');
  const [summaryMode, setSummaryMode] = useState<SummaryMode>('daily');
  const [summaryVersion, setSummaryVersion] = useState(1);
  const [selectedModule, setSelectedModule] =
    useState<keyof typeof MODULE_ROUTES>('Pagos');
  const [riskMode, setRiskMode] = useState<RiskMode>('critical');
  const [heatmapWindow, setHeatmapWindow] = useState<HeatmapWindow>('today');
  const [tasks, setTasks] = useState<PanelTask[]>(initialTasks);
  const [taskDraft, setTaskDraft] = useState('');
  const [strictSla, setStrictSla] = useState(true);
  const [portfolioFilter, setPortfolioFilter] = useState<PortfolioFilter>('overdue');
  const [selectedPaymentIds, setSelectedPaymentIds] = useState<string[]>([]);
  const [securityMonitoring, setSecurityMonitoring] = useState(true);
  const [productivityWindow, setProductivityWindow] = useState<ProductivityWindow>('week');
  const [followedProviderIds, setFollowedProviderIds] = useState<string[]>([]);
  const [adoptionAutomation, setAdoptionAutomation] = useState(false);
  const [adoptionBoost, setAdoptionBoost] = useState(0);
  const [adoptionChannels, setAdoptionChannels] = useState<string[]>(['app', 'email']);

  const visibleAlerts = alertItems.filter((item) => !dismissedAlertIds.includes(item.id));
  const selectedModuleInsight = moduleInsights[selectedModule];
  const adoptionRate = Math.min(100, adoptionBase + adoptionBoost);

  const comparisonFactor = comparisonRange === '30d' ? 1 : comparisonRange === '90d' ? 3 : 6;
  const comparisonStats = {
    payments: {
      label: 'Cartera en seguimiento',
      current: Math.max(overduePayments.length * comparisonFactor, overduePayments.length || 1),
      previous: Math.max(overduePayments.length * comparisonFactor - 2, 1),
      formatter: (value: number) => `${value} casos`,
    },
    pqrs: {
      label: 'PQRS abiertas',
      current: Math.max(openPqrs.length * comparisonFactor, openPqrs.length || 1),
      previous: Math.max(openPqrs.length * comparisonFactor - 3, 1),
      formatter: (value: number) => `${value} casos`,
    },
    occupancy: {
      label: 'Ocupacion promedio',
      current: averageOccupancy,
      previous: Math.max(averageOccupancy - 4, 0),
      formatter: (value: number) => `${value}%`,
    },
  } satisfies Record<
    ComparisonMetric,
    { label: string; current: number; previous: number; formatter: (value: number) => string }
  >;

  const comparisonCurrent = comparisonStats[comparisonMetric];
  const comparisonDelta = comparisonCurrent.current - comparisonCurrent.previous;

  const riskItems = useMemo(() => {
    const items = [
      {
        id: 'risk-portfolio',
        label: 'Cartera vencida',
        score: 65 + overduePayments.length * 4,
        owner: 'Pagos',
      },
      {
        id: 'risk-security',
        label: 'Accesos con novedad',
        score: 58 + unauthorizedAccess.length * 7,
        owner: 'Seguridad',
      },
      {
        id: 'risk-maintenance',
        label: 'Mantenimientos demorados',
        score: 55 + pendingMaintenance.length * 5,
        owner: 'Mantenimiento',
      },
      {
        id: 'risk-pqrs',
        label: 'Casos sin mover',
        score: 52 + openPqrs.length * 5,
        owner: 'PQRS',
      },
    ];

    return items
      .sort((left, right) =>
        riskMode === 'critical'
          ? right.score - left.score
          : left.label.localeCompare(right.label),
      )
      .slice(0, 4);
  }, [openPqrs.length, overduePayments.length, pendingMaintenance.length, riskMode, unauthorizedAccess.length]);

  const heatmapAreas = useMemo(() => {
    const base = heatmapWindow === 'today' ? 1 : 1.4;

    return [
      {
        name: 'Porteria',
        level: Math.min(95, Math.round((28 + unauthorizedAccess.length * 18) * base)),
        detail: `${unauthorizedAccess.length} novedades activas`,
      },
      {
        name: 'Cartera',
        level: Math.min(95, Math.round((30 + overduePayments.length * 14) * base)),
        detail: `${overduePayments.length} casos con alerta`,
      },
      {
        name: 'PQRS',
        level: Math.min(95, Math.round((24 + openPqrs.length * 12) * base)),
        detail: `${openPqrs.length} tickets en cola`,
      },
      {
        name: 'Mantenimiento',
        level: Math.min(95, Math.round((22 + pendingMaintenance.length * 12) * base)),
        detail: `${pendingMaintenance.length} OT en curso`,
      },
    ];
  }, [heatmapWindow, openPqrs.length, overduePayments.length, pendingMaintenance.length, unauthorizedAccess.length]);

  const portfolioRows = useMemo(() => {
    if (portfolioFilter === 'agreements') return agreementPayments.slice(0, 3);
    if (portfolioFilter === 'all') return payments.slice(0, 3);
    return overduePayments.slice(0, 3);
  }, [agreementPayments, overduePayments, payments, portfolioFilter]);

  const securityRows = useMemo(() => accessLogs.slice(0, 3), [accessLogs]);
  const providerRows = useMemo(() => providers.slice(0, 3), [providers]);
  const visibleSla = useMemo(
    () => [
      {
        label: 'PQRS',
        ok: Math.max(pqrs.length - openPqrs.length, 1),
        warning: strictSla ? Math.max(openPqrs.length - 1, 1) : Math.max(openPqrs.length - 2, 1),
        late: strictSla ? Math.max(Math.floor(openPqrs.length / 2), 1) : Math.max(Math.floor(openPqrs.length / 3), 1),
      },
      {
        label: 'Pagos',
        ok: Math.max(payments.length - overduePayments.length, 1),
        warning: strictSla ? Math.max(overduePayments.length - 1, 1) : Math.max(overduePayments.length - 2, 1),
        late: strictSla ? Math.max(Math.floor(overduePayments.length / 2), 1) : Math.max(Math.floor(overduePayments.length / 3), 1),
      },
      {
        label: 'Mantenimiento',
        ok: Math.max(maintenance.length - pendingMaintenance.length, 1),
        warning: strictSla ? Math.max(pendingMaintenance.length - 1, 1) : Math.max(pendingMaintenance.length - 2, 1),
        late: strictSla ? Math.max(Math.floor(pendingMaintenance.length / 2), 1) : Math.max(Math.floor(pendingMaintenance.length / 3), 1),
      },
    ],
    [maintenance.length, openPqrs.length, overduePayments.length, payments.length, pendingMaintenance.length, pqrs.length, strictSla],
  );

  if (!user || !dashboardFeatures.length) {
    return null;
  }

  const toggleAlertReview = (alertId: string) => {
    setReviewedAlertIds((current) =>
      current.includes(alertId)
        ? current.filter((item) => item !== alertId)
        : [...current, alertId],
    );
  };

  const clearReviewedAlerts = () => {
    const toRemove = reviewedAlertIds.filter((item) =>
      visibleAlerts.some((alert) => alert.id === item),
    );

    if (!toRemove.length) return;

    setDismissedAlertIds((current) => [...current, ...toRemove]);
    setReviewedAlertIds((current) => current.filter((item) => !toRemove.includes(item)));

    toast({
      title: 'Alertas limpiadas',
      description: `${toRemove.length} alertas fueron retiradas del panel.`,
    });
  };

  const addTask = () => {
    const label = taskDraft.trim();
    if (!label) return;

    setTasks((current) => [
      {
        id: `task-${Date.now()}`,
        label,
        done: false,
      },
      ...current,
    ]);
    setTaskDraft('');

    toast({
      title: 'Tarea agregada',
      description: 'La nueva tarea ya aparece en el panel pendiente.',
    });
  };

  const toggleTask = (taskId: string) => {
    setTasks((current) =>
      current.map((task) => (task.id === taskId ? { ...task, done: !task.done } : task)),
    );
  };

  const togglePaymentSelection = (paymentId: string) => {
    setSelectedPaymentIds((current) =>
      current.includes(paymentId)
        ? current.filter((item) => item !== paymentId)
        : [...current, paymentId],
    );
  };

  const moveSelectedPaymentsToAgreement = () => {
    if (!selectedPaymentIds.length) return;

    selectedPaymentIds.forEach((paymentId) => updatePaymentStatus(paymentId, 'agreement'));
    setSelectedPaymentIds([]);

    toast({
      title: 'Cartera actualizada',
      description: 'Los pagos seleccionados pasaron a seguimiento en acuerdo.',
    });
  };

  const closeFirstMaintenance = () => {
    const nextMaintenance = pendingMaintenance[0];
    if (!nextMaintenance) return;

    updateMaintenanceStatus(nextMaintenance.id, 'completed');

    toast({
      title: 'Mantenimiento cerrado',
      description: `${nextMaintenance.title} quedo marcado como completado.`,
    });
  };

  const toggleProviderFollow = (providerId: string) => {
    setFollowedProviderIds((current) =>
      current.includes(providerId)
        ? current.filter((item) => item !== providerId)
        : [...current, providerId],
    );
  };

  const toggleAdoptionChannel = (channel: string) => {
    setAdoptionChannels((current) =>
      current.includes(channel)
        ? current.filter((item) => item !== channel)
        : [...current, channel],
    );
  };

  const generateSummary = () => {
    setSummaryVersion((current) => current + 1);
    toast({
      title: 'Resumen actualizado',
      description: `Se genero un nuevo resumen ${summaryMode === 'daily' ? 'diario' : 'semanal'}.`,
    });
  };

  const summaryText =
    summaryMode === 'daily'
      ? `Hoy tienes ${visibleAlerts.length} alertas activas, ${openPqrs.length} PQRS abiertas y ${pendingMaintenance.length} mantenimientos por mover.`
      : `Esta semana el tablero consolida ${overduePayments.length} casos de cartera, ${unauthorizedAccess.length} novedades de seguridad y ${completedWorkOrders.length} cierres tecnicos.`;

  const renderFeatureCard = (feature: FeatureDefinition) => {
    const accessLevel = feature.access[roleId] ?? 'NONE';
    const writable = canManage(accessLevel);
    const adminMode = isFullAccess(accessLevel);
    const selectedCount = tasks.filter((task) => !task.done).length;

    switch (feature.id) {
      case 'm12_priority_alerts':
        return (
          <FeatureCard
            key={feature.id}
            feature={feature}
            accessLevel={accessLevel}
            summary={`${visibleAlerts.length} alertas activas listas para seguimiento.`}
          >
            <div className="space-y-3">
              {visibleAlerts.map((alert) => (
                <label
                  key={alert.id}
                  className="flex items-start gap-3 rounded-2xl border border-black/8 bg-[#FBFCFE] px-4 py-3"
                >
                  <Checkbox
                    checked={reviewedAlertIds.includes(alert.id)}
                    onCheckedChange={() => toggleAlertReview(alert.id)}
                    disabled={!writable}
                  />
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <p className="text-sm font-semibold text-[#0D2654]">{alert.title}</p>
                      <Badge variant={badgeForSeverity(alert.severity)}>{alert.severity}</Badge>
                    </div>
                    <p className="mt-1 text-xs text-[#52627A]">{alert.detail}</p>
                  </div>
                </label>
              ))}

              {!visibleAlerts.length && (
                <div className="rounded-2xl border border-dashed border-black/12 px-4 py-5 text-sm text-[#52627A]">
                  No hay alertas pendientes en este momento.
                </div>
              )}

              <div className="flex flex-wrap gap-2">
                <Button size="sm" onClick={clearReviewedAlerts} disabled={!writable}>
                  Limpiar revisadas
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() =>
                    toast({
                      title: 'Nueva alerta preparada',
                      description: 'El panel deja listo un nuevo registro prioritario.',
                    })
                  }
                >
                  Crear alerta
                </Button>
              </div>
            </div>
          </FeatureCard>
        );

      case 'm12_historical_comparatives':
        return (
          <FeatureCard
            key={feature.id}
            feature={feature}
            accessLevel={accessLevel}
            summary={`${comparisonCurrent.label} con comparacion ${comparisonRange}.`}
          >
            <div className="flex flex-wrap gap-2">
              {(['payments', 'pqrs', 'occupancy'] as ComparisonMetric[]).map((metric) => (
                <button
                  key={metric}
                  onClick={() => setComparisonMetric(metric)}
                  className={`rounded-full px-3 py-2 text-sm font-semibold transition ${
                    comparisonMetric === metric
                      ? 'bg-[#0F7A5C]/12 text-[#0F7A5C]'
                      : 'bg-[#F4F7FB] text-[#52627A] hover:bg-[#EAF0F8]'
                  }`}
                >
                  {metric === 'payments' ? 'Cartera' : metric === 'pqrs' ? 'PQRS' : 'Ocupacion'}
                </button>
              ))}
            </div>

            <Select value={comparisonRange} onValueChange={(value) => setComparisonRange(value as ComparisonRange)}>
              <SelectTrigger className="rounded-2xl border-black/8 bg-[#FBFCFE]">
                <SelectValue placeholder="Selecciona un periodo" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="30d">Ultimos 30 dias</SelectItem>
                <SelectItem value="90d">Ultimos 90 dias</SelectItem>
                <SelectItem value="12m">Ultimos 12 meses</SelectItem>
              </SelectContent>
            </Select>

            <div className="grid gap-3 sm:grid-cols-2">
              <div className="rounded-2xl bg-[#F8FBFF] p-4">
                <p className="text-xs uppercase tracking-[0.12em] text-[#6B7280]">Actual</p>
                <p className="mt-2 text-2xl font-bold text-[#0D2654]">
                  {comparisonCurrent.formatter(comparisonCurrent.current)}
                </p>
              </div>
              <div className="rounded-2xl bg-[#F8FBFF] p-4">
                <p className="text-xs uppercase tracking-[0.12em] text-[#6B7280]">Periodo previo</p>
                <p className="mt-2 text-2xl font-bold text-[#0D2654]">
                  {comparisonCurrent.formatter(comparisonCurrent.previous)}
                </p>
              </div>
            </div>

            <div className="rounded-2xl border border-black/8 px-4 py-3">
              <div className="flex items-center justify-between text-sm">
                <span className="text-[#52627A]">Variacion</span>
                <Badge variant={comparisonDelta >= 0 ? 'warning' : 'success'}>
                  {comparisonDelta >= 0 ? '+' : ''}
                  {comparisonCurrent.formatter(comparisonDelta)}
                </Badge>
              </div>
              <Progress
                value={Math.min(100, Math.max(10, (comparisonCurrent.current / Math.max(comparisonCurrent.previous, 1)) * 50))}
                className="mt-3 h-3"
              />
            </div>
          </FeatureCard>
        );

      case 'm12_daily_weekly_summary':
        return (
          <FeatureCard
            key={feature.id}
            feature={feature}
            accessLevel={accessLevel}
            summary={`Resumen ${summaryMode === 'daily' ? 'diario' : 'semanal'} v${summaryVersion}.`}
          >
            <div className="flex flex-wrap gap-2">
              {(['daily', 'weekly'] as SummaryMode[]).map((mode) => (
                <button
                  key={mode}
                  onClick={() => setSummaryMode(mode)}
                  className={`rounded-full px-3 py-2 text-sm font-semibold transition ${
                    summaryMode === mode
                      ? 'bg-[#0D2654] text-white'
                      : 'bg-[#F4F7FB] text-[#52627A] hover:bg-[#EAF0F8]'
                  }`}
                >
                  {mode === 'daily' ? 'Diario' : 'Semanal'}
                </button>
              ))}
            </div>

            <div className="rounded-2xl border border-black/8 bg-[#FBFCFE] p-4">
              <p className="text-sm leading-6 text-[#52627A]">{summaryText}</p>
            </div>

            <Button size="sm" onClick={generateSummary}>
              Generar resumen
            </Button>
          </FeatureCard>
        );

      case 'm12_drill_down_by_module':
        return (
          <FeatureCard
            key={feature.id}
            feature={feature}
            accessLevel={accessLevel}
            summary={`Detalle rapido del modulo ${selectedModule}.`}
          >
            <div className="flex flex-wrap gap-2">
              {(Object.keys(MODULE_ROUTES) as Array<keyof typeof MODULE_ROUTES>).map((moduleName) => (
                <button
                  key={moduleName}
                  onClick={() => setSelectedModule(moduleName)}
                  className={`rounded-full px-3 py-2 text-sm font-semibold transition ${
                    selectedModule === moduleName
                      ? 'bg-[#0F7A5C]/12 text-[#0F7A5C]'
                      : 'bg-[#F4F7FB] text-[#52627A] hover:bg-[#EAF0F8]'
                  }`}
                >
                  {moduleName}
                </button>
              ))}
            </div>

            <div className="rounded-2xl border border-black/8 bg-[#FBFCFE] p-4">
              <p className="text-xs uppercase tracking-[0.12em] text-[#6B7280]">{selectedModule}</p>
              <p className="mt-2 text-3xl font-bold text-[#0D2654]">{selectedModuleInsight.total}</p>
              <p className="mt-1 text-sm text-[#52627A]">{selectedModuleInsight.detail}</p>
            </div>

            <Button size="sm" variant="outline" onClick={() => navigate(MODULE_ROUTES[selectedModule])}>
              Abrir detalle
              <ChevronRight className="h-4 w-4" />
            </Button>
          </FeatureCard>
        );

      case 'm12_risk_ranking':
        return (
          <FeatureCard
            key={feature.id}
            feature={feature}
            accessLevel={accessLevel}
            summary={`Ranking ${riskMode === 'critical' ? 'por criticidad' : 'balanceado'} de riesgos.`}
          >
            <div className="flex flex-wrap gap-2">
              <Button
                size="sm"
                variant={riskMode === 'critical' ? 'secondary' : 'outline'}
                onClick={() => setRiskMode('critical')}
              >
                Criticidad
              </Button>
              <Button
                size="sm"
                variant={riskMode === 'balanced' ? 'secondary' : 'outline'}
                onClick={() => setRiskMode('balanced')}
              >
                Balanceado
              </Button>
            </div>

            <div className="space-y-3">
              {riskItems.map((risk, index) => (
                <div key={risk.id} className="rounded-2xl border border-black/8 bg-[#FBFCFE] px-4 py-3">
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <p className="text-sm font-semibold text-[#0D2654]">
                        {index + 1}. {risk.label}
                      </p>
                      <p className="text-xs text-[#52627A]">{risk.owner}</p>
                    </div>
                    <Badge variant={risk.score >= 80 ? 'destructive' : 'warning'}>{risk.score}/100</Badge>
                  </div>
                </div>
              ))}
            </div>

            <Button
              size="sm"
              variant="outline"
              disabled={!writable}
              onClick={() =>
                toast({
                  title: 'Seguimiento registrado',
                  description: 'El riesgo mas alto quedo marcado para revision.',
                })
              }
            >
              Registrar seguimiento
            </Button>
          </FeatureCard>
        );

      case 'm12_operational_heatmap':
        return (
          <FeatureCard
            key={feature.id}
            feature={feature}
            accessLevel={accessLevel}
            summary={`Mapa de calor ${heatmapWindow === 'today' ? 'de hoy' : 'de los ultimos 7 dias'}.`}
          >
            <div className="flex flex-wrap gap-2">
              <Button
                size="sm"
                variant={heatmapWindow === 'today' ? 'secondary' : 'outline'}
                onClick={() => setHeatmapWindow('today')}
              >
                Hoy
              </Button>
              <Button
                size="sm"
                variant={heatmapWindow === 'week' ? 'secondary' : 'outline'}
                onClick={() => setHeatmapWindow('week')}
              >
                7 dias
              </Button>
            </div>

            <div className="grid grid-cols-2 gap-3">
              {heatmapAreas.map((area) => (
                <div
                  key={area.name}
                  className="rounded-2xl border border-black/8 p-4"
                  style={{ backgroundColor: intensityColor(area.level) }}
                >
                  <p className="text-sm font-semibold text-[#0D2654]">{area.name}</p>
                  <p className="mt-2 text-2xl font-bold text-[#0D2654]">{area.level}%</p>
                  <p className="mt-1 text-xs text-[#52627A]">{area.detail}</p>
                </div>
              ))}
            </div>
          </FeatureCard>
        );

      case 'm12_pending_tasks':
        return (
          <FeatureCard
            key={feature.id}
            feature={feature}
            accessLevel={accessLevel}
            summary={`${selectedCount} tareas siguen abiertas en este panel.`}
          >
            <div className="space-y-3">
              {tasks.map((task) => (
                <label
                  key={task.id}
                  className="flex items-start gap-3 rounded-2xl border border-black/8 bg-[#FBFCFE] px-4 py-3"
                >
                  <Checkbox checked={task.done} onCheckedChange={() => toggleTask(task.id)} disabled={!writable} />
                  <span className={`text-sm ${task.done ? 'text-[#8A94A6] line-through' : 'text-[#0D2654]'}`}>
                    {task.label}
                  </span>
                </label>
              ))}
            </div>

            <div className="flex gap-2">
              <Input
                value={taskDraft}
                onChange={(event) => setTaskDraft(event.target.value)}
                placeholder="Nueva tarea del panel"
                disabled={!writable}
              />
              <Button size="sm" onClick={addTask} disabled={!writable}>
                Agregar
              </Button>
            </div>
          </FeatureCard>
        );

      case 'm12_sla_semaphores':
        return (
          <FeatureCard
            key={feature.id}
            feature={feature}
            accessLevel={accessLevel}
            summary={`Semaforos ${strictSla ? 'estrictos' : 'flexibles'} para el equipo.`}
          >
            <div className="flex items-center justify-between rounded-2xl bg-[#F8FBFF] px-4 py-3">
              <div>
                <p className="text-sm font-semibold text-[#0D2654]">Modo de control</p>
                <p className="text-xs text-[#52627A]">Ajusta cuando una gestion pasa a alerta.</p>
              </div>
              <Switch checked={strictSla} onCheckedChange={setStrictSla} disabled={!writable} />
            </div>

            <div className="space-y-3">
              {visibleSla.map((row) => (
                <div key={row.label} className="rounded-2xl border border-black/8 bg-[#FBFCFE] p-4">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-semibold text-[#0D2654]">{row.label}</p>
                    <div className="flex gap-2">
                      <Badge variant="success">{row.ok} verde</Badge>
                      <Badge variant="warning">{row.warning} amarillo</Badge>
                      <Badge variant="destructive">{row.late} rojo</Badge>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </FeatureCard>
        );

      case 'm12_portfolio_board':
        return (
          <FeatureCard
            key={feature.id}
            feature={feature}
            accessLevel={accessLevel}
            summary={`${portfolioRows.length} registros visibles en cartera.`}
          >
            <Select value={portfolioFilter} onValueChange={(value) => setPortfolioFilter(value as PortfolioFilter)}>
              <SelectTrigger className="rounded-2xl border-black/8 bg-[#FBFCFE]">
                <SelectValue placeholder="Filtrar cartera" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="overdue">Solo vencidos</SelectItem>
                <SelectItem value="agreements">En acuerdo</SelectItem>
                <SelectItem value="all">Todos</SelectItem>
              </SelectContent>
            </Select>

            <div className="space-y-3">
              {portfolioRows.map((payment) => (
                <label
                  key={payment.id}
                  className="flex items-start gap-3 rounded-2xl border border-black/8 bg-[#FBFCFE] px-4 py-3"
                >
                  <Checkbox
                    checked={selectedPaymentIds.includes(payment.id)}
                    onCheckedChange={() => togglePaymentSelection(payment.id)}
                    disabled={!writable}
                  />
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <p className="text-sm font-semibold text-[#0D2654]">
                        {payment.unit} - {payment.owner}
                      </p>
                      <Badge variant={payment.status === 'overdue' ? 'destructive' : 'warning'}>
                        {payment.status}
                      </Badge>
                    </div>
                    <p className="mt-1 text-xs text-[#52627A]">
                      {payment.concept} - saldo {formatCurrency(payment.balance)}
                    </p>
                  </div>
                </label>
              ))}

              {!portfolioRows.length && (
                <div className="rounded-2xl border border-dashed border-black/12 px-4 py-5 text-sm text-[#52627A]">
                  No hay registros para el filtro seleccionado.
                </div>
              )}
            </div>

            <div className="flex flex-wrap gap-2">
              <Button size="sm" onClick={moveSelectedPaymentsToAgreement} disabled={!writable || !selectedPaymentIds.length}>
                Pasar a acuerdo
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={() =>
                  toast({
                    title: 'Recordatorio listo',
                    description: 'El panel preparo el envio de cobro para los registros visibles.',
                  })
                }
              >
                Enviar cobro
              </Button>
            </div>
          </FeatureCard>
        );

      case 'm12_security_board':
        return (
          <FeatureCard
            key={feature.id}
            feature={feature}
            accessLevel={accessLevel}
            summary={`${unauthorizedAccess.length} novedades y monitoreo ${securityMonitoring ? 'activo' : 'pausado'}.`}
          >
            <div className="flex items-center justify-between rounded-2xl bg-[#F8FBFF] px-4 py-3">
              <div>
                <p className="text-sm font-semibold text-[#0D2654]">Monitoreo de seguridad</p>
                <p className="text-xs text-[#52627A]">Activa o pausa el seguimiento del tablero.</p>
              </div>
              <Switch checked={securityMonitoring} onCheckedChange={setSecurityMonitoring} disabled={!writable} />
            </div>

            <div className="space-y-3">
              {securityRows.map((log) => (
                <div key={log.id} className="rounded-2xl border border-black/8 bg-[#FBFCFE] px-4 py-3">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <p className="text-sm font-semibold text-[#0D2654]">{log.person}</p>
                    <Badge variant={log.authorized ? 'success' : 'destructive'}>
                      {log.authorized ? 'Autorizado' : 'Con novedad'}
                    </Badge>
                  </div>
                  <p className="mt-1 text-xs text-[#52627A]">
                    {log.destination} - {log.date} {log.time}
                  </p>
                </div>
              ))}
            </div>

            <Button size="sm" variant="outline" onClick={() => navigate('/seguridad')}>
              Abrir control de seguridad
              <ChevronRight className="h-4 w-4" />
            </Button>
          </FeatureCard>
        );

      case 'm12_maintenance_productivity': {
        const totalOrders =
          productivityWindow === 'week'
            ? Math.max(openWorkOrders.length, 1)
            : Math.max(openWorkOrders.length + completedWorkOrders.length, 1);
        const completedOrders =
          productivityWindow === 'week'
            ? Math.min(completedWorkOrders.length, totalOrders)
            : completedWorkOrders.length;
        const progress = Math.min(100, Math.round((completedOrders / totalOrders) * 100));

        return (
          <FeatureCard
            key={feature.id}
            feature={feature}
            accessLevel={accessLevel}
            summary={`${progress}% de productividad en ${productivityWindow === 'week' ? 'la semana' : 'el mes'}.`}
          >
            <div className="flex flex-wrap gap-2">
              <Button
                size="sm"
                variant={productivityWindow === 'week' ? 'secondary' : 'outline'}
                onClick={() => setProductivityWindow('week')}
              >
                Semana
              </Button>
              <Button
                size="sm"
                variant={productivityWindow === 'month' ? 'secondary' : 'outline'}
                onClick={() => setProductivityWindow('month')}
              >
                Mes
              </Button>
            </div>

            <div className="rounded-2xl border border-black/8 bg-[#FBFCFE] p-4">
              <div className="flex items-center justify-between text-sm">
                <span className="text-[#52627A]">Avance de OT</span>
                <span className="font-semibold text-[#0D2654]">
                  {completedOrders}/{totalOrders}
                </span>
              </div>
              <Progress value={progress} className="mt-3 h-3" />
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              <div className="rounded-2xl bg-[#F8FBFF] p-4">
                <p className="text-xs uppercase tracking-[0.12em] text-[#6B7280]">En curso</p>
                <p className="mt-2 text-2xl font-bold text-[#0D2654]">{openWorkOrders.length}</p>
              </div>
              <div className="rounded-2xl bg-[#F8FBFF] p-4">
                <p className="text-xs uppercase tracking-[0.12em] text-[#6B7280]">Completadas</p>
                <p className="mt-2 text-2xl font-bold text-[#0D2654]">{completedWorkOrders.length}</p>
              </div>
            </div>

            <Button size="sm" onClick={closeFirstMaintenance} disabled={!adminMode || !pendingMaintenance.length}>
              Cerrar primera OT
            </Button>
          </FeatureCard>
        );
      }

      case 'm12_provider_status':
        return (
          <FeatureCard
            key={feature.id}
            feature={feature}
            accessLevel={accessLevel}
            summary={`${activeProviders.length} proveedores activos con promedio ${averageProviderRating}.`}
          >
            <div className="space-y-3">
              {providerRows.map((provider) => (
                <label
                  key={provider.id}
                  className="flex items-start gap-3 rounded-2xl border border-black/8 bg-[#FBFCFE] px-4 py-3"
                >
                  <Checkbox
                    checked={followedProviderIds.includes(provider.id)}
                    onCheckedChange={() => toggleProviderFollow(provider.id)}
                    disabled={!writable}
                  />
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <p className="text-sm font-semibold text-[#0D2654]">{provider.name}</p>
                      <Badge variant={provider.status === 'active' ? 'success' : 'warning'}>
                        {provider.status}
                      </Badge>
                    </div>
                    <p className="mt-1 text-xs text-[#52627A]">
                      {provider.serviceType} - rating {provider.rating} - {provider.totalJobs} trabajos
                    </p>
                  </div>
                </label>
              ))}
            </div>

            <Button
              size="sm"
              variant="outline"
              onClick={() =>
                toast({
                  title: 'Seguimiento de proveedores',
                  description: 'Los proveedores marcados quedaron en revision prioritaria.',
                })
              }
            >
              Solicitar seguimiento
            </Button>
          </FeatureCard>
        );

      case 'm12_digital_adoption':
        return (
          <FeatureCard
            key={feature.id}
            feature={feature}
            accessLevel={accessLevel}
            summary={`${adoptionRate}% de adopcion digital estimada en el conjunto.`}
          >
            <div className="rounded-2xl border border-black/8 bg-[#FBFCFE] p-4">
              <div className="flex items-center justify-between text-sm">
                <span className="text-[#52627A]">Cobertura digital</span>
                <span className="font-semibold text-[#0D2654]">{adoptionRate}%</span>
              </div>
              <Progress value={adoptionRate} className="mt-3 h-3" />
            </div>

            <div className="flex items-center justify-between rounded-2xl bg-[#F8FBFF] px-4 py-3">
              <div>
                <p className="text-sm font-semibold text-[#0D2654]">Recordatorio automatico</p>
                <p className="text-xs text-[#52627A]">Activa el seguimiento sobre residentes inactivos.</p>
              </div>
              <Switch checked={adoptionAutomation} onCheckedChange={setAdoptionAutomation} disabled={!writable} />
            </div>

            <div className="grid gap-3 sm:grid-cols-3">
              {[
                { id: 'app', label: 'App' },
                { id: 'email', label: 'Email' },
                { id: 'whatsapp', label: 'WhatsApp' },
              ].map((channel) => (
                <label key={channel.id} className="flex items-center gap-3 rounded-2xl border border-black/8 bg-[#FBFCFE] px-4 py-3">
                  <Checkbox
                    checked={adoptionChannels.includes(channel.id)}
                    onCheckedChange={() => toggleAdoptionChannel(channel.id)}
                    disabled={!writable}
                  />
                  <span className="text-sm text-[#0D2654]">{channel.label}</span>
                </label>
              ))}
            </div>

            <Button
              size="sm"
              onClick={() => {
                setAdoptionBoost((current) => Math.min(20, current + 4));
                toast({
                  title: 'Campana lanzada',
                  description: 'El panel preparo una activacion digital para residentes.',
                });
              }}
              disabled={!writable || !adoptionChannels.length}
            >
              Lanzar campana
            </Button>
          </FeatureCard>
        );

      default:
        return (
          <FeatureCard
            key={feature.id}
            feature={feature}
            accessLevel={accessLevel}
            summary="Funcion disponible en el panel del administrador."
          >
            <div className="rounded-2xl border border-dashed border-black/12 px-4 py-5 text-sm text-[#52627A]">
              Esta funcion ya quedo conectada al panel operativo.
            </div>
          </FeatureCard>
        );
    }
  };

  return <div className="grid gap-6 xl:grid-cols-2 2xl:grid-cols-3">{dashboardFeatures.map(renderFeatureCard)}</div>;
};

export default DashboardFeatureWorkbench;
