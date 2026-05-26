import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { commonAreas, reservations as initialReservations, getReservationsByUnit, getUnitById } from '@/data/demoData';
import { useAuthStore } from '@/store/useAuthStore';
import { Button } from '@/components/ui/button';
import { Calendar, Clock, Users, X, CheckCircle2, AlertCircle } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

type Reservation = {
  id: string;
  unitId: string;
  residentName: string;
  areaId: string;
  areaName: string;
  date: string;
  startTime: string;
  endTime: string;
  status: 'confirmed' | 'pending' | 'cancelled';
  guests: number;
};

export function TenantReservationsView() {
  const user = useAuthStore((s) => s.user);
  const [reservations, setReservations] = useState<Reservation[]>(initialReservations);
  const [showForm, setShowForm] = useState(false);
  const [selectedArea, setSelectedArea] = useState<string>('');
  const [formData, setFormData] = useState({
    date: '',
    startTime: '14:00',
    endTime: '16:00',
    guests: 2,
    reason: '',
  });
  const [loading, setLoading] = useState(false);

  const myReservations = reservations.filter(r => r.residentName === 'Juan Pérez'); // Mock: current tenant
  const confirmedCount = myReservations.filter(r => r.status === 'confirmed').length;
  const pendingCount = myReservations.filter(r => r.status === 'pending').length;

  const timeSlots = [
    '06:00-07:00', '07:00-08:00', '08:00-09:00',
    '14:00-15:00', '15:00-16:00', '16:00-17:00', '17:00-18:00', '18:00-19:00', '19:00-20:00'
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedArea || !formData.date) {
      toast({ title: 'Por favor completa todos los campos', variant: 'destructive' });
      return;
    }

    setLoading(true);
    setTimeout(() => {
      const newReservation: Reservation = {
        id: `res-${Date.now()}`,
        unitId: 'apt-a-101',
        residentName: 'Juan Pérez',
        areaId: selectedArea,
        areaName: commonAreas.find(a => a.id === selectedArea)?.name || 'Área',
        date: formData.date,
        startTime: formData.startTime,
        endTime: formData.endTime,
        status: 'pending',
        guests: formData.guests,
      };

      setReservations(prev => [...prev, newReservation]);
      toast({ title: '✓ Reserva enviada', description: 'Tu solicitud fue registrada y está pendiente de aprobación' });
      setShowForm(false);
      setFormData({ date: '', startTime: '14:00', endTime: '16:00', guests: 2, reason: '' });
      setSelectedArea('');
      setLoading(false);
    }, 1000);
  };

  const handleCancel = (id: string) => {
    setReservations(prev =>
      prev.map(r => r.id === id ? { ...r, status: 'cancelled' } : r)
    );
    toast({ title: 'Reserva cancelada', description: 'Tu reserva ha sido cancelada' });
  };

  return (
    <div className="space-y-6">
      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: 'Mis Reservas', value: myReservations.length, icon: '📅' },
          { label: 'Confirmadas', value: confirmedCount, icon: '✓' },
          { label: 'Pendientes', value: pendingCount, icon: '⏳' },
        ].map((stat, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
            className="bg-gradient-to-br from-teal-600/40 to-teal-600/20 border border-white/10 rounded-lg p-4"
          >
            <p className="text-gray-400 text-sm">{stat.label}</p>
            <div className="flex items-center justify-between mt-2">
              <p className="text-2xl font-bold text-white">{stat.value}</p>
              <span className="text-2xl">{stat.icon}</span>
            </div>
          </motion.div>
        ))}
      </div>

      {/* New Reservation Button */}
      <Button
        onClick={() => setShowForm(!showForm)}
        className="w-full bg-teal-600 hover:bg-teal-700 text-white font-semibold py-6"
      >
        + Nueva Reserva
      </Button>

      {/* Booking Form */}
      <AnimatePresence>
        {showForm && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="bg-white/5 border border-white/10 rounded-lg p-6 space-y-4"
          >
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-white">Hacer una Reserva</h3>
              <button onClick={() => setShowForm(false)} className="text-gray-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Area Selection */}
              <div>
                <label className="text-sm text-gray-400 block mb-2">Selecciona un área*</label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {commonAreas.map(area => (
                    <motion.button
                      key={area.id}
                      type="button"
                      onClick={() => setSelectedArea(area.id)}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className={`p-3 rounded-lg border-2 transition font-medium text-sm ${
                        selectedArea === area.id
                          ? 'border-teal-500 bg-teal-500/20 text-teal-400'
                          : 'border-white/20 bg-white/5 text-gray-300 hover:border-white/40'
                      }`}
                    >
                      <div className="text-xl mb-1">{area.image}</div>
                      {area.name}
                    </motion.button>
                  ))}
                </div>
              </div>

              {/* Date */}
              <div>
                <label className="text-sm text-gray-400 block mb-2">Fecha*</label>
                <input
                  type="date"
                  value={formData.date}
                  onChange={(e) => setFormData(prev => ({ ...prev, date: e.target.value }))}
                  min={new Date().toISOString().split('T')[0]}
                  className="w-full bg-white/5 border border-white/10 rounded px-3 py-2 text-white"
                  required
                />
              </div>

              {/* Time Selection */}
              <div>
                <label className="text-sm text-gray-400 block mb-2">Horario*</label>
                <select
                  value={`${formData.startTime}-${formData.endTime}`}
                  onChange={(e) => {
                    const [start, end] = e.target.value.split('-');
                    setFormData(prev => ({ ...prev, startTime: start, endTime: end }));
                  }}
                  className="w-full bg-white/5 border border-white/10 rounded px-3 py-2 text-white text-sm"
                >
                  {timeSlots.map(slot => {
                    const [start, end] = slot.split('-');
                    return (
                      <option key={slot} value={slot}>{start} - {end}</option>
                    );
                  })}
                </select>
              </div>

              {/* Guests */}
              <div>
                <label className="text-sm text-gray-400 block mb-2">Número de personas*</label>
                <input
                  type="number"
                  min="1"
                  max="10"
                  value={formData.guests}
                  onChange={(e) => setFormData(prev => ({ ...prev, guests: parseInt(e.target.value) }))}
                  className="w-full bg-white/5 border border-white/10 rounded px-3 py-2 text-white"
                  required
                />
              </div>

              {/* Reason */}
              <div>
                <label className="text-sm text-gray-400 block mb-2">Motivo (opcional)</label>
                <textarea
                  value={formData.reason}
                  onChange={(e) => setFormData(prev => ({ ...prev, reason: e.target.value }))}
                  placeholder="Ej: Reunión familiar, celebración..."
                  className="w-full bg-white/5 border border-white/10 rounded px-3 py-2 text-white text-sm resize-none"
                  rows={3}
                />
              </div>

              {/* Submit Buttons */}
              <div className="flex gap-3">
                <Button
                  type="submit"
                  disabled={loading}
                  className="flex-1 bg-teal-600 hover:bg-teal-700 text-white font-semibold"
                >
                  {loading ? 'Enviando...' : 'Solicitar Reserva'}
                </Button>
                <Button
                  type="button"
                  onClick={() => setShowForm(false)}
                  variant="outline"
                  className="flex-1"
                >
                  Cancelar
                </Button>
              </div>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      {/* My Reservations */}
      <div className="space-y-3">
        <h3 className="text-lg font-semibold text-white">Mis Reservas ({myReservations.length})</h3>
        <div className="space-y-2 max-h-96 overflow-y-auto pr-2">
          {myReservations.length === 0 ? (
            <div className="text-center py-8 text-gray-400">
              <AlertCircle className="w-12 h-12 mx-auto mb-3 opacity-50" />
              <p>No tienes reservas aún</p>
            </div>
          ) : (
            myReservations.map((res) => (
              <motion.div
                key={res.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className={`bg-white/5 border rounded-lg p-4 transition ${
                  res.status === 'confirmed' ? 'border-emerald-500/50' : 'border-white/10'
                }`}
              >
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <h4 className="font-semibold text-white">{res.areaName}</h4>
                    <p className="text-gray-400 text-sm mt-1">
                      {new Date(res.date).toLocaleDateString('es-CO', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                    </p>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1 ${
                    res.status === 'confirmed'
                      ? 'bg-emerald-500/20 text-emerald-400'
                      : res.status === 'pending'
                        ? 'bg-amber-500/20 text-amber-400'
                        : 'bg-red-500/20 text-red-400'
                  }`}>
                    {res.status === 'confirmed' && <CheckCircle2 className="w-3 h-3" />}
                    {res.status === 'confirmed' ? 'Confirmada' : res.status === 'pending' ? 'Pendiente' : 'Cancelada'}
                  </span>
                </div>

                <div className="flex flex-wrap gap-3 text-sm text-gray-300 mb-3">
                  <div className="flex items-center gap-1">
                    <Clock className="w-3 h-3 text-gray-500" />
                    {res.startTime} - {res.endTime}
                  </div>
                  <div className="flex items-center gap-1">
                    <Users className="w-3 h-3 text-gray-500" />
                    {res.guests} personas
                  </div>
                </div>

                {res.status === 'pending' && (
                  <Button
                    onClick={() => handleCancel(res.id)}
                    variant="outline"
                    size="sm"
                    className="w-full text-red-400 hover:text-red-300 border-red-500/50"
                  >
                    Cancelar Reserva
                  </Button>
                )}
              </motion.div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
