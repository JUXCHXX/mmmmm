import { motion, AnimatePresence } from 'framer-motion';
import { useAppStore } from '@/store/useAppStore';
import { useAuthStore } from '@/store/useAuthStore';
import { CalendarDays, CheckCircle2, XCircle, MapPin, Clock, ChevronLeft, ChevronRight, Plus, Trash2, Calendar, BarChart3, Users, ToggleLeft, ToggleRight, SparklesIcon, Zap, Waves, Dumbbell, Sofa, Flame, Activity, Smile, ParkingSquare, Leaf, TrendingUp, AlertCircle, ClipboardList, User, Home, FileText } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { FloatingContainer } from '@/components/FloatingContainer';
import { useState } from 'react';

const STATUS_MAP: Record<string, { label: string; class: string; icon: any }> = {
  confirmed: { label: 'Confirmada', class: 'bg-emerald-500/20 text-emerald-400', icon: CheckCircle2 },
  pending: { label: 'Pendiente', class: 'bg-amber-500/20 text-amber-400', icon: Clock },
  rejected: { label: 'Rechazada', class: 'bg-red-500/20 text-red-400', icon: XCircle },
  cancelled: { label: 'Cancelada', class: 'bg-gray-500/20 text-gray-400', icon: XCircle },
};

const TIME_SLOTS = ['09:00-11:00', '11:00-13:00', '14:00-16:00', '16:00-18:00', '18:00-20:00'];
const TYPE_LABELS: Record<string, string> = {
  pool: 'Piscina',
  gym: 'Gimnasio',
  lounge: 'Salón Comunal',
  bbq: 'BBQ',
  court: 'Cancha',
  playground: 'Parque Infantil',
  parking: 'Parqueadero',
  garden: 'Jardín',
};

// Icon components mapping
const SPACE_ICON_MAP: Record<string, React.ReactNode> = {
  pool: <Waves className="w-8 h-8" strokeWidth={1.5} />,
  gym: <Dumbbell className="w-8 h-8" strokeWidth={1.5} />,
  lounge: <Sofa className="w-8 h-8" strokeWidth={1.5} />,
  bbq: <Flame className="w-8 h-8" strokeWidth={1.5} />,
  court: <Activity className="w-8 h-8" strokeWidth={1.5} />,
  playground: <Smile className="w-8 h-8" strokeWidth={1.5} />,
  parking: <ParkingSquare className="w-8 h-8" strokeWidth={1.5} />,
  garden: <Leaf className="w-8 h-8" strokeWidth={1.5} />,
};

// Color mapping for each space type
const SPACE_COLORS: Record<string, { gradient: string; border: string; light: string; hover: string }> = {
  pool: { gradient: 'from-blue-600/40 via-cyan-600/30 to-blue-600/20', border: 'border-blue-500/50', light: 'bg-blue-500/10', hover: 'hover:shadow-blue-500/20' },
  gym: { gradient: 'from-red-600/40 via-orange-600/30 to-red-600/20', border: 'border-red-500/50', light: 'bg-red-500/10', hover: 'hover:shadow-red-500/20' },
  lounge: { gradient: 'from-purple-600/40 via-violet-600/30 to-purple-600/20', border: 'border-purple-500/50', light: 'bg-purple-500/10', hover: 'hover:shadow-purple-500/20' },
  bbq: { gradient: 'from-amber-600/40 via-orange-600/30 to-amber-600/20', border: 'border-amber-500/50', light: 'bg-amber-500/10', hover: 'hover:shadow-amber-500/20' },
  court: { gradient: 'from-green-600/40 via-emerald-600/30 to-green-600/20', border: 'border-green-500/50', light: 'bg-green-500/10', hover: 'hover:shadow-green-500/20' },
  playground: { gradient: 'from-pink-600/40 via-rose-600/30 to-pink-600/20', border: 'border-pink-500/50', light: 'bg-pink-500/10', hover: 'hover:shadow-pink-500/20' },
  parking: { gradient: 'from-slate-600/40 via-gray-600/30 to-slate-600/20', border: 'border-slate-500/50', light: 'bg-slate-500/10', hover: 'hover:shadow-slate-500/20' },
  garden: { gradient: 'from-emerald-600/40 via-teal-600/30 to-emerald-600/20', border: 'border-emerald-500/50', light: 'bg-emerald-500/10', hover: 'hover:shadow-emerald-500/20' },
};

interface CalendarDay {
  date: number;
  available: boolean;
  isToday: boolean;
  isCurrentMonth: boolean;
}

const ReservationsPage = () => {
  const { reservations, updateReservationStatus, addReservation, condoConfig } = useAppStore();
  const user = useAuthStore((s) => s.user);

  const canValidate = user?.roleId === 'porteria' || user?.roleId === 'admin' || user?.roleId === 'super_admin';
  const canMakeReservations = user?.roleId === 'propietario' || user?.roleId === 'arrendatario';
  const hasFullAccess = user?.roleId === 'super_admin' || user?.roleId === 'admin';

  const [activeTab, setActiveTab] = useState<'espacios' | 'mis-reservas' | 'validacion'>('espacios');
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [showNewReservation, setShowNewReservation] = useState(false);
  const [zoneServiceStatus, setZoneServiceStatus] = useState<Record<string, boolean>>({});

  const [formData, setFormData] = useState({
    area: '',
    date: '',
    timeSlot: '',
    observations: '',
  });

  // Calculate stats
  const totalReservations = reservations.length;
  const confirmedCount = reservations.filter(r => r.status === 'confirmed').length;
  const pendingCount = reservations.filter(r => r.status === 'pending').length;
  const occupancyRate = totalReservations > 0 ? Math.round((confirmedCount / totalReservations) * 100) : 0;

  // Get days in month
  const getDaysInMonth = (date: Date): CalendarDay[] => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    const days: CalendarDay[] = [];
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    for (let i = startingDayOfWeek - 1; i >= 0; i--) {
      const date = new Date(year, month, -i);
      days.push({ date: date.getDate(), available: false, isToday: false, isCurrentMonth: false });
    }

    for (let i = 1; i <= daysInMonth; i++) {
      const date = new Date(year, month, i);
      date.setHours(0, 0, 0, 0);
      const dateStr = date.toISOString().split('T')[0];
      const hasReservations = reservations.some(r => r.date === dateStr);

      days.push({
        date: i,
        available: !hasReservations && date >= today,
        isToday: date.getTime() === today.getTime(),
        isCurrentMonth: true,
      });
    }

    const remainingDays = 42 - days.length;
    for (let i = 1; i <= remainingDays; i++) {
      days.push({ date: i, available: false, isToday: false, isCurrentMonth: false });
    }

    return days;
  };

  const calendarDays = getDaysInMonth(currentDate);
  const monthName = currentDate.toLocaleDateString('es-ES', { month: 'long', year: 'numeric' });

  // Render: Header con KPIs
  const renderHeader = () => (
    <motion.div initial={{ opacity: 0, y: -30 }} animate={{ opacity: 1, y: 0 }} className="mb-10">
      <div className="space-y-6">
        {/* Main Title */}
        <div>
          <h1 className="text-5xl md:text-6xl font-black text-foreground mb-3 flex items-center gap-4">
            <motion.span
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="text-foreground"
            >
              <Calendar className="w-10 h-10 text-primary" strokeWidth={1.5} />
            </motion.span>
            Gestión de Reservas
          </h1>
          <p className="text-lg text-muted-foreground font-medium">
            Administra los espacios comunes del conjunto de forma sencilla y rápida
          </p>
        </div>

        {/* Stats Grid Enhanced */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
          {[
            { Icon: BarChart3, label: 'Total Reservas', value: totalReservations, color: 'blue', trend: '+12%' },
            { Icon: CheckCircle2, label: 'Confirmadas', value: confirmedCount, color: 'emerald', trend: '+8%' },
            { Icon: Clock, label: 'Pendientes', value: pendingCount, color: 'amber', trend: '0%' },
            { Icon: TrendingUp, label: 'Ocupación', value: `${occupancyRate}%`, color: 'purple', trend: '+5%' },
          ].map((stat, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: idx * 0.1 }}
              className={`group bg-white rounded-xl border border-black/8 shadow-sm-static p-6 rounded-2xl border border-${stat.color}-500/30 hover:border-${stat.color}-500/50 hover:shadow-2xl hover:shadow-${stat.color}-500/10 transition-all`}
              whileHover={{ scale: 1.05 }}
            >
              <div className="flex items-start justify-between mb-4">
                <stat.Icon className="w-10 h-10 text-primary group-hover:scale-110 transition-transform" strokeWidth={1.5} />
                <span className="text-xs font-bold text-emerald-400 bg-emerald-500/20 px-2 py-1 rounded-full">{stat.trend}</span>
              </div>
              <p className="text-4xl font-black text-foreground mb-2">{stat.value}</p>
              <p className="text-sm text-muted-foreground font-semibold">{stat.label}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.div>
  );

  // Render: Espacios/Áreas
  const renderEspacios = () => (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-8">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-black text-foreground flex items-center gap-3">
          <Calendar className="w-8 h-8 text-primary" strokeWidth={1.5} />
          Espacios Disponibles
        </h2>
        {hasFullAccess && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-sm bg-primary/20 text-primary px-4 py-2 rounded-full font-bold border border-primary/30 flex items-center gap-2"
          >
            <Zap className="w-4 h-4" /> Control Administrativo Activo
          </motion.div>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-7">
        {condoConfig.commonAreas.map((area, idx) => {
          const areaRes = reservations.filter(r => r.area === area.name);
          const confirmed = areaRes.filter(r => r.status === 'confirmed').length;
          const isInService = zoneServiceStatus[area.id] !== false;

          const colorConfig = SPACE_COLORS[area.type] || SPACE_COLORS.lounge;
          const spaceIcon = SPACE_ICON_MAP[area.type] || SPACE_ICON_MAP.lounge;
          const occupancyPercent = area.capacity > 0 ? Math.round((confirmed / area.capacity) * 100) : 0;

          return (
            <motion.div
              key={area.id}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.08 }}
              className={`group relative rounded-3xl overflow-hidden transition-all transform hover:scale-105 cursor-pointer ${
                isInService
                  ? `bg-gradient-to-br ${colorConfig.gradient} ${colorConfig.border} border-2 ${colorConfig.hover} hover:shadow-2xl`
                  : 'bg-red-500/10 border border-red-500/30 opacity-70'
              }`}
              whileHover={{ y: -10 }}
            >
              {/* Decorative Elements */}
              <div className="absolute top-0 right-0 w-24 h-24 opacity-10 group-hover:opacity-20 transition-opacity">
                <div className="w-full h-full rounded-full bg-white blur-3xl"></div>
              </div>

              {/* Header con Icono Grande */}
              <div className="relative h-32 flex flex-col items-center justify-center p-4 overflow-hidden">
                {/* Animated background */}
                <motion.div
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 4, repeat: Infinity }}
                  className={`absolute inset-0 ${colorConfig.light} opacity-50`}
                ></motion.div>

                {/* Main Icon */}
                <motion.div
                  animate={{ y: [0, -12, 0], rotate: [0, 5, -5, 0] }}
                  transition={{ duration: 3.5, repeat: Infinity }}
                  className="relative z-10 drop-shadow-2xl text-white"
                >
                  {spaceIcon}
                </motion.div>

                {!isInService && (
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
                    className="absolute top-4 right-4 bg-red-500/30 text-red-400 px-4 py-2 rounded-full text-sm font-bold border border-red-500/50 flex items-center gap-1"
                  >
                    <AlertCircle className="w-4 h-4" /> Fuera de Servicio
                  </motion.div>
                )}
              </div>

              {/* Content */}
              <div className="relative z-10 p-4 space-y-3 bg-gradient-to-b from-transparent via-[rgba(0,0,0,0.2)] to-[rgba(0,0,0,0.4)]">
                {/* Título */}
                <div>
                  <p className="text-xs text-white/70 font-bold uppercase tracking-widest mb-0.5">{TYPE_LABELS[area.type]}</p>
                  <h3 className="text-lg font-black text-white drop-shadow-lg">{area.name}</h3>
                </div>

                {/* Progress Bar */}
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-white/80 font-semibold">Ocupación</span>
                    <span className="text-xs font-black text-white">{occupancyPercent}%</span>
                  </div>
                  <div className="h-2 bg-white/20 rounded-full overflow-hidden backdrop-blur-sm">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${occupancyPercent}%` }}
                      transition={{ duration: 1, ease: 'easeOut' }}
                      className="h-full bg-gradient-to-r from-white via-white to-white/70 rounded-full"
                    ></motion.div>
                  </div>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-2 gap-2 pt-1">
                  <div className="p-2 rounded-lg bg-white/10 backdrop-blur-sm border border-white/20 text-center">
                    <p className="text-xs text-white/70 font-semibold mb-0.5 flex items-center justify-center gap-1">
                      <Users className="w-3 h-3" /> Capacidad
                    </p>
                    <p className="text-sm font-black text-white">{area.capacity}</p>
                  </div>
                  <div className="p-2 rounded-lg bg-white/10 backdrop-blur-sm border border-white/20 text-center">
                    <p className="text-xs text-white/70 font-semibold mb-0.5 flex items-center justify-center gap-1">
                      <CheckCircle2 className="w-3 h-3" /> Reservadas
                    </p>
                    <p className="text-sm font-black text-white">{confirmed}</p>
                  </div>
                </div>

                {/* Service Toggle */}
                {hasFullAccess && (
                  <motion.button
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                    onClick={() => {
                      const newStatus = !isInService;
                      zoneServiceStatus[area.id] = newStatus;
                      setZoneServiceStatus({ ...zoneServiceStatus });
                      toast({
                        title: newStatus ? 'Espacio Activado' : 'Espacio Desactivado',
                        description: `${area.name} está ${newStatus ? 'disponible' : 'fuera de servicio'}`,
                        variant: 'default'
                      });
                    }}
                    className={`w-full py-2 px-3 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-2 border-2 ${
                      isInService
                        ? 'bg-green-500/30 text-green-200 hover:bg-green-500/40 border-green-500/50'
                        : 'bg-red-500/30 text-red-200 hover:bg-red-500/40 border-red-500/50'
                    }`}
                  >
                    {isInService ? <ToggleRight className="w-5 h-5" /> : <ToggleLeft className="w-5 h-5" />}
                    {isInService ? 'En Servicio' : 'Fuera de Servicio'}
                  </motion.button>
                )}

                {/* Action Buttons */}
                <div className="flex gap-2 pt-2">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => {
                      setFormData({ ...formData, area: area.name });
                      setShowNewReservation(true);
                    }}
                    className="flex-1 py-2 rounded-lg bg-white/20 hover:bg-white/30 text-white text-xs font-bold transition-all flex items-center justify-center gap-1 border border-white/30 backdrop-blur-sm"
                  >
                    <Plus className="w-3 h-3" /> Reservar
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="flex-1 py-2 rounded-lg bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-100 text-xs font-bold transition-all flex items-center justify-center gap-1 border border-cyan-500/30 backdrop-blur-sm"
                  >
                    <Calendar className="w-3 h-3" /> Agenda
                  </motion.button>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </motion.div>
  );

  // Render: Mis Reservas
  const renderMisReservas = () => {
    const myReservations = canMakeReservations
      ? reservations.filter(r => r.resident === user?.name)
      : reservations;

    return (
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
        <h2 className="text-xl font-bold text-foreground mb-4 flex items-center gap-2">
          <ClipboardList className="h-5 w-5 text-primary" />
          {canMakeReservations ? 'Mis Reservas' : 'Todas las Reservas'}
        </h2>

        {myReservations.length > 0 ? (
          <div className="space-y-3">
            {myReservations.map((res, idx) => {
              const statusInfo = STATUS_MAP[res.status];
              const StatusIcon = statusInfo.icon;

              return (
                <motion.div
                  key={res.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.05 }}
                  className="bg-white rounded-[12px] border border-[#E5E7EB] p-6 shadow-sm rounded-2xl border border-gradient-to-r from-primary/20 to-transparent hover:border-primary/40 hover:shadow-lg hover:shadow-primary/10 transition-all"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-3">
                        <SparklesIcon className="h-6 w-6 text-primary" />
                        <div>
                          <p className="font-bold text-lg text-foreground">{res.area}</p>
                          <span className={`px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1 w-fit ${statusInfo.class}`}>
                            <StatusIcon className="w-3 h-3" />
                            {statusInfo.label}
                          </span>
                        </div>
                      </div>
                      <div className="flex flex-wrap gap-6 text-sm text-muted-foreground">
                        <span className="flex items-center gap-2">
                          <Calendar className="h-4 w-4" />
                          {res.date}
                        </span>
                        <span className="flex items-center gap-2">
                          <Clock className="h-4 w-4" />
                          {res.timeSlot}
                        </span>
                        {res.unit && (
                          <span className="flex items-center gap-2">
                            <Home className="h-4 w-4" />
                            Apto {res.unit}
                          </span>
                        )}
                      </div>
                    </div>

                    {canValidate && res.status === 'pending' && (
                      <div className="flex gap-2">
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => {
                            updateReservationStatus(res.id, 'confirmed');
                            toast({ title: 'Reserva confirmada', variant: 'default' });
                          }}
                          className="px-4 py-2 rounded-lg bg-emerald-500/20 text-emerald-400 hover:bg-emerald-500/30 text-xs font-bold transition-colors border border-emerald-500/20 inline-flex items-center gap-1.5"
                        >
                          <CheckCircle2 className="h-4 w-4" />
                          Aprobar
                        </motion.button>
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => {
                            updateReservationStatus(res.id, 'rejected');
                            toast({ title: 'Reserva rechazada', variant: 'default' });
                          }}
                          className="px-4 py-2 rounded-lg bg-red-500/20 text-red-400 hover:bg-red-500/30 text-xs font-bold transition-colors border border-red-500/20 inline-flex items-center gap-1.5"
                        >
                          <XCircle className="h-4 w-4" />
                          Rechazar
                        </motion.button>
                      </div>
                    )}
                  </div>
                </motion.div>
              );
            })}
          </div>
        ) : (
          <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="text-center py-16 bg-white rounded-xl border border-black/8 shadow-sm-static rounded-2xl p-8">
            <CalendarDays className="w-16 h-16 text-muted-foreground mx-auto mb-4 opacity-30" />
            <p className="text-muted-foreground text-lg font-medium">No hay reservas registradas</p>
            <p className="text-muted-foreground text-sm mt-2">¡Crea tu primera reserva!</p>
          </motion.div>
        )}
      </motion.div>
    );
  };

  // Render: Validación
  const renderValidacion = () => {
    const pendingReservations = reservations.filter(r => r.status === 'pending');

    return (
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-foreground flex items-center gap-2">
            <CheckCircle2 className="h-5 w-5 text-emerald-400" />
            Centro de Validación
          </h2>
          <motion.span
            animate={{ scale: [1, 1.1, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="px-4 py-2 rounded-full bg-amber-500/20 text-amber-400 text-sm font-bold border border-amber-500/30"
          >
            <span className="inline-flex items-center gap-1.5">
              <Clock className="h-4 w-4" />
              {pendingReservations.length} Pendientes
            </span>
          </motion.span>
        </div>

        {pendingReservations.length > 0 ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
            {pendingReservations.map((res, idx) => (
              <motion.div
                key={res.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.05 }}
                className="group bg-white rounded-xl border border-black/8 shadow-sm-static rounded-2xl overflow-hidden border border-amber-500/30 hover:border-amber-500/50 hover:shadow-lg hover:shadow-amber-500/10 transition-all"
              >
                {/* Header con gradiente */}
                <div className="bg-gradient-to-r from-amber-500/30 via-amber-500/15 to-transparent p-5 border-b border-amber-500/20">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-start gap-3">
                      <SparklesIcon className="h-8 w-8 text-amber-300" />
                      <div>
                        <h3 className="text-lg font-bold text-foreground">{res.area}</h3>
                        <p className="inline-flex items-center gap-2 text-sm text-muted-foreground">
                          <User className="h-4 w-4" />
                          {res.resident}
                        </p>
                      </div>
                    </div>
                    <motion.span
                      animate={{ rotate: [0, 5, -5, 0] }}
                      transition={{ duration: 2, repeat: Infinity }}
                      className="px-3 py-1.5 rounded-full bg-amber-500/30 text-amber-400 text-xs font-bold flex items-center gap-1 whitespace-nowrap border border-amber-500/30"
                    >
                      <Clock className="h-4 w-4" />
                      Por Validar
                    </motion.span>
                  </div>
                </div>

                {/* Detalles en Grid */}
                <div className="p-5 space-y-4">
                  <div className="grid grid-cols-2 gap-3">
                    <motion.div whileHover={{ scale: 1.05 }} className="p-4 rounded-xl bg-gradient-to-br from-blue-500/20 to-blue-500/5 border border-blue-500/20 text-center">
                      <p className="inline-flex items-center gap-1 text-xs text-muted-foreground mb-1 font-semibold">
                        <Calendar className="h-3.5 w-3.5" />
                        FECHA
                      </p>
                      <p className="font-bold text-blue-400 text-sm">{res.date}</p>
                    </motion.div>
                    <motion.div whileHover={{ scale: 1.05 }} className="p-4 rounded-xl bg-gradient-to-br from-purple-500/20 to-purple-500/5 border border-purple-500/20 text-center">
                      <p className="inline-flex items-center gap-1 text-xs text-muted-foreground mb-1 font-semibold">
                        <Clock className="h-3.5 w-3.5" />
                        HORARIO
                      </p>
                      <p className="font-bold text-purple-400 text-sm">{res.timeSlot}</p>
                    </motion.div>
                    <motion.div whileHover={{ scale: 1.05 }} className="p-4 rounded-xl bg-gradient-to-br from-cyan-500/20 to-cyan-500/5 border border-cyan-500/20 text-center">
                      <p className="inline-flex items-center gap-1 text-xs text-muted-foreground mb-1 font-semibold">
                        <Home className="h-3.5 w-3.5" />
                        UNIDAD
                      </p>
                      <p className="font-bold text-cyan-400 text-sm">Apto {res.unit}</p>
                    </motion.div>
                    <motion.div whileHover={{ scale: 1.05 }} className="p-4 rounded-xl bg-gradient-to-br from-rose-500/20 to-rose-500/5 border border-rose-500/20 text-center">
                      <p className="inline-flex items-center gap-1 text-xs text-muted-foreground mb-1 font-semibold">
                        <Users className="h-3.5 w-3.5" />
                        PERSONAS
                      </p>
                      <p className="font-bold text-rose-400 text-sm">2-4</p>
                    </motion.div>
                  </div>

                  {/* Observaciones */}
                  {res.observations && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      className="p-4 rounded-xl bg-gradient-to-r from-blue-500/20 to-blue-500/5 border border-blue-500/30"
                    >
                      <p className="inline-flex items-center gap-1 text-xs text-muted-foreground mb-2 font-semibold">
                        <FileText className="h-3.5 w-3.5" />
                        OBSERVACIONES
                      </p>
                      <p className="text-sm text-foreground">{res.observations}</p>
                    </motion.div>
                  )}

                  {/* Acciones */}
                  <div className="flex gap-3 pt-4 border-t border-[rgba(255,255,255,0.1)]">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => {
                        updateReservationStatus(res.id, 'rejected');
                        toast({ title: 'Reserva rechazada', variant: 'default' });
                      }}
                      className="flex-1 py-3 rounded-lg bg-gradient-to-r from-red-500/20 to-red-500/10 hover:from-red-500/30 hover:to-red-500/20 text-red-400 font-bold text-sm transition-all flex items-center justify-center gap-2 border border-red-500/20"
                    >
                      <XCircle className="h-4 w-4" />
                      Rechazar
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => {
                        updateReservationStatus(res.id, 'confirmed');
                        toast({ title: 'Reserva confirmada', variant: 'default' });
                      }}
                      className="flex-1 py-3 rounded-lg bg-gradient-to-r from-emerald-500/20 to-emerald-500/10 hover:from-emerald-500/30 hover:to-emerald-500/20 text-emerald-400 font-bold text-sm transition-all flex items-center justify-center gap-2 border border-emerald-500/20"
                    >
                      <CheckCircle2 className="h-4 w-4" />
                      Aprobar
                    </motion.button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center py-16 bg-white rounded-xl border border-black/8 shadow-sm-static rounded-2xl p-8 border border-emerald-500/30"
          >
            <motion.div
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="mb-4 flex justify-center"
            >
              <CheckCircle2 className="h-14 w-14 text-emerald-400" />
            </motion.div>
            <p className="text-foreground text-lg font-bold">¡Sin Pendientes!</p>
            <p className="text-muted-foreground text-sm mt-2">Todas las reservas han sido validadas</p>
          </motion.div>
        )}
      </motion.div>
    );
  };

  return (
    <div className="space-y-8">
      {renderHeader()}

      {/* Tabs Mejorados */}
      <div className="flex gap-3 overflow-x-auto pb-3 pt-2">
        {[
          { id: 'espacios', label: 'Espacios', icon: Calendar, description: 'Todos los espacios disponibles' },
          { id: 'mis-reservas', label: canMakeReservations ? 'Mis Reservas' : 'Todas', icon: ClipboardList, description: canMakeReservations ? 'Tus reservaciones' : 'Todas las reservaciones' },
          ...(canValidate ? [{ id: 'validacion', label: 'Validación', icon: CheckCircle2, description: 'Aprobar/rechazar reservas' }] : []),
        ].map(tab => (
          <motion.button
            key={tab.id}
            whileHover={{ scale: 1.05, y: -2 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setActiveTab(tab.id as any)}
            className={`relative px-6 py-3 rounded-2xl text-sm font-bold transition-all whitespace-nowrap flex items-center gap-3 group ${
              activeTab === tab.id
                ? 'bg-gradient-to-r from-primary/40 to-primary/20 text-primary border border-primary/50 shadow-xl shadow-primary/20'
                : 'text-muted-foreground hover:text-foreground bg-[rgba(255,255,255,0.04)] border border-[rgba(255,255,255,0.1)] hover:border-primary/30'
            }`}
            title={tab.description}
          >
            <tab.icon className="h-5 w-5" />
            <span>{tab.label}</span>
            {activeTab === tab.id && (
              <motion.div
                layoutId="activeTab"
                className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-primary via-primary to-cyan-400"
                style={{ borderRadius: '12px 12px 0 0' }}
              />
            )}
          </motion.button>
        ))}
      </div>

      {/* Content Area */}
      <AnimatePresence mode="wait">
        {activeTab === 'espacios' && <div key="espacios">{renderEspacios()}</div>}
        {activeTab === 'mis-reservas' && <div key="mis-reservas">{renderMisReservas()}</div>}
        {activeTab === 'validacion' && <div key="validacion">{renderValidacion()}</div>}
      </AnimatePresence>

      {/* Modal Nueva Reserva */}
      <FloatingContainer
        isOpen={showNewReservation}
        onClose={() => setShowNewReservation(false)}
        title="Nueva Reserva"
        icon={<CalendarDays className="w-5 h-5" />}
        size="md"
      >
        <div className="space-y-5">
          <div>
            <label className="text-sm font-bold text-foreground mb-2 block">Espacio</label>
            <input
              type="text"
              value={formData.area}
              disabled
              className="w-full px-4 py-3 rounded-lg bg-[rgba(255,255,255,0.04)] border border-[rgba(255,255,255,0.08)] text-foreground text-sm font-semibold"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-sm font-bold text-foreground mb-2 block">Fecha</label>
              <input
                type="date"
                value={formData.date}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                className="w-full px-4 py-3 rounded-lg bg-[rgba(255,255,255,0.08)] border border-[rgba(255,255,255,0.1)] text-foreground text-sm focus:outline-none focus:border-primary"
              />
            </div>
            <div>
              <label className="text-sm font-bold text-foreground mb-2 block">Horario</label>
              <select
                value={formData.timeSlot}
                onChange={(e) => setFormData({ ...formData, timeSlot: e.target.value })}
                className="w-full px-4 py-3 rounded-lg bg-[rgba(255,255,255,0.08)] border border-[rgba(255,255,255,0.1)] text-foreground text-sm focus:outline-none focus:border-primary"
              >
                <option value="">Selecciona...</option>
                {TIME_SLOTS.map(slot => (
                  <option key={slot} value={slot}>{slot}</option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="text-sm font-bold text-foreground mb-2 block">Observaciones</label>
            <textarea
              value={formData.observations}
              onChange={(e) => setFormData({ ...formData, observations: e.target.value })}
              placeholder="Añade alguna nota adicional..."
              rows={3}
              className="w-full px-4 py-3 rounded-lg bg-[rgba(255,255,255,0.08)] border border-[rgba(255,255,255,0.1)] text-foreground text-sm focus:outline-none focus:border-primary resize-none"
            />
          </div>

          <div className="flex gap-3 pt-4 border-t border-[rgba(255,255,255,0.1)]">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setShowNewReservation(false)}
              className="flex-1 py-3 rounded-lg bg-gray-500/20 hover:bg-gray-500/30 text-gray-400 font-bold transition-colors inline-flex items-center justify-center gap-2"
            >
              <XCircle className="h-4 w-4" />
              Cancelar
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => {
                toast({ title: 'Reserva creada', description: 'Tu reserva ha sido registrada exitosamente', variant: 'default' });
                setShowNewReservation(false);
                setFormData({ area: '', date: '', timeSlot: '', observations: '' });
              }}
              className="flex-1 py-3 rounded-lg bg-gradient-to-r from-primary/30 to-primary/20 hover:from-primary/40 hover:to-primary/30 text-primary font-bold transition-colors border border-primary/30 inline-flex items-center justify-center gap-2"
            >
              <CheckCircle2 className="h-4 w-4" />
              Reservar Ahora
            </motion.button>
          </div>
        </div>
      </FloatingContainer>
    </div>
  );
};

export default ReservationsPage;
