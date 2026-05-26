import { useAuthStore } from '@/store/useAuthStore';
import { motion } from 'framer-motion';
import { AdminPaymentsView } from '@/components/features/payments';
import { TenantPaymentsView } from '@/components/features/payments';
import { CreditCard } from 'lucide-react';

export default function PaymentsPage() {
  const user = useAuthStore((s) => s.user);

  // Admin (P2): Full access to payments dashboard
  const isAdmin = user?.roleId === 'super_admin' || user?.roleId === 'admin';

  // Tenant (P5): Can only see their own payments
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
            <CreditCard className="icon-responsive-lg text-primary" /> Pagos y Cartera
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            {isAdmin
              ? 'Dashboard de recaudos, cartera y gestión de pagos'
              : 'Tu estado de cuenta e historial de pagos'
            }
          </p>
        </div>
      </div>

      {/* Content */}
      <div className="bg-white border border-black/8 rounded-xl p-6 shadow-sm">
        {isAdmin ? (
          <AdminPaymentsView />
        ) : isTenant ? (
          <TenantPaymentsView />
        ) : (
          <div className="text-center py-12 text-muted-foreground">
            <p>No tienes acceso a este módulo. Contacta con administración.</p>
          </div>
        )}
      </div>
    </motion.div>
  );
}
