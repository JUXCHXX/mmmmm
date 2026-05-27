import { useAuthStore } from '@/store/useAuthStore';
import { motion } from 'framer-motion';
import { AdminReservationsView, CouncilReservationsView, TenantReservationsView } from '@/components/features/reservations';
import { CalendarDays } from 'lucide-react';

export default function ReservationsPage() {
  const user = useAuthStore((s) => s.user);

  const isAdmin = user?.roleId === 'super_admin' || user?.roleId === 'admin';
  const isCouncil = user?.roleId === 'consejo';
  const isTenant = user?.roleId === 'arrendatario' || user?.roleId === 'propietario';

  if (isCouncil) {
    return <CouncilReservationsView />;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="flex items-center gap-3 text-2xl font-bold text-foreground md:text-3xl">
            <CalendarDays className="icon-responsive-lg text-primary" />
            Reservas de Zonas Comunes
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            {isAdmin ? 'Gestion completa de reservas del conjunto' : 'Reserva tus espacios favoritos'}
          </p>
        </div>
      </div>

      <div className="rounded-xl border border-black/8 bg-white p-6 shadow-sm">
        {isAdmin ? (
          <AdminReservationsView />
        ) : isTenant ? (
          <TenantReservationsView />
        ) : (
          <div className="py-12 text-center text-muted-foreground">
            <p>No tienes acceso a este modulo. Contacta con administracion.</p>
          </div>
        )}
      </div>
    </motion.div>
  );
}
