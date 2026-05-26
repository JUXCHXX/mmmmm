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
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-foreground flex items-center gap-3">
            <CalendarDays className="icon-responsive-lg text-primary" /> Reservas de Zonas Comunes
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            {isAdmin ? 'Gestión completa de reservas del conjunto' : 'Reserva tus espacios favoritos'}
          </p>
        </div>
      </div>

      {/* Content */}
      <div className="bg-white border border-black/8 rounded-xl p-6 shadow-sm">
        {isAdmin ? (
          <AdminReservationsView />
        ) : isTenant ? (
          <TenantReservationsView />
        ) : (
          <div className="text-center py-12 text-muted-foreground">
            <p>No tienes acceso a este módulo. Contacta con administración.</p>
          </div>
        )}
      </div>
    </motion.div>
  );
}
