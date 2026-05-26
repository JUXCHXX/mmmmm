import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuthStore } from '@/store/useAuthStore';
import { commonAreas, reservations as initialReservations, getReservationsByUnit, getUnitById, units } from '@/data/demoData';
import { Button } from '@/components/ui/button';
import { Calendar, Clock, Users, Trash2, CheckCircle2, XCircle, AlertCircle, ChevronRight, MoreVertical } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

type ReservationStatus = 'confirmed' | 'pending' | 'cancelled';

interface ExtendedReservation {
  id: string;
  unitId: string;
  unitNumber: string;
  residentName: string;
  areaId: string;
  areaName: string;
  date: string;
  startTime: string;
  endTime: string;
  status: ReservationStatus;
  guests: number;
}

const STATUS_CONFIG: Record<ReservationStatus, { bg: string; text: string; icon: React.ReactNode; label: string }> = {
  confirmed: { bg: 'bg-emerald-500/20', text: 'text-emerald-400', icon: <CheckCircle2 className="w-4 h-4" />, label: 'Confirmada' },
  pending: { bg: 'bg-amber-500/20', text: 'text-amber-400', icon: <AlertCircle className="w-4 h-4" />, label: 'Pendiente' },
  cancelled: { bg: 'bg-red-500/20', text: 'text-red-400', icon: <XCircle className="w-4 h-4" />, label: 'Cancelada' },
};

export function AdminReservationsView() {
  const user = useAuthStore((s) => s.user);
  const [reservations, setReservations] = useState<ExtendedReservation[]>(
    initialReservations.map(r => {
      const unit = getUnitById(r.unitId);
      return {
        ...r,
        unitNumber: unit ? `${unit.tower}-${unit.number}` : r.unitId,
      } as ExtendedReservation;
    })
  );
  const [selectedArea, setSelectedArea] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<'all' | ReservationStatus>('all');
  const [showNewForm, setShowNewForm] = useState(false);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const filteredReservations = reservations.filter(r => {
    const areaMatch = selectedArea === 'all' || r.areaId === selectedArea;
    const statusMatch = selectedStatus === 'all' || r.status === selectedStatus;
    return areaMatch && statusMatch;
  });

  const stats = {
    total: reservations.length,
    confirmed: reservations.filter(r => r.status === 'confirmed').length,
    pending: reservations.filter(r => r.status === 'pending').length,
    cancelled: reservations.filter(r => r.status === 'cancelled').length,
  };

  const handleApprove = (id: string) => {
    setReservations(prev =>
      prev.map(r => r.id === id ? { ...r, status: 'confirmed' as const } : r)
    );
    toast({ title: '✓ Reserva aprobada', description: 'La reserva ha sido confirmada' });
  };

  const handleReject = (id: string) => {
    setReservations(prev =>
      prev.map(r => r.id === id ? { ...r, status: 'cancelled' as const } : r)
    );
    toast({ title: 'Reserva rechazada', description: 'La reserva ha sido cancelada' });
  };

  const handleDelete = (id: string) => {
    setReservations(prev => prev.filter(r => r.id !== id));
    toast({ title: 'Reserva eliminada', description: 'Se ha removido la reserva' });
  };

  return (
    <div className="space-y-6">
      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Total', value: stats.total, color: 'from-blue-600/40 to-blue-600/20' },
          { label: 'Confirmadas', value: stats.confirmed, color: 'from-emerald-600/40 to-emerald-600/20' },
          { label: 'Pendientes', value: stats.pending, color: 'from-amber-600/40 to-amber-600/20' },
          { label: 'Canceladas', value: stats.cancelled, color: 'from-red-600/40 to-red-600/20' },
        ].map((stat, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
            className={`bg-gradient-to-br ${stat.color} border border-white/10 rounded-lg p-4`}
          >
            <p className="text-gray-400 text-sm">{stat.label}</p>
            <p className="text-2xl font-bold text-white mt-2">{stat.value}</p>
          </motion.div>
        ))}
      </div>

      {/* Filters */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="flex-1">
          <label className="text-sm text-gray-400 block mb-2">Filtrar por área</label>
          <select
            value={selectedArea}
            onChange={(e) => setSelectedArea(e.target.value)}
            className="w-full bg-white/5 border border-white/10 rounded px-3 py-2 text-white text-sm"
          >
            <option value="all">Todas las áreas</option>
            {commonAreas.map(area => (
              <option key={area.id} value={area.id}>{area.name}</option>
            ))}
          </select>
        </div>
        <div className="flex-1">
          <label className="text-sm text-gray-400 block mb-2">Filtrar por estado</label>
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value as any)}
            className="w-full bg-white/5 border border-white/10 rounded px-3 py-2 text-white text-sm"
          >
            <option value="all">Todos los estados</option>
            <option value="confirmed">Confirmadas</option>
            <option value="pending">Pendientes</option>
            <option value="cancelled">Canceladas</option>
          </select>
        </div>
      </div>

      {/* Reservations List */}
      <div className="space-y-3">
        <h3 className="text-lg font-semibold text-white">Reservas: {filteredReservations.length} resultados</h3>
        <div className="space-y-2 max-h-96 overflow-y-auto pr-2">
          <AnimatePresence mode="popLayout">
            {filteredReservations.map((res, idx) => {
              const statusCfg = STATUS_CONFIG[res.status];
              const isPending = res.status === 'pending';

              return (
                <motion.div
                  key={res.id}
                  layout
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  transition={{ delay: idx * 0.05 }}
                  className="bg-white/5 border border-white/10 rounded-lg p-4 hover:bg-white/10 transition"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="font-semibold text-white">{res.residentName}</h4>
                        <span className={`px-2 py-1 rounded text-xs font-medium flex items-center gap-1 ${statusCfg.bg} ${statusCfg.text}`}>
                          {statusCfg.icon} {statusCfg.label}
                        </span>
                      </div>
                      <p className="text-gray-400 text-sm">Unidad {res.unitNumber}</p>
                    </div>
                    <div className="flex gap-2">
                      {isPending && (
                        <>
                          <button
                            onClick={() => handleApprove(res.id)}
                            className="p-2 rounded hover:bg-emerald-500/20 text-emerald-400 transition"
                            title="Aprobar"
                          >
                            <CheckCircle2 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleReject(res.id)}
                            className="p-2 rounded hover:bg-red-500/20 text-red-400 transition"
                            title="Rechazar"
                          >
                            <XCircle className="w-4 h-4" />
                          </button>
                        </>
                      )}
                      <button
                        onClick={() => handleDelete(res.id)}
                        className="p-2 rounded hover:bg-red-500/20 text-red-400 transition"
                        title="Eliminar"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
                    <div className="flex items-center gap-2 text-gray-300">
                      <span className="text-teal-400 font-medium">{res.areaName}</span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-300">
                      <Calendar className="w-3 h-3 text-gray-500" />
                      <span>{new Date(res.date).toLocaleDateString('es-CO')}</span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-300">
                      <Clock className="w-3 h-3 text-gray-500" />
                      <span>{res.startTime} - {res.endTime}</span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-300">
                      <Users className="w-3 h-3 text-gray-500" />
                      <span>{res.guests} personas</span>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      </div>

      {filteredReservations.length === 0 && (
        <div className="text-center py-8">
          <AlertCircle className="w-12 h-12 mx-auto text-gray-500 mb-3" />
          <p className="text-gray-400">No hay reservas para mostrar</p>
        </div>
      )}
    </div>
  );
}
