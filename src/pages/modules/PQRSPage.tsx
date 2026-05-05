import { motion, AnimatePresence } from 'framer-motion';
import { useAppStore } from '@/store/useAppStore';
import { useAuthStore } from '@/store/useAuthStore';
import { ClipboardList, ArrowRight, BarChart3, PieChart, TrendingUp, AlertTriangle, CheckCircle, Clock, Users, Filter, Search, Calendar, XCircle, MessageSquare, AlertCircle, Lightbulb, Mail, Settings, Zap, CheckSquare } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { useState } from 'react';

const STATUS_FLOW = ['received', 'in_progress', 'escalated', 'resolved', 'closed'] as const;
const STATUS_LABELS: Record<string, { label: string; class: string; icon: any }> = {
  received: { label: 'Recibido', class: 'bg-blue-500/20 text-blue-400', icon: Mail },
  in_progress: { label: 'En Proceso', class: 'bg-amber-500/20 text-amber-400', icon: Settings },
  escalated: { label: 'Escalado', class: 'bg-violet-500/20 text-violet-400', icon: TrendingUp },
  resolved: { label: 'Resuelto', class: 'bg-emerald-500/20 text-emerald-400', icon: CheckCircle },
  closed: { label: 'Cerrado', class: 'bg-gray-500/20 text-gray-400', icon: XCircle },
};

const PRIORITY_MAP: Record<string, { label: string; class: string; icon: any }> = {
  low: { label: 'Baja', class: 'text-blue-400', icon: AlertCircle },
  medium: { label: 'Media', class: 'text-amber-400', icon: AlertTriangle },
  high: { label: 'Alta', class: 'text-orange-400', icon: AlertTriangle },
  urgent: { label: 'Urgente', class: 'text-red-400', icon: Zap },
};

const CATEGORY_MAP: Record<string, { label: string; icon: any; color: string; gradient: string }> = {
  petition: { label: 'Petición', icon: MessageSquare, color: 'blue', gradient: 'from-blue-600/40 to-blue-600/20' },
  complaint: { label: 'Queja', icon: AlertTriangle, color: 'red', gradient: 'from-red-600/40 to-red-600/20' },
  claim: { label: 'Reclamo', icon: AlertCircle, color: 'orange', gradient: 'from-orange-600/40 to-orange-600/20' },
  suggestion: { label: 'Sugerencia', icon: Lightbulb, color: 'emerald', gradient: 'from-emerald-600/40 to-emerald-600/20' },
};

type TabType = 'lista' | 'analisis' | 'estadisticas';

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

  const filteredPQRS = pqrs.filter(p => {
    if (statusFilter !== 'all' && p.status !== statusFilter) return false;
    if (priorityFilter !== 'all' && p.priority !== priorityFilter) return false;
    if (categoryFilter !== 'all' && p.category !== categoryFilter) return false;
    if (searchTerm && !p.subject.toLowerCase().includes(searchTerm.toLowerCase()) &&
        !p.resident.toLowerCase().includes(searchTerm.toLowerCase())) return false;
    return true;
  });

  const stats = {
    total: pqrs.length,
    received: pqrs.filter(p => p.status === 'received').length,
    inProgress: pqrs.filter(p => p.status === 'in_progress').length,
    escalated: pqrs.filter(p => p.status === 'escalated').length,
    resolved: pqrs.filter(p => p.status === 'resolved').length,
    closed: pqrs.filter(p => p.status === 'closed').length,
    byPriority: {
      urgent: pqrs.filter(p => p.priority === 'urgent').length,
      high: pqrs.filter(p => p.priority === 'high').length,
      medium: pqrs.filter(p => p.priority === 'medium').length,
      low: pqrs.filter(p => p.priority === 'low').length,
    },
    byCategory: {
      petition: pqrs.filter(p => p.category === 'petition').length,
      complaint: pqrs.filter(p => p.category === 'complaint').length,
      claim: pqrs.filter(p => p.category === 'claim').length,
      suggestion: pqrs.filter(p => p.category === 'suggestion').length,
    },
    resolutionRate: pqrs.length > 0 ? Math.round((pqrs.filter(p => p.status === 'resolved' || p.status === 'closed').length / pqrs.length) * 100) : 0,
    averageTime: '3.2 días',
  };

  const advanceStatus = (id: string, current: string) => {
    const idx = STATUS_FLOW.indexOf(current as any);
    if (idx < STATUS_FLOW.length - 1) {
      updatePQRSStatus(id, STATUS_FLOW[idx + 1]);
      toast({ title: 'Estado actualizado', description: `Avanzado a: ${STATUS_LABELS[STATUS_FLOW[idx + 1]].label}` });
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
        <div className="flex items-center gap-4 mb-2">
          <div className="text-5xl text-primary">
            <ClipboardList className="w-14 h-14" strokeWidth={1.5} />
          </div>
          <div>
            <h1 className="text-4xl md:text-5xl font-black text-foreground">PQRS</h1>
            <p className="text-muted-foreground text-sm mt-1">Peticiones, Quejas, Reclamos y Sugerencias</p>
          </div>
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <motion.div whileHover={{ scale: 1.05, y: -5 }} className="bg-white rounded-xl border border-black/8 shadow-sm-static p-4 rounded-xl border-l-4 border-blue-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-muted-foreground mb-1">Total</p>
                <p className="text-2xl font-black text-foreground">{stats.total}</p>
              </div>
              <BarChart3 className="w-8 h-8 text-blue-500" strokeWidth={1.5} />
            </div>
          </motion.div>
          <motion.div whileHover={{ scale: 1.05, y: -5 }} className="bg-white rounded-xl border border-black/8 shadow-sm-static p-4 rounded-xl border-l-4 border-emerald-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-muted-foreground mb-1">Resueltos</p>
                <p className="text-2xl font-black text-emerald-400">{stats.resolved + stats.closed}</p>
              </div>
              <CheckCircle className="w-8 h-8 text-emerald-500" strokeWidth={1.5} />
            </div>
          </motion.div>
          <motion.div whileHover={{ scale: 1.05, y: -5 }} className="bg-white rounded-xl border border-black/8 shadow-sm-static p-4 rounded-xl border-l-4 border-amber-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-muted-foreground mb-1">Pendientes</p>
                <p className="text-2xl font-black text-amber-400">{stats.received + stats.inProgress}</p>
              </div>
              <Clock className="w-8 h-8 text-amber-500" strokeWidth={1.5} />
            </div>
          </motion.div>
          <motion.div whileHover={{ scale: 1.05, y: -5 }} className="bg-white rounded-xl border border-black/8 shadow-sm-static p-4 rounded-xl border-l-4 border-violet-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-muted-foreground mb-1">Resolución</p>
                <p className="text-2xl font-black text-violet-400">{stats.resolutionRate}%</p>
              </div>
              <TrendingUp className="w-8 h-8 text-violet-500" strokeWidth={1.5} />
            </div>
          </motion.div>
        </div>
      </motion.div>

      {/* Tabs */}
      {(
        <div className="flex gap-2 overflow-x-auto pb-2">
          {[
            { id: 'lista', label: 'Lista', icon: ClipboardList },
            { id: 'analisis', label: 'Análisis', icon: BarChart3 },
            { id: 'estadisticas', label: 'Estadísticas', icon: PieChart },
          ].map(tab => {
            const TabIcon = tab.icon;
            return (
            <motion.button
              key={tab.id}
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setActiveTab(tab.id as any)}
              className={`relative px-6 py-3 rounded-2xl text-sm font-bold transition-all whitespace-nowrap flex items-center gap-2 ${
                activeTab === tab.id
                  ? 'bg-gradient-to-r from-primary/40 to-primary/20 text-primary border border-primary/50 shadow-lg'
                  : 'text-muted-foreground hover:text-foreground bg-white/5 border border-white/10'
              }`}
            >
              <TabIcon className="w-5 h-5" strokeWidth={1.5} />
              <span>{tab.label}</span>
            </motion.button>
            );
          })}
        </div>
      )}

      <AnimatePresence mode="wait">
      {/* Analysis View */}
      {activeTab === 'analisis' && hasFullAccess && (
        <motion.div key="analisis" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
          {/* Priority Analysis */}
          <div className="bg-white rounded-xl border border-black/8 shadow-sm-static p-6 rounded-2xl border border-white/10">
            <h3 className="font-bold text-lg text-foreground mb-4 flex items-center gap-3">
              <AlertTriangle className="w-6 h-6 text-amber-500" strokeWidth={1.5} />
              Análisis por Prioridad
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {Object.entries(stats.byPriority).map(([priority, count]) => {
                const PriorityIcon = PRIORITY_MAP[priority]?.icon;
                return (
                <motion.div
                  key={priority}
                  whileHover={{ scale: 1.05, y: -5 }}
                  className={`rounded-xl p-5 border-2 backdrop-blur-md ${
                    priority === 'urgent' ? 'bg-gradient-to-br from-red-500/40 to-red-600/20 border-red-400/50' :
                    priority === 'high' ? 'bg-gradient-to-br from-orange-500/40 to-orange-600/20 border-orange-400/50' :
                    priority === 'medium' ? 'bg-gradient-to-br from-amber-500/40 to-amber-600/20 border-amber-400/50' :
                    'bg-gradient-to-br from-blue-500/40 to-blue-600/20 border-blue-400/50'
                  }`}
                >
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <p className="text-xs font-semibold text-gray-900">{PRIORITY_MAP[priority]?.label}</p>
                      <p className="text-2xl font-black text-gray-900 mt-1">{count}</p>
                    </div>
                    <PriorityIcon className="w-8 h-8 text-gray-900 drop-shadow-lg" strokeWidth={1.5} />
                  </div>
                  <div className="w-full bg-white/20 rounded-full h-2">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${stats.total > 0 ? (count / stats.total) * 100 : 0}%` }}
                      transition={{ duration: 1 }}
                      className={`h-2 rounded-full ${
                        priority === 'urgent' ? 'bg-red-300' :
                        priority === 'high' ? 'bg-orange-300' :
                        priority === 'medium' ? 'bg-amber-300' :
                        'bg-blue-300'
                      }`}
                    />
                  </div>
                  <p className="text-xs text-gray-900 mt-2 font-semibold">{stats.total > 0 ? Math.round((count / stats.total) * 100) : 0}% del total</p>
                </motion.div>
                );
              })}
            </div>
          </div>

          {/* Category Analysis */}
          <div className="bg-white rounded-xl border border-black/8 shadow-sm-static p-6 rounded-2xl border border-white/10">
            <h3 className="font-bold text-lg text-foreground mb-4 flex items-center gap-3">
              <Filter className="w-6 h-6 text-primary" strokeWidth={1.5} />
              Análisis por Categoría
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {Object.entries(stats.byCategory).map(([category, count]) => {
                const catInfo = CATEGORY_MAP[category];
                const CatIcon = catInfo.icon;
                return (
                  <motion.div
                    key={category}
                    whileHover={{ scale: 1.05, y: -5 }}
                    className={`bg-gradient-to-br ${catInfo.gradient} rounded-xl p-5 border border-white/40 backdrop-blur-md`}
                  >
                    <div className="flex items-center justify-between mb-3">
                      <div>
                        <p className="text-xs font-semibold text-gray-900">{catInfo.label}</p>
                        <p className="text-2xl font-black text-gray-900 mt-1">{count}</p>
                      </div>
                      <CatIcon className="w-8 h-8 text-gray-900 drop-shadow-lg" strokeWidth={1.5} />
                    </div>
                    <div className="w-full bg-white/30 rounded-full h-2">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${stats.total > 0 ? (count / stats.total) * 100 : 0}%` }}
                        transition={{ duration: 1 }}
                        className="h-2 rounded-full bg-white"
                      />
                    </div>
                    <p className="text-xs text-gray-900 mt-2 font-semibold">{stats.total > 0 ? Math.round((count / stats.total) * 100) : 0}%</p>
                  </motion.div>
                );
              })}
            </div>
          </div>

          {/* Workflow Analysis */}
          <div className="bg-white rounded-xl border border-black/8 shadow-sm-static p-6 rounded-2xl border border-white/10">
            <h3 className="font-bold text-lg text-foreground mb-6 flex items-center gap-3">
              <ArrowRight className="w-6 h-6 text-primary" strokeWidth={1.5} />
              Flujo de Trabajo
            </h3>
            <div className="flex items-center justify-between overflow-x-auto pb-4 gap-2">
              {STATUS_FLOW.map((s, i) => {
                const StatusIcon = STATUS_LABELS[s].icon;
                return (
                <div key={s} className="flex items-center flex-1 min-w-[100px]">
                  <motion.div
                    whileHover={{ scale: 1.1 }}
                    className={`flex flex-col items-center flex-1 p-4 rounded-xl ${STATUS_LABELS[s].class} bg-white/5 border border-white/10`}
                  >
                    <StatusIcon className="w-6 h-6 mb-2" strokeWidth={1.5} />
                    <p className="text-xl font-black">{s === 'received' ? stats.received : s === 'in_progress' ? stats.inProgress : s === 'escalated' ? stats.escalated : s === 'resolved' ? stats.resolved : stats.closed}</p>
                    <p className="text-xs mt-1 text-center">{STATUS_LABELS[s].label}</p>
                  </motion.div>
                  {i < STATUS_FLOW.length - 1 && <ArrowRight className="w-5 h-5 text-muted-foreground mx-1 flex-shrink-0" strokeWidth={1.5} />}
                </div>
                );
              })}
            </div>
          </div>

          {/* Cases Needing Attention */}
          {pqrs.filter(p => p.priority === 'urgent' || p.priority === 'high').length > 0 && (
            <div className="bg-white rounded-xl border border-black/8 shadow-sm-static p-6 rounded-2xl border border-red-500/30">
              <h3 className="font-bold text-lg text-foreground mb-4 flex items-center gap-3">
                <AlertTriangle className="w-6 h-6 text-red-500" strokeWidth={1.5} />
                Casos Urgentes
              </h3>
              <div className="space-y-3">
                {pqrs.filter(p => p.priority === 'urgent' || p.priority === 'high').slice(0, 5).map((p, idx) => {
                  const Icon = PRIORITY_MAP[p.priority]?.icon;
                  return (
                  <motion.div
                    key={p.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.1 }}
                    className="p-4 bg-gradient-to-r from-red-500/20 to-red-500/5 rounded-lg border-l-4 border-red-500"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="font-bold text-foreground text-sm">{p.subject}</p>
                        <p className="text-xs text-muted-foreground mt-1">{p.resident} - {CATEGORY_MAP[p.category]?.label}</p>
                      </div>
                      <div className={`px-3 py-1 rounded-full text-xs font-bold whitespace-nowrap flex items-center gap-1 ${PRIORITY_MAP[p.priority]?.class}`}>
                        <Icon className="w-3.5 h-3.5" strokeWidth={1.5} />
                        {PRIORITY_MAP[p.priority]?.label}
                      </div>
                    </div>
                  </motion.div>
                  );
                })}
              </div>
            </div>
          )}
        </motion.div>
      )}

      {/* Statistics View */}
      {activeTab === 'estadisticas' && hasFullAccess && (
        <motion.div key="estadisticas" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
          {/* Status Overview */}
          <div className="bg-white rounded-xl border border-black/8 shadow-sm-static p-6 rounded-2xl border border-white/10">
            <h3 className="font-bold text-lg text-foreground mb-5 flex items-center gap-3">
              <BarChart3 className="w-6 h-6 text-primary" strokeWidth={1.5} />
              Estado General
            </h3>
            <div className="grid grid-cols-3 md:grid-cols-5 gap-3">
              {STATUS_FLOW.map(s => {
                const count = s === 'received' ? stats.received : s === 'in_progress' ? stats.inProgress : s === 'escalated' ? stats.escalated : s === 'resolved' ? stats.resolved : stats.closed;
                const StatusIcon = STATUS_LABELS[s].icon;
                return (
                  <motion.div
                    key={s}
                    whileHover={{ scale: 1.05, y: -5 }}
                    className={`text-center p-5 rounded-xl border-2 ${STATUS_LABELS[s].class} bg-white/5 border-white/20 backdrop-blur-sm`}
                  >
                    <StatusIcon className="w-6 h-6 mx-auto mb-2" strokeWidth={1.5} />
                    <p className="text-2xl font-black text-white">{count}</p>
                    <p className="text-xs text-white/80 mt-2">{STATUS_LABELS[s].label}</p>
                  </motion.div>
                );
              })}
            </div>
          </div>

          {/* Category Distribution */}
          <div className="bg-white rounded-xl border border-black/8 shadow-sm-static p-6 rounded-2xl border border-white/10">
            <h3 className="font-bold text-lg text-foreground mb-5 flex items-center gap-3">
              <Filter className="w-6 h-6 text-primary" strokeWidth={1.5} />
              Distribución por Categoría
            </h3>
            <div className="space-y-4">
              {Object.entries(stats.byCategory).map(([category, count]) => {
                const catInfo = CATEGORY_MAP[category];
                const CatIcon = catInfo.icon;
                return (
                  <div key={category}>
                    <div className="flex justify-between items-center mb-2">
                      <div className="flex items-center gap-2">
                        <div className={`p-2 rounded-lg bg-gradient-to-br ${catInfo.gradient}`}>
                          <CatIcon className="w-4 h-4 text-white" strokeWidth={1.5} />
                        </div>
                        <span className="text-sm font-semibold text-foreground">{catInfo.label}</span>
                      </div>
                      <span className="text-sm font-black text-primary">{count}</span>
                    </div>
                    <div className="w-full bg-white/10 rounded-full h-3 overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${stats.total > 0 ? (count / stats.total) * 100 : 0}%` }}
                        transition={{ duration: 1, delay: 0.1 }}
                        className="h-full rounded-full bg-gradient-to-r from-primary to-cyan-400"
                      />
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">{stats.total > 0 ? Math.round((count / stats.total) * 100) : 0}% del total</p>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Priority Distribution */}
          <div className="bg-white rounded-xl border border-black/8 shadow-sm-static p-6 rounded-2xl border border-white/10">
            <h3 className="font-bold text-lg text-foreground mb-5 flex items-center gap-3">
              <AlertTriangle className="w-6 h-6 text-amber-500" strokeWidth={1.5} />
              Distribución por Prioridad
            </h3>
            <div className="space-y-4">
              {Object.entries(stats.byPriority).map(([priority, count]) => {
                const PriorityIcon = PRIORITY_MAP[priority]?.icon;
                return (
                <div key={priority}>
                  <div className="flex justify-between items-center mb-2">
                    <div className="flex items-center gap-2">
                      <div className={`p-2 rounded-lg ${
                        priority === 'urgent' ? 'bg-red-500/30' :
                        priority === 'high' ? 'bg-orange-500/30' :
                        priority === 'medium' ? 'bg-amber-500/30' :
                        'bg-blue-500/30'
                      }`}>
                        <PriorityIcon className="w-4 h-4 text-white" strokeWidth={1.5} />
                      </div>
                      <span className="text-sm font-semibold text-foreground">{PRIORITY_MAP[priority]?.label}</span>
                    </div>
                    <span className={`text-sm font-black ${PRIORITY_MAP[priority]?.class}`}>{count}</span>
                  </div>
                  <div className="w-full bg-white/10 rounded-full h-3 overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${stats.total > 0 ? (count / stats.total) * 100 : 0}%` }}
                      transition={{ duration: 1, delay: 0.1 }}
                      className={`h-full rounded-full ${
                        priority === 'urgent' ? 'bg-gradient-to-r from-red-500 to-red-400' :
                        priority === 'high' ? 'bg-gradient-to-r from-orange-500 to-orange-400' :
                        priority === 'medium' ? 'bg-gradient-to-r from-amber-500 to-amber-400' :
                        'bg-gradient-to-r from-blue-500 to-blue-400'
                      }`}
                    />
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">{stats.total > 0 ? Math.round((count / stats.total) * 100) : 0}% del total</p>
                </div>
                );
              })}
            </div>
          </div>
        </motion.div>
      )}

      {/* List View */}
      {(activeTab === 'lista' || !hasFullAccess) && (
        <>
          {/* Filters */}
          {hasFullAccess && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="bg-white rounded-xl border border-black/8 shadow-sm-static p-4 mb-6 rounded-xl border border-white/10">
              <div className="flex flex-wrap gap-3">
                <div className="flex-1 min-w-[200px] flex items-center gap-2 bg-white/5 rounded-lg px-3 py-2 border border-white/10">
                  <Search className="w-4 h-4 text-muted-foreground" strokeWidth={1.5} />
                  <input
                    type="text"
                    placeholder="Buscar..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="bg-transparent border-0 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none w-full"
                  />
                </div>
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  <option value="all">Todos estados</option>
                  {STATUS_FLOW.map(s => (
                    <option key={s} value={s}>{STATUS_LABELS[s].label}</option>
                  ))}
                </select>
                <select
                  value={priorityFilter}
                  onChange={(e) => setPriorityFilter(e.target.value)}
                  className="bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  <option value="all">Todas prioridades</option>
                  {Object.entries(PRIORITY_MAP).map(([key, val]) => (
                    <option key={key} value={key}>{val.label}</option>
                  ))}
                </select>
                <select
                  value={categoryFilter}
                  onChange={(e) => setCategoryFilter(e.target.value)}
                  className="bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  <option value="all">Todas categorías</option>
                  {Object.entries(CATEGORY_MAP).map(([key, val]) => (
                    <option key={key} value={key}>{val.label}</option>
                  ))}
                </select>
              </div>
              <p className="text-xs text-muted-foreground mt-3">
                Mostrando <span className="font-bold text-primary">{filteredPQRS.length}</span> de <span className="font-bold">{pqrs.length}</span> registros
              </p>
            </motion.div>
          )}

          {/* PQRS List */}
          <div className="space-y-3">
            {(hasFullAccess ? filteredPQRS : pqrs).length === 0 ? (
              <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="text-center py-12 bg-white rounded-xl border border-black/8 shadow-sm-static rounded-2xl p-8">
                <ClipboardList className="w-12 h-12 mx-auto mb-3 text-muted-foreground opacity-30" strokeWidth={1.5} />
                <p className="text-muted-foreground">No hay PQRS con los filtros aplicados</p>
              </motion.div>
            ) : (
              (hasFullAccess ? filteredPQRS : pqrs).map((p, i) => {
                const catInfo = CATEGORY_MAP[p.category];
                const StatusIcon = STATUS_LABELS[p.status].icon;
                const PriorityIcon = PRIORITY_MAP[p.priority]?.icon;
                return (
                  <motion.div
                    key={p.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.05 }}
                    whileHover={{ y: -3, boxShadow: '0 10px 30px rgba(0,0,0,0.2)' }}
                    className={`bg-white rounded-[12px] border border-[#E5E7EB] p-6 shadow-sm rounded-xl border-l-4 group cursor-pointer transition-all ${
                      p.priority === 'urgent' ? 'border-l-red-500 hover:shadow-red-500/10' :
                      p.priority === 'high' ? 'border-l-orange-500 hover:shadow-orange-500/10' :
                      p.priority === 'medium' ? 'border-l-amber-500 hover:shadow-amber-500/10' :
                      'border-l-blue-500 hover:shadow-blue-500/10'
                    }`}
                  >
                    <div className="flex flex-col sm:flex-row sm:items-start gap-4">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-2 flex-wrap">
                          <span className="text-xs font-mono bg-white/10 px-2.5 py-1 rounded-lg text-primary">{p.ticket}</span>
                          <motion.div whileHover={{ scale: 1.1 }} className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-bold ${STATUS_LABELS[p.status].class} bg-white/10`}>
                            <StatusIcon className="w-3.5 h-3.5" strokeWidth={1.5} />
                            {STATUS_LABELS[p.status].label}
                          </motion.div>
                          <span className={`inline-flex items-center gap-1.5 text-xs font-bold ${PRIORITY_MAP[p.priority].class}`}>
                            <PriorityIcon className="w-3.5 h-3.5" strokeWidth={1.5} />
                            {PRIORITY_MAP[p.priority].label}
                          </span>
                          <span className="text-xs bg-white/10 px-2.5 py-1 rounded-lg text-white/80">{catInfo.label}</span>
                        </div>
                        <h3 className="font-bold text-foreground mb-2 line-clamp-2">{p.subject}</h3>
                        <p className="text-sm text-muted-foreground mb-3 line-clamp-2">{p.description}</p>
                        <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
                          <span>{p.resident}</span>
                          <span>-</span>
                          <span>Apto {p.unit}</span>
                          <span>-</span>
                          <span>{p.date}</span>
                          {p.assignedTo && (
                            <>
                              <span>-</span>
                              <span className="text-primary font-semibold">Asignado: {p.assignedTo}</span>
                            </>
                          )}
                        </div>
                      </div>
                      {canAdvance && p.status !== 'closed' && (
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => advanceStatus(p.id, p.status)}
                          className="btn-premium px-4 py-2 rounded-lg text-xs font-bold flex items-center gap-2 whitespace-nowrap flex-shrink-0"
                        >
                          Avanzar <ArrowRight className="w-3.5 h-3.5" strokeWidth={1.5} />
                        </motion.button>
                      )}
                    </div>
                  </motion.div>
                );
              })
            )}
          </div>
        </>
      )}
      </AnimatePresence>
    </div>
  );
};

export default PQRSPage;
