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
  paid: { bg: 'bg-green-100', text: 'text-green-800', icon: <CheckCircle2 className="w-4 h-4" />, label: 'Pagado' },
  pending: { bg: 'bg-yellow-100', text: 'text-yellow-800', icon: <AlertTriangle className="w-4 h-4" />, label: 'Pendiente' },
  overdue: { bg: 'bg-red-100', text: 'text-red-800', icon: <XCircle className="w-4 h-4" />, label: 'Vencido' },
  partial: { bg: 'bg-blue-100', text: 'text-blue-800', icon: <CreditCard className="w-4 h-4" />, label: 'Parcial' },
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
          className="bg-white border border-blue-200 rounded-xl p-4 shadow-sm hover:shadow-md transition-all"
        >
          <p className="text-sm text-muted-foreground">Cartera Total</p>
          <p className="text-2xl font-bold text-foreground mt-2">
            ${(stats.totalPortfolio / 1000000).toFixed(1)}M
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white border border-green-200 rounded-xl p-4 shadow-sm hover:shadow-md transition-all"
        >
          <p className="text-sm text-muted-foreground">Tasa Recaudo</p>
          <p className="text-2xl font-bold text-green-700 mt-2">{stats.collectionRate}%</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white border border-red-200 rounded-xl p-4 shadow-sm hover:shadow-md transition-all"
        >
          <p className="text-sm text-muted-foreground">Morosos</p>
          <p className="text-2xl font-bold text-red-700 mt-2">{stats.uniqueDefaulters}</p>
          <p className="text-xs text-red-600 mt-1">${(stats.overdueAmount / 1000000).toFixed(1)}M vencido</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white border border-amber-200 rounded-xl p-4 shadow-sm hover:shadow-md transition-all"
        >
          <p className="text-sm text-muted-foreground">Pendientes</p>
          <p className="text-2xl font-bold text-amber-700 mt-2">
            ${(stats.pendingTotal / 1000000).toFixed(1)}M
          </p>
        </motion.div>
      </div>

      {/* Actions Bar */}
      <div className="flex flex-wrap gap-3">
        <Button
          onClick={handleExportPortfolio}
          variant="outline"
          className="flex items-center gap-2"
        >
          <Download className="w-4 h-4" />
          Exportar Cartera
        </Button>
        <div className="flex-1 flex items-center gap-2 bg-white border border-gray-200 rounded-lg px-3 shadow-sm">
          <Filter className="w-4 h-4 text-muted-foreground" />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as any)}
            className="flex-1 bg-white text-foreground text-sm py-2 outline-none"
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
        <h3 className="text-lg font-semibold text-foreground">
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
                  className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-all cursor-pointer"
                  onClick={() => setExpandedId(isExpanded ? null : payment.id)}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="font-semibold text-foreground">
                          Unidad {unit?.tower}-{unit?.number} • {payment.concept}
                        </h4>
                        <span className={`px-2 py-1 rounded text-xs font-medium flex items-center gap-1 ${statusCfg.bg} ${statusCfg.text}`}>
                          {statusCfg.icon} {statusCfg.label}
                        </span>
                      </div>
                      <p className="text-sm text-muted-foreground">Mes: {payment.month}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-bold text-foreground">${payment.amount.toLocaleString('es-CO')}</p>
                      <p className="text-xs text-muted-foreground">
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
                        className="mt-4 pt-4 border-t border-gray-200 space-y-3"
                      >
                        <div className="grid grid-cols-2 gap-3 text-sm">
                          <div>
                            <p className="text-muted-foreground">Monto Original</p>
                            <p className="text-foreground font-semibold">${payment.amount.toLocaleString('es-CO')}</p>
                          </div>
                          {payment.status === 'paid' && (
                            <div>
                              <p className="text-muted-foreground">Pagado el</p>
                              <p className="text-green-700 font-semibold">
                                {payment.paidDate ? new Date(payment.paidDate).toLocaleDateString('es-CO') : 'N/A'}
                              </p>
                            </div>
                          )}
                          {payment.status === 'partial' && (
                            <>
                              <div>
                                <p className="text-muted-foreground">Pagado</p>
                                <p className="text-blue-700 font-semibold">${(payment.paidAmount || 0).toLocaleString('es-CO')}</p>
                              </div>
                              <div>
                                <p className="text-muted-foreground">Pendiente</p>
                                <p className="text-amber-700 font-semibold">
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
                              className="flex-1 text-blue-700 border-blue-200 hover:bg-blue-50"
                              onClick={() => handleCreatePaymentAgreement(payment.id)}
                            >
                              Crear Acuerdo
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              className="flex-1 text-amber-700 border-amber-200 hover:bg-amber-50"
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
                            className="w-full text-green-700 border-green-200 hover:bg-green-50 flex items-center justify-center gap-2"
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
