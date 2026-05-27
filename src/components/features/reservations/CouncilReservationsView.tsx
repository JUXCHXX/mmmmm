import { useState, type ElementType } from 'react';
import { motion } from 'framer-motion';
import jsPDF from 'jspdf';
import {
  CalendarDays,
  ChevronLeft,
  ChevronRight,
  Waves,
  Flame,
  Dumbbell,
  Trophy,
  Building2,
  Clock3,
  Users,
  Search,
  CheckCircle2,
  XCircle,
  Ban,
  Settings,
  Download,
  Plus,
  Eye,
  BarChart3,
  ShieldAlert,
  User,
  CalendarRange,
} from 'lucide-react';
import { BarChart, Bar, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis, Legend, LineChart, Line } from 'recharts';
import { toast } from '@/hooks/use-toast';

type ReservationTab = 'calendar' | 'reservations' | 'spaces' | 'reports' | 'policies';
type ReservationStatus = 'Confirmada' | 'Pendiente' | 'Cancelada';
type ZoneStatus = 'Disponible' | 'En uso' | 'Mantenimiento';
type ZoneState = 'Activa' | 'Inactiva' | 'Mantenimiento';
type ZoneId = 'salon' | 'piscina' | 'bbq' | 'gimnasio' | 'cancha';

interface CouncilReservation {
  id: string;
  zoneId: ZoneId;
  zone: string;
  resident: string;
  unit: string;
  date: string;
  startTime: string;
  endTime: string;
  people: number;
  status: ReservationStatus;
  notes?: string;
}

interface CommonZone {
  id: ZoneId;
  name: string;
  description: string;
  currentStatus: ZoneStatus;
  configState: ZoneState;
  reservationsToday: number;
  nextReservation: string;
  nextResident: string;
  capacity: number;
  startHour: string;
  endHour: string;
  availableDays: string[];
  requiresApproval: boolean;
  requiresDeposit: boolean;
  depositAmount: number;
}

interface ReservationPolicies {
  maxReservationsPerMonth: number;
  minAdvanceDays: number;
  maxAdvanceDays: number;
  minimumHoursBetweenReservations: string;
  noShowFineEnabled: boolean;
  noShowFineAmount: number;
  requiresGoodStanding: boolean;
  cancellationDeadlineHours: string;
}

interface BlacklistEntry {
  id: string;
  resident: string;
  unit: string;
  reason: string;
  startDate: string;
  endDate: string;
}

const panelClass = 'bg-white rounded-xl border border-gray-200 shadow-sm';
const weekdayLabels = ['Lun', 'Mar', 'Mie', 'Jue', 'Vie', 'Sab', 'Dom'];
const availableDays = ['Lun', 'Mar', 'Mie', 'Jue', 'Vie', 'Sab', 'Dom'];

const zoneMeta: Record<
  ZoneId,
  { icon: ElementType; colorClass: string; softClass: string; borderClass: string }
> = {
  salon: { icon: Building2, colorClass: 'text-emerald-600', softClass: 'bg-emerald-50', borderClass: 'border-emerald-200' },
  piscina: { icon: Waves, colorClass: 'text-blue-600', softClass: 'bg-blue-50', borderClass: 'border-blue-200' },
  bbq: { icon: Flame, colorClass: 'text-orange-600', softClass: 'bg-orange-50', borderClass: 'border-orange-200' },
  gimnasio: { icon: Dumbbell, colorClass: 'text-violet-600', softClass: 'bg-violet-50', borderClass: 'border-violet-200' },
  cancha: { icon: Trophy, colorClass: 'text-amber-600', softClass: 'bg-amber-50', borderClass: 'border-amber-200' },
};

const initialReservations: CouncilReservation[] = [
  { id: 'res-001', zoneId: 'salon', zone: 'Salon Comunal', resident: 'Luis Torres', unit: 'Apto 302', date: '2026-05-24', startTime: '14:00', endTime: '18:00', people: 24, status: 'Confirmada' },
  { id: 'res-002', zoneId: 'piscina', zone: 'Piscina', resident: 'Ana Garcia', unit: 'Apto 101', date: '2026-05-25', startTime: '10:00', endTime: '12:00', people: 10, status: 'Pendiente' },
  { id: 'res-003', zoneId: 'bbq', zone: 'Area BBQ', resident: 'Carlos Ruiz', unit: 'Apto 205', date: '2026-05-26', startTime: '16:00', endTime: '20:00', people: 14, status: 'Confirmada' },
  { id: 'res-004', zoneId: 'gimnasio', zone: 'Gimnasio', resident: 'Maria Fernandez', unit: 'Apto 412', date: '2026-05-27', startTime: '07:00', endTime: '08:00', people: 2, status: 'Confirmada' },
  { id: 'res-005', zoneId: 'salon', zone: 'Salon Comunal', resident: 'Pedro Gomez', unit: 'Apto 108', date: '2026-05-28', startTime: '18:00', endTime: '22:00', people: 30, status: 'Pendiente' },
  { id: 'res-006', zoneId: 'cancha', zone: 'Cancha', resident: 'R. Ospina', unit: 'Apto 315', date: '2026-05-29', startTime: '08:00', endTime: '10:00', people: 8, status: 'Confirmada' },
  { id: 'res-007', zoneId: 'piscina', zone: 'Piscina', resident: 'J. Martinez', unit: 'Apto 203', date: '2026-05-30', startTime: '15:00', endTime: '17:00', people: 12, status: 'Pendiente' },
];

const initialZones: CommonZone[] = [
  {
    id: 'salon',
    name: 'Salon Comunal',
    description: 'Espacio principal para reuniones, celebraciones y actividades comunitarias.',
    currentStatus: 'Disponible',
    configState: 'Activa',
    reservationsToday: 2,
    nextReservation: '18:00 - 22:00',
    nextResident: 'Pedro Gomez · Apto 108',
    capacity: 50,
    startHour: '07:00',
    endHour: '23:00',
    availableDays: [...availableDays],
    requiresApproval: true,
    requiresDeposit: true,
    depositAmount: 180000,
  },
  {
    id: 'piscina',
    name: 'Piscina',
    description: 'Zona humeda para actividades recreativas con control de aforo.',
    currentStatus: 'En uso',
    configState: 'Activa',
    reservationsToday: 1,
    nextReservation: '15:00 - 17:00',
    nextResident: 'J. Martinez · Apto 203',
    capacity: 30,
    startHour: '08:00',
    endHour: '19:00',
    availableDays: [...availableDays],
    requiresApproval: true,
    requiresDeposit: false,
    depositAmount: 0,
  },
  {
    id: 'bbq',
    name: 'Area BBQ',
    description: 'Zona social para reuniones familiares con parrilla y mobiliario.',
    currentStatus: 'Disponible',
    configState: 'Activa',
    reservationsToday: 1,
    nextReservation: '16:00 - 20:00',
    nextResident: 'Carlos Ruiz · Apto 205',
    capacity: 20,
    startHour: '09:00',
    endHour: '22:00',
    availableDays: [...availableDays],
    requiresApproval: true,
    requiresDeposit: true,
    depositAmount: 95000,
  },
  {
    id: 'gimnasio',
    name: 'Gimnasio',
    description: 'Area de entrenamiento con agenda por franja horaria.',
    currentStatus: 'Disponible',
    configState: 'Activa',
    reservationsToday: 3,
    nextReservation: '07:00 - 08:00',
    nextResident: 'Maria Fernandez · Apto 412',
    capacity: 10,
    startHour: '05:30',
    endHour: '22:00',
    availableDays: [...availableDays],
    requiresApproval: false,
    requiresDeposit: false,
    depositAmount: 0,
  },
  {
    id: 'cancha',
    name: 'Cancha Multiple',
    description: 'Escenario deportivo para practicas recreativas y entrenamientos.',
    currentStatus: 'Disponible',
    configState: 'Activa',
    reservationsToday: 2,
    nextReservation: '08:00 - 10:00',
    nextResident: 'R. Ospina · Apto 315',
    capacity: 22,
    startHour: '06:00',
    endHour: '21:00',
    availableDays: [...availableDays],
    requiresApproval: true,
    requiresDeposit: false,
    depositAmount: 0,
  },
];

const reportSummary = [
  { label: 'Total reservas este mes', value: '47', helper: 'Agenda consolidada mayo 2026' },
  { label: 'Zona mas usada', value: 'Salon Comunal', helper: '18 reservas en el mes' },
  { label: 'Tasa de ocupacion promedio', value: '73%', helper: 'Uso promedio de zonas activas' },
  { label: 'Reservas canceladas', value: '4', helper: 'Cierres con seguimiento' },
];

const zoneUsageData = [
  { name: 'Salon Comunal', value: 18 },
  { name: 'Piscina', value: 12 },
  { name: 'Gimnasio', value: 9 },
  { name: 'BBQ', value: 5 },
  { name: 'Cancha', value: 3 },
];

const weekdayUsageData = [
  { name: 'Lunes', value: 4 },
  { name: 'Martes', value: 3 },
  { name: 'Miercoles', value: 5 },
  { name: 'Jueves', value: 4 },
  { name: 'Viernes', value: 8 },
  { name: 'Sabado', value: 15 },
  { name: 'Domingo', value: 8 },
];

const monthlyTrendData = [
  { month: 'Dic', value: 38 },
  { month: 'Ene', value: 42 },
  { month: 'Feb', value: 35 },
  { month: 'Mar', value: 44 },
  { month: 'Abr', value: 51 },
  { month: 'May', value: 47 },
];

const topResidents = [
  { resident: 'Luis Torres', unit: 'Apto 302', reservations: 5 },
  { resident: 'Ana Garcia', unit: 'Apto 101', reservations: 4 },
  { resident: 'Carlos Ruiz', unit: 'Apto 205', reservations: 3 },
];

const initialPolicies: ReservationPolicies = {
  maxReservationsPerMonth: 4,
  minAdvanceDays: 1,
  maxAdvanceDays: 30,
  minimumHoursBetweenReservations: '48 horas',
  noShowFineEnabled: true,
  noShowFineAmount: 50000,
  requiresGoodStanding: true,
  cancellationDeadlineHours: '24 horas antes',
};

const initialBlacklist: BlacklistEntry[] = [
  {
    id: 'bl-001',
    resident: 'Jorge Salcedo',
    unit: 'Apto 207',
    reason: 'Incumplimiento reiterado en entrega del salon comunal',
    startDate: '2026-05-01',
    endDate: '2026-06-15',
  },
  {
    id: 'bl-002',
    resident: 'Paula Mejia',
    unit: 'Apto 410',
    reason: 'No presentacion en dos reservas consecutivas',
    startDate: '2026-05-10',
    endDate: '2026-07-10',
  },
];

const initialNewReservationForm = {
  zoneId: 'salon' as ZoneId,
  resident: 'Roberto Diaz',
  unit: 'Apto 401',
  date: '2026-05-31',
  startTime: '18:00',
  endTime: '21:00',
  people: 16,
};

const initialBlacklistForm = {
  resident: 'Laura Rojas',
  unit: 'Apto 214',
  reason: 'Uso indebido de zona comun en evento anterior',
  startDate: '2026-05-27',
  endDate: '2026-06-27',
};

const councilTabs: Array<{ id: ReservationTab; label: string; icon: ElementType }> = [
  { id: 'calendar', label: 'Calendario', icon: CalendarDays },
  { id: 'reservations', label: 'Reservas', icon: CalendarRange },
  { id: 'spaces', label: 'Zonas Comunes', icon: Settings },
  { id: 'reports', label: 'Reportes', icon: BarChart3 },
  { id: 'policies', label: 'Politicas', icon: ShieldAlert },
];

const statusBadgeClass: Record<ReservationStatus, string> = {
  Confirmada: 'bg-emerald-50 text-emerald-600 border border-emerald-200',
  Pendiente: 'bg-amber-50 text-amber-600 border border-amber-200',
  Cancelada: 'bg-slate-100 text-slate-600 border border-slate-200',
};

const formatDateLabel = (value: string) =>
  new Date(`${value}T12:00:00`).toLocaleDateString('es-CO', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });

const toDateValue = (year: number, month: number, day: number) =>
  `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;

const normalizeDay = (value: string) => new Date(`${value}T12:00:00`);

const buildCalendarDays = (month: Date) => {
  const firstDay = new Date(month.getFullYear(), month.getMonth(), 1);
  const start = new Date(firstDay);
  const weekOffset = (firstDay.getDay() + 6) % 7;
  start.setDate(firstDay.getDate() - weekOffset);

  return Array.from({ length: 42 }, (_, index) => {
    const current = new Date(start);
    current.setDate(start.getDate() + index);
    return current;
  });
};

export function CouncilReservationsView() {
  const [activeTab, setActiveTab] = useState<ReservationTab>('calendar');
  const [calendarMonth, setCalendarMonth] = useState(new Date(2026, 4, 1));
  const [reservations, setReservations] = useState<CouncilReservation[]>(initialReservations);
  const [zones, setZones] = useState<CommonZone[]>(initialZones);
  const [policies, setPolicies] = useState<ReservationPolicies>(initialPolicies);
  const [blacklist, setBlacklist] = useState<BlacklistEntry[]>(initialBlacklist);
  const [zoneFilter, setZoneFilter] = useState<'all' | ZoneId>('all');
  const [statusFilter, setStatusFilter] = useState<'all' | ReservationStatus>('all');
  const [dateFrom, setDateFrom] = useState('2026-05-24');
  const [dateTo, setDateTo] = useState('2026-05-31');
  const [search, setSearch] = useState('');
  const [selectedReservation, setSelectedReservation] = useState<CouncilReservation | null>(null);
  const [rejectTarget, setRejectTarget] = useState<CouncilReservation | null>(null);
  const [cancelTarget, setCancelTarget] = useState<CouncilReservation | null>(null);
  const [rejectReason, setRejectReason] = useState('Incumplimiento de politicas de uso.');
  const [cancelReason, setCancelReason] = useState('Cancelacion preventiva por decision operativa del consejo.');
  const [editingZone, setEditingZone] = useState<CommonZone | null>(null);
  const [showNewReservation, setShowNewReservation] = useState(false);
  const [showBlacklistForm, setShowBlacklistForm] = useState(false);
  const [newReservationForm, setNewReservationForm] = useState(initialNewReservationForm);
  const [blacklistForm, setBlacklistForm] = useState(initialBlacklistForm);

  const filteredReservations = reservations.filter((reservation) => {
    if (zoneFilter !== 'all' && reservation.zoneId !== zoneFilter) return false;
    if (statusFilter !== 'all' && reservation.status !== statusFilter) return false;
    if (dateFrom && reservation.date < dateFrom) return false;
    if (dateTo && reservation.date > dateTo) return false;
    if (
      search &&
      !reservation.resident.toLowerCase().includes(search.toLowerCase()) &&
      !reservation.unit.toLowerCase().includes(search.toLowerCase()) &&
      !reservation.zone.toLowerCase().includes(search.toLowerCase())
    ) {
      return false;
    }
    return true;
  });

  const calendarDays = buildCalendarDays(calendarMonth);

  const updateReservation = (targetId: string, updater: (reservation: CouncilReservation) => CouncilReservation) => {
    setReservations((current) => current.map((reservation) => (reservation.id === targetId ? updater(reservation) : reservation)));
  };

  const handleApprove = (reservation: CouncilReservation) => {
    updateReservation(reservation.id, (current) => ({ ...current, status: 'Confirmada', notes: 'Aprobada por consejo.' }));
    toast({
      title: 'Reserva aprobada',
      description: `${reservation.zone} para ${reservation.resident} quedo confirmada.`,
    });
    setSelectedReservation((current) => (current?.id === reservation.id ? { ...current, status: 'Confirmada', notes: 'Aprobada por consejo.' } : current));
  };

  const handleReject = () => {
    if (!rejectTarget) return;
    updateReservation(rejectTarget.id, (current) => ({ ...current, status: 'Cancelada', notes: rejectReason }));
    toast({
      title: 'Reserva rechazada',
      description: `Se registro el motivo de rechazo para ${rejectTarget.resident}.`,
    });
    if (selectedReservation?.id === rejectTarget.id) {
      setSelectedReservation({ ...rejectTarget, status: 'Cancelada', notes: rejectReason });
    }
    setRejectTarget(null);
  };

  const handleCancel = () => {
    if (!cancelTarget) return;
    updateReservation(cancelTarget.id, (current) => ({ ...current, status: 'Cancelada', notes: cancelReason }));
    toast({
      title: 'Reserva cancelada',
      description: `La reserva de ${cancelTarget.resident} fue cancelada por el consejo.`,
    });
    if (selectedReservation?.id === cancelTarget.id) {
      setSelectedReservation({ ...cancelTarget, status: 'Cancelada', notes: cancelReason });
    }
    setCancelTarget(null);
  };

  const handleViewResident = (reservation: CouncilReservation) => {
    toast({
      title: reservation.resident,
      description: `${reservation.unit} · Reserva ${reservation.zone} el ${formatDateLabel(reservation.date)}`,
    });
  };

  const handleSaveZone = () => {
    if (!editingZone) return;
    setZones((current) =>
      current.map((zone) =>
        zone.id === editingZone.id
          ? {
              ...editingZone,
              currentStatus: editingZone.configState === 'Mantenimiento' ? 'Mantenimiento' : zone.currentStatus,
            }
          : zone,
      ),
    );
    toast({
      title: 'Zona actualizada',
      description: `${editingZone.name} quedo guardada con la nueva configuracion.`,
    });
    setEditingZone(null);
  };

  const handleCreateReservation = () => {
    const zone = zones.find((item) => item.id === newReservationForm.zoneId);
    if (!zone) return;

    const newReservation: CouncilReservation = {
      id: `res-${Date.now()}`,
      zoneId: newReservationForm.zoneId,
      zone: zone.name,
      resident: newReservationForm.resident,
      unit: newReservationForm.unit,
      date: newReservationForm.date,
      startTime: newReservationForm.startTime,
      endTime: newReservationForm.endTime,
      people: Number(newReservationForm.people),
      status: 'Confirmada',
      notes: 'Reserva creada por consejo.',
    };

    setReservations((current) => [...current, newReservation].sort((a, b) => `${a.date}${a.startTime}`.localeCompare(`${b.date}${b.startTime}`)));
    toast({
      title: 'Reserva creada',
      description: `${zone.name} quedo agendada para ${newReservationForm.resident}.`,
    });
    setShowNewReservation(false);
    setNewReservationForm(initialNewReservationForm);
  };

  const handleSavePolicies = () => {
    toast({
      title: 'Politicas guardadas',
      description: 'Las reglas globales de reservas fueron actualizadas.',
    });
  };

  const handleAddBlacklist = () => {
    setBlacklist((current) => [
      ...current,
      {
        id: `bl-${Date.now()}`,
        resident: blacklistForm.resident,
        unit: blacklistForm.unit,
        reason: blacklistForm.reason,
        startDate: blacklistForm.startDate,
        endDate: blacklistForm.endDate,
      },
    ]);
    toast({
      title: 'Lista negra actualizada',
      description: `${blacklistForm.resident} fue agregado a restricciones temporales.`,
    });
    setShowBlacklistForm(false);
    setBlacklistForm(initialBlacklistForm);
  };

  const handleRemoveBlacklist = (entry: BlacklistEntry) => {
    setBlacklist((current) => current.filter((item) => item.id !== entry.id));
    toast({
      title: 'Restriccion removida',
      description: `${entry.resident} ya no figura en la lista negra.`,
    });
  };

  const exportReservationReport = () => {
    const pdf = new jsPDF({ unit: 'mm', format: 'a4' });
    let y = 18;

    const addLine = (text: string, gap = 6) => {
      if (y > 280) {
        pdf.addPage();
        y = 18;
      }
      pdf.text(text, 14, y);
      y += gap;
    };

    pdf.setFontSize(16);
    addLine('BUNTY - Reporte de reservas del consejo', 8);
    pdf.setFontSize(10);
    addLine(`Periodo: ${calendarMonth.toLocaleDateString('es-CO', { month: 'long', year: 'numeric' })}`);
    addLine('Control y supervision de zonas comunes', 8);

    pdf.setFontSize(12);
    addLine('Resumen del mes', 7);
    pdf.setFontSize(10);
    reportSummary.forEach((item) => addLine(`${item.label}: ${item.value} | ${item.helper}`));

    y += 3;
    pdf.setFontSize(12);
    addLine('Reservas por zona', 7);
    pdf.setFontSize(10);
    zoneUsageData.forEach((item) => addLine(`${item.name}: ${item.value} reservas`));

    y += 3;
    pdf.setFontSize(12);
    addLine('Ocupacion por dia de semana', 7);
    pdf.setFontSize(10);
    weekdayUsageData.forEach((item) => addLine(`${item.name}: ${item.value}`));

    y += 3;
    pdf.setFontSize(12);
    addLine('Tendencia ultimos 6 meses', 7);
    pdf.setFontSize(10);
    monthlyTrendData.forEach((item) => addLine(`${item.month}: ${item.value} reservas`));

    y += 3;
    pdf.setFontSize(12);
    addLine('Reservas visibles', 7);
    pdf.setFontSize(10);
    filteredReservations.forEach((item) =>
      addLine(`${item.zone} | ${item.resident} | ${item.unit} | ${item.date} | ${item.startTime}-${item.endTime} | ${item.status}`),
    );

    pdf.save('reporte-reservas-consejo.pdf');
    toast({
      title: 'Reporte exportado',
      description: 'El reporte mensual de reservas fue descargado en PDF.',
    });
  };

  return (
    <div>
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-foreground flex items-center gap-3">
            <CalendarDays className="icon-responsive-lg text-primary" /> Gestion de Reservas
          </h1>
          <p className="text-sm text-muted-foreground mt-1">Control y supervision de zonas comunes · Consejo</p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => setShowNewReservation(true)}
            className="inline-flex items-center gap-2 rounded-xl bg-primary px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-primary/90"
          >
            <Plus className="w-4 h-4" />
            Nueva Reserva
          </button>
          <button
            onClick={exportReservationReport}
            className="inline-flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50"
          >
            <Download className="w-4 h-4" />
            Exportar Reporte
          </button>
        </div>
      </motion.div>

      <div className="flex gap-2 mb-4 overflow-x-auto pb-1">
        {councilTabs.map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-2 rounded-xl text-sm font-medium transition-colors whitespace-nowrap ${
                activeTab === tab.id ? 'bg-primary/20 text-primary' : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              <Icon className="w-4 h-4 inline mr-2" />
              {tab.label}
            </button>
          );
        })}
      </div>

      <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
        {activeTab === 'calendar' && (
          <div className="space-y-6">
            <div className={`${panelClass} p-4`}>
              <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setCalendarMonth((current) => new Date(current.getFullYear(), current.getMonth() - 1, 1))}
                    className="rounded-lg border border-gray-200 p-2 text-gray-500 hover:bg-gray-50"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  <div>
                    <p className="text-sm font-medium text-gray-900">
                      {calendarMonth.toLocaleDateString('es-CO', { month: 'long', year: 'numeric' })}
                    </p>
                    <p className="text-xs text-gray-500">Calendario mensual navegable</p>
                  </div>
                  <button
                    onClick={() => setCalendarMonth((current) => new Date(current.getFullYear(), current.getMonth() + 1, 1))}
                    className="rounded-lg border border-gray-200 p-2 text-gray-500 hover:bg-gray-50"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {Object.entries(zoneMeta).map(([zoneId, config]) => (
                    <span
                      key={zoneId}
                      className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-medium ${config.softClass} ${config.borderClass} ${config.colorClass}`}
                    >
                      <config.icon className="w-3.5 h-3.5" />
                      {zones.find((zone) => zone.id === zoneId)?.name}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <div className={`${panelClass} p-4 overflow-x-auto`}>
              <div className="grid grid-cols-7 gap-2 min-w-[980px]">
                {weekdayLabels.map((day) => (
                  <div key={day} className="px-3 py-2 text-xs font-semibold uppercase tracking-wide text-gray-500">
                    {day}
                  </div>
                ))}
                {calendarDays.map((day) => {
                  const dateKey = toDateValue(day.getFullYear(), day.getMonth(), day.getDate());
                  const dayReservations = reservations.filter((reservation) => reservation.date === dateKey);
                  const isCurrentMonth = day.getMonth() === calendarMonth.getMonth();
                  return (
                    <div
                      key={`${dateKey}-${isCurrentMonth ? 'current' : 'other'}`}
                      className={`min-h-[148px] rounded-xl border p-3 ${isCurrentMonth ? 'border-gray-200 bg-white' : 'border-gray-100 bg-gray-50/80'}`}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <span className={`text-sm font-semibold ${isCurrentMonth ? 'text-gray-900' : 'text-gray-400'}`}>
                          {day.getDate()}
                        </span>
                        {dayReservations.length > 0 && (
                          <span className="text-[11px] font-medium text-gray-400">{dayReservations.length}</span>
                        )}
                      </div>
                      <div className="space-y-1.5">
                        {dayReservations.map((reservation) => {
                          const meta = zoneMeta[reservation.zoneId];
                          return (
                            <button
                              key={reservation.id}
                              onClick={() => setSelectedReservation(reservation)}
                              className={`w-full rounded-lg border px-2 py-1.5 text-left text-[11px] font-medium ${meta.softClass} ${meta.borderClass} ${meta.colorClass}`}
                            >
                              <p className="truncate">{reservation.zone}</p>
                              <p className="truncate">{reservation.startTime}-{reservation.endTime}</p>
                              <p className="truncate text-gray-500">{reservation.resident}</p>
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'reservations' && (
          <div className="space-y-6">
            <div className={`${panelClass} p-4`}>
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-5">
                <div>
                  <label className="block text-xs font-medium text-gray-500 mb-1">Zona</label>
                  <select
                    value={zoneFilter}
                    onChange={(event) => setZoneFilter(event.target.value as 'all' | ZoneId)}
                    className="h-10 w-full rounded-xl border border-gray-200 bg-white px-3 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-primary/20"
                  >
                    <option value="all">Todas</option>
                    {zones.map((zone) => (
                      <option key={zone.id} value={zone.id}>
                        {zone.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-500 mb-1">Estado</label>
                  <select
                    value={statusFilter}
                    onChange={(event) => setStatusFilter(event.target.value as 'all' | ReservationStatus)}
                    className="h-10 w-full rounded-xl border border-gray-200 bg-white px-3 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-primary/20"
                  >
                    <option value="all">Todas</option>
                    <option value="Confirmada">Confirmadas</option>
                    <option value="Pendiente">Pendientes</option>
                    <option value="Cancelada">Canceladas</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-500 mb-1">Fecha desde</label>
                  <input
                    type="date"
                    value={dateFrom}
                    onChange={(event) => setDateFrom(event.target.value)}
                    className="h-10 w-full rounded-xl border border-gray-200 bg-white px-3 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-primary/20"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-500 mb-1">Fecha hasta</label>
                  <input
                    type="date"
                    value={dateTo}
                    onChange={(event) => setDateTo(event.target.value)}
                    className="h-10 w-full rounded-xl border border-gray-200 bg-white px-3 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-primary/20"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-500 mb-1">Buscar</label>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                      type="text"
                      value={search}
                      onChange={(event) => setSearch(event.target.value)}
                      className="h-10 w-full rounded-xl border border-gray-200 bg-white pl-10 pr-3 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-primary/20"
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className={`${panelClass} p-6 overflow-x-auto`}>
              <table className="min-w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-200 text-left text-xs uppercase tracking-wide text-gray-500">
                    <th className="pb-3 pr-4 font-medium">#</th>
                    <th className="pb-3 pr-4 font-medium">Zona</th>
                    <th className="pb-3 pr-4 font-medium">Residente</th>
                    <th className="pb-3 pr-4 font-medium">Apto</th>
                    <th className="pb-3 pr-4 font-medium">Fecha</th>
                    <th className="pb-3 pr-4 font-medium">Horario</th>
                    <th className="pb-3 pr-4 font-medium">Personas</th>
                    <th className="pb-3 pr-4 font-medium">Estado</th>
                    <th className="pb-3 font-medium">Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredReservations.map((reservation, index) => (
                    <tr key={reservation.id} className="border-b border-gray-100 last:border-b-0">
                      <td className="py-4 pr-4 text-gray-500">{index + 1}</td>
                      <td className="py-4 pr-4 font-medium text-gray-900">{reservation.zone}</td>
                      <td className="py-4 pr-4 text-gray-600">{reservation.resident}</td>
                      <td className="py-4 pr-4 text-gray-600">{reservation.unit}</td>
                      <td className="py-4 pr-4 text-gray-600">{formatDateLabel(reservation.date)}</td>
                      <td className="py-4 pr-4 text-gray-600">
                        {reservation.startTime} - {reservation.endTime}
                      </td>
                      <td className="py-4 pr-4 text-gray-600">{reservation.people}</td>
                      <td className="py-4 pr-4">
                        <span className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium ${statusBadgeClass[reservation.status]}`}>
                          {reservation.status}
                        </span>
                      </td>
                      <td className="py-4">
                        <div className="flex flex-wrap gap-2">
                          {reservation.status === 'Pendiente' && (
                            <>
                              <button
                                onClick={() => handleApprove(reservation)}
                                className="rounded-lg bg-emerald-50 px-3 py-1.5 text-xs font-medium text-emerald-600 hover:bg-emerald-100"
                              >
                                Aprobar
                              </button>
                              <button
                                onClick={() => {
                                  setRejectTarget(reservation);
                                  setRejectReason('Incumplimiento de politicas de uso.');
                                }}
                                className="rounded-lg bg-red-50 px-3 py-1.5 text-xs font-medium text-red-600 hover:bg-red-100"
                              >
                                Rechazar
                              </button>
                            </>
                          )}
                          {reservation.status === 'Confirmada' && (
                            <button
                              onClick={() => {
                                setCancelTarget(reservation);
                                setCancelReason('Cancelacion preventiva por decision operativa del consejo.');
                              }}
                              className="rounded-lg bg-slate-100 px-3 py-1.5 text-xs font-medium text-slate-600 hover:bg-slate-200"
                            >
                              Cancelar
                            </button>
                          )}
                          <button
                            onClick={() => handleViewResident(reservation)}
                            className="rounded-lg border border-gray-200 px-3 py-1.5 text-xs font-medium text-gray-600 hover:bg-gray-50"
                          >
                            Ver residente
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === 'spaces' && (
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
            {zones.map((zone) => {
              const meta = zoneMeta[zone.id];
              const Icon = meta.icon;
              const statusClass =
                zone.currentStatus === 'Disponible'
                  ? 'bg-emerald-50 text-emerald-600 border border-emerald-200'
                  : zone.currentStatus === 'En uso'
                    ? 'bg-blue-50 text-blue-600 border border-blue-200'
                    : 'bg-amber-50 text-amber-600 border border-amber-200';

              return (
                <div key={zone.id} className={`${panelClass} p-5`}>
                  <div className="flex items-start justify-between gap-3 mb-4">
                    <div className="flex items-center gap-3">
                      <div className={`rounded-xl p-3 ${meta.softClass} ${meta.borderClass} border`}>
                        <Icon className={`w-5 h-5 ${meta.colorClass}`} />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900">{zone.name}</h3>
                        <span className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium mt-1 ${statusClass}`}>
                          {zone.currentStatus}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-3 text-sm">
                    <div className="flex items-center justify-between">
                      <span className="text-gray-500">Reservas hoy</span>
                      <span className="font-medium text-gray-900">{zone.reservationsToday}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-500">Proxima reserva</span>
                      <span className="font-medium text-gray-900 text-right">
                        {zone.nextReservation}
                        <span className="block text-xs text-gray-500">{zone.nextResident}</span>
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-500">Capacidad maxima</span>
                      <span className="font-medium text-gray-900">{zone.capacity} personas</span>
                    </div>
                  </div>

                  <button
                    onClick={() => setEditingZone({ ...zone })}
                    className="mt-5 inline-flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
                  >
                    <Settings className="w-4 h-4" />
                    Gestionar
                  </button>
                </div>
              );
            })}
          </div>
        )}

        {activeTab === 'reports' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
              {reportSummary.map((card) => (
                <div key={card.label} className={`${panelClass} p-4`}>
                  <p className="text-xs uppercase tracking-wide text-gray-500">{card.label}</p>
                  <p className="text-2xl font-bold text-gray-900 mt-2">{card.value}</p>
                  <p className="text-sm text-gray-500 mt-2">{card.helper}</p>
                </div>
              ))}
            </div>

            <div className={`${panelClass} p-6`}>
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between mb-4">
                <h2 className="text-lg font-semibold text-gray-900">Reportes de uso</h2>
                <button
                  onClick={exportReservationReport}
                  className="inline-flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
                >
                  <Download className="w-4 h-4" />
                  Exportar reporte PDF
                </button>
              </div>
              <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
                <div>
                  <h3 className="text-sm font-semibold text-gray-900 mb-3">Reservas por zona</h3>
                  <div className="h-[260px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={zoneUsageData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                        <XAxis dataKey="name" stroke="#6B7280" fontSize={12} />
                        <YAxis stroke="#6B7280" fontSize={12} />
                        <Tooltip contentStyle={{ borderRadius: 12, border: '1px solid #E5E7EB', background: '#FFFFFF' }} />
                        <Bar dataKey="value" fill="#0F7A5C" radius={[8, 8, 0, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-gray-900 mb-3">Ocupacion por dia de semana</h3>
                  <div className="h-[260px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={weekdayUsageData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                        <XAxis dataKey="name" stroke="#6B7280" fontSize={12} />
                        <YAxis stroke="#6B7280" fontSize={12} />
                        <Tooltip contentStyle={{ borderRadius: 12, border: '1px solid #E5E7EB', background: '#FFFFFF' }} />
                        <Bar dataKey="value" fill="#2563EB" radius={[8, 8, 0, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>
                <div className="xl:col-span-2">
                  <h3 className="text-sm font-semibold text-gray-900 mb-3">Tendencia mensual ultimos 6 meses</h3>
                  <div className="h-[280px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={monthlyTrendData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                        <XAxis dataKey="month" stroke="#6B7280" fontSize={12} />
                        <YAxis stroke="#6B7280" fontSize={12} />
                        <Tooltip contentStyle={{ borderRadius: 12, border: '1px solid #E5E7EB', background: '#FFFFFF' }} />
                        <Legend />
                        <Line type="monotone" dataKey="value" name="Reservas" stroke="#7C3AED" strokeWidth={3} dot={{ r: 4 }} />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </div>
            </div>

            <div className={`${panelClass} p-6`}>
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Top residentes con mas reservas</h2>
              <div className="overflow-x-auto">
                <table className="min-w-full text-sm">
                  <thead>
                    <tr className="border-b border-gray-200 text-left text-xs uppercase tracking-wide text-gray-500">
                      <th className="pb-3 pr-4 font-medium">Residente</th>
                      <th className="pb-3 pr-4 font-medium">Apto</th>
                      <th className="pb-3 font-medium">Reservas este mes</th>
                    </tr>
                  </thead>
                  <tbody>
                    {topResidents.map((resident) => (
                      <tr key={resident.resident} className="border-b border-gray-100 last:border-b-0">
                        <td className="py-4 pr-4 font-medium text-gray-900">{resident.resident}</td>
                        <td className="py-4 pr-4 text-gray-600">{resident.unit}</td>
                        <td className="py-4 text-gray-600">{resident.reservations}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'policies' && (
          <div className="space-y-6">
            <div className={`${panelClass} p-6`}>
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Politicas globales de reservas</h2>
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Maximo de reservas por residente por mes</label>
                  <input
                    type="number"
                    value={policies.maxReservationsPerMonth}
                    onChange={(event) => setPolicies((current) => ({ ...current, maxReservationsPerMonth: Number(event.target.value) }))}
                    className="h-10 w-full rounded-xl border border-gray-200 px-3 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-primary/20"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Dias de anticipacion minima</label>
                  <input
                    type="number"
                    value={policies.minAdvanceDays}
                    onChange={(event) => setPolicies((current) => ({ ...current, minAdvanceDays: Number(event.target.value) }))}
                    className="h-10 w-full rounded-xl border border-gray-200 px-3 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-primary/20"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Dias de anticipacion maxima</label>
                  <input
                    type="number"
                    value={policies.maxAdvanceDays}
                    onChange={(event) => setPolicies((current) => ({ ...current, maxAdvanceDays: Number(event.target.value) }))}
                    className="h-10 w-full rounded-xl border border-gray-200 px-3 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-primary/20"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Tiempo minimo entre reservas</label>
                  <select
                    value={policies.minimumHoursBetweenReservations}
                    onChange={(event) => setPolicies((current) => ({ ...current, minimumHoursBetweenReservations: event.target.value }))}
                    className="h-10 w-full rounded-xl border border-gray-200 px-3 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-primary/20"
                  >
                    <option>24 horas</option>
                    <option>48 horas</option>
                    <option>72 horas</option>
                  </select>
                </div>
                <div className="rounded-xl border border-gray-200 p-4">
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <p className="text-sm font-medium text-gray-900">Multa por no presentarse</p>
                      <p className="text-xs text-gray-500">Activa el cobro por inasistencia.</p>
                    </div>
                    <input
                      type="checkbox"
                      checked={policies.noShowFineEnabled}
                      onChange={(event) => setPolicies((current) => ({ ...current, noShowFineEnabled: event.target.checked }))}
                    />
                  </div>
                  <input
                    type="number"
                    value={policies.noShowFineAmount}
                    onChange={(event) => setPolicies((current) => ({ ...current, noShowFineAmount: Number(event.target.value) }))}
                    className="mt-3 h-10 w-full rounded-xl border border-gray-200 px-3 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-primary/20"
                  />
                </div>
                <div className="rounded-xl border border-gray-200 p-4">
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <p className="text-sm font-medium text-gray-900">Requiere paz y salvo de pagos</p>
                      <p className="text-xs text-gray-500">Bloquea reservas si el residente tiene mora.</p>
                    </div>
                    <input
                      type="checkbox"
                      checked={policies.requiresGoodStanding}
                      onChange={(event) => setPolicies((current) => ({ ...current, requiresGoodStanding: event.target.checked }))}
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Hora limite para cancelar sin penalidad</label>
                  <select
                    value={policies.cancellationDeadlineHours}
                    onChange={(event) => setPolicies((current) => ({ ...current, cancellationDeadlineHours: event.target.value }))}
                    className="h-10 w-full rounded-xl border border-gray-200 px-3 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-primary/20"
                  >
                    <option>12 horas antes</option>
                    <option>24 horas antes</option>
                    <option>48 horas antes</option>
                  </select>
                </div>
              </div>

              <button
                onClick={handleSavePolicies}
                className="mt-5 inline-flex items-center gap-2 rounded-xl bg-primary px-4 py-2 text-sm font-medium text-white hover:bg-primary/90"
              >
                <CheckCircle2 className="w-4 h-4" />
                Guardar politicas
              </button>
            </div>

            <div className={`${panelClass} p-6`}>
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between mb-4">
                <div>
                  <h2 className="text-lg font-semibold text-gray-900">Lista negra</h2>
                  <p className="text-sm text-gray-500 mt-1">Residentes con reservas suspendidas temporalmente.</p>
                </div>
                <button
                  onClick={() => setShowBlacklistForm(true)}
                  className="inline-flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
                >
                  <Plus className="w-4 h-4" />
                  Agregar a lista negra
                </button>
              </div>

              <div className="overflow-x-auto">
                <table className="min-w-full text-sm">
                  <thead>
                    <tr className="border-b border-gray-200 text-left text-xs uppercase tracking-wide text-gray-500">
                      <th className="pb-3 pr-4 font-medium">Residente</th>
                      <th className="pb-3 pr-4 font-medium">Apto</th>
                      <th className="pb-3 pr-4 font-medium">Motivo</th>
                      <th className="pb-3 pr-4 font-medium">Fecha inicio</th>
                      <th className="pb-3 pr-4 font-medium">Fecha fin</th>
                      <th className="pb-3 font-medium">Quitar</th>
                    </tr>
                  </thead>
                  <tbody>
                    {blacklist.map((entry) => (
                      <tr key={entry.id} className="border-b border-gray-100 last:border-b-0">
                        <td className="py-4 pr-4 font-medium text-gray-900">{entry.resident}</td>
                        <td className="py-4 pr-4 text-gray-600">{entry.unit}</td>
                        <td className="py-4 pr-4 text-gray-600">{entry.reason}</td>
                        <td className="py-4 pr-4 text-gray-600">{formatDateLabel(entry.startDate)}</td>
                        <td className="py-4 pr-4 text-gray-600">{formatDateLabel(entry.endDate)}</td>
                        <td className="py-4">
                          <button
                            onClick={() => handleRemoveBlacklist(entry)}
                            className="rounded-lg bg-red-50 px-3 py-1.5 text-xs font-medium text-red-600 hover:bg-red-100"
                          >
                            Quitar
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </motion.div>

      {selectedReservation && (
        <div className="fixed inset-0 z-50 bg-black/40 p-4 overflow-y-auto">
          <div className="min-h-full flex items-center justify-center">
            <div className="w-full max-w-xl rounded-2xl bg-white p-6 shadow-xl">
              <div className="flex items-start justify-between gap-4 mb-5">
                <div>
                  <h2 className="text-xl font-bold text-gray-900">{selectedReservation.zone}</h2>
                  <p className="text-sm text-gray-500 mt-1">
                    {selectedReservation.resident} · {selectedReservation.unit}
                  </p>
                </div>
                <button
                  onClick={() => setSelectedReservation(null)}
                  className="rounded-lg p-1 text-gray-400 hover:text-gray-700"
                >
                  <XCircle className="w-5 h-5" />
                </button>
              </div>

              <div className="grid grid-cols-2 gap-3 mb-6">
                <div className="rounded-xl border border-gray-200 bg-gray-50 p-3">
                  <p className="text-xs uppercase tracking-wide text-gray-400">Fecha</p>
                  <p className="text-sm font-medium text-gray-900 mt-1">{formatDateLabel(selectedReservation.date)}</p>
                </div>
                <div className="rounded-xl border border-gray-200 bg-gray-50 p-3">
                  <p className="text-xs uppercase tracking-wide text-gray-400">Horario</p>
                  <p className="text-sm font-medium text-gray-900 mt-1">
                    {selectedReservation.startTime} - {selectedReservation.endTime}
                  </p>
                </div>
                <div className="rounded-xl border border-gray-200 bg-gray-50 p-3">
                  <p className="text-xs uppercase tracking-wide text-gray-400">Personas</p>
                  <p className="text-sm font-medium text-gray-900 mt-1">{selectedReservation.people}</p>
                </div>
                <div className="rounded-xl border border-gray-200 bg-gray-50 p-3">
                  <p className="text-xs uppercase tracking-wide text-gray-400">Estado</p>
                  <span className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium mt-1 ${statusBadgeClass[selectedReservation.status]}`}>
                    {selectedReservation.status}
                  </span>
                </div>
              </div>

              {selectedReservation.notes && (
                <div className="rounded-xl border border-gray-200 bg-gray-50 p-3 mb-4">
                  <p className="text-xs uppercase tracking-wide text-gray-400 mb-1">Ultima novedad</p>
                  <p className="text-sm text-gray-700">{selectedReservation.notes}</p>
                </div>
              )}

              <div className="flex flex-wrap gap-2">
                {selectedReservation.status === 'Pendiente' && (
                  <>
                    <button
                      onClick={() => handleApprove(selectedReservation)}
                      className="rounded-xl bg-emerald-50 px-4 py-2 text-sm font-medium text-emerald-600 hover:bg-emerald-100"
                    >
                      Aprobar
                    </button>
                    <button
                      onClick={() => {
                        setRejectTarget(selectedReservation);
                        setRejectReason('Incumplimiento de politicas de uso.');
                      }}
                      className="rounded-xl bg-red-50 px-4 py-2 text-sm font-medium text-red-600 hover:bg-red-100"
                    >
                      Rechazar
                    </button>
                  </>
                )}
                {selectedReservation.status !== 'Cancelada' && (
                  <button
                    onClick={() => {
                      setCancelTarget(selectedReservation);
                      setCancelReason('Cancelacion preventiva por decision operativa del consejo.');
                    }}
                    className="rounded-xl bg-slate-100 px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-200"
                  >
                    Cancelar
                  </button>
                )}
                <button
                  onClick={() => handleViewResident(selectedReservation)}
                  className="rounded-xl border border-gray-200 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
                >
                  Ver residente
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {rejectTarget && (
        <div className="fixed inset-0 z-50 bg-black/40 p-4 overflow-y-auto">
          <div className="min-h-full flex items-center justify-center">
            <div className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-xl">
              <h2 className="text-xl font-bold text-gray-900">Motivo del rechazo</h2>
              <p className="text-sm text-gray-500 mt-1">
                Define la causa para rechazar la reserva de {rejectTarget.resident}.
              </p>
              <textarea
                value={rejectReason}
                onChange={(event) => setRejectReason(event.target.value)}
                className="mt-4 min-h-[120px] w-full rounded-xl border border-gray-200 px-3 py-3 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-primary/20"
              />
              <div className="mt-5 flex gap-2">
                <button
                  onClick={() => setRejectTarget(null)}
                  className="flex-1 rounded-xl border border-gray-200 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
                >
                  Cerrar
                </button>
                <button
                  onClick={handleReject}
                  className="flex-1 rounded-xl bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700"
                >
                  Confirmar rechazo
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {cancelTarget && (
        <div className="fixed inset-0 z-50 bg-black/40 p-4 overflow-y-auto">
          <div className="min-h-full flex items-center justify-center">
            <div className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-xl">
              <h2 className="text-xl font-bold text-gray-900">Cancelar reserva</h2>
              <p className="text-sm text-gray-500 mt-1">
                Registra el motivo de cancelacion para {cancelTarget.resident}.
              </p>
              <textarea
                value={cancelReason}
                onChange={(event) => setCancelReason(event.target.value)}
                className="mt-4 min-h-[120px] w-full rounded-xl border border-gray-200 px-3 py-3 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-primary/20"
              />
              <div className="mt-5 flex gap-2">
                <button
                  onClick={() => setCancelTarget(null)}
                  className="flex-1 rounded-xl border border-gray-200 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
                >
                  Cerrar
                </button>
                <button
                  onClick={handleCancel}
                  className="flex-1 rounded-xl bg-slate-700 px-4 py-2 text-sm font-medium text-white hover:bg-slate-800"
                >
                  Confirmar cancelacion
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {editingZone && (
        <div className="fixed inset-0 z-50 bg-black/40 p-4 overflow-y-auto">
          <div className="min-h-full flex items-center justify-center">
            <div className="w-full max-w-2xl rounded-2xl bg-white p-6 shadow-xl">
              <h2 className="text-xl font-bold text-gray-900">Gestionar {editingZone.name}</h2>
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2 mt-5">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Nombre</label>
                  <input
                    value={editingZone.name}
                    onChange={(event) => setEditingZone((current) => (current ? { ...current, name: event.target.value } : current))}
                    className="h-10 w-full rounded-xl border border-gray-200 px-3 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-primary/20"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Capacidad maxima</label>
                  <input
                    type="number"
                    value={editingZone.capacity}
                    onChange={(event) => setEditingZone((current) => (current ? { ...current, capacity: Number(event.target.value) } : current))}
                    className="h-10 w-full rounded-xl border border-gray-200 px-3 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-primary/20"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Descripcion</label>
                  <textarea
                    value={editingZone.description}
                    onChange={(event) => setEditingZone((current) => (current ? { ...current, description: event.target.value } : current))}
                    className="min-h-[90px] w-full rounded-xl border border-gray-200 px-3 py-3 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-primary/20"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Hora inicio</label>
                  <input
                    type="time"
                    value={editingZone.startHour}
                    onChange={(event) => setEditingZone((current) => (current ? { ...current, startHour: event.target.value } : current))}
                    className="h-10 w-full rounded-xl border border-gray-200 px-3 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-primary/20"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Hora fin</label>
                  <input
                    type="time"
                    value={editingZone.endHour}
                    onChange={(event) => setEditingZone((current) => (current ? { ...current, endHour: event.target.value } : current))}
                    className="h-10 w-full rounded-xl border border-gray-200 px-3 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-primary/20"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Dias disponibles</label>
                  <div className="flex flex-wrap gap-2">
                    {availableDays.map((day) => {
                      const active = editingZone.availableDays.includes(day);
                      return (
                        <button
                          key={day}
                          onClick={() =>
                            setEditingZone((current) =>
                              current
                                ? {
                                    ...current,
                                    availableDays: active
                                      ? current.availableDays.filter((entry) => entry !== day)
                                      : [...current.availableDays, day],
                                  }
                                : current,
                            )
                          }
                          className={`rounded-full px-3 py-1.5 text-xs font-medium ${active ? 'bg-primary/20 text-primary' : 'bg-gray-100 text-gray-600'}`}
                        >
                          {day}
                        </button>
                      );
                    })}
                  </div>
                </div>
                <div className="rounded-xl border border-gray-200 p-4">
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <p className="text-sm font-medium text-gray-900">Requiere aprobacion</p>
                      <p className="text-xs text-gray-500">Controla si pasa por validacion manual.</p>
                    </div>
                    <input
                      type="checkbox"
                      checked={editingZone.requiresApproval}
                      onChange={(event) => setEditingZone((current) => (current ? { ...current, requiresApproval: event.target.checked } : current))}
                    />
                  </div>
                </div>
                <div className="rounded-xl border border-gray-200 p-4">
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <p className="text-sm font-medium text-gray-900">Requiere deposito</p>
                      <p className="text-xs text-gray-500">Activa un deposito editable para la reserva.</p>
                    </div>
                    <input
                      type="checkbox"
                      checked={editingZone.requiresDeposit}
                      onChange={(event) => setEditingZone((current) => (current ? { ...current, requiresDeposit: event.target.checked } : current))}
                    />
                  </div>
                  {editingZone.requiresDeposit && (
                    <input
                      type="number"
                      value={editingZone.depositAmount}
                      onChange={(event) => setEditingZone((current) => (current ? { ...current, depositAmount: Number(event.target.value) } : current))}
                      className="mt-3 h-10 w-full rounded-xl border border-gray-200 px-3 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-primary/20"
                    />
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Estado</label>
                  <select
                    value={editingZone.configState}
                    onChange={(event) => setEditingZone((current) => (current ? { ...current, configState: event.target.value as ZoneState } : current))}
                    className="h-10 w-full rounded-xl border border-gray-200 px-3 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-primary/20"
                  >
                    <option value="Activa">Activa</option>
                    <option value="Inactiva">Inactiva</option>
                    <option value="Mantenimiento">Mantenimiento</option>
                  </select>
                </div>
              </div>

              <div className="mt-5 flex gap-2">
                <button
                  onClick={() => setEditingZone(null)}
                  className="flex-1 rounded-xl border border-gray-200 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
                >
                  Cerrar
                </button>
                <button
                  onClick={handleSaveZone}
                  className="flex-1 rounded-xl bg-primary px-4 py-2 text-sm font-medium text-white hover:bg-primary/90"
                >
                  Guardar cambios
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {showNewReservation && (
        <div className="fixed inset-0 z-50 bg-black/40 p-4 overflow-y-auto">
          <div className="min-h-full flex items-center justify-center">
            <div className="w-full max-w-xl rounded-2xl bg-white p-6 shadow-xl">
              <h2 className="text-xl font-bold text-gray-900">Nueva reserva del consejo</h2>
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2 mt-5">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Zona</label>
                  <select
                    value={newReservationForm.zoneId}
                    onChange={(event) => setNewReservationForm((current) => ({ ...current, zoneId: event.target.value as ZoneId }))}
                    className="h-10 w-full rounded-xl border border-gray-200 px-3 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-primary/20"
                  >
                    {zones.map((zone) => (
                      <option key={zone.id} value={zone.id}>
                        {zone.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Fecha</label>
                  <input
                    type="date"
                    value={newReservationForm.date}
                    onChange={(event) => setNewReservationForm((current) => ({ ...current, date: event.target.value }))}
                    className="h-10 w-full rounded-xl border border-gray-200 px-3 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-primary/20"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Residente</label>
                  <input
                    value={newReservationForm.resident}
                    onChange={(event) => setNewReservationForm((current) => ({ ...current, resident: event.target.value }))}
                    className="h-10 w-full rounded-xl border border-gray-200 px-3 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-primary/20"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Apartamento</label>
                  <input
                    value={newReservationForm.unit}
                    onChange={(event) => setNewReservationForm((current) => ({ ...current, unit: event.target.value }))}
                    className="h-10 w-full rounded-xl border border-gray-200 px-3 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-primary/20"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Hora inicio</label>
                  <input
                    type="time"
                    value={newReservationForm.startTime}
                    onChange={(event) => setNewReservationForm((current) => ({ ...current, startTime: event.target.value }))}
                    className="h-10 w-full rounded-xl border border-gray-200 px-3 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-primary/20"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Hora fin</label>
                  <input
                    type="time"
                    value={newReservationForm.endTime}
                    onChange={(event) => setNewReservationForm((current) => ({ ...current, endTime: event.target.value }))}
                    className="h-10 w-full rounded-xl border border-gray-200 px-3 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-primary/20"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Personas</label>
                  <input
                    type="number"
                    value={newReservationForm.people}
                    onChange={(event) => setNewReservationForm((current) => ({ ...current, people: Number(event.target.value) }))}
                    className="h-10 w-full rounded-xl border border-gray-200 px-3 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-primary/20"
                  />
                </div>
              </div>
              <div className="mt-5 flex gap-2">
                <button
                  onClick={() => setShowNewReservation(false)}
                  className="flex-1 rounded-xl border border-gray-200 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
                >
                  Cerrar
                </button>
                <button
                  onClick={handleCreateReservation}
                  className="flex-1 rounded-xl bg-primary px-4 py-2 text-sm font-medium text-white hover:bg-primary/90"
                >
                  Guardar reserva
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {showBlacklistForm && (
        <div className="fixed inset-0 z-50 bg-black/40 p-4 overflow-y-auto">
          <div className="min-h-full flex items-center justify-center">
            <div className="w-full max-w-xl rounded-2xl bg-white p-6 shadow-xl">
              <h2 className="text-xl font-bold text-gray-900">Agregar a lista negra</h2>
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2 mt-5">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Residente</label>
                  <input
                    value={blacklistForm.resident}
                    onChange={(event) => setBlacklistForm((current) => ({ ...current, resident: event.target.value }))}
                    className="h-10 w-full rounded-xl border border-gray-200 px-3 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-primary/20"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Apartamento</label>
                  <input
                    value={blacklistForm.unit}
                    onChange={(event) => setBlacklistForm((current) => ({ ...current, unit: event.target.value }))}
                    className="h-10 w-full rounded-xl border border-gray-200 px-3 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-primary/20"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Motivo</label>
                  <textarea
                    value={blacklistForm.reason}
                    onChange={(event) => setBlacklistForm((current) => ({ ...current, reason: event.target.value }))}
                    className="min-h-[100px] w-full rounded-xl border border-gray-200 px-3 py-3 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-primary/20"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Fecha inicio</label>
                  <input
                    type="date"
                    value={blacklistForm.startDate}
                    onChange={(event) => setBlacklistForm((current) => ({ ...current, startDate: event.target.value }))}
                    className="h-10 w-full rounded-xl border border-gray-200 px-3 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-primary/20"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Fecha fin</label>
                  <input
                    type="date"
                    value={blacklistForm.endDate}
                    onChange={(event) => setBlacklistForm((current) => ({ ...current, endDate: event.target.value }))}
                    className="h-10 w-full rounded-xl border border-gray-200 px-3 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-primary/20"
                  />
                </div>
              </div>

              <div className="mt-5 flex gap-2">
                <button
                  onClick={() => setShowBlacklistForm(false)}
                  className="flex-1 rounded-xl border border-gray-200 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
                >
                  Cerrar
                </button>
                <button
                  onClick={handleAddBlacklist}
                  className="flex-1 rounded-xl bg-primary px-4 py-2 text-sm font-medium text-white hover:bg-primary/90"
                >
                  Guardar restriccion
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
