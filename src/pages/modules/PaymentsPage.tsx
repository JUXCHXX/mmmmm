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
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-gradient-to-br from-blue-600/40 to-blue-600/20 border border-white/10 rounded-lg">
            <CreditCard className="w-6 h-6 text-blue-400" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-white">Pagos y Cartera</h1>
            <p className="text-gray-400 text-sm mt-1">
              {isAdmin
                ? 'Dashboard de recaudos, cartera y gestión de pagos'
                : 'Tu estado de cuenta e historial de pagos'
              }
            </p>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="bg-white/5 border border-white/10 rounded-lg p-6">
        {isAdmin ? (
          <AdminPaymentsView />
        ) : isTenant ? (
          <TenantPaymentsView />
        ) : (
          <div className="text-center py-12 text-gray-400">
            <p>No tienes acceso a este módulo. Contacta con administración.</p>
          </div>
        )}
      </div>
    </motion.div>
  );
}
