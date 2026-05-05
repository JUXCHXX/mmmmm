import { motion } from 'framer-motion';
import { Clock, CheckCircle, AlertCircle, MessageCircle, Search, Filter, Download, ClipboardList, XCircle } from 'lucide-react';
import { useState } from 'react';

export interface PQRS {
  id: string;
  type: 'peticion' | 'queja' | 'reclamo' | 'sugerencia';
  title: string;
  description: string;
  status: 'pendiente' | 'en_proceso' | 'completado' | 'rechazado';
  priority: 'baja' | 'normal' | 'alta';
  createdDate: Date;
  lastUpdate: Date;
  unit: string;
  assignedTo?: string;
  notes?: string;
}

interface PQRSHistoryProps {
  pqrsList: PQRS[];
  onDeletePQRS?: (id: string) => void;
  onUpdateStatus?: (id: string, status: PQRS['status']) => void;
}

const STATUS_CONFIG = {
  pendiente: {
    icon: <Clock className="w-5 h-5" />,
    label: 'Pendiente',
    color: 'text-amber-600',
    bgColor: 'bg-amber-50',
    borderColor: 'border-amber-200',
    badgeColor: 'bg-amber-100 text-amber-700',
  },
  en_proceso: {
    icon: <MessageCircle className="w-5 h-5" />,
    label: 'En Proceso',
    color: 'text-blue-600',
    bgColor: 'bg-blue-50',
    borderColor: 'border-blue-200',
    badgeColor: 'bg-blue-100 text-blue-700',
  },
  completado: {
    icon: <CheckCircle className="w-5 h-5" />,
    label: 'Completado',
    color: 'text-emerald-600',
    bgColor: 'bg-emerald-50',
    borderColor: 'border-emerald-200',
    badgeColor: 'bg-emerald-100 text-emerald-700',
  },
  rechazado: {
    icon: <AlertCircle className="w-5 h-5" />,
    label: 'Rechazado',
    color: 'text-red-600',
    bgColor: 'bg-red-50',
    borderColor: 'border-red-200',
    badgeColor: 'bg-red-100 text-red-700',
  },
};

const TYPE_CONFIG = {
  peticion: { label: 'Petición', color: 'text-blue-600' },
  queja: { label: 'Queja', color: 'text-amber-600' },
  reclamo: { label: 'Reclamo', color: 'text-red-600' },
  sugerencia: { label: 'Sugerencia', color: 'text-green-600' },
};

const PRIORITY_CONFIG = {
  baja: { label: 'Baja', color: 'bg-blue-100 text-blue-700' },
  normal: { label: 'Normal', color: 'bg-amber-100 text-amber-700' },
  alta: { label: 'Alta', color: 'bg-red-100 text-red-700' },
};

export const PQRSHistory = ({ pqrsList, onDeletePQRS, onUpdateStatus }: PQRSHistoryProps) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | PQRS['status']>('all');
  const [filterType, setFilterType] = useState<'all' | PQRS['type']>('all');

  const filtered = pqrsList.filter(pqrs => {
    const matchesSearch =
      pqrs.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      pqrs.id.includes(searchTerm);
    const matchesStatus = filterStatus === 'all' || pqrs.status === filterStatus;
    const matchesType = filterType === 'all' || pqrs.type === filterType;
    return matchesSearch && matchesStatus && matchesType;
  });

  const stats = {
    total: pqrsList.length,
    pending: pqrsList.filter(p => p.status === 'pendiente').length,
    completed: pqrsList.filter(p => p.status === 'completado').length,
    rejected: pqrsList.filter(p => p.status === 'rechazado').length,
  };

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Total', value: stats.total, icon: ClipboardList, color: 'from-blue-500 to-cyan-400' },
          { label: 'Pendientes', value: stats.pending, icon: Clock, color: 'from-amber-500 to-orange-400' },
          { label: 'Completadas', value: stats.completed, icon: CheckCircle, color: 'from-emerald-500 to-green-400' },
          { label: 'Rechazadas', value: stats.rejected, icon: XCircle, color: 'from-red-500 to-pink-400' },
        ].map((stat) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className={`p-4 rounded-xl bg-gradient-to-br ${stat.color} text-white`}
          >
            <p className="text-sm opacity-90 mb-1">{stat.label}</p>
            <div className="flex items-center justify-between">
              <p className="text-3xl font-bold">{stat.value}</p>
              <stat.icon className="h-7 w-7" />
            </div>
          </motion.div>
        ))}
      </div>

      {/* Filters */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col sm:flex-row gap-3"
      >
        {/* Search */}
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Buscar por título o ID..."
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 focus:border-[#0F7A5C] outline-none transition-colors"
          />
        </div>

        {/* Status Filter */}
        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value as typeof filterStatus)}
          className="px-4 py-2.5 rounded-xl border border-gray-200 focus:border-[#0F7A5C] outline-none transition-colors"
        >
          <option value="all">Todos los estados</option>
          <option value="pendiente">Pendiente</option>
          <option value="en_proceso">En Proceso</option>
          <option value="completado">Completado</option>
          <option value="rechazado">Rechazado</option>
        </select>

        {/* Type Filter */}
        <select
          value={filterType}
          onChange={(e) => setFilterType(e.target.value as typeof filterType)}
          className="px-4 py-2.5 rounded-xl border border-gray-200 focus:border-[#0F7A5C] outline-none transition-colors"
        >
          <option value="all">Todos los tipos</option>
          <option value="peticion">Petición</option>
          <option value="queja">Queja</option>
          <option value="reclamo">Reclamo</option>
          <option value="sugerencia">Sugerencia</option>
        </select>

        {/* Export Button */}
        <button className="px-4 py-2.5 rounded-xl border border-gray-200 hover:bg-gray-50 transition-colors flex items-center gap-2 text-sm font-semibold text-gray-700">
          <Download className="w-4 h-4" />
          Exportar
        </button>
      </motion.div>

      {/* PQRS List */}
      <div className="space-y-3">
        {filtered.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12"
          >
            <MessageCircle className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-500">No se encontraron PQRS con los filtros aplicados</p>
          </motion.div>
        ) : (
          filtered.map((pqrs, idx) => {
            const statusConfig = STATUS_CONFIG[pqrs.status];
            const typeConfig = TYPE_CONFIG[pqrs.type];
            const priorityConfig = PRIORITY_CONFIG[pqrs.priority];
            const daysAgo = Math.floor(
              (new Date().getTime() - pqrs.createdDate.getTime()) / (1000 * 60 * 60 * 24)
            );

            return (
              <motion.div
                key={pqrs.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.05 }}
                className={`p-5 rounded-xl border-2 ${statusConfig.borderColor} ${statusConfig.bgColor} hover:shadow-md transition-all`}
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <span className="text-xl">{statusConfig.icon}</span>
                      <h4 className="text-lg font-bold text-[#0D4A3E]">{pqrs.title}</h4>
                      <span className={`px-2.5 py-1 rounded-lg text-xs font-bold ${priorityConfig.color}`}>
                        {priorityConfig.label}
                      </span>
                    </div>
                    <div className="flex flex-wrap gap-2 items-center">
                      <span className={`px-2 py-1 rounded-lg text-xs font-semibold ${typeConfig.color}`}>
                        {typeConfig.label}
                      </span>
                      <span className={`px-2 py-1 rounded-lg text-xs font-semibold ${statusConfig.badgeColor}`}>
                        {statusConfig.label}
                      </span>
                      <span className="text-xs text-gray-500">Apto {pqrs.unit}</span>
                      <span className="text-xs text-gray-500">Hace {daysAgo} días</span>
                    </div>
                  </div>

                  {/* ID Badge */}
                  <div className="text-right">
                    <p className="text-xs text-gray-500 font-mono">{pqrs.id}</p>
                  </div>
                </div>

                {/* Description */}
                <p className="text-sm text-gray-700 mb-4 line-clamp-2">{pqrs.description}</p>

                {/* Timeline */}
                <div className="flex items-center gap-4 text-xs text-gray-600 mb-4 pb-4 border-b border-gray-200">
                  <div>
                    <span className="font-bold">Creado:</span> {pqrs.createdDate.toLocaleDateString('es-CO')}
                  </div>
                  <div>
                    <span className="font-bold">Actualizado:</span> {pqrs.lastUpdate.toLocaleDateString('es-CO')}
                  </div>
                  {pqrs.assignedTo && (
                    <div>
                      <span className="font-bold">Asignado a:</span> {pqrs.assignedTo}
                    </div>
                  )}
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2">
                  {pqrs.status === 'pendiente' && onUpdateStatus && (
                    <button
                      onClick={() => onUpdateStatus(pqrs.id, 'en_proceso')}
                      className="px-3 py-1.5 rounded-lg bg-blue-100 hover:bg-blue-200 text-blue-700 text-xs font-semibold transition-colors"
                    >
                      Procesar
                    </button>
                  )}
                  {pqrs.status === 'en_proceso' && onUpdateStatus && (
                    <>
                      <button
                        onClick={() => onUpdateStatus(pqrs.id, 'completado')}
                        className="px-3 py-1.5 rounded-lg bg-emerald-100 hover:bg-emerald-200 text-emerald-700 text-xs font-semibold transition-colors"
                      >
                        Completar
                      </button>
                      <button
                        onClick={() => onUpdateStatus(pqrs.id, 'rechazado')}
                        className="px-3 py-1.5 rounded-lg bg-red-100 hover:bg-red-200 text-red-700 text-xs font-semibold transition-colors"
                      >
                        Rechazar
                      </button>
                    </>
                  )}
                  {onDeletePQRS && (
                    <button
                      onClick={() => onDeletePQRS(pqrs.id)}
                      className="ml-auto px-3 py-1.5 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-semibold transition-colors"
                    >
                      Eliminar
                    </button>
                  )}
                </div>

                {/* Notes */}
                {pqrs.notes && (
                  <div className="mt-4 pt-4 border-t border-gray-200">
                    <p className="text-xs font-bold text-gray-600 mb-2">Notas:</p>
                    <p className="text-sm text-gray-700 italic">{pqrs.notes}</p>
                  </div>
                )}
              </motion.div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default PQRSHistory;
