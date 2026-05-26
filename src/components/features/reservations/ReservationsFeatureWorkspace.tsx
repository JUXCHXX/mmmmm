import { useMemo, useState } from 'react';
import type { AccessLevel, RoleId } from '@/types/roles';
import { useAuthStore } from '@/store/useAuthStore';
import { FeatureActionButtons, FeatureSectionCard } from '@/components/features/shared/FeatureActionShell';
import { FeatureWorkspaceTable, type FeatureTableColumn } from '@/components/features/shared/FeatureWorkspaceTable';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from '@/hooks/use-toast';
import { formatCurrency } from '@/utils/metrics';
import { downloadMockPdf } from '@/utils/mockPdf';

type ReservationFeatureId =
  | 'm06_space_policies'
  | 'm06_user_quota_limits'
  | 'm06_visual_calendar'
  | 'm06_mora_restrictions'
  | 'm06_payments_and_deposits'
  | 'm06_non_use_penalties'
  | 'm06_waiting_list'
  | 'm06_rules_based_approval'
  | 'm06_special_hours'
  | 'm06_maintenance_blocks'
  | 'm06_check_in_out'
  | 'm06_space_condition_evidence'
  | 'm06_reservation_history'
  | 'm06_space_usage_analytics';

type ReservationStatus = 'Confirmada' | 'Pendiente' | 'Rechazada' | 'Cancelada';

interface AreaRow {
  id: string;
  name: string;
  capacity: number;
  fee: number;
  approvalRequired: boolean;
}

interface ReservationRow {
  id: string;
  areaId: string;
  area: string;
  resident: string;
  unit: string;
  date: string;
  timeSlot: string;
  status: ReservationStatus;
  guests: number;
  deposit: number;
  paymentStatus: 'Pagado' | 'Pendiente' | 'No aplica';
  checkState: 'Pendiente' | 'Check-in' | 'Check-out';
  evidence: string;
}

interface WaitlistRow {
  id: string;
  resident: string;
  unit: string;
  area: string;
  date: string;
  priority: string;
}

interface PenaltyRow {
  id: string;
  resident: string;
  unit: string;
  area: string;
  amount: number;
  status: 'Pendiente' | 'Aplicada' | 'Condonada';
}

interface RuleRow {
  id: string;
  name: string;
  scope: string;
  trigger: string;
  active: boolean;
}

interface SpecialHourRow {
  id: string;
  area: string;
  date: string;
  schedule: string;
  reason: string;
}

interface BlockRow {
  id: string;
  area: string;
  dateRange: string;
  reason: string;
  status: 'Activo' | 'Liberado';
}

interface QuotaRow {
  id: string;
  profile: string;
  monthlyLimit: string;
  overlap: string;
  exception: string;
}

interface MoraRow {
  id: string;
  unit: string;
  resident: string;
  debt: number;
  affectedAreas: string;
  status: string;
}

const INITIAL_AREAS: AreaRow[] = [
  { id: 'area-salon', name: 'Salon comunal', capacity: 80, fee: 220000, approvalRequired: true },
  { id: 'area-bbq', name: 'BBQ', capacity: 25, fee: 120000, approvalRequired: false },
  { id: 'area-piscina', name: 'Piscina', capacity: 40, fee: 0, approvalRequired: false },
  { id: 'area-gimnasio', name: 'Gimnasio', capacity: 20, fee: 0, approvalRequired: false },
  { id: 'area-cancha', name: 'Cancha', capacity: 24, fee: 60000, approvalRequired: false },
];

const INITIAL_RESERVATIONS: ReservationRow[] = [
  { id: 'res-01', areaId: 'area-salon', area: 'Salon comunal', resident: 'Paula Rios', unit: 'Torre A - 402', date: '2026-05-28', timeSlot: '18:00 - 23:00', status: 'Pendiente', guests: 35, deposit: 180000, paymentStatus: 'Pendiente', checkState: 'Pendiente', evidence: 'Pendiente acta de entrega' },
  { id: 'res-02', areaId: 'area-bbq', area: 'BBQ', resident: 'Luis Torres', unit: 'Torre B - 504', date: '2026-05-29', timeSlot: '12:00 - 16:00', status: 'Confirmada', guests: 12, deposit: 80000, paymentStatus: 'Pagado', checkState: 'Pendiente', evidence: '2 fotos previas' },
  { id: 'res-03', areaId: 'area-piscina', area: 'Piscina', resident: 'Sara Molina', unit: 'Torre C - 203', date: '2026-05-30', timeSlot: '09:00 - 12:00', status: 'Pendiente', guests: 6, deposit: 0, paymentStatus: 'No aplica', checkState: 'Pendiente', evidence: 'Sin novedad' },
  { id: 'res-04', areaId: 'area-gimnasio', area: 'Gimnasio', resident: 'Mauricio Leon', unit: 'Torre A - 1201', date: '2026-05-31', timeSlot: '06:00 - 07:30', status: 'Confirmada', guests: 1, deposit: 0, paymentStatus: 'No aplica', checkState: 'Check-in', evidence: 'Acceso por QR' },
  { id: 'res-05', areaId: 'area-cancha', area: 'Cancha', resident: 'Monica Ospina', unit: 'Torre A - 1203', date: '2026-06-01', timeSlot: '17:00 - 19:00', status: 'Rechazada', guests: 10, deposit: 0, paymentStatus: 'No aplica', checkState: 'Pendiente', evidence: 'Cruce con torneo interno' },
  { id: 'res-06', areaId: 'area-salon', area: 'Salon comunal', resident: 'Laura Gomez', unit: 'Torre D - 601', date: '2026-06-02', timeSlot: '15:00 - 21:00', status: 'Confirmada', guests: 28, deposit: 180000, paymentStatus: 'Pagado', checkState: 'Pendiente', evidence: 'Acta de entrega cargada' },
  { id: 'res-07', areaId: 'area-piscina', area: 'Piscina', resident: 'Andres Prieto', unit: 'Torre B - 308', date: '2026-06-03', timeSlot: '10:00 - 12:00', status: 'Cancelada', guests: 4, deposit: 0, paymentStatus: 'No aplica', checkState: 'Check-out', evidence: 'Cancelada por lluvia' },
];

const INITIAL_WAITLIST: WaitlistRow[] = [
  { id: 'wait-01', resident: 'Carolina Mejia', unit: 'Torre D - 401', area: 'Salon comunal', date: '2026-05-28', priority: '1 de la fila' },
  { id: 'wait-02', resident: 'Javier Pardo', unit: 'Torre C - 1102', area: 'BBQ', date: '2026-05-29', priority: '2 de la fila' },
  { id: 'wait-03', resident: 'Natalia Cardenas', unit: 'Torre A - 208', area: 'Cancha', date: '2026-06-01', priority: 'Flexible' },
];

const INITIAL_PENALTIES: PenaltyRow[] = [
  { id: 'pen-01', resident: 'Nicolas Ruiz', unit: 'Torre C - 904', area: 'Salon comunal', amount: 70000, status: 'Pendiente' },
  { id: 'pen-02', resident: 'Sara Rojas', unit: 'Torre A - 604', area: 'BBQ', amount: 45000, status: 'Aplicada' },
];

const INITIAL_RULES: RuleRow[] = [
  { id: 'rule-01', name: 'Aprobar eventos pequenos', scope: 'Salon comunal', trigger: 'Menos de 20 invitados y sin mora', active: true },
  { id: 'rule-02', name: 'Escalar musica nocturna', scope: 'BBQ', trigger: 'Despues de las 20:00', active: true },
  { id: 'rule-03', name: 'Bloquear si supera cupo mensual', scope: 'Cancha', trigger: 'Mas de 2 reservas por mes en arrendatarios', active: false },
];

const INITIAL_SPECIAL_HOURS: SpecialHourRow[] = [
  { id: 'sp-01', area: 'Piscina', date: '2026-05-31', schedule: '06:00 - 20:00', reason: 'Temporada alta' },
  { id: 'sp-02', area: 'Salon comunal', date: '2026-06-03', schedule: 'Cerrado 08:00 - 14:00', reason: 'Asamblea extraordinaria' },
];

const INITIAL_BLOCKS: BlockRow[] = [
  { id: 'block-01', area: 'Gimnasio', dateRange: '2026-05-27 06:00 a 2026-05-28 18:00', reason: 'Cambio de piso', status: 'Activo' },
  { id: 'block-02', area: 'Piscina', dateRange: '2026-06-02 07:00 a 2026-06-02 17:00', reason: 'Lavado y balance quimico', status: 'Activo' },
];

const QUOTA_ROWS: QuotaRow[] = [
  { id: 'quota-01', profile: 'Propietario', monthlyLimit: '4 reservas', overlap: '1 simultanea', exception: 'Eventos institucionales' },
  { id: 'quota-02', profile: 'Arrendatario', monthlyLimit: '2 reservas', overlap: '1 simultanea', exception: 'Sin excepciones activas' },
  { id: 'quota-03', profile: 'Consejo', monthlyLimit: '6 reservas', overlap: '2 simultaneas', exception: 'Jornadas del conjunto' },
];

const MORA_ROWS: MoraRow[] = [
  { id: 'mora-01', unit: 'Torre B - 504', resident: 'Luis Torres', debt: 1980000, affectedAreas: 'Salon comunal, BBQ', status: 'Bloqueada hasta abono' },
  { id: 'mora-02', unit: 'Torre A - 1203', resident: 'Monica Ospina', debt: 875000, affectedAreas: 'Salon comunal', status: 'Pendiente validacion de acuerdo' },
];

const statusPill = (value: string) => {
  const tone =
    value === 'Confirmada' || value === 'Pagado' || value === 'Aplicada' || value === 'Activo' || value === 'Check-in'
      ? 'bg-emerald-100 text-emerald-700'
      : value === 'Pendiente' || value === 'No aplica'
      ? 'bg-amber-100 text-amber-700'
      : 'bg-rose-100 text-rose-700';

  return <span className={`rounded-full px-3 py-1 text-xs font-semibold ${tone}`}>{value}</span>;
};

const formatShortDate = (value: string) =>
  new Date(value).toLocaleDateString('es-CO', { day: '2-digit', month: 'short' });

const BASE_CALENDAR_MONTH = new Date(2026, 4, 1);

export const ReservationsFeatureWorkspace = ({
  featureId,
  accessLevel,
  roleId,
}: {
  featureId: ReservationFeatureId;
  accessLevel: AccessLevel;
  roleId: RoleId;
}) => {
  const user = useAuthStore((state) => state.user);
  const [areas] = useState<AreaRow[]>(INITIAL_AREAS);
  const [reservations, setReservations] = useState<ReservationRow[]>(INITIAL_RESERVATIONS);
  const [waitlist, setWaitlist] = useState<WaitlistRow[]>(INITIAL_WAITLIST);
  const [penalties, setPenalties] = useState<PenaltyRow[]>(INITIAL_PENALTIES);
  const [rules, setRules] = useState<RuleRow[]>(INITIAL_RULES);
  const [specialHours] = useState<SpecialHourRow[]>(INITIAL_SPECIAL_HOURS);
  const [blocks, setBlocks] = useState<BlockRow[]>(INITIAL_BLOCKS);
  const [areaFilter, setAreaFilter] = useState<string>('all');
  const [monthOffset, setMonthOffset] = useState(0);
  const [selectedDate, setSelectedDate] = useState('2026-05-29');
  const [selectedTimeSlot, setSelectedTimeSlot] = useState('18:00 - 22:00');
  const [guestCount, setGuestCount] = useState('8');
  const [search, setSearch] = useState('');

  const isResidentView =
    roleId === 'arrendatario' ||
    roleId === 'propietario' ||
    accessLevel === 'OWN_DATA_ONLY';

  const residentFallback =
    roleId === 'propietario'
      ? { resident: 'Carolina Mejia', unit: 'Torre D - 401' }
      : { resident: 'Luis Torres', unit: 'Torre B - 504' };

  const activeResident = reservations.find((row) => row.resident === user?.name)
    ? user?.name ?? residentFallback.resident
    : residentFallback.resident;

  const activeUnit = reservations.find((row) => row.resident === user?.name)?.unit ?? residentFallback.unit;

  const filteredReservations = useMemo(() => {
    const normalized = search.trim().toLowerCase();

    return reservations.filter((row) => {
      const scopeMatch = !isResidentView || row.resident === activeResident || row.unit === activeUnit;
      const areaMatch = areaFilter === 'all' || row.areaId === areaFilter;
      const searchMatch =
        !normalized ||
        row.area.toLowerCase().includes(normalized) ||
        row.resident.toLowerCase().includes(normalized) ||
        row.unit.toLowerCase().includes(normalized);

      return scopeMatch && areaMatch && searchMatch;
    });
  }, [activeResident, activeUnit, areaFilter, isResidentView, reservations, search]);

  const calendarMonth = useMemo(() => {
    return new Date(BASE_CALENDAR_MONTH.getFullYear(), BASE_CALENDAR_MONTH.getMonth() + monthOffset, 1);
  }, [monthOffset]);

  const calendarDays = useMemo(() => {
    const year = calendarMonth.getFullYear();
    const month = calendarMonth.getMonth();
    const totalDays = new Date(year, month + 1, 0).getDate();

    return Array.from({ length: totalDays }, (_, index) => {
      const date = new Date(year, month, index + 1);
      const iso = date.toISOString().split('T')[0];
      const dayReservations = reservations.filter(
        (row) => row.date === iso && (areaFilter === 'all' || row.areaId === areaFilter),
      );
      const isBlocked = blocks.some(
        (row) => row.status === 'Activo' && row.dateRange.includes(iso.slice(0, 10)),
      );

      return {
        iso,
        label: date.getDate(),
        reservationCount: dayReservations.length,
        pendingCount: dayReservations.filter((row) => row.status === 'Pendiente').length,
        blocked: isBlocked,
      };
    });
  }, [areaFilter, blocks, calendarMonth, reservations]);

  const usageRows = useMemo(() => {
    return areas.map((area) => {
      const areaReservations = reservations.filter((row) => row.areaId === area.id && row.status !== 'Cancelada');
      return {
        ...area,
        reservations: areaReservations.length,
        occupancy: Math.min(100, areaReservations.length * 18),
      };
    });
  }, [areas, reservations]);

  const handleApprove = (row: ReservationRow) => {
    setReservations((current) =>
      current.map((entry) =>
        entry.id === row.id ? { ...entry, status: 'Confirmada' } : entry,
      ),
    );
    toast({
      title: 'Reserva confirmada',
      description: `${row.area} quedo aprobada para ${row.resident}.`,
    });
  };

  const handleReject = (row: ReservationRow) => {
    setReservations((current) =>
      current.map((entry) =>
        entry.id === row.id ? { ...entry, status: 'Rechazada' } : entry,
      ),
    );
    toast({
      title: 'Reserva rechazada',
      description: `La franja ${row.timeSlot} de ${row.area} quedo liberada.`,
    });
  };

  const handlePromoteWaitlist = (row: WaitlistRow) => {
    const area = areas.find((entry) => entry.name === row.area);
    if (!area) {
      return;
    }

    setReservations((current) => [
      {
        id: `res-${Date.now()}`,
        areaId: area.id,
        area: row.area,
        resident: row.resident,
        unit: row.unit,
        date: row.date,
        timeSlot: '18:00 - 22:00',
        status: 'Pendiente',
        guests: 10,
        deposit: area.fee > 0 ? 80000 : 0,
        paymentStatus: area.fee > 0 ? 'Pendiente' : 'No aplica',
        checkState: 'Pendiente',
        evidence: 'Creada desde lista de espera',
      },
      ...current,
    ]);
    setWaitlist((current) => current.filter((entry) => entry.id !== row.id));
    toast({
      title: 'Solicitud promovida',
      description: `${row.resident} entro a la bandeja de reservas pendientes.`,
    });
  };

  const handleTogglePenalty = (row: PenaltyRow, status: PenaltyRow['status']) => {
    setPenalties((current) =>
      current.map((entry) => (entry.id === row.id ? { ...entry, status } : entry)),
    );
  };

  const handleToggleRule = (row: RuleRow) => {
    setRules((current) =>
      current.map((entry) => (entry.id === row.id ? { ...entry, active: !entry.active } : entry)),
    );
  };

  const handleReleaseBlock = (row: BlockRow) => {
    setBlocks((current) =>
      current.map((entry) => (entry.id === row.id ? { ...entry, status: 'Liberado' } : entry)),
    );
    toast({
      title: 'Bloqueo liberado',
      description: `${row.area} vuelve a mostrarse disponible en la agenda.`,
    });
  };

  const handleToggleDeposit = (row: ReservationRow) => {
    setReservations((current) =>
      current.map((entry) =>
        entry.id === row.id
          ? {
              ...entry,
              paymentStatus: entry.paymentStatus === 'Pagado' ? 'Pendiente' : 'Pagado',
            }
          : entry,
      ),
    );
    toast({
      title: 'Deposito actualizado',
      description: `La reserva de ${row.resident} cambio su estado de recaudo.`,
    });
  };

  const handleCheckState = (row: ReservationRow, nextState: ReservationRow['checkState']) => {
    setReservations((current) =>
      current.map((entry) => (entry.id === row.id ? { ...entry, checkState: nextState } : entry)),
    );
  };

  const handleCreateReservation = () => {
    const area = areas.find((entry) => entry.id === (areaFilter === 'all' ? 'area-salon' : areaFilter));
    if (!area) {
      return;
    }

    setReservations((current) => [
      {
        id: `res-${Date.now()}`,
        areaId: area.id,
        area: area.name,
        resident: activeResident,
        unit: activeUnit,
        date: selectedDate,
        timeSlot: selectedTimeSlot,
        status: isResidentView ? 'Pendiente' : 'Confirmada',
        guests: Number(guestCount) || 1,
        deposit: area.fee > 0 ? 80000 : 0,
        paymentStatus: area.fee > 0 ? 'Pendiente' : 'No aplica',
        checkState: 'Pendiente',
        evidence: 'Solicitud creada desde calendario',
      },
      ...current,
    ]);
    toast({
      title: 'Reserva registrada',
      description: `${area.name} quedo apartada en la fecha seleccionada.`,
    });
  };

  const handleDownloadHistory = () => {
    downloadMockPdf({
      fileName: 'historial-reservas-bunty.pdf',
      title: 'Historial de reservas',
      lines: filteredReservations.slice(0, 8).map((row) => `${row.date} | ${row.area} | ${row.resident} | ${row.status}`),
    });
    toast({
      title: 'Historial descargado',
      description: 'Se preparo el soporte de reservas visibles en esta vista.',
    });
  };

  const reservationColumns: FeatureTableColumn<ReservationRow>[] = [
    {
      key: 'resident',
      header: isResidentView ? 'Reserva' : 'Residente',
      cell: (row) => (
        <div className="space-y-1">
          <p className="font-semibold text-slate-900">{isResidentView ? row.area : row.resident}</p>
          <p className="text-xs text-slate-500">{isResidentView ? row.timeSlot : row.unit}</p>
        </div>
      ),
    },
    {
      key: 'date',
      header: 'Fecha',
      cell: (row) => (
        <div className="space-y-1">
          <p>{formatShortDate(row.date)}</p>
          <p className="text-xs text-slate-500">{row.timeSlot}</p>
        </div>
      ),
    },
    {
      key: 'status',
      header: 'Estado',
      cell: (row) => statusPill(row.status),
    },
    {
      key: 'guests',
      header: 'Detalle',
      cell: (row) => (
        <div className="space-y-1">
          <p>{row.guests} personas</p>
          <p className="text-xs text-slate-500">{row.paymentStatus}</p>
        </div>
      ),
    },
    {
      key: 'actions',
      header: 'Acciones',
      cell: (row) => (
        <div className="flex flex-wrap justify-end gap-2">
          {row.status === 'Pendiente' && !isResidentView && (
            <>
              <Button size="sm" variant="outline" onClick={() => handleApprove(row)}>
                Aprobar
              </Button>
              <Button size="sm" onClick={() => handleReject(row)}>
                Rechazar
              </Button>
            </>
          )}
          {isResidentView && row.status !== 'Cancelada' && (
            <Button size="sm" variant="outline" onClick={() => handleReject(row)}>
              Cancelar
            </Button>
          )}
        </div>
      ),
      align: 'right',
    },
  ];

  const reservationToolbar = (
    <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
      <div className="flex flex-col gap-3 sm:flex-row">
        <Input
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          placeholder={isResidentView ? 'Buscar en tus reservas...' : 'Buscar residente, unidad o espacio...'}
          className="sm:max-w-sm"
        />
        <select
          value={areaFilter}
          onChange={(event) => setAreaFilter(event.target.value)}
          className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700"
        >
          <option value="all">Todas las zonas</option>
          {areas.map((area) => (
            <option key={area.id} value={area.id}>
              {area.name}
            </option>
          ))}
        </select>
      </div>

      <div className="flex gap-2">
        <Button variant="outline" onClick={handleDownloadHistory}>
          Descargar historial
        </Button>
      </div>
    </div>
  );

  const renderReservationsTable = (title: string, description: string) => (
    <FeatureWorkspaceTable
      title={title}
      description={description}
      rowKey={(row) => row.id}
      rows={filteredReservations}
      columns={reservationColumns}
      toolbar={reservationToolbar}
      emptyState="No hay reservas para el filtro seleccionado."
    />
  );

  const renderCalendar = () => (
    <FeatureSectionCard
      title={isResidentView ? 'Agenda disponible para reservar' : 'Calendario de disponibilidad'}
      description="Navega mes a mes, revisa ocupacion y registra una nueva solicitud desde la misma vista."
    >
      <div className="space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="space-y-1">
            <p className="text-lg font-semibold text-slate-900">
              {calendarMonth.toLocaleDateString('es-CO', { month: 'long', year: 'numeric' })}
            </p>
            <p className="text-sm text-slate-500">
              Zona activa: {areaFilter === 'all' ? 'todas las zonas' : areas.find((area) => area.id === areaFilter)?.name}
            </p>
          </div>

          <div className="flex gap-2">
            <Button variant="outline" onClick={() => setMonthOffset((current) => current - 1)}>
              Mes anterior
            </Button>
            <Button variant="outline" onClick={() => setMonthOffset((current) => current + 1)}>
              Mes siguiente
            </Button>
          </div>
        </div>

        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-7">
          {calendarDays.map((day) => (
            <button
              key={day.iso}
              type="button"
              onClick={() => setSelectedDate(day.iso)}
              className={`rounded-2xl border p-3 text-left transition ${
                selectedDate === day.iso
                  ? 'border-blue-500 bg-blue-50'
                  : day.blocked
                  ? 'border-rose-200 bg-rose-50'
                  : 'border-slate-200 bg-white hover:border-blue-300'
              }`}
            >
              <p className="text-sm font-semibold text-slate-900">{day.label}</p>
              <p className="mt-2 text-xs text-slate-500">
                {day.blocked
                  ? 'Mantenimiento'
                  : day.reservationCount
                  ? `${day.reservationCount} reservas`
                  : 'Libre'}
              </p>
              {!!day.pendingCount && (
                <p className="mt-1 text-xs font-medium text-amber-700">
                  {day.pendingCount} por aprobar
                </p>
              )}
            </button>
          ))}
        </div>

        <div className="grid gap-4 lg:grid-cols-[1fr_0.9fr]">
          <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
            <p className="text-sm font-semibold text-slate-900">Fecha seleccionada</p>
            <p className="mt-1 text-sm text-slate-600">{selectedDate}</p>
            <div className="mt-4 grid gap-3 md:grid-cols-2">
              <label className="space-y-2">
                <span className="text-sm font-medium text-slate-700">Franja</span>
                <Input value={selectedTimeSlot} onChange={(event) => setSelectedTimeSlot(event.target.value)} />
              </label>
              <label className="space-y-2">
                <span className="text-sm font-medium text-slate-700">Personas</span>
                <Input value={guestCount} onChange={(event) => setGuestCount(event.target.value)} inputMode="numeric" />
              </label>
            </div>

            <div className="mt-4">
              <FeatureActionButtons
                actions={[
                  {
                    label: isResidentView ? 'Solicitar reserva' : 'Crear reserva',
                    onClick: handleCreateReservation,
                  },
                ]}
              />
            </div>
          </div>

          <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-4">
            <p className="text-sm font-semibold text-emerald-700">Resumen del dia</p>
            <div className="mt-3 space-y-2">
              {reservations
                .filter((row) => row.date === selectedDate && (areaFilter === 'all' || row.areaId === areaFilter))
                .slice(0, 4)
                .map((row) => (
                  <div key={row.id} className="rounded-xl bg-white p-3 text-sm text-slate-700">
                    <p className="font-semibold text-slate-900">{row.area}</p>
                    <p>{row.timeSlot}</p>
                    <p className="text-xs text-slate-500">{row.resident}</p>
                  </div>
                ))}

              {!reservations.some(
                (row) => row.date === selectedDate && (areaFilter === 'all' || row.areaId === areaFilter),
              ) && <p className="text-sm text-slate-600">No hay reservas cargadas para esta fecha.</p>}
            </div>
          </div>
        </div>
      </div>
    </FeatureSectionCard>
  );

  const renderPolicies = () => (
    <FeatureWorkspaceTable
      title="Politicas por espacio"
      description="Cada zona muestra cupo, costo y si requiere validacion manual."
      rowKey={(row) => row.id}
      rows={areas}
      columns={[
        {
          key: 'area',
          header: 'Zona',
          cell: (row) => (
            <div className="space-y-1">
              <p className="font-semibold text-slate-900">{row.name}</p>
              <p className="text-xs text-slate-500">Capacidad {row.capacity} personas</p>
            </div>
          ),
        },
        {
          key: 'fee',
          header: 'Costo',
          cell: (row) => formatCurrency(row.fee),
        },
        {
          key: 'approval',
          header: 'Aprobacion',
          cell: (row) => (
            <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700">
              {row.approvalRequired ? 'Manual' : 'Automatica'}
            </span>
          ),
        },
      ]}
    />
  );

  const renderQuotas = () => (
    <FeatureWorkspaceTable
      title="Cupos maximos por perfil"
      description="La tabla muestra limite mensual, simultaneidad y excepciones operativas."
      rowKey={(row) => row.id}
      rows={QUOTA_ROWS}
      columns={[
        {
          key: 'profile',
          header: 'Perfil',
          cell: (row) => (
            <div className="space-y-1">
              <p className="font-semibold text-slate-900">{row.profile}</p>
              <p className="text-xs text-slate-500">{row.exception}</p>
            </div>
          ),
        },
        { key: 'limit', header: 'Limite mensual', cell: (row) => row.monthlyLimit },
        { key: 'overlap', header: 'Simultaneidad', cell: (row) => row.overlap },
      ]}
    />
  );

  const renderMoraRestrictions = () => (
    <FeatureWorkspaceTable
      title={isResidentView ? 'Restricciones visibles por estado de cuenta' : 'Restricciones por mora'}
      description="Identifica que zonas quedan restringidas mientras exista deuda vencida."
      rowKey={(row) => row.id}
      rows={isResidentView ? MORA_ROWS.filter((row) => row.resident === activeResident || row.unit === activeUnit) : MORA_ROWS}
      columns={[
        {
          key: 'unit',
          header: 'Unidad',
          cell: (row) => (
            <div className="space-y-1">
              <p className="font-semibold text-slate-900">{row.unit}</p>
              <p className="text-xs text-slate-500">{row.resident}</p>
            </div>
          ),
        },
        { key: 'debt', header: 'Saldo vencido', cell: (row) => formatCurrency(row.debt) },
        { key: 'areas', header: 'Zonas afectadas', cell: (row) => row.affectedAreas },
        { key: 'status', header: 'Estado', cell: (row) => row.status },
      ]}
    />
  );

  const renderWaitlist = () => (
    <FeatureWorkspaceTable
      title="Lista de espera"
      description="Promueve solicitudes a la bandeja activa cuando se libera una franja."
      rowKey={(row) => row.id}
      rows={isResidentView ? waitlist.filter((row) => row.resident === activeResident) : waitlist}
      columns={[
        {
          key: 'resident',
          header: isResidentView ? 'Solicitud' : 'Residente',
          cell: (row) => (
            <div className="space-y-1">
              <p className="font-semibold text-slate-900">{isResidentView ? row.area : row.resident}</p>
              <p className="text-xs text-slate-500">{row.unit}</p>
            </div>
          ),
        },
        {
          key: 'date',
          header: 'Fecha',
          cell: (row) => formatShortDate(row.date),
        },
        {
          key: 'priority',
          header: 'Prioridad',
          cell: (row) => row.priority,
        },
        {
          key: 'actions',
          header: 'Accion',
          cell: (row) => (
            <div className="flex justify-end">
              {!isResidentView && (
                <Button size="sm" onClick={() => handlePromoteWaitlist(row)}>
                  Promover
                </Button>
              )}
            </div>
          ),
          align: 'right',
        },
      ]}
    />
  );

  const renderDeposits = () => (
    <FeatureWorkspaceTable
      title={isResidentView ? 'Tus depositos y recaudos' : 'Pagos y depositos asociados'}
      description="Controla el recaudo de cada reserva y confirma cuando el soporte ya fue recibido."
      rowKey={(row) => row.id}
      rows={filteredReservations.filter((row) => row.deposit > 0)}
      columns={[
        {
          key: 'reservation',
          header: 'Reserva',
          cell: (row) => (
            <div className="space-y-1">
              <p className="font-semibold text-slate-900">{row.area}</p>
              <p className="text-xs text-slate-500">{row.resident}</p>
            </div>
          ),
        },
        {
          key: 'date',
          header: 'Fecha',
          cell: (row) => formatShortDate(row.date),
        },
        {
          key: 'deposit',
          header: 'Deposito',
          cell: (row) => formatCurrency(row.deposit),
        },
        {
          key: 'actions',
          header: 'Estado',
          cell: (row) => (
            <div className="flex flex-wrap justify-end gap-2">
              {statusPill(row.paymentStatus)}
              <Button size="sm" variant="outline" onClick={() => handleToggleDeposit(row)}>
                Cambiar
              </Button>
            </div>
          ),
          align: 'right',
        },
      ]}
    />
  );

  const renderPenalties = () => (
    <FeatureWorkspaceTable
      title="Penalizaciones por no uso"
      description="Aplica o condona novedades cuando la reserva no se usa o se entrega fuera de tiempo."
      rowKey={(row) => row.id}
      rows={penalties}
      columns={[
        {
          key: 'resident',
          header: 'Cuenta',
          cell: (row) => (
            <div className="space-y-1">
              <p className="font-semibold text-slate-900">{row.resident}</p>
              <p className="text-xs text-slate-500">{row.unit}</p>
            </div>
          ),
        },
        {
          key: 'area',
          header: 'Espacio',
          cell: (row) => row.area,
        },
        {
          key: 'amount',
          header: 'Valor',
          cell: (row) => formatCurrency(row.amount),
        },
        {
          key: 'actions',
          header: 'Estado',
          cell: (row) => (
            <div className="flex flex-wrap justify-end gap-2">
              {statusPill(row.status)}
              <Button size="sm" variant="outline" onClick={() => handleTogglePenalty(row, 'Aplicada')}>
                Aplicar
              </Button>
              <Button size="sm" onClick={() => handleTogglePenalty(row, 'Condonada')}>
                Condonar
              </Button>
            </div>
          ),
          align: 'right',
        },
      ]}
    />
  );

  const renderRules = () => (
    <FeatureWorkspaceTable
      title="Aprobacion por reglas"
      description="Activa o pausa reglas automaticas para agilizar validaciones sobre la agenda."
      rowKey={(row) => row.id}
      rows={rules}
      columns={[
        {
          key: 'name',
          header: 'Regla',
          cell: (row) => (
            <div className="space-y-1">
              <p className="font-semibold text-slate-900">{row.name}</p>
              <p className="text-xs text-slate-500">{row.scope}</p>
            </div>
          ),
        },
        {
          key: 'trigger',
          header: 'Disparo',
          cell: (row) => row.trigger,
        },
        {
          key: 'active',
          header: 'Estado',
          cell: (row) => statusPill(row.active ? 'Activa' : 'Pausada'),
        },
        {
          key: 'actions',
          header: 'Accion',
          cell: (row) => (
            <div className="flex justify-end">
              <Button size="sm" onClick={() => handleToggleRule(row)}>
                {row.active ? 'Pausar' : 'Activar'}
              </Button>
            </div>
          ),
          align: 'right',
        },
      ]}
    />
  );

  const renderSpecialHours = () => (
    <FeatureWorkspaceTable
      title="Horarios especiales"
      description="Consulta excepciones operativas para fines de semana, asambleas o cierres parciales."
      rowKey={(row) => row.id}
      rows={specialHours}
      columns={[
        { key: 'area', header: 'Zona', cell: (row) => row.area },
        { key: 'date', header: 'Fecha', cell: (row) => formatShortDate(row.date) },
        { key: 'schedule', header: 'Horario', cell: (row) => row.schedule },
        { key: 'reason', header: 'Motivo', cell: (row) => row.reason },
      ]}
    />
  );

  const renderBlocks = () => (
    <FeatureWorkspaceTable
      title="Bloqueos por mantenimiento"
      description="Libera o conserva cierres tecnicos para evitar reservas en franjas no disponibles."
      rowKey={(row) => row.id}
      rows={blocks}
      columns={[
        {
          key: 'area',
          header: 'Zona',
          cell: (row) => (
            <div className="space-y-1">
              <p className="font-semibold text-slate-900">{row.area}</p>
              <p className="text-xs text-slate-500">{row.reason}</p>
            </div>
          ),
        },
        { key: 'dateRange', header: 'Ventana', cell: (row) => row.dateRange },
        { key: 'status', header: 'Estado', cell: (row) => statusPill(row.status) },
        {
          key: 'actions',
          header: 'Accion',
          cell: (row) => (
            <div className="flex justify-end">
              {row.status === 'Activo' && (
                <Button size="sm" onClick={() => handleReleaseBlock(row)}>
                  Liberar
                </Button>
              )}
            </div>
          ),
          align: 'right',
        },
      ]}
    />
  );

  const renderCheckIn = () => (
    <FeatureWorkspaceTable
      title={isResidentView ? 'Estado operativo de tus reservas' : 'Check-in y check-out del dia'}
      description="Confirma ingreso, uso del espacio y salida con un cambio visible en la tabla."
      rowKey={(row) => row.id}
      rows={filteredReservations.filter((row) => row.status === 'Confirmada')}
      columns={[
        {
          key: 'area',
          header: 'Reserva',
          cell: (row) => (
            <div className="space-y-1">
              <p className="font-semibold text-slate-900">{row.area}</p>
              <p className="text-xs text-slate-500">{row.resident}</p>
            </div>
          ),
        },
        { key: 'date', header: 'Fecha', cell: (row) => `${formatShortDate(row.date)} | ${row.timeSlot}` },
        { key: 'status', header: 'Operacion', cell: (row) => statusPill(row.checkState) },
        {
          key: 'actions',
          header: 'Accion',
          cell: (row) => (
            <div className="flex flex-wrap justify-end gap-2">
              <Button size="sm" variant="outline" onClick={() => handleCheckState(row, 'Check-in')}>
                Check-in
              </Button>
              <Button size="sm" onClick={() => handleCheckState(row, 'Check-out')}>
                Check-out
              </Button>
            </div>
          ),
          align: 'right',
        },
      ]}
    />
  );

  const renderEvidence = () => (
    <FeatureWorkspaceTable
      title="Evidencia del estado del espacio"
      description="Cada reserva conserva notas operativas y soporte visible antes o despues del uso."
      rowKey={(row) => row.id}
      rows={filteredReservations}
      columns={[
        {
          key: 'area',
          header: 'Reserva',
          cell: (row) => (
            <div className="space-y-1">
              <p className="font-semibold text-slate-900">{row.area}</p>
              <p className="text-xs text-slate-500">{row.unit}</p>
            </div>
          ),
        },
        { key: 'date', header: 'Fecha', cell: (row) => formatShortDate(row.date) },
        { key: 'evidence', header: 'Soporte', cell: (row) => row.evidence },
      ]}
    />
  );

  const renderAnalytics = () => (
    <FeatureWorkspaceTable
      title="Analitica de uso por espacio"
      description="Compara demanda, ocupacion y recaudo potencial entre las zonas comunes."
      rowKey={(row) => row.id}
      rows={usageRows}
      columns={[
        {
          key: 'name',
          header: 'Espacio',
          cell: (row) => (
            <div className="space-y-1">
              <p className="font-semibold text-slate-900">{row.name}</p>
              <p className="text-xs text-slate-500">Capacidad {row.capacity}</p>
            </div>
          ),
        },
        { key: 'reservations', header: 'Reservas', cell: (row) => row.reservations },
        { key: 'occupancy', header: 'Ocupacion', cell: (row) => `${row.occupancy}%` },
        { key: 'revenue', header: 'Recaudo potencial', cell: (row) => formatCurrency(row.fee * row.reservations) },
      ]}
    />
  );

  switch (featureId) {
    case 'm06_space_policies':
      return renderPolicies();

    case 'm06_user_quota_limits':
      return renderQuotas();

    case 'm06_visual_calendar':
      return renderCalendar();

    case 'm06_mora_restrictions':
      return renderMoraRestrictions();

    case 'm06_payments_and_deposits':
      return renderDeposits();

    case 'm06_non_use_penalties':
      return renderPenalties();

    case 'm06_waiting_list':
      return renderWaitlist();

    case 'm06_rules_based_approval':
      return renderRules();

    case 'm06_special_hours':
      return renderSpecialHours();

    case 'm06_maintenance_blocks':
      return renderBlocks();

    case 'm06_check_in_out':
      return renderCheckIn();

    case 'm06_space_condition_evidence':
      return renderEvidence();

    case 'm06_reservation_history':
      return renderReservationsTable(
        isResidentView ? 'Tu historial de reservas' : 'Historial consolidado de reservas',
        'Incluye fecha, estado, cantidad de asistentes y descarga de soporte cuando lo necesites.',
      );

    case 'm06_space_usage_analytics':
      return renderAnalytics();

    default:
      return (
        <>
          {renderCalendar()}
          {renderReservationsTable(
            isResidentView ? 'Tus reservas visibles' : 'Reservas del conjunto',
            'Vista operativa con estados, filtros y acciones inmediatas sobre cada solicitud.',
          )}
        </>
      );
  }
};

export default ReservationsFeatureWorkspace;
