import { useAuthStore } from '@/store/useAuthStore';
import { motion } from 'framer-motion';
import { AdminReservationsView } from '@/components/features/reservations';
import { TenantReservationsView } from '@/components/features/reservations';
import { CalendarDays } from 'lucide-react';

export default function ReservationsPage() {
  const user = useAuthStore((s) => s.user);

  // Admin (P2): Full access to all reservations
  const isAdmin = user?.roleId === 'super_admin' || user?.roleId === 'admin';

  // Tenant (P5): Can only make their own reservations
  const isTenant = user?.roleId === 'arrendatario' || user?.roleId === 'propietario';

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-gradient-to-br from-teal-600/40 to-teal-600/20 border border-white/10 rounded-lg">
            <CalendarDays className="w-6 h-6 text-teal-400" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-white">Reservas de Zonas Comunes</h1>
            <p className="text-gray-400 text-sm mt-1">
              {isAdmin ? 'Gestión completa de reservas del conjunto' : 'Reserva tus espacios favoritos'}
            </p>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="bg-white/5 border border-white/10 rounded-lg p-6">
        {isAdmin ? (
          <AdminReservationsView />
        ) : isTenant ? (
          <TenantReservationsView />
        ) : (
          <div className="text-center py-12 text-gray-400">
            <p>No tienes acceso a este módulo. Contacta con administración.</p>
          </div>
        )}
      </div>
    </motion.div>
  );
}
