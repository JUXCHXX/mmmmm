import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { payments as initialPayments, getUnitById, getOverduePayments, getTotalPortfolioValue, getCollectionRate } from '@/data/demoData';
import { CreditCard, TrendingUp, AlertTriangle, CheckCircle2, XCircle, Filter, Download, Eye } from 'lucide-react';
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
  overdue: { bg: 'bg-red-500/20', text: 'text-red-400', icon: <XCircle className="w-4 h-4" />, label: 'Vencido' },
  partial: { bg: 'bg-blue-500/20', text: 'text-blue-400', icon: <CreditCard className="w-4 h-4" />, label: 'Parcial' },
};

export function AdminPaymentsView() {
  const [payments, setPayments] = useState<Payment[]>(initialPayments);
  const [statusFilter, setStatusFilter] = useState<'all' | Payment['status']>('all');
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const overdue = getOverduePayments();
  const totalValue = getTotalPortfolioValue();
  const collectionRate = getCollectionRate();

  const filteredPayments = useMemo(() => {
    return payments.filter(p => statusFilter === 'all' || p.status === statusFilter)
      .sort((a, b) => new Date(b.dueDate).getTime() - new Date(a.dueDate).getTime());
  }, [payments, statusFilter]);

  const stats = useMemo(() => {
    const overdue = payments.filter(p => p.status === 'overdue');
    const totalOverdue = overdue.reduce((sum, p) => sum + p.amount, 0);
    const paid = payments.filter(p => p.status === 'paid');
    const totalPaid = paid.reduce((sum, p) => sum + (p.paidAmount || 0), 0);

    return {
      totalPortfolio: totalValue,
      paidTotal: totalPaid,
      pendingTotal: payments
        .filter(p => p.status === 'pending' || p.status === 'overdue')
        .reduce((sum, p) => sum + p.amount, 0),
      overdueCount: overdue.length,
      overdueAmount: totalOverdue,
      collectionRate: Math.round(collectionRate),
      uniqueDefaulters: new Set(overdue.map(p => p.unitId)).size,
    };
  }, [payments, totalValue, collectionRate]);

  const handleGenerateReceipt = (paymentId: string) => {
    toast({
      title: '✓ Recibo generado',
      description: 'El recibo ha sido generado y descargado',
    });
  };

  const handleSendNotification = (unitId: string) => {
    toast({
      title: '✓ Notificación enviada',
      description: 'Se envió notificación de pago pendiente al residente',
    });
  };

  const handleExportPortfolio = () => {
    toast({
      title: '✓ Cartera exportada',
      description: 'El archivo CSV ha sido descargado',
    });
  };

  const handleCreatePaymentAgreement = (paymentId: string) => {
    setPayments(prev =>
      prev.map(p => p.id === paymentId ? { ...p, status: 'pending' as const } : p)
    );
    toast({
      title: '✓ Acuerdo de pago creado',
      description: 'Se ha registrado el acuerdo de pago',
    });
  };

  return (
    <div className="space-y-6">
      {/* KPI Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-br from-blue-600/40 to-blue-600/20 border border-white/10 rounded-lg p-4"
        >
          <p className="text-gray-400 text-sm">Cartera Total</p>
          <p className="text-2xl font-bold text-white mt-2">
            ${(stats.totalPortfolio / 1000000).toFixed(1)}M
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-gradient-to-br from-emerald-600/40 to-emerald-600/20 border border-white/10 rounded-lg p-4"
        >
          <p className="text-gray-400 text-sm">Tasa Recaudo</p>
          <p className="text-2xl font-bold text-emerald-400 mt-2">{stats.collectionRate}%</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-gradient-to-br from-red-600/40 to-red-600/20 border border-white/10 rounded-lg p-4"
        >
          <p className="text-gray-400 text-sm">Morosos</p>
          <p className="text-2xl font-bold text-red-400 mt-2">{stats.uniqueDefaulters}</p>
          <p className="text-xs text-red-400/70 mt-1">${(stats.overdueAmount / 1000000).toFixed(1)}M vencido</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-gradient-to-br from-amber-600/40 to-amber-600/20 border border-white/10 rounded-lg p-4"
        >
          <p className="text-gray-400 text-sm">Pendientes</p>
          <p className="text-2xl font-bold text-amber-400 mt-2">
            ${(stats.pendingTotal / 1000000).toFixed(1)}M
          </p>
        </motion.div>
      </div>

      {/* Actions Bar */}
      <div className="flex flex-wrap gap-3">
        <Button
          onClick={handleExportPortfolio}
          variant="outline"
          className="flex items-center gap-2 border-white/20"
        >
          <Download className="w-4 h-4" />
          Exportar Cartera
        </Button>
        <div className="flex-1 flex items-center gap-2 bg-white/5 border border-white/10 rounded px-3">
          <Filter className="w-4 h-4 text-gray-400" />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as any)}
            className="flex-1 bg-transparent text-white text-sm py-2 outline-none"
          >
            <option value="all">Todos los estados</option>
            <option value="paid">Pagados</option>
            <option value="pending">Pendientes</option>
            <option value="overdue">Vencidos</option>
            <option value="partial">Parciales</option>
          </select>
        </div>
      </div>

      {/* Payments List */}
      <div className="space-y-3">
        <h3 className="text-lg font-semibold text-white">
          Registros: {filteredPayments.length} resultados
        </h3>
        <div className="space-y-2 max-h-96 overflow-y-auto pr-2">
          <AnimatePresence mode="popLayout">
            {filteredPayments.map((payment, idx) => {
              const statusCfg = STATUS_CONFIG[payment.status];
              const unit = getUnitById(payment.unitId);
              const isExpanded = expandedId === payment.id;

              return (
                <motion.div
                  key={payment.id}
                  layout
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  transition={{ delay: idx * 0.03 }}
                  className="bg-white/5 border border-white/10 rounded-lg p-4 hover:bg-white/10 transition"
                >
                  <div className="flex items-start justify-between cursor-pointer" onClick={() => setExpandedId(isExpanded ? null : payment.id)}>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="font-semibold text-white">
                          Unidad {unit?.tower}-{unit?.number} • {payment.concept}
                        </h4>
                        <span className={`px-2 py-1 rounded text-xs font-medium flex items-center gap-1 ${statusCfg.bg} ${statusCfg.text}`}>
                          {statusCfg.icon} {statusCfg.label}
                        </span>
                      </div>
                      <p className="text-gray-400 text-sm">Mes: {payment.month}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-bold text-white">${payment.amount.toLocaleString('es-CO')}</p>
                      <p className="text-xs text-gray-400">
                        Vence: {new Date(payment.dueDate).toLocaleDateString('es-CO')}
                      </p>
                    </div>
                  </div>

                  {/* Expanded Details */}
                  <AnimatePresence>
                    {isExpanded && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="mt-4 pt-4 border-t border-white/10 space-y-3"
                      >
                        <div className="grid grid-cols-2 gap-3 text-sm">
                          <div>
                            <p className="text-gray-400">Monto Original</p>
                            <p className="text-white font-semibold">${payment.amount.toLocaleString('es-CO')}</p>
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
                            <>
                              <div>
                                <p className="text-gray-400">Pagado</p>
                                <p className="text-blue-400 font-semibold">${(payment.paidAmount || 0).toLocaleString('es-CO')}</p>
                              </div>
                              <div>
                                <p className="text-gray-400">Pendiente</p>
                                <p className="text-amber-400 font-semibold">
                                  ${(payment.amount - (payment.paidAmount || 0)).toLocaleString('es-CO')}
                                </p>
                              </div>
                            </>
                          )}
                        </div>

                        {/* Action Buttons */}
                        {(payment.status === 'overdue' || payment.status === 'pending') && (
                          <div className="flex flex-wrap gap-2">
                            <Button
                              size="sm"
                              variant="outline"
                              className="flex-1 text-blue-400 border-blue-500/50 hover:bg-blue-500/20"
                              onClick={() => handleCreatePaymentAgreement(payment.id)}
                            >
                              Crear Acuerdo
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              className="flex-1 text-amber-400 border-amber-500/50 hover:bg-amber-500/20"
                              onClick={() => handleSendNotification(payment.unitId)}
                            >
                              Notificar
                            </Button>
                          </div>
                        )}

                        {payment.status === 'paid' && (
                          <Button
                            size="sm"
                            variant="outline"
                            className="w-full text-emerald-400 border-emerald-500/50 hover:bg-emerald-500/20 flex items-center justify-center gap-2"
                            onClick={() => handleGenerateReceipt(payment.id)}
                          >
                            <Eye className="w-4 h-4" />
                            Ver/Descargar Recibo
                          </Button>
                        )}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      </div>

      {filteredPayments.length === 0 && (
        <div className="text-center py-8">
          <CreditCard className="w-12 h-12 mx-auto text-gray-500 mb-3" />
          <p className="text-gray-400">No hay pagos para mostrar</p>
        </div>
      )}
    </div>
  );
}
