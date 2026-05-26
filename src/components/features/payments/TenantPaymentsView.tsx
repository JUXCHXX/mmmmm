import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { payments as initialPayments, getPaymentsByUnit } from '@/data/demoData';
import { CreditCard, Download, AlertTriangle, CheckCircle2, Eye, TrendingDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from '@/hooks/use-toast';

interface Payment {
  id: string;
  unitId: string;
  month: string;
  concept: string;
  amount: number;
  dueDate: string;
  paidDate?: string;
  status: 'paid' | 'pending' | 'overdue' | 'partial';
  paidAmount?: number;
}

const STATUS_CONFIG: Record<Payment['status'], { bg: string; text: string; icon: React.ReactNode; label: string }> = {
  paid: { bg: 'bg-emerald-500/20', text: 'text-emerald-400', icon: <CheckCircle2 className="w-4 h-4" />, label: 'Pagado' },
  pending: { bg: 'bg-amber-500/20', text: 'text-amber-400', icon: <AlertTriangle className="w-4 h-4" />, label: 'Pendiente' },
  overdue: { bg: 'bg-red-500/20', text: 'text-red-400', icon: <AlertTriangle className="w-4 h-4" />, label: 'Vencido' },
  partial: { bg: 'bg-blue-500/20', text: 'text-blue-400', icon: <CreditCard className="w-4 h-4" />, label: 'Parcial' },
};

export function TenantPaymentsView() {
  const myUnitId = 'apt-a-101'; // Mock: current tenant's unit
  const myPayments = initialPayments.filter(p => p.unitId === myUnitId)
    .sort((a, b) => new Date(b.month).getTime() - new Date(a.month).getTime());

  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [showPaymentMethod, setShowPaymentMethod] = useState(false);

  const stats = useMemo(() => {
    const total = myPayments.reduce((sum, p) => sum + p.amount, 0);
    const paid = myPayments.filter(p => p.status === 'paid').reduce((sum, p) => sum + (p.paidAmount || 0), 0);
    const overdue = myPayments.filter(p => p.status === 'overdue').reduce((sum, p) => sum + p.amount, 0);
    const pending = myPayments.filter(p => p.status === 'pending' || p.status === 'overdue').reduce((sum, p) => sum + p.amount, 0);

    return {
      total,
      paid,
      pending,
      overdue,
      paidCount: myPayments.filter(p => p.status === 'paid').length,
      overdueCount: myPayments.filter(p => p.status === 'overdue').length,
    };
  }, [myPayments]);

  const handleDownloadReceipt = (paymentId: string) => {
    toast({
      title: '✓ Recibo descargado',
      description: 'El recibo PDF ha sido descargado a tu dispositivo',
    });
  };

  const handleMakePayment = (paymentId: string) => {
    setShowPaymentMethod(true);
    toast({
      title: 'Redirigiendo a plataforma de pago...',
      description: 'Selecciona tu método de pago preferido',
    });
  };

  const handleDownloadHistory = () => {
    toast({
      title: '✓ Historial descargado',
      description: 'Tu historial de pagos ha sido descargado como PDF',
    });
  };

  return (
    <div className="space-y-6">
      {/* Account Summary */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-br from-teal-600/40 to-teal-600/20 border border-white/10 rounded-lg p-4"
        >
          <p className="text-gray-400 text-sm">Balance Total</p>
          <p className="text-2xl font-bold text-teal-400 mt-2">
            ${stats.pending.toLocaleString('es-CO')}
          </p>
          <p className="text-xs text-gray-400 mt-1">{stats.overdueCount} vencidos</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-gradient-to-br from-emerald-600/40 to-emerald-600/20 border border-white/10 rounded-lg p-4"
        >
          <p className="text-gray-400 text-sm">Pagos Realizados</p>
          <p className="text-2xl font-bold text-emerald-400 mt-2">
            ${stats.paid.toLocaleString('es-CO')}
          </p>
          <p className="text-xs text-gray-400 mt-1">{stats.paidCount} pagos</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-gradient-to-br from-red-600/40 to-red-600/20 border border-white/10 rounded-lg p-4"
        >
          <p className="text-gray-400 text-sm">Vencidos</p>
          <p className="text-2xl font-bold text-red-400 mt-2">
            ${stats.overdue.toLocaleString('es-CO')}
          </p>
          <p className="text-xs text-red-400/70 mt-1">⚠️ Requiere atención</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-gradient-to-br from-blue-600/40 to-blue-600/20 border border-white/10 rounded-lg p-4"
        >
          <p className="text-gray-400 text-sm">Total Facturado</p>
          <p className="text-2xl font-bold text-blue-400 mt-2">
            ${stats.total.toLocaleString('es-CO')}
          </p>
          <p className="text-xs text-gray-400 mt-1">últimos 6 meses</p>
        </motion.div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-wrap gap-3">
        <Button
          onClick={handleDownloadHistory}
          variant="outline"
          className="flex items-center gap-2 border-white/20"
        >
          <Download className="w-4 h-4" />
          Descargar Historial
        </Button>
        {stats.pending > 0 && (
          <Button
            onClick={() => handleMakePayment('')}
            className="flex-1 md:flex-none bg-teal-600 hover:bg-teal-700 text-white font-semibold flex items-center gap-2"
          >
            <CreditCard className="w-4 h-4" />
            Pagar Ahora
          </Button>
        )}
      </div>

      {/* Alerts */}
      {stats.overdue > 0 && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-red-500/20 border border-red-500/50 rounded-lg p-4 flex items-start gap-3"
        >
          <AlertTriangle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
          <div>
            <h4 className="font-semibold text-red-400">⚠️ Tienes pagos vencidos</h4>
            <p className="text-red-300 text-sm mt-1">
              Te recomendamos regularizar tu situación. Contacta con administración si necesitas un acuerdo de pago.
            </p>
          </div>
        </motion.div>
      )}

      {/* Payment History */}
      <div className="space-y-3">
        <h3 className="text-lg font-semibold text-white flex items-center gap-2">
          <CreditCard className="w-5 h-5" />
          Historial de Pagos ({myPayments.length})
        </h3>

        <div className="space-y-2 max-h-96 overflow-y-auto pr-2">
          {myPayments.length === 0 ? (
            <div className="text-center py-8 text-gray-400">
              <TrendingDown className="w-12 h-12 mx-auto mb-3 opacity-50" />
              <p>No tienes historial de pagos</p>
            </div>
          ) : (
            myPayments.map((payment, idx) => {
              const statusCfg = STATUS_CONFIG[payment.status];
              const isExpanded = expandedId === payment.id;

              return (
                <motion.div
                  key={payment.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.05 }}
                  className="bg-white/5 border border-white/10 rounded-lg p-4 hover:bg-white/10 transition"
                >
                  <div
                    className="flex items-center justify-between cursor-pointer"
                    onClick={() => setExpandedId(isExpanded ? null : payment.id)}
                  >
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="font-semibold text-white">{payment.concept}</h4>
                        <span className={`px-2 py-1 rounded text-xs font-medium flex items-center gap-1 ${statusCfg.bg} ${statusCfg.text}`}>
                          {statusCfg.icon} {statusCfg.label}
                        </span>
                      </div>
                      <p className="text-gray-400 text-sm">Mes: {payment.month}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-bold text-white">${payment.amount.toLocaleString('es-CO')}</p>
                      <p className="text-xs text-gray-400">Vence: {new Date(payment.dueDate).toLocaleDateString('es-CO')}</p>
                    </div>
                  </div>

                  {/* Expanded Details */}
                  {isExpanded && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="mt-4 pt-4 border-t border-white/10 space-y-3"
                    >
                      <div className="grid grid-cols-2 gap-3 text-sm">
                        <div>
                          <p className="text-gray-400">Monto</p>
                          <p className="text-white font-semibold">${payment.amount.toLocaleString('es-CO')}</p>
                        </div>
                        <div>
                          <p className="text-gray-400">Vencimiento</p>
                          <p className="text-white font-semibold">
                            {new Date(payment.dueDate).toLocaleDateString('es-CO')}
                          </p>
                        </div>
                        {payment.status === 'paid' && (
                          <div>
                            <p className="text-gray-400">Pagado el</p>
                            <p className="text-emerald-400 font-semibold">
                              {payment.paidDate ? new Date(payment.paidDate).toLocaleDateString('es-CO') : 'N/A'}
                            </p>
                          </div>
                        )}
                        {payment.status === 'partial' && (
                          <div>
                            <p className="text-gray-400">Pendiente</p>
                            <p className="text-amber-400 font-semibold">
                              ${(payment.amount - (payment.paidAmount || 0)).toLocaleString('es-CO')}
                            </p>
                          </div>
                        )}
                      </div>

                      {/* Action Buttons */}
                      <div className="flex flex-wrap gap-2">
                        {payment.status === 'paid' && (
                          <Button
                            size="sm"
                            variant="outline"
                            className="flex-1 text-emerald-400 border-emerald-500/50 hover:bg-emerald-500/20 flex items-center justify-center gap-2"
                            onClick={() => handleDownloadReceipt(payment.id)}
                          >
                            <Eye className="w-4 h-4" />
                            Descargar Recibo
                          </Button>
                        )}
                        {(payment.status === 'pending' || payment.status === 'overdue' || payment.status === 'partial') && (
                          <Button
                            size="sm"
                            className="flex-1 bg-teal-600 hover:bg-teal-700 text-white flex items-center justify-center gap-2"
                            onClick={() => handleMakePayment(payment.id)}
                          >
                            <CreditCard className="w-4 h-4" />
                            Pagar Ahora
                          </Button>
                        )}
                      </div>
                    </motion.div>
                  )}
                </motion.div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}
