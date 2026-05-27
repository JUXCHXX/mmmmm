import { useState, type ElementType } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAppStore, type PQRS } from '@/store/useAppStore';
import { useAuthStore } from '@/store/useAuthStore';
import {
  ClipboardList,
  ArrowRight,
  BarChart3,
  PieChart,
  TrendingUp,
  AlertTriangle,
  CheckCircle,
  Clock,
  Filter,
  Search,
  XCircle,
  MessageSquare,
  AlertCircle,
  Lightbulb,
  Mail,
  Settings,
  Zap,
} from 'lucide-react';
import { toast } from '@/hooks/use-toast';

const STATUS_FLOW = ['received', 'in_progress', 'escalated', 'resolved', 'closed'] as const;

const STATUS_LABELS: Record<
  PQRS['status'],
  { label: string; className: string; toneClass: string; icon: ElementType }
> = {
  received: {
    label: 'Recibido',
    className: 'bg-blue-50 text-blue-600 border border-blue-100',
    toneClass: 'bg-blue-50',
    icon: Mail,
  },
  in_progress: {
    label: 'En proceso',
    className: 'bg-amber-50 text-amber-600 border border-amber-100',
    toneClass: 'bg-amber-50',
    icon: Settings,
  },
  escalated: {
    label: 'Escalado',
    className: 'bg-violet-50 text-violet-600 border border-violet-100',
    toneClass: 'bg-violet-50',
    icon: TrendingUp,
  },
  resolved: {
    label: 'Resuelto',
    className: 'bg-emerald-50 text-emerald-600 border border-emerald-100',
    toneClass: 'bg-emerald-50',
    icon: CheckCircle,
  },
  closed: {
    label: 'Cerrado',
    className: 'bg-slate-100 text-slate-600 border border-slate-200',
    toneClass: 'bg-slate-100',
    icon: XCircle,
  },
};

const PRIORITY_MAP: Record<
  PQRS['priority'],
  {
    label: string;
    className: string;
    textClass: string;
    borderClass: string;
    softClass: string;
    icon: ElementType;
  }
> = {
  low: {
    label: 'Baja',
    className: 'bg-blue-50 text-blue-600 border border-blue-100',
    textClass: 'text-blue-500',
    borderClass: 'border-l-blue-500',
    softClass: 'bg-blue-50',
    icon: AlertCircle,
  },
  medium: {
    label: 'Media',
    className: 'bg-amber-50 text-amber-600 border border-amber-100',
    textClass: 'text-amber-500',
    borderClass: 'border-l-amber-400',
    softClass: 'bg-amber-50',
    icon: AlertTriangle,
  },
  high: {
    label: 'Alta',
    className: 'bg-red-50 text-red-600 border border-red-100',
    textClass: 'text-red-500',
    borderClass: 'border-l-red-500',
    softClass: 'bg-red-50',
    icon: AlertTriangle,
  },
  urgent: {
    label: 'Urgente',
    className: 'bg-red-50 text-red-700 border border-red-100',
    textClass: 'text-red-600',
    borderClass: 'border-l-red-600',
    softClass: 'bg-red-50',
    icon: Zap,
  },
};

const CATEGORY_MAP: Record<PQRS['category'], { label: string; className: string; icon: ElementType }> = {
  petition: {
    label: 'Peticion',
    className: 'bg-sky-50 text-sky-600 border border-sky-100',
    icon: MessageSquare,
  },
  complaint: {
    label: 'Queja',
    className: 'bg-rose-50 text-rose-600 border border-rose-100',
    icon: AlertTriangle,
  },
  claim: {
    label: 'Reclamo',
    className: 'bg-orange-50 text-orange-600 border border-orange-100',
    icon: AlertCircle,
  },
  suggestion: {
    label: 'Sugerencia',
    className: 'bg-emerald-50 text-emerald-600 border border-emerald-100',
    icon: Lightbulb,
  },
};

type TabType = 'lista' | 'analisis' | 'estadisticas';

interface PQRSComment {
  id: string;
  author: string;
  text: string;
  date: string;
  avatar: string;
}

const basePanelClass = 'bg-white rounded-xl border border-gray-200 shadow-sm';

const PQRSPage = () => {
  const { pqrs, updatePQRSStatus } = useAppStore();
  const user = useAuthStore((s) => s.user);

  const hasFullAccess = user?.roleId === 'admin' || user?.roleId === 'super_admin';
  const canAdvance = hasFullAccess;

  const [activeTab, setActiveTab] = useState<TabType>('lista');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [priorityFilter, setPriorityFilter] = useState<string>('all');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedPQRS, setSelectedPQRS] = useState<PQRS | null>(null);
  const [newComment, setNewComment] = useState('');
  const [comments, setComments] = useState<PQRSComment[]>([]);

  const filteredPQRS = pqrs.filter((item) => {
    if (statusFilter !== 'all' && item.status !== statusFilter) return false;
    if (priorityFilter !== 'all' && item.priority !== priorityFilter) return false;
    if (categoryFilter !== 'all' && item.category !== categoryFilter) return false;
    if (
      searchTerm &&
      !item.subject.toLowerCase().includes(searchTerm.toLowerCase()) &&
      !item.resident.toLowerCase().includes(searchTerm.toLowerCase()) &&
      !item.unit.toLowerCase().includes(searchTerm.toLowerCase())
    ) {
      return false;
    }
    return true;
  });

  const visiblePQRS = hasFullAccess ? filteredPQRS : pqrs;

  const stats = {
    total: pqrs.length,
    received: pqrs.filter((item) => item.status === 'received').length,
    inProgress: pqrs.filter((item) => item.status === 'in_progress').length,
    escalated: pqrs.filter((item) => item.status === 'escalated').length,
    resolved: pqrs.filter((item) => item.status === 'resolved').length,
    closed: pqrs.filter((item) => item.status === 'closed').length,
    byPriority: {
      urgent: pqrs.filter((item) => item.priority === 'urgent').length,
      high: pqrs.filter((item) => item.priority === 'high').length,
      medium: pqrs.filter((item) => item.priority === 'medium').length,
      low: pqrs.filter((item) => item.priority === 'low').length,
    },
    byCategory: {
      petition: pqrs.filter((item) => item.category === 'petition').length,
      complaint: pqrs.filter((item) => item.category === 'complaint').length,
      claim: pqrs.filter((item) => item.category === 'claim').length,
      suggestion: pqrs.filter((item) => item.category === 'suggestion').length,
    },
    resolutionRate:
      pqrs.length > 0
        ? Math.round(
            ((pqrs.filter((item) => item.status === 'resolved' || item.status === 'closed').length || 0) /
              pqrs.length) *
              100,
          )
        : 0,
    averageTime: '3.2 dias',
  };

  const summaryCards = [
    { label: 'Total', value: stats.total, icon: BarChart3, iconClass: 'text-slate-400' },
    { label: 'Resueltos', value: stats.resolved + stats.closed, icon: CheckCircle, iconClass: 'text-emerald-400' },
    {
      label: 'Pendientes',
      value: stats.received + stats.inProgress + stats.escalated,
      icon: Clock,
      iconClass: 'text-amber-400',
    },
    { label: 'Resolucion', value: `${stats.resolutionRate}%`, icon: TrendingUp, iconClass: 'text-violet-400' },
  ];

  const advanceStatus = (id: string, current: PQRS['status']) => {
    const currentIndex = STATUS_FLOW.indexOf(current);
    if (currentIndex >= 0 && currentIndex < STATUS_FLOW.length - 1) {
      const nextStatus = STATUS_FLOW[currentIndex + 1];
      updatePQRSStatus(id, nextStatus);
      toast({
        title: 'Estado actualizado',
        description: `Avanzado a: ${STATUS_LABELS[nextStatus].label}`,
      });
    }
  };

  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
        <div className="flex items-start gap-3">
          <ClipboardList className="w-8 h-8 text-primary mt-0.5" />
          <div>
            <h1 className="text-3xl font-bold text-gray-900">PQRS</h1>
            <p className="text-sm text-gray-500 font-normal mt-1">
              Peticiones, Quejas, Reclamos y Sugerencias
            </p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
          {summaryCards.map((card, index) => {
            const CardIcon = card.icon;
            return (
              <motion.div
                key={card.label}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className={`${basePanelClass} p-4`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-xs text-gray-500 uppercase tracking-wide">{card.label}</p>
                    <p className="text-2xl font-bold text-gray-900 mt-2">{card.value}</p>
                  </div>
                  <CardIcon className={`w-5 h-5 ${card.iconClass}`} strokeWidth={1.8} />
                </div>
              </motion.div>
            );
          })}
        </div>
      </motion.div>

      {hasFullAccess && (
        <div className="flex gap-2 overflow-x-auto pb-1">
          {[
            { id: 'lista', label: 'Lista', icon: ClipboardList },
            { id: 'analisis', label: 'Analisis', icon: BarChart3 },
            { id: 'estadisticas', label: 'Estadisticas', icon: PieChart },
          ].map((tab) => {
            const TabIcon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as TabType)}
                className={`px-4 py-2 rounded-xl text-sm font-medium transition-colors whitespace-nowrap ${
                  activeTab === tab.id
                    ? 'bg-primary/20 text-primary'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                <TabIcon className="w-4 h-4 inline mr-2" />
                {tab.label}
              </button>
            );
          })}
        </div>
      )}

      <AnimatePresence mode="wait">
        {activeTab === 'analisis' && hasFullAccess && (
          <motion.div key="analisis" initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
            <div className={`${basePanelClass} p-6`}>
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-amber-500" />
                Analisis por Prioridad
              </h3>
              <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
                {Object.entries(stats.byPriority).map(([priority, count]) => {
                  const config = PRIORITY_MAP[priority as PQRS['priority']];
                  const Icon = config.icon;
                  const percent = stats.total > 0 ? Math.round((count / stats.total) * 100) : 0;
                  return (
                    <div key={priority} className={`${basePanelClass} p-4`}>
                      <div className="flex items-center justify-between mb-3">
                        <div>
                          <p className="text-xs uppercase tracking-wide text-gray-500">{config.label}</p>
                          <p className="text-2xl font-bold text-gray-900 mt-1">{count}</p>
                        </div>
                        <Icon className={`w-5 h-5 ${config.textClass}`} />
                      </div>
                      <div className="h-2 rounded-full bg-gray-100 overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${percent}%` }}
                          transition={{ duration: 0.6 }}
                          className={`h-full ${config.softClass}`}
                        />
                      </div>
                      <p className="text-xs text-gray-400 mt-2">{percent}% del total</p>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className={`${basePanelClass} p-6`}>
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <Filter className="w-5 h-5 text-primary" />
                Analisis por Categoria
              </h3>
              <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
                {Object.entries(stats.byCategory).map(([category, count]) => {
                  const config = CATEGORY_MAP[category as PQRS['category']];
                  const Icon = config.icon;
                  const percent = stats.total > 0 ? Math.round((count / stats.total) * 100) : 0;
                  return (
                    <div key={category} className={`${basePanelClass} p-4`}>
                      <div className="flex items-center justify-between mb-3">
                        <div>
                          <p className="text-xs uppercase tracking-wide text-gray-500">{config.label}</p>
                          <p className="text-2xl font-bold text-gray-900 mt-1">{count}</p>
                        </div>
                        <Icon className="w-5 h-5 text-gray-400" />
                      </div>
                      <div className="h-2 rounded-full bg-gray-100 overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${percent}%` }}
                          transition={{ duration: 0.6 }}
                          className="h-full bg-primary/25"
                        />
                      </div>
                      <p className="text-xs text-gray-400 mt-2">{percent}% del total</p>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className={`${basePanelClass} p-6`}>
              <h3 className="text-lg font-semibold text-gray-900 mb-5 flex items-center gap-2">
                <ArrowRight className="w-5 h-5 text-primary" />
                Flujo de Trabajo
              </h3>
              <div className="grid gap-3 md:grid-cols-5">
                {STATUS_FLOW.map((status) => {
                  const config = STATUS_LABELS[status];
                  const Icon = config.icon;
                  const count =
                    status === 'received'
                      ? stats.received
                      : status === 'in_progress'
                        ? stats.inProgress
                        : status === 'escalated'
                          ? stats.escalated
                          : status === 'resolved'
                            ? stats.resolved
                            : stats.closed;
                  return (
                    <div key={status} className={`${config.toneClass} border border-gray-200 rounded-xl p-4`}>
                      <Icon className="w-5 h-5 text-gray-500 mb-3" />
                      <p className="text-2xl font-bold text-gray-900">{count}</p>
                      <p className="text-xs text-gray-500 mt-1">{config.label}</p>
                    </div>
                  );
                })}
              </div>
            </div>

            {pqrs.filter((item) => item.priority === 'urgent' || item.priority === 'high').length > 0 && (
              <div className={`${basePanelClass} p-6`}>
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <AlertTriangle className="w-5 h-5 text-red-500" />
                  Casos de Atencion Prioritaria
                </h3>
                <div className="space-y-3">
                  {pqrs
                    .filter((item) => item.priority === 'urgent' || item.priority === 'high')
                    .slice(0, 5)
                    .map((item) => {
                      const priority = PRIORITY_MAP[item.priority];
                      const PriorityIcon = priority.icon;
                      return (
                        <div
                          key={item.id}
                          className={`bg-white border border-gray-200 rounded-xl p-4 shadow-sm border-l-[3px] ${priority.borderClass}`}
                        >
                          <div className="flex items-start justify-between gap-3">
                            <div>
                              <p className="text-base font-semibold text-gray-900">{item.subject}</p>
                              <p className="text-sm text-gray-500 mt-1">{item.resident} · Apto {item.unit}</p>
                            </div>
                            <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-medium ${priority.className}`}>
                              <PriorityIcon className="w-3 h-3" />
                              {priority.label}
                            </span>
                          </div>
                        </div>
                      );
                    })}
                </div>
              </div>
            )}
          </motion.div>
        )}

        {activeTab === 'estadisticas' && hasFullAccess && (
          <motion.div key="estadisticas" initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
            <div className={`${basePanelClass} p-6`}>
              <h3 className="text-lg font-semibold text-gray-900 mb-5 flex items-center gap-2">
                <BarChart3 className="w-5 h-5 text-primary" />
                Estado General
              </h3>
              <div className="grid grid-cols-2 gap-3 md:grid-cols-5">
                {STATUS_FLOW.map((status) => {
                  const config = STATUS_LABELS[status];
                  const Icon = config.icon;
                  const count =
                    status === 'received'
                      ? stats.received
                      : status === 'in_progress'
                        ? stats.inProgress
                        : status === 'escalated'
                          ? stats.escalated
                          : status === 'resolved'
                            ? stats.resolved
                            : stats.closed;
                  return (
                    <div key={status} className={`${config.className} rounded-xl p-4 text-center`}>
                      <Icon className="w-5 h-5 mx-auto mb-2" />
                      <p className="text-2xl font-bold text-gray-900">{count}</p>
                      <p className="text-xs mt-1">{config.label}</p>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className={`${basePanelClass} p-6`}>
              <h3 className="text-lg font-semibold text-gray-900 mb-5 flex items-center gap-2">
                <Filter className="w-5 h-5 text-primary" />
                Distribucion por Categoria
              </h3>
              <div className="space-y-4">
                {Object.entries(stats.byCategory).map(([category, count]) => {
                  const config = CATEGORY_MAP[category as PQRS['category']];
                  const CategoryIcon = config.icon;
                  const percent = stats.total > 0 ? Math.round((count / stats.total) * 100) : 0;
                  return (
                    <div key={category}>
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <div className={`rounded-lg p-2 ${config.className}`}>
                            <CategoryIcon className="w-4 h-4" />
                          </div>
                          <span className="text-sm font-medium text-gray-900">{config.label}</span>
                        </div>
                        <span className="text-sm font-semibold text-gray-900">{count}</span>
                      </div>
                      <div className="h-2 rounded-full bg-gray-100 overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${percent}%` }}
                          transition={{ duration: 0.6 }}
                          className="h-full bg-primary/25"
                        />
                      </div>
                      <p className="text-xs text-gray-400 mt-1">{percent}% del total</p>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className={`${basePanelClass} p-6`}>
              <h3 className="text-lg font-semibold text-gray-900 mb-5 flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-amber-500" />
                Distribucion por Prioridad
              </h3>
              <div className="space-y-4">
                {Object.entries(stats.byPriority).map(([priority, count]) => {
                  const config = PRIORITY_MAP[priority as PQRS['priority']];
                  const PriorityIcon = config.icon;
                  const percent = stats.total > 0 ? Math.round((count / stats.total) * 100) : 0;
                  return (
                    <div key={priority}>
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <div className={`rounded-lg p-2 ${config.className}`}>
                            <PriorityIcon className="w-4 h-4" />
                          </div>
                          <span className="text-sm font-medium text-gray-900">{config.label}</span>
                        </div>
                        <span className="text-sm font-semibold text-gray-900">{count}</span>
                      </div>
                      <div className="h-2 rounded-full bg-gray-100 overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${percent}%` }}
                          transition={{ duration: 0.6 }}
                          className={`h-full ${config.softClass}`}
                        />
                      </div>
                      <p className="text-xs text-gray-400 mt-1">{percent}% del total</p>
                    </div>
                  );
                })}
              </div>
            </div>
          </motion.div>
        )}

        {(activeTab === 'lista' || !hasFullAccess) && (
          <motion.div key="lista" initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
            {hasFullAccess && (
              <div className={`${basePanelClass} p-4`}>
                <div className="flex flex-wrap gap-3">
                  <div className="relative flex-1 min-w-[220px]">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                      type="text"
                      value={searchTerm}
                      onChange={(event) => setSearchTerm(event.target.value)}
                      placeholder="Buscar por asunto, nombre o apartamento"
                      className="w-full h-10 pl-10 pr-4 rounded-xl border border-gray-200 bg-white text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-primary/20"
                    />
                  </div>
                  <select
                    value={statusFilter}
                    onChange={(event) => setStatusFilter(event.target.value)}
                    className="h-10 rounded-xl border border-gray-200 bg-white px-3 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-primary/20"
                  >
                    <option value="all">Todos los estados</option>
                    {STATUS_FLOW.map((status) => (
                      <option key={status} value={status}>
                        {STATUS_LABELS[status].label}
                      </option>
                    ))}
                  </select>
                  <select
                    value={priorityFilter}
                    onChange={(event) => setPriorityFilter(event.target.value)}
                    className="h-10 rounded-xl border border-gray-200 bg-white px-3 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-primary/20"
                  >
                    <option value="all">Todas las prioridades</option>
                    {Object.entries(PRIORITY_MAP).map(([key, value]) => (
                      <option key={key} value={key}>
                        {value.label}
                      </option>
                    ))}
                  </select>
                  <select
                    value={categoryFilter}
                    onChange={(event) => setCategoryFilter(event.target.value)}
                    className="h-10 rounded-xl border border-gray-200 bg-white px-3 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-primary/20"
                  >
                    <option value="all">Todas las categorias</option>
                    {Object.entries(CATEGORY_MAP).map(([key, value]) => (
                      <option key={key} value={key}>
                        {value.label}
                      </option>
                    ))}
                  </select>
                </div>
                <p className="text-xs text-gray-400 mt-3">
                  Mostrando <span className="font-semibold text-gray-900">{visiblePQRS.length}</span> de{' '}
                  <span className="font-semibold text-gray-900">{pqrs.length}</span> registros
                </p>
              </div>
            )}

            <div className="space-y-3">
              {visiblePQRS.length === 0 ? (
                <div className={`${basePanelClass} p-10 text-center`}>
                  <ClipboardList className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                  <p className="text-sm text-gray-500">No hay PQRS con los filtros aplicados</p>
                </div>
              ) : (
                visiblePQRS.map((item, index) => {
                  const status = STATUS_LABELS[item.status];
                  const priority = PRIORITY_MAP[item.priority];
                  const category = CATEGORY_MAP[item.category];
                  const StatusIcon = status.icon;
                  const PriorityIcon = priority.icon;
                  const CategoryIcon = category.icon;
                  return (
                    <motion.div
                      key={item.id}
                      initial={{ opacity: 0, y: 16 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.04 }}
                      whileHover={{ y: -2 }}
                      onClick={() => {
                        setSelectedPQRS(item);
                        setComments([
                          {
                            id: '1',
                            author: 'Administracion',
                            text: 'Se ha recibido la solicitud y ya fue asignada para validacion.',
                            date: '2026-05-24 10:30',
                            avatar: 'A',
                          },
                          {
                            id: '2',
                            author: item.resident,
                            text: 'Agradezco la revision y quedo atento a la gestion.',
                            date: '2026-05-24 11:00',
                            avatar: 'R',
                          },
                        ]);
                      }}
                      className={`${basePanelClass} p-4 border-l-[3px] ${priority.borderClass} cursor-pointer`}
                    >
                      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                        <div className="flex-1 min-w-0">
                          <div className="flex flex-wrap items-center gap-2 mb-3">
                            <span className="text-xs font-mono text-gray-400">{item.ticket}</span>
                            <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-medium ${status.className}`}>
                              <StatusIcon className="w-3 h-3" />
                              {status.label}
                            </span>
                            <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-medium ${priority.className}`}>
                              <PriorityIcon className="w-3 h-3" />
                              {priority.label}
                            </span>
                            <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-medium ${category.className}`}>
                              <CategoryIcon className="w-3 h-3" />
                              {category.label}
                            </span>
                          </div>

                          <h3 className="text-base font-semibold text-gray-900">{item.subject}</h3>
                          <p className="text-sm text-gray-500 line-clamp-2 mt-2">{item.description}</p>

                          <div className="flex flex-wrap items-center gap-1 text-xs text-gray-400 mt-3">
                            <span>{item.resident}</span>
                            <span>·</span>
                            <span>Apto {item.unit}</span>
                            <span>·</span>
                            <span>{item.date}</span>
                            {item.assignedTo && (
                              <>
                                <span>·</span>
                                <span>{item.assignedTo}</span>
                              </>
                            )}
                          </div>
                        </div>

                        {canAdvance && item.status !== 'closed' && (
                          <button
                            onClick={(event) => {
                              event.stopPropagation();
                              advanceStatus(item.id, item.status);
                            }}
                            className="inline-flex items-center justify-center gap-2 rounded-lg bg-primary px-3 py-2 text-xs font-medium text-white transition-colors hover:bg-primary/90"
                          >
                            Avanzar
                            <ArrowRight className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                    </motion.div>
                  );
                })
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {selectedPQRS && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="fixed inset-0 z-50 bg-black/40 p-4 overflow-y-auto">
          <div className="min-h-full flex items-center justify-center">
            <motion.div
              initial={{ scale: 0.96, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="w-full max-w-2xl rounded-2xl bg-white p-6 shadow-xl"
            >
              <div className="flex items-start justify-between gap-4 mb-5">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">{selectedPQRS.subject}</h2>
                  <p className="text-xs font-mono text-gray-400 mt-1">{selectedPQRS.ticket}</p>
                </div>
                <button
                  onClick={() => setSelectedPQRS(null)}
                  className="rounded-lg p-1 text-gray-400 transition-colors hover:text-gray-700"
                >
                  <XCircle className="w-6 h-6" />
                </button>
              </div>

              <div className="grid grid-cols-2 gap-3 md:grid-cols-4 mb-6">
                <div className="rounded-xl border border-gray-200 bg-gray-50 p-3">
                  <p className="text-xs uppercase tracking-wide text-gray-400">Estado</p>
                  <p className="text-sm font-semibold text-gray-900 mt-1">{STATUS_LABELS[selectedPQRS.status].label}</p>
                </div>
                <div className="rounded-xl border border-gray-200 bg-gray-50 p-3">
                  <p className="text-xs uppercase tracking-wide text-gray-400">Prioridad</p>
                  <p className="text-sm font-semibold text-gray-900 mt-1">{PRIORITY_MAP[selectedPQRS.priority].label}</p>
                </div>
                <div className="rounded-xl border border-gray-200 bg-gray-50 p-3">
                  <p className="text-xs uppercase tracking-wide text-gray-400">Residente</p>
                  <p className="text-sm font-semibold text-gray-900 mt-1">{selectedPQRS.resident}</p>
                </div>
                <div className="rounded-xl border border-gray-200 bg-gray-50 p-3">
                  <p className="text-xs uppercase tracking-wide text-gray-400">Fecha</p>
                  <p className="text-sm font-semibold text-gray-900 mt-1">{selectedPQRS.date}</p>
                </div>
              </div>

              <div className="rounded-xl border border-gray-200 bg-gray-50 p-4 mb-6">
                <h4 className="text-sm font-semibold text-gray-900 mb-3">Historial de estados</h4>
                <div className="space-y-3 text-sm">
                  <div className="flex gap-3">
                    <div className="mt-1 h-3 w-3 rounded-full bg-blue-500" />
                    <div>
                      <p className="font-medium text-gray-900">Recibido</p>
                      <p className="text-xs text-gray-400">2026-05-24 09:00</p>
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <div className="mt-1 h-3 w-3 rounded-full bg-amber-500" />
                    <div>
                      <p className="font-medium text-gray-900">En proceso</p>
                      <p className="text-xs text-gray-400">2026-05-24 10:15</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mb-5">
                <h4 className="text-sm font-semibold text-gray-900 mb-3">Comentarios</h4>
                <div className="space-y-3 max-h-44 overflow-y-auto mb-3">
                  {comments.map((comment) => (
                    <div key={comment.id} className="rounded-xl border border-gray-200 bg-gray-50 p-3">
                      <div className="flex items-start gap-3">
                        <div className="h-8 w-8 rounded-full bg-primary/10 text-primary text-xs font-semibold flex items-center justify-center">
                          {comment.avatar}
                        </div>
                        <div className="flex-1">
                          <div className="flex flex-wrap items-center gap-2">
                            <p className="text-sm font-semibold text-gray-900">{comment.author}</p>
                            <p className="text-xs text-gray-400">{comment.date}</p>
                          </div>
                          <p className="text-sm text-gray-600 mt-1">{comment.text}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="flex gap-2">
                  <input
                    type="text"
                    value={newComment}
                    onChange={(event) => setNewComment(event.target.value)}
                    placeholder="Agregar comentario..."
                    className="flex-1 h-10 rounded-xl border border-gray-200 bg-white px-3 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-primary/20"
                  />
                  <button
                    onClick={() => {
                      if (!newComment.trim()) return;
                      setComments((current) => [
                        ...current,
                        {
                          id: String(Date.now()),
                          author: 'Tu',
                          text: newComment,
                          date: new Date().toLocaleString('es-CO'),
                          avatar: 'T',
                        },
                      ]);
                      setNewComment('');
                    }}
                    className="rounded-xl bg-primary px-4 text-sm font-medium text-white hover:bg-primary/90"
                  >
                    Comentar
                  </button>
                </div>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => setSelectedPQRS(null)}
                  className="flex-1 h-10 rounded-xl border border-gray-200 text-sm font-medium text-gray-700 hover:bg-gray-50"
                >
                  Cerrar
                </button>
                {canAdvance && selectedPQRS.status !== 'closed' && (
                  <button
                    onClick={() => {
                      advanceStatus(selectedPQRS.id, selectedPQRS.status);
                      setSelectedPQRS(null);
                    }}
                    className="flex-1 h-10 rounded-xl bg-primary text-sm font-medium text-white hover:bg-primary/90"
                  >
                    Avanzar estado
                  </button>
                )}
              </div>
            </motion.div>
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default PQRSPage;
