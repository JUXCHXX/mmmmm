import { motion } from 'framer-motion';
import { useAppStore } from '@/store/useAppStore';
import { useAuthStore } from '@/store/useAuthStore';
import { Wrench, ArrowRight, Droplet, Zap, Shield, Paintbrush, Wind, Hammer, BarChart3, PieChart, TrendingUp, AlertTriangle, CheckCircle, Clock, Calendar, Filter, Search, MapPin } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { useState } from 'react';

const STATUS_FLOW = ['pending', 'assigned', 'in_progress', 'completed'] as const;
const STATUS_MAP: Record<string, { label: string; class: string }> = {
  pending: { label: 'Pendiente', class: 'bg-amber-500/20 text-amber-400' },
  assigned: { label: 'Asignado', class: 'bg-blue-500/20 text-blue-400' },
  in_progress: { label: 'En Ejecución', class: 'bg-violet-500/20 text-violet-400' },
  completed: { label: 'Finalizado', class: 'bg-emerald-500/20 text-emerald-400' },
};

const PRIORITY_MAP: Record<string, { label: string; class: string }> = {
  low: { label: 'Baja', class: 'text-blue-400' },
  medium: { label: 'Media', class: 'text-amber-400' },
  high: { label: 'Alta', class: 'text-red-400' },
};

const SERVICE_ICONS: Record<string, React.ElementType> = {
  'reparaciones': Hammer,
  'pintura': Paintbrush,
  'electricidad': Zap,
  'plomería': Droplet,
  'puertas': Shield,
  'ventilación': Wind,
  'default': Wrench,
};

type TabType = 'lista' | 'analisis' | 'estadisticas';

const MaintenancePage = () => {
  const { maintenance, updateMaintenanceStatus } = useAppStore();
  const user = useAuthStore((s) => s.user);
  
  const hasFullAccess = user?.roleId === 'admin' || user?.roleId === 'super_admin';
  const canAdvance = hasFullAccess;

  const [activeTab, setActiveTab] = useState<TabType>('lista');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [priorityFilter, setPriorityFilter] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');

  const filteredMaintenance = maintenance.filter(m => {
    if (statusFilter !== 'all' && m.status !== statusFilter) return false;
    if (priorityFilter !== 'all' && m.priority !== priorityFilter) return false;
    if (searchTerm && !m.title.toLowerCase().includes(searchTerm.toLowerCase()) &&
        !m.area.toLowerCase().includes(searchTerm.toLowerCase()) &&
        !m.assignedTo.toLowerCase().includes(searchTerm.toLowerCase())) return false;
    return true;
  });

  const activeMaintenance = maintenance.filter(m => m.status === 'in_progress' || m.status === 'assigned');

  const stats = {
    total: maintenance.length,
    pending: maintenance.filter(m => m.status === 'pending').length,
    assigned: maintenance.filter(m => m.status === 'assigned').length,
    inProgress: maintenance.filter(m => m.status === 'in_progress').length,
    completed: maintenance.filter(m => m.status === 'completed').length,
    byPriority: {
      high: maintenance.filter(m => m.priority === 'high').length,
      medium: maintenance.filter(m => m.priority === 'medium').length,
      low: maintenance.filter(m => m.priority === 'low').length,
    },
    completionRate: maintenance.length > 0 ? Math.round((maintenance.filter(m => m.status === 'completed').length / maintenance.length) * 100) : 0,
    averageTime: '2.5 días',
    totalOrdersThisMonth: maintenance.length,
  };

  const advance = (id: string, current: string) => {
    const idx = STATUS_FLOW.indexOf(current as typeof STATUS_FLOW[number]);
    if (idx < STATUS_FLOW.length - 1) {
      updateMaintenanceStatus(id, STATUS_FLOW[idx + 1]);
      toast({ title: 'Estado actualizado', description: `Avanzado a: ${STATUS_MAP[STATUS_FLOW[idx + 1]].label}` });
    }
  };

  return (
    <div>
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mb-6">
        <h1 className="text-2xl md:text-3xl font-bold text-foreground flex items-center gap-3">
          <Wrench className="icon-responsive-lg text-primary" /> Mantenimiento
        </h1>
        <p className="text-sm text-muted-foreground mt-1">{maintenance.length} órdenes de trabajo</p>
      </motion.div>

      {/* Avisos de Zonas en Reparación - Visible para todos */}
      {activeMaintenance.length > 0 && (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-6">
          <div className="bg-white rounded-xl border border-black/8 p-6 shadow-sm hover:shadow-md border border-amber-500/30 bg-amber-500/5">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-lg bg-amber-500/20 flex items-center justify-center">
                <AlertTriangle className="w-5 h-5 text-amber-500" />
              </div>
              <div>
                <h3 className="font-bold text-foreground">Zonas en Reparación</h3>
                <p className="text-xs text-muted-foreground">AVISOS IMPORTANTES PARA RESIDENTES</p>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {activeMaintenance.map(m => (
                <div key={m.id} className="p-4 rounded-lg bg-white/5 border border-amber-500/20">
                  <div className="flex items-center gap-2 mb-2">
                    <Hammer className="w-4 h-4 text-amber-500" />
                    <span className={`text-xs px-2 py-0.5 rounded-full ${
                      m.status === 'in_progress' ? 'bg-violet-500/20 text-violet-400' : 'bg-blue-500/20 text-blue-400'
                    }`}>
                      {m.status === 'in_progress' ? 'En proceso' : 'Asignado'}
                    </span>
                  </div>
                  <h4 className="font-medium text-foreground text-sm mb-1">{m.title}</h4>
                  <p className="text-xs text-muted-foreground mb-2 flex items-center gap-1"><MapPin className="w-3 h-3" /> {m.area}</p>
                  <p className="text-xs text-amber-400/80">{m.description}</p>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      )}

      {hasFullAccess && (
        <div className="flex gap-2 mb-6">
          <button
            onClick={() => setActiveTab('lista')}
            className={`px-4 py-2 rounded-xl font-medium transition-all ${
              activeTab === 'lista' ? 'bg-primary text-white' : 'bg-white/10 text-muted-foreground hover:bg-white/20'
            }`}
          >
            <Wrench className="w-4 h-4 inline mr-2" />
            Lista
          </button>
          <button
            onClick={() => setActiveTab('analisis')}
            className={`px-4 py-2 rounded-xl font-medium transition-all ${
              activeTab === 'analisis' ? 'bg-primary text-white' : 'bg-white/10 text-muted-foreground hover:bg-white/20'
            }`}
          >
            <BarChart3 className="w-4 h-4 inline mr-2" />
            Análisis
          </button>
          <button
            onClick={() => setActiveTab('estadisticas')}
            className={`px-4 py-2 rounded-xl font-medium transition-all ${
              activeTab === 'estadisticas' ? 'bg-primary text-white' : 'bg-white/10 text-muted-foreground hover:bg-white/20'
            }`}
          >
            <PieChart className="w-4 h-4 inline mr-2" />
            Estadísticas
          </button>
        </div>
      )}

      {activeTab === 'analisis' && hasFullAccess && (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-white rounded-xl border border-black/8 shadow-sm hover:shadow-md p-5 rounded-xl">
              <div className="flex items-center gap-2 mb-3">
                <AlertTriangle className="w-5 h-5 text-amber-400" />
                <span className="text-sm text-muted-foreground">Pendientes</span>
              </div>
              <p className="text-3xl font-bold text-foreground">{stats.pending}</p>
              <p className="text-xs text-muted-foreground mt-1">Órdenes sin iniciar</p>
            </div>
            <div className="bg-white rounded-xl border border-black/8 shadow-sm hover:shadow-md p-5 rounded-xl">
              <div className="flex items-center gap-2 mb-3">
                <TrendingUp className="w-5 h-5 text-violet-400" />
                <span className="text-sm text-muted-foreground">Tasa de Completado</span>
              </div>
              <p className="text-3xl font-bold text-foreground">{stats.completionRate}%</p>
              <p className="text-xs text-muted-foreground mt-1">Órdenes finalizadas</p>
            </div>
            <div className="bg-white rounded-xl border border-black/8 shadow-sm hover:shadow-md p-5 rounded-xl">
              <div className="flex items-center gap-2 mb-3">
                <Clock className="w-5 h-5 text-blue-400" />
                <span className="text-sm text-muted-foreground">Tiempo Promedio</span>
              </div>
              <p className="text-3xl font-bold text-foreground">{stats.averageTime}</p>
              <p className="text-xs text-muted-foreground mt-1">Para completar</p>
            </div>
            <div className="bg-white rounded-xl border border-black/8 shadow-sm hover:shadow-md p-5 rounded-xl">
              <div className="flex items-center gap-2 mb-3">
                <CheckCircle className="w-5 h-5 text-emerald-400" />
                <span className="text-sm text-muted-foreground">Este Mes</span>
              </div>
              <p className="text-3xl font-bold text-foreground">{stats.totalOrdersThisMonth}</p>
              <p className="text-xs text-muted-foreground mt-1">Órdenes registradas</p>
            </div>
          </div>

          <div className="bg-white rounded-xl border border-black/8 p-6 shadow-sm hover:shadow-md">
            <h3 className="font-semibold text-foreground mb-4 flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-amber-400" />
              Análisis por Prioridad
            </h3>
            <div className="grid grid-cols-3 gap-4">
            {Object.entries(stats.byPriority).map(([key, count]) => (
                <div key={key} className="bg-white/5 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className={`text-sm font-medium ${PRIORITY_MAP[key]?.class}`}>
                      {PRIORITY_MAP[key]?.label}
                    </span>
                    <span className={`text-xs px-2 py-0.5 rounded-full ${
                      key === 'high' ? 'bg-red-500/20 text-red-400' :
                      key === 'medium' ? 'bg-amber-500/20 text-amber-400' :
                      'bg-blue-500/20 text-blue-400'
                    }`}>
                      {count}
                    </span>
                  </div>
                  <div className="w-full bg-white/10 rounded-full h-2 mt-2">
                    <div 
                      className={`h-2 rounded-full ${
                        key === 'high' ? 'bg-red-500' :
                        key === 'medium' ? 'bg-amber-500' :
                        'bg-blue-500'
                      }`}
                      style={{ width: `${stats.total > 0 ? (count / stats.total) * 100 : 0}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-xl border border-black/8 p-6 shadow-sm hover:shadow-md">
            <h3 className="font-semibold text-foreground mb-4 flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-emerald-400" />
              Flujo de Trabajo
            </h3>
            <div className="flex items-center justify-between overflow-x-auto pb-4">
              {STATUS_FLOW.map((s, i) => (
                <div key={s} className="flex items-center flex-1 min-w-[120px]">
                  <div className="flex flex-col items-center flex-1">
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center text-lg font-bold ${
                      s === 'pending' ? 'bg-amber-500/20 text-amber-400' :
                      s === 'assigned' ? 'bg-blue-500/20 text-blue-400' :
                      s === 'in_progress' ? 'bg-violet-500/20 text-violet-400' :
                      'bg-emerald-500/20 text-emerald-400'
                    }`}>
                      {s === 'pending' ? stats.pending :
                       s === 'assigned' ? stats.assigned :
                       s === 'in_progress' ? stats.inProgress :
                       stats.completed}
                    </div>
                    <span className="text-xs text-muted-foreground mt-2 text-center">{STATUS_MAP[s].label}</span>
                  </div>
                  {i < STATUS_FLOW.length - 1 && (
                    <ArrowRight className="w-5 h-5 text-muted-foreground mx-2 flex-shrink-0" />
                  )}
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      )}

      {activeTab === 'estadisticas' && hasFullAccess && (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white rounded-xl border border-black/8 p-6 shadow-sm hover:shadow-md">
              <h3 className="font-semibold text-foreground mb-4">Distribución por Prioridad</h3>
              <div className="space-y-4">
                {Object.entries(stats.byPriority).map(([priority, count]) => (
                  <div key={priority}>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-muted-foreground">{PRIORITY_MAP[priority]?.label}</span>
                      <span className={`font-medium ${PRIORITY_MAP[priority]?.class}`}>{count} ({stats.total > 0 ? Math.round((count / stats.total) * 100) : 0}%)</span>
                    </div>
                    <div className="w-full bg-white/10 rounded-full h-2">
                      <div 
                        className={`h-2 rounded-full ${
                          priority === 'high' ? 'bg-red-500' :
                          priority === 'medium' ? 'bg-amber-500' :
                          'bg-blue-500'
                        }`}
                        style={{ width: `${stats.total > 0 ? (count / stats.total) * 100 : 0}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white rounded-xl border border-black/8 p-6 shadow-sm hover:shadow-md">
              <h3 className="font-semibold text-foreground mb-4">Distribución por Estado</h3>
              <div className="space-y-4">
                {STATUS_FLOW.map(s => {
                  const count = s === 'pending' ? stats.pending :
                               s === 'assigned' ? stats.assigned :
                               s === 'in_progress' ? stats.inProgress :
                               stats.completed;
                  return (
                    <div key={s}>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-muted-foreground">{STATUS_MAP[s].label}</span>
                        <span className={`font-medium ${STATUS_MAP[s].class.split(' ')[1]}`}>{count}</span>
                      </div>
                      <div className="w-full bg-white/10 rounded-full h-2">
                        <div 
                          className={`h-2 rounded-full ${
                            s === 'pending' ? 'bg-amber-500' :
                            s === 'assigned' ? 'bg-blue-500' :
                            s === 'in_progress' ? 'bg-violet-500' :
                            'bg-emerald-500'
                          }`}
                          style={{ width: `${stats.total > 0 ? (count / stats.total) * 100 : 0}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </motion.div>
      )}

      {(activeTab === 'lista' || !hasFullAccess) && (
        <>
          {hasFullAccess && (
            <div className="bg-white rounded-xl border border-black/8 shadow-sm hover:shadow-md p-4 mb-6 rounded-xl">
              <div className="flex flex-wrap gap-4">
                <div className="flex items-center gap-2">
                  <Search className="w-4 h-4 text-muted-foreground" />
                  <input
                    type="text"
                    placeholder="Buscar..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="bg-white/10 border-0 rounded-lg px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="bg-white/10 border-0 rounded-lg px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  <option value="all">Todos los estados</option>
                  {STATUS_FLOW.map(s => (
                    <option key={s} value={s}>{STATUS_MAP[s].label}</option>
                  ))}
                </select>
                <select
                  value={priorityFilter}
                  onChange={(e) => setPriorityFilter(e.target.value)}
                  className="bg-white/10 border-0 rounded-lg px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  <option value="all">Todas las prioridades</option>
                  {Object.entries(PRIORITY_MAP).map(([key, val]) => (
                    <option key={key} value={key}>{val.label}</option>
                  ))}
                </select>
              </div>
              <p className="text-xs text-muted-foreground mt-2">
                Mostrando {filteredMaintenance.length} de {maintenance.length} registros
              </p>
            </div>
          )}

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
            {STATUS_FLOW.map((s) => (
              <motion.div key={s} initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="bg-white rounded-xl border border-black/8 shadow-sm-static p-4 text-center">
                <p className="text-2xl font-bold text-foreground">
                  {hasFullAccess 
                    ? filteredMaintenance.filter(m => m.status === s).length 
                    : maintenance.filter(m => m.status === s).length}
                </p>
                <p className={`text-xs font-medium mt-1 ${STATUS_MAP[s].class.split(' ')[1]}`}>{STATUS_MAP[s].label}</p>
              </motion.div>
            ))}
          </div>

          <div className="space-y-4">
            {(hasFullAccess ? filteredMaintenance : maintenance).map((m, i) => {
              const ServiceIcon = SERVICE_ICONS[m.assignedTo?.toLowerCase() || 'default'] || Wrench;
              return (
                <motion.div key={m.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.07 }} className="bg-white rounded-xl border border-black/8 shadow-sm hover:shadow-md p-5">
                  <div className="flex flex-col sm:flex-row gap-4">
                    <div className="flex-shrink-0">
                      <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-primary/20 to-accent/10 flex items-center justify-center border border-[rgba(255,255,255,0.1)]">
                        <ServiceIcon className="w-8 h-8 text-primary" />
                      </div>
                    </div>

                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2 flex-wrap">
                        <span className={`px-2.5 py-0.5 rounded-lg text-xs font-medium ${STATUS_MAP[m.status].class}`}>{STATUS_MAP[m.status].label}</span>
                        <span className={`text-xs font-medium flex items-center gap-1 ${PRIORITY_MAP[m.priority]?.class}`}>
                          <span className="w-2 h-2 rounded-full inline-block" style={{backgroundColor: 'currentColor'}}></span>
                          {PRIORITY_MAP[m.priority]?.label}
                        </span>
                      </div>
                      <h3 className="font-semibold text-foreground text-sm">{m.title}</h3>
                      <p className="text-sm text-muted-foreground mt-1">{m.description}</p>
                      <div className="flex flex-col sm:flex-row gap-3 mt-3 text-xs text-muted-foreground">
                        <span className="flex items-center gap-1"><MapPin className="w-3 h-3" /> {m.area}</span>
                        <span className="flex items-center gap-1"><Wrench className="w-3 h-3" /> {m.assignedTo}</span>
                        <span className="flex items-center gap-1"><Calendar className="w-3 h-3" /> {m.reportedDate}</span>
                        {m.completedDate && <span className="flex items-center gap-1"><CheckCircle className="w-3 h-3" /> {m.completedDate}</span>}
                      </div>
                    </div>

                    {canAdvance && m.status !== 'completed' && (
                      <div className="flex-shrink-0 flex items-center">
                        <button onClick={() => advance(m.id, m.status)} className="btn-premium px-4 py-2 rounded-xl text-xs flex items-center gap-1.5 whitespace-nowrap">
                          Avanzar <ArrowRight className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    )}
                  </div>
                </motion.div>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
};

export default MaintenancePage;
