import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAppStore, type FeeConfig } from '@/store/useAppStore';
import { useAuthStore } from '@/store/useAuthStore';
import { getAccessLevel } from '@/types/modules';
import { CreditCard, DollarSign, AlertTriangle, CheckCircle, Clock, TrendingUp, FileText, Bot, Send, Settings2, Link2, Sparkles, X, Plus, Edit2, Trash2, CheckCircle2, AlertCircle, TrendingDown, ReceiptText, Tag, Calendar, Percent, Mail, Copy, Scale, ClipboardList } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import KpiCard from '@/components/dashboard/KpiCard';
import { FloatingContainer } from '@/components/FloatingContainer';
import { PaymentModal } from '@/components/PaymentModal';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, BarChart, Bar, XAxis, YAxis, CartesianGrid, LineChart, Line } from 'recharts';

const STATUS_MAP: Record<string, { label: string; class: string; icon: React.ElementType }> = {
  paid: { label: 'Pagado', class: 'bg-emerald-500/20 text-emerald-400', icon: CheckCircle },
  pending: { label: 'Pendiente', class: 'bg-amber-500/20 text-amber-400', icon: Clock },
  overdue: { label: 'Vencido', class: 'bg-red-500/20 text-red-400', icon: AlertTriangle },
  agreement: { label: 'En Acuerdo', class: 'bg-blue-500/20 text-blue-400', icon: CreditCard },
};

const FEE_TYPE_LABELS: Record<string, string> = {
  ordinary: 'Ordinaria', extraordinary: 'Extraordinaria', special_fund: 'Fondo Especial', interest: 'Intereses',
};

const COLORS = ['#0F7A5C', '#FBBF24', '#F87171', '#2563EB'];

const MOROSIDAD_TREND = [
  { month: 'Sep', porcentaje: 22 },
  { month: 'Oct', porcentaje: 19 },
  { month: 'Nov', porcentaje: 21 },
  { month: 'Dic', porcentaje: 15 },
  { month: 'Ene', porcentaje: 17 },
  { month: 'Feb', porcentaje: 18 },
];

const PaymentsPage = () => {
  const { payments, feeConfigs, collectionActions, updatePaymentStatus, addFeeConfig, updateFeeConfig, deleteFeeConfig } = useAppStore();
  const user = useAuthStore((s) => s.user);
  const [activeTab, setActiveTab] = useState<'overview' | 'statements' | 'config' | 'collection' | 'ai'>('overview');
  const [filterUnit, setFilterUnit] = useState('all');
  const [showModal, setShowModal] = useState(false);
  const [editingFee, setEditingFee] = useState<FeeConfig | null>(null);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [selectedPaymentId, setSelectedPaymentId] = useState<string | null>(null);
  const [paymentRate, setPaymentRate] = useState(80); // Interactive slider for IA

  // Fee Form
  const [feeName, setFeeName] = useState('');
  const [feeType, setFeeType] = useState<FeeConfig['type']>('ordinary');
  const [feeAmount, setFeeAmount] = useState('');
  const [feeFreq, setFeeFreq] = useState<FeeConfig['frequency']>('monthly');
  const [feeDesc, setFeeDesc] = useState('');
  const [feeDueDay, setFeeDueDay] = useState('15');
  const [feeInterest, setFeeInterest] = useState('2.0');

  const roleId = user?.roleId ?? 'propietario';
  const accessLevel = getAccessLevel('payments', roleId);
  const canPay = roleId === 'propietario';
  const isAdmin = accessLevel === 'FULL_ACCESS';

  const totalPaid = payments.filter(p => p.status === 'paid').reduce((a, p) => a + p.amount, 0);
  const totalPending = payments.filter(p => p.status !== 'paid').reduce((a, p) => a + p.balance, 0);
  const totalInterest = payments.reduce((a, p) => a + p.interest, 0);
  const overdue = payments.filter(p => p.status === 'overdue').length;
  const overdueUnits = [...new Set(payments.filter(p => p.status === 'overdue').map(p => p.unit))];

  const pieData = [
    { name: 'Pagado', value: payments.filter(p => p.status === 'paid').length },
    { name: 'Pendiente', value: payments.filter(p => p.status === 'pending').length },
    { name: 'Vencido', value: payments.filter(p => p.status === 'overdue').length },
    { name: 'Acuerdo', value: payments.filter(p => p.status === 'agreement').length },
  ];

  const units = [...new Set(payments.map(p => p.unit))];
  const filteredPayments = filterUnit === 'all' ? payments : payments.filter(p => p.unit === filterUnit);

  const handlePay = (id: string) => {
    setSelectedPaymentId(id);
    setShowPaymentModal(true);
  };

  const handlePaymentMethodSelected = (method: string) => {
    if (selectedPaymentId) {
      updatePaymentStatus(selectedPaymentId, 'paid');
      toast({ title: 'Pago Realizado', description: `Pago procesado via ${method} exitosamente (simulado)`, variant: 'default' });
      setShowPaymentModal(false);
      setSelectedPaymentId(null);
    }
  };

  const handleGenerateLink = (id: string) => {
    toast({ title: 'Link de Pago', description: `Link generado: pay.bunty.co/p/${id} (simulado)`, variant: 'default' });
  };

  const openFeeModal = (fee?: FeeConfig) => {
    if (fee) {
      setEditingFee(fee);
      setFeeName(fee.name); setFeeType(fee.type); setFeeAmount(String(fee.amount));
      setFeeFreq(fee.frequency); setFeeDesc(fee.description); setFeeDueDay(String(fee.dueDay)); setFeeInterest(String(fee.interestRate));
    } else {
      setEditingFee(null);
      setFeeName(''); setFeeType('ordinary'); setFeeAmount('');
      setFeeFreq('monthly'); setFeeDesc(''); setFeeDueDay('15'); setFeeInterest('2.0');
    }
    setShowModal(true);
  };

  const handleSaveFee = () => {
    if (!feeName) return;
    const data = {
      name: feeName, type: feeType, amount: Number(feeAmount), frequency: feeFreq,
      description: feeDesc, active: true, dueDay: Number(feeDueDay), interestRate: Number(feeInterest),
    };
    if (editingFee) {
      updateFeeConfig(editingFee.id, data);
      toast({ title: 'Actualizada', description: 'Configuración de cuota actualizada', variant: 'default' });
    } else {
      addFeeConfig({ ...data, id: `FC${Date.now()}` });
      toast({ title: 'Creada', description: 'Nueva cuota configurada', variant: 'default' });
    }
    setShowModal(false);
  };

  return (
    <div>
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mb-6">
        <h1 className="text-2xl md:text-3xl font-bold text-foreground flex items-center gap-3">
          <CreditCard className="icon-responsive-lg text-primary" /> Pagos y Cartera
        </h1>
      </motion.div>

      {/* KPIs */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
        <KpiCard title="Recaudado" value={Math.round(totalPaid / 1000)} prefix="$" suffix="K" icon={<DollarSign className="w-5 h-5" />} delay={0} />
        <KpiCard title="Por Cobrar" value={Math.round(totalPending / 1000)} prefix="$" suffix="K" icon={<Clock className="w-5 h-5" />} delay={100} />
        <KpiCard title="Intereses" value={Math.round(totalInterest / 1000)} prefix="$" suffix="K" icon={<TrendingUp className="w-5 h-5" />} delay={200} />
        <KpiCard title="Vencidos" value={overdue} icon={<AlertTriangle className="w-5 h-5" />} trend={{ value: 15, positive: false }} delay={300} />
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-4 overflow-x-auto">
        {[
          { id: 'overview', label: 'Estado de Cuenta', icon: FileText },
          ...(isAdmin ? [{ id: 'config', label: 'Cuotas', icon: Settings2 }] : []),
          ...(isAdmin ? [{ id: 'collection', label: 'Cobranza', icon: Send }] : []),
          ...(isAdmin ? [{ id: 'ai', label: 'IA Financiera', icon: Bot }] : []),
        ].map(tab => (
          <button key={tab.id} onClick={() => setActiveTab(tab.id as any)} className={`px-4 py-2 rounded-xl text-sm font-medium transition-colors whitespace-nowrap flex items-center gap-2 ${activeTab === tab.id ? 'bg-primary/20 text-primary' : 'text-muted-foreground hover:text-foreground'}`}>
            <tab.icon className="w-4 h-4" />{tab.label}
          </button>
        ))}
      </div>

      {activeTab === 'config' ? (
        <>
          {/* Header */}
          <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="bg-white rounded-xl border border-black/8 shadow-sm-static p-6 rounded-xl mb-6">
            <div className="flex items-start justify-between">
              <div>
                <h2 className="text-xl font-bold text-foreground flex items-center gap-2 mb-2">
                  <Settings2 className="w-5 h-5 text-primary" /> Configuración de Cuotas
                </h2>
                <p className="text-sm text-muted-foreground">Define los tipos de cuotas, frecuencias de pago, intereses y montos para la administración</p>
              </div>
              <button onClick={() => openFeeModal()} className="btn-premium px-4 py-2.5 rounded-xl text-sm font-medium flex items-center gap-2 whitespace-nowrap">
                <Plus className="w-4 h-4" /> Nueva Cuota
              </button>
            </div>
          </motion.div>

          {/* Fee Cards Grid */}
          {feeConfigs.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {feeConfigs.map((fc, idx) => (
                <motion.div
                  key={fc.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.05 }}
                  className={`p-4 rounded-xl border transition-all ${fc.active ? 'bg-[rgba(255,255,255,0.05)] border-[rgba(255,255,255,0.1)] hover:border-primary/50' : 'bg-[rgba(255,255,255,0.02)] border-[rgba(255,255,255,0.04)] opacity-60'}`}
                >
                  {/* Top - Name and Status */}
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <h3 className="text-sm font-bold text-foreground">{fc.name}</h3>
                      <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{fc.description}</p>
                    </div>
                    <span className={`px-2 py-1 rounded-lg text-xs font-medium whitespace-nowrap ml-2 ${fc.active ? 'bg-emerald-500/20 text-emerald-400' : 'bg-gray-500/20 text-gray-400'}`}>
                      {fc.active ? 'Activa' : 'Inactiva'}
                    </span>
                  </div>

                  {/* Middle - Type and Frequency Tags */}
                  <div className="flex flex-wrap gap-2 mb-3">
                    <span className={`px-2.5 py-1 rounded-lg text-xs font-semibold ${
                      fc.type === 'ordinary' ? 'bg-blue-500/20 text-blue-400' :
                      fc.type === 'extraordinary' ? 'bg-amber-500/20 text-amber-400' :
                      'bg-violet-500/20 text-violet-400'
                    }`}>
                      {FEE_TYPE_LABELS[fc.type]}
                    </span>
                    <span className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-gray-500/20 text-gray-400 flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      {fc.frequency === 'monthly' ? 'Mensual' : fc.frequency === 'quarterly' ? 'Trimestral' : fc.frequency === 'annual' ? 'Anual' : 'Única'}
                    </span>
                  </div>

                  {/* Info Grid */}
                  <div className="grid grid-cols-2 gap-3 mb-3 pb-3 border-b border-[rgba(255,255,255,0.06)]">
                    <div className="p-3 rounded-lg bg-[rgba(255,255,255,0.03)]">
                      <p className="text-xs text-muted-foreground mb-1">Monto</p>
                      {fc.amount > 0 ? (
                        <p className="font-bold text-foreground text-sm">${fc.amount.toLocaleString()}</p>
                      ) : (
                        <p className="text-xs text-muted-foreground italic">Por coeficiente</p>
                      )}
                    </div>
                    <div className="p-3 rounded-lg bg-[rgba(255,255,255,0.03)]">
                      <p className="text-xs text-muted-foreground mb-1">Vencimiento</p>
                      <p className="font-bold text-foreground text-sm">Día {fc.dueDay}</p>
                    </div>
                    <div className="p-3 rounded-lg bg-[rgba(255,255,255,0.03)]">
                      <p className="text-xs text-muted-foreground mb-1">Interés</p>
                      <p className="font-bold text-orange-400 text-sm">{fc.interestRate}%</p>
                    </div>
                    <div className="p-3 rounded-lg bg-[rgba(255,255,255,0.03)]">
                      <p className="text-xs text-muted-foreground mb-1">Estado</p>
                      <p className="text-sm font-semibold text-emerald-400 flex items-center gap-1"><CheckCircle2 className="w-4 h-4" /> {fc.active ? 'Activa' : 'Pausada'}</p>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => openFeeModal(fc)}
                      className="flex-1 py-2 px-3 rounded-lg text-xs font-medium text-primary hover:bg-primary/20 transition-colors flex items-center justify-center gap-1"
                    >
                      <Edit2 className="w-3.5 h-3.5" /> Editar
                    </button>
                    <button
                      onClick={() => { deleteFeeConfig(fc.id); toast({ title: 'Cuota Eliminada', variant: 'default' }); }}
                      className="flex-1 py-2 px-3 rounded-lg text-xs font-medium text-red-400 hover:bg-red-500/20 transition-colors flex items-center justify-center gap-1"
                    >
                      <Trash2 className="w-3.5 h-3.5" /> Eliminar
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>
          ) : (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-white rounded-xl border border-black/8 shadow-sm-static p-12 rounded-xl text-center">
              <Settings2 className="w-12 h-12 text-muted-foreground mx-auto mb-3 opacity-50" />
              <h3 className="text-lg font-semibold text-foreground mb-2">Sin Cuotas Configuradas</h3>
              <p className="text-sm text-muted-foreground mb-4">Crea tu primera cuota para comenzar a gestionar los pagos</p>
              <button onClick={() => openFeeModal()} className="btn-premium px-6 py-2.5 rounded-xl text-sm inline-flex items-center gap-2">
                <Plus className="w-4 h-4" /> Crear Primera Cuota
              </button>
            </motion.div>
          )}
        </>
      ) : activeTab === 'collection' ? (
        <div className="space-y-6">
          {/* Unidades en Mora */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <div className="bg-white rounded-xl border border-black/8 shadow-sm-static p-6 rounded-xl mb-4">
              <div className="flex items-center gap-2 mb-2">
                <AlertTriangle className="w-5 h-5 text-red-400" />
                <h2 className="text-lg font-bold text-foreground">Unidades en Mora</h2>
                <span className="ml-auto bg-red-500/20 text-red-400 px-3 py-1 rounded-lg text-sm font-semibold">{overdueUnits.length} unidades</span>
              </div>
              <p className="text-sm text-muted-foreground">Seguimiento de residentes con pagos vencidos y acciones de cobro necesarias</p>
            </div>

            {overdueUnits.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {overdueUnits.map((unit, idx) => {
                  const unitPayments = payments.filter(p => p.unit === unit && p.status === 'overdue');
                  const totalDebt = unitPayments.reduce((a, p) => a + p.balance, 0);
                  const daysOverdue = Math.floor(Math.random() * 120) + 15; // Simulated days
                  return (
                    <motion.div
                      key={unit}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: idx * 0.05 }}
                      className="p-4 rounded-xl bg-red-500/10 border border-red-500/30 hover:border-red-500/50 transition-all"
                    >
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <h3 className="text-sm font-bold text-foreground">Unidad {unit}</h3>
                          <p className="text-xs text-muted-foreground mt-1">{unitPayments[0]?.owner || 'Propietario'}</p>
                        </div>
                        <span className="bg-red-500/30 text-red-400 px-2 py-1 rounded-lg text-xs font-bold flex items-center gap-1"><AlertTriangle className="w-3 h-3" /> Vencido</span>
                      </div>

                      <div className="grid grid-cols-2 gap-2 mb-3 pb-3 border-b border-red-500/20">
                        <div>
                          <p className="text-xs text-muted-foreground mb-1">Saldo Pendiente</p>
                          <p className="text-sm font-bold text-red-400">${totalDebt.toLocaleString()}</p>
                        </div>
                        <div>
                          <p className="text-xs text-muted-foreground mb-1">Cuotas Vencidas</p>
                          <p className="text-sm font-bold text-foreground">{unitPayments.length}</p>
                        </div>
                        <div>
                          <p className="text-xs text-muted-foreground mb-1">Días Mora</p>
                          <p className="text-sm font-bold text-amber-400">{daysOverdue}</p>
                        </div>
                        <div>
                          <p className="text-xs text-muted-foreground mb-1">Interés Acumulado</p>
                          <p className="text-sm font-bold text-orange-400">$
                            {Math.round(totalDebt * 0.02).toLocaleString()}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <button className="flex-1 py-2 px-3 rounded-lg text-xs font-medium text-amber-400 hover:bg-amber-500/20 transition-colors flex items-center justify-center gap-1">
                          <Clock className="w-3.5 h-3.5" /> Recordatorio
                        </button>
                        <button className="flex-1 py-2 px-3 rounded-lg text-xs font-medium text-red-400 hover:bg-red-500/20 transition-colors flex items-center justify-center gap-1">
                          <FileText className="w-3.5 h-3.5" /> Carta
                        </button>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            ) : (
              <div className="bg-white rounded-xl border border-black/8 shadow-sm-static p-12 rounded-xl text-center">
                <CheckCircle2 className="w-12 h-12 text-emerald-400 mx-auto mb-3 opacity-70" />
                <h3 className="text-lg font-semibold text-foreground mb-2">¡Excelente!</h3>
                <p className="text-sm text-muted-foreground">No hay unidades en mora. La cartera está al día.</p>
              </div>
            )}
          </motion.div>

          {/* Historial de Acciones */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
            <div className="bg-white rounded-xl border border-black/8 shadow-sm-static p-6 rounded-xl mb-4">
              <div className="flex items-center gap-2 mb-2">
                <TrendingDown className="w-5 h-5 text-primary" />
                <h2 className="text-lg font-bold text-foreground">Historial de Acciones de Cobro</h2>
              </div>
              <p className="text-sm text-muted-foreground">Registro de gestiones de cobro realizadas y generadas por IA</p>
            </div>

            {collectionActions.length > 0 ? (
              <div className="space-y-3">
                {collectionActions.map((a, idx) => {
                  const typeIcons = {
                    reminder: Clock,
                    letter: FileText,
                    agreement: CreditCard,
                    legal: AlertTriangle,
                  };
                  const TypeIcon = typeIcons[a.type as keyof typeof typeIcons];
                  const colors = {
                    reminder: 'bg-amber-500/10 border-amber-500/30 hover:border-amber-500/50',
                    letter: 'bg-orange-500/10 border-orange-500/30 hover:border-orange-500/50',
                    agreement: 'bg-blue-500/10 border-blue-500/30 hover:border-blue-500/50',
                    legal: 'bg-red-500/10 border-red-500/30 hover:border-red-500/50',
                  };

                  return (
                    <motion.div
                      key={a.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.2 + idx * 0.03 }}
                      className={`p-4 rounded-xl border-2 transition-all ${colors[a.type as keyof typeof colors]}`}
                    >
                      <div className="flex items-start gap-3">
                        <div className={`p-2 rounded-lg flex-shrink-0 ${
                          a.type === 'reminder' ? 'bg-amber-500/20 text-amber-400' :
                          a.type === 'letter' ? 'bg-orange-500/20 text-orange-400' :
                          a.type === 'agreement' ? 'bg-blue-500/20 text-blue-400' :
                          'bg-red-500/20 text-red-400'
                        }`}>
                          <TypeIcon className="w-4 h-4" />
                        </div>

                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <span className={`px-2.5 py-0.5 rounded-lg text-xs font-semibold flex items-center gap-1 ${
                              a.type === 'reminder' ? 'bg-amber-500/20 text-amber-400' :
                              a.type === 'letter' ? 'bg-orange-500/20 text-orange-400' :
                              a.type === 'agreement' ? 'bg-blue-500/20 text-blue-400' :
                              'bg-red-500/20 text-red-400'
                            }`}>
                              {a.type === 'reminder' ? (
                                <><Mail className="w-3 h-3" /> Recordatorio</>
                              ) : a.type === 'letter' ? (
                                <><FileText className="w-3 h-3" /> Carta</>
                              ) : a.type === 'agreement' ? (
                                <><ClipboardList className="w-3 h-3" /> Acuerdo</>
                              ) : (
                                <><Scale className="w-3 h-3" /> Legal</>
                              )}
                            </span>
                            <span className="text-xs text-muted-foreground">Unidad {a.unit}</span>
                            {a.aiGenerated && (
                              <span className="px-1.5 py-0.5 rounded text-xs bg-violet-500/20 text-violet-400 flex items-center gap-1 ml-auto">
                                <Sparkles className="w-3 h-3" />IA
                              </span>
                            )}
                          </div>
                          <p className="text-xs text-muted-foreground mb-2">{a.description}</p>
                          <p className="text-xs text-muted-foreground flex items-center gap-1"><Calendar className="w-3 h-3" /> {a.date}</p>
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            ) : (
              <div className="bg-white rounded-xl border border-black/8 shadow-sm-static p-12 rounded-xl text-center">
                <TrendingDown className="w-12 h-12 text-muted-foreground mx-auto mb-3 opacity-50" />
                <h3 className="text-lg font-semibold text-foreground mb-2">Sin Acciones Registradas</h3>
                <p className="text-sm text-muted-foreground">Las acciones de cobro aparecerán aquí cuando se realicen.</p>
              </div>
            )}
          </motion.div>
        </div>
      ) : activeTab === 'ai' ? (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
          {/* Análisis de Sensibilidad - Slider Interactivo */}
          <motion.div className="bg-white rounded-xl border border-black/8 shadow-sm-static p-6 rounded-xl">
            <h2 className="text-lg font-bold text-foreground mb-4 flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-primary" /> Simulador Interactivo de Escenarios
            </h2>
            <p className="text-sm text-muted-foreground mb-6">Ajusta la tasa de pago para ver cómo impacta en la morosidad y el recaudo</p>

            {/* Slider */}
            <div className="mb-8">
              <div className="flex items-center justify-between mb-3">
                <label className="text-sm font-bold text-foreground">Tasa de Pago Esperada</label>
                <span className="px-4 py-1 rounded-lg bg-primary/20 text-primary font-bold">{paymentRate}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                value={paymentRate}
                onChange={(e) => setPaymentRate(Number(e.target.value))}
                className="w-full h-2 bg-[rgba(255,255,255,0.1)] rounded-lg appearance-none cursor-pointer accent-primary"
              />
              <div className="flex justify-between text-xs text-muted-foreground mt-2">
                <span>0%</span>
                <span>50%</span>
                <span>100%</span>
              </div>
            </div>

            {/* Métricas calculadas */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <div className="p-4 rounded-lg bg-[rgba(255,255,255,0.04)] border border-[rgba(255,255,255,0.08)]">
                <p className="text-xs text-muted-foreground mb-2">Recaudo Proyectado</p>
                <p className="text-2xl font-black text-primary">${((17_500_000 * paymentRate) / 100 / 1_000_000).toFixed(1)}M</p>
                <p className="text-xs text-muted-foreground mt-1">De $17.5M total</p>
              </div>
              <div className="p-4 rounded-lg bg-[rgba(255,255,255,0.04)] border border-[rgba(255,255,255,0.08)]">
                <p className="text-xs text-muted-foreground mb-2">Morosidad Proyectada</p>
                <p className={`text-2xl font-black ${paymentRate >= 85 ? 'text-emerald-400' : paymentRate >= 70 ? 'text-amber-400' : 'text-red-400'}`}>
                  {Math.max(0, 25 - (paymentRate - 65) * 0.35).toFixed(1)}%
                </p>
                <p className="text-xs text-muted-foreground mt-1">De mora en cartera</p>
              </div>
              <div className="p-4 rounded-lg bg-[rgba(255,255,255,0.04)] border border-[rgba(255,255,255,0.08)]">
                <p className="text-xs text-muted-foreground mb-2">Riesgo de Impago</p>
                <p className={`text-2xl font-black ${paymentRate >= 85 ? 'text-emerald-400' : paymentRate >= 70 ? 'text-amber-400' : 'text-red-400'}`}>
                  {Math.max(0, 35 - paymentRate * 0.25).toFixed(0)}%
                </p>
                <p className="text-xs text-muted-foreground mt-1">Unidades potenciales</p>
              </div>
            </div>

            {/* Gráfico de Trend */}
            <div className="p-4 rounded-lg bg-[rgba(255,255,255,0.04)] border border-[rgba(255,255,255,0.08)]">
              <h4 className="text-sm font-bold text-foreground mb-4">Proyección Mensual (Últimos 6 Meses)</h4>
              <ResponsiveContainer width="100%" height={240}>
                <LineChart
                  data={[
                    { month: 'Sep', morosidad: 22, recaudo: 13.2 },
                    { month: 'Oct', morosidad: 19, recaudo: 14.1 },
                    { month: 'Nov', morosidad: 21, recaudo: 13.8 },
                    { month: 'Dic', morosidad: 15, recaudo: 14.9 },
                    { month: 'Ene', morosidad: 17, recaudo: 14.5 },
                    { month: 'Feb', morosidad: 18, recaudo: 14.3 },
                    { month: 'Mar (Proyectado)', morosidad: Math.max(0, 25 - (paymentRate - 65) * 0.35), recaudo: (17_500_000 * paymentRate) / 100 / 1_000_000 },
                  ]}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                  <XAxis dataKey="month" tick={{ fill: '#94A3B8', fontSize: 11 }} />
                  <YAxis yAxisId="left" tick={{ fill: '#94A3B8', fontSize: 11 }} label={{ value: 'Morosidad %', angle: -90, position: 'insideLeft' }} />
                  <YAxis yAxisId="right" orientation="right" tick={{ fill: '#94A3B8', fontSize: 11 }} label={{ value: 'Recaudo (M)', angle: 90, position: 'insideRight' }} />
                  <Tooltip
                    contentStyle={{ background: 'rgba(15,23,42,0.95)', border: '1px solid rgba(255,255,255,0.2)', borderRadius: 12 }}
                    formatter={(value: any, name: string) => [
                      name === 'morosidad' ? `${value.toFixed(1)}%` : `$${value.toFixed(1)}M`,
                      name === 'morosidad' ? 'Morosidad' : 'Recaudo',
                    ]}
                  />
                  <Line yAxisId="left" type="monotone" dataKey="morosidad" stroke="#F87171" strokeWidth={2.5} dot={{ r: 4 }} name="Morosidad" />
                  <Line yAxisId="right" type="monotone" dataKey="recaudo" stroke="#10B981" strokeWidth={2.5} dot={{ r: 4 }} name="Recaudo" />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </motion.div>

          {/* Predicción de Morosidad */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-white rounded-[12px] border border-[#E5E7EB] p-6 shadow-sm">
              <h3 className="text-sm font-semibold text-foreground mb-1 flex items-center gap-2">
                <Bot className="w-4 h-4 text-primary" /> Predicción IA de Morosidad
              </h3>
              <p className="text-xs text-muted-foreground mb-4">Análisis de tendencia con proyecciones inteligentes</p>
              <ResponsiveContainer width="100%" height={200}>
                <LineChart data={MOROSIDAD_TREND}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.16)" />
                  <XAxis dataKey="month" tick={{ fill: '#94A3B8', fontSize: 12 }} />
                  <YAxis tick={{ fill: '#94A3B8', fontSize: 12 }} />
                  <Tooltip contentStyle={{ background: 'rgba(15,23,42,0.9)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 12, color: '#fff' }} formatter={(v) => `${v}%`} />
                  <Line type="monotone" dataKey="porcentaje" stroke="#F87171" strokeWidth={2.5} dot={{ fill: '#F87171', r: 5 }} activeDot={{ r: 7 }} />
                </LineChart>
              </ResponsiveContainer>
              <div className="mt-3 p-3 rounded-xl bg-[rgba(255,255,255,0.04)]">
                <p className="text-xs text-muted-foreground">
                  <strong><CheckCircle className="w-4 h-4 inline mr-1" /> IA Predicción:</strong> La morosidad estimada para marzo 2026 con {paymentRate}% de tasa de pago sería{' '}
                  <strong className={paymentRate >= 85 ? 'text-emerald-400' : paymentRate >= 70 ? 'text-amber-400' : 'text-red-400'}>
                    {Math.max(0, 25 - (paymentRate - 65) * 0.35).toFixed(1)}%
                  </strong>
                  . Se recomienda{' '}
                  {paymentRate >= 85 ? 'mantener' : paymentRate >= 70 ? 'intensificar' : 'aumentar urgentemente'} acciones preventivas.
                </p>
              </div>
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="bg-white rounded-[12px] border border-[#E5E7EB] p-6 shadow-sm">
              <h3 className="text-sm font-semibold text-foreground mb-4 flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-primary" /> Recomendaciones Inteligentes
              </h3>
              <div className="space-y-3">
                {paymentRate >= 85 ? (
                  <div className="p-3 rounded-xl bg-emerald-500/20 border border-emerald-500/30">
                    <p className="text-sm font-medium text-foreground flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-emerald-400" /> Excelente Desempeño
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">La cartera está saludable. Mantén el monitoreo preventivo y considera reducir insistencia de cobro.</p>
                  </div>
                ) : paymentRate >= 70 ? (
                  <div className="p-3 rounded-xl bg-amber-500/20 border border-amber-500/30">
                    <p className="text-sm font-medium text-foreground flex items-center gap-2">
                      <AlertCircle className="w-4 h-4 text-amber-400" /> Riesgo Moderado
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">Aumenta frecuencia de recordatorios y automatiza segunda notificación para unidades en riesgo.</p>
                  </div>
                ) : (
                  <div className="p-3 rounded-xl bg-red-500/20 border border-red-500/30">
                    <p className="text-sm font-medium text-foreground flex items-center gap-2">
                      <AlertTriangle className="w-4 h-4 text-red-400" /> Riesgo Alto
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">Activa protocolos de cobro legal inmediato. Escalada a revisión jurídica recomendada.</p>
                  </div>
                )}

                <div className="p-3 rounded-xl bg-blue-500/20 border border-blue-500/30">
                  <p className="text-sm font-medium text-foreground flex items-center gap-2">
                    <TrendingUp className="w-4 h-4 text-blue-400" /> Plan Sugerido para Unidad 203
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">4 cuotas de $405.600 desde marzo. Probabilidad de cumplimiento: {Math.min(95, 60 + paymentRate * 0.35).toFixed(0)}%</p>
                </div>

                <button className="w-full py-2 rounded-lg bg-primary/20 text-primary hover:bg-primary/30 text-xs font-medium transition-colors mt-2">
                  <span className="inline-flex items-center gap-2">
                    <Download className="h-3.5 w-3.5" />
                    Exportar Análisis Completo
                  </span>
                </button>
              </div>
            </motion.div>
          </div>
        </motion.div>
      ) : (
        <>
          {/* Filtros y Gráficos */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
            {/* Selector de unidad */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-white rounded-xl border border-black/8 shadow-sm-static p-6 rounded-xl">
              <h3 className="text-sm font-bold text-foreground uppercase tracking-wider mb-4">Filtrar por Unidad</h3>
              <select value={filterUnit} onChange={(e) => setFilterUnit(e.target.value)} className="w-full h-12 px-4 rounded-lg bg-[rgba(255,255,255,0.08)] border border-[rgba(255,255,255,0.1)] text-foreground font-medium focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20">
                <option value="all">Todas las unidades</option>
                {units.map(u => (
                  <option key={u} value={u}>Unidad {u}</option>
                ))}
              </select>
            </motion.div>

            {/* Gráfico de tarta - Estado de cuentas */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="bg-white rounded-xl border border-black/8 shadow-sm-static p-6 rounded-xl">
              <h3 className="text-sm font-bold text-foreground uppercase tracking-wider mb-4">Distribución de Pagos</h3>
              <ResponsiveContainer width="100%" height={180}>
                <PieChart>
                  <Pie data={pieData} cx="50%" cy="50%" innerRadius={50} outerRadius={75} paddingAngle={4} dataKey="value">
                    {COLORS.map((color, index) => (
                      <Cell key={`cell-${index}`} fill={color} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(v) => `${v} cuota(s)`} contentStyle={{ background: 'rgba(15,23,42,0.9)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 12, color: '#fff' }} />
                </PieChart>
              </ResponsiveContainer>
              <div className="mt-4 space-y-2 text-xs">
                {pieData.map((item, i) => (
                  <div key={i} className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[i] }} />
                    <span className="text-muted-foreground">{item.name}: {item.value}</span>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Resumen rápido */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="bg-white rounded-xl border border-black/8 shadow-sm-static p-6 rounded-xl">
              <h3 className="text-sm font-bold text-foreground uppercase tracking-wider mb-4">Resumen Rápido</h3>
              <div className="space-y-3">
                <div className="p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/20">
                  <p className="text-xs text-muted-foreground">Pagado</p>
                  <p className="text-lg font-black text-emerald-400">${(totalPaid / 1000000).toFixed(1)}M</p>
                </div>
                <div className="p-3 rounded-lg bg-amber-500/10 border border-amber-500/20">
                  <p className="text-xs text-muted-foreground">Por Cobrar</p>
                  <p className="text-lg font-black text-amber-400">${(totalPending / 1000000).toFixed(1)}M</p>
                </div>
                <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20">
                  <p className="text-xs text-muted-foreground">Vencidos</p>
                  <p className="text-lg font-black text-red-400">{overdue}</p>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Tabla de Estado de Cuenta - Rediseñada */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="bg-white rounded-xl border border-black/8 shadow-sm-static rounded-xl overflow-hidden">
            <div className="p-6 border-b border-[rgba(255,255,255,0.1)]">
              <h3 className="text-lg font-bold text-foreground">Estado de Cuenta Detallado</h3>
            </div>

            {/* Desktop Table View */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-[rgba(255,255,255,0.06)] bg-[rgba(255,255,255,0.02)]">
                    <th className="text-left p-4 font-bold text-foreground">Unidad</th>
                    <th className="text-left p-4 font-bold text-foreground">Concepto</th>
                    <th className="text-left p-4 font-bold text-foreground">Tipo</th>
                    <th className="text-right p-4 font-bold text-foreground">Monto</th>
                    <th className="text-right p-4 font-bold text-foreground">Intereses</th>
                    <th className="text-right p-4 font-bold text-foreground">Saldo</th>
                    <th className="text-center p-4 font-bold text-foreground">Estado</th>
                    <th className="text-center p-4 font-bold text-foreground">Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredPayments.map((p, idx) => {
                    const st = STATUS_MAP[p.status];
                    const formatAmount = (amount: number) => {
                      if (isAdmin && amount >= 1000000) return `$${(amount / 1000000).toFixed(1)}M`;
                      return `$${amount.toLocaleString()}`;
                    };
                    return (
                      <motion.tr
                        key={p.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: idx * 0.05 }}
                        className="border-b border-[rgba(255,255,255,0.04)] hover:bg-[rgba(255,255,255,0.05)] transition-colors"
                      >
                        <td className="p-4">
                          <span className="font-bold text-foreground">Apto {p.unit}</span>
                        </td>
                        <td className="p-4 text-muted-foreground">{p.concept}</td>
                        <td className="p-4">
                          <span className={`px-2.5 py-1 rounded-lg text-xs font-semibold ${
                            p.feeType === 'ordinary' ? 'bg-blue-500/20 text-blue-400' :
                            p.feeType === 'extraordinary' ? 'bg-amber-500/20 text-amber-400' :
                            'bg-violet-500/20 text-violet-400'
                          }`}>
                            {FEE_TYPE_LABELS[p.feeType]}
                          </span>
                        </td>
                        <td className="p-4 text-right font-bold text-foreground">{formatAmount(p.amount)}</td>
                        <td className="p-4 text-right">
                          {p.interest > 0 ? (
                            <span className="text-orange-400 font-semibold">{formatAmount(p.interest)}</span>
                          ) : (
                            <span className="text-muted-foreground">-</span>
                          )}
                        </td>
                        <td className="p-4 text-right font-bold">
                          {p.balance > 0 ? (
                            <span className={p.status === 'overdue' ? 'text-red-400' : 'text-amber-400'}>
                              {formatAmount(p.balance)}
                            </span>
                          ) : (
                            <span className="text-emerald-400 flex items-center gap-1"><CheckCircle className="w-4 h-4" /> Pagado</span>
                          )}
                        </td>
                        <td className="p-4 text-center">
                          <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold border ${st.class}`}>
                            <st.icon className="w-3.5 h-3.5" />
                            {st.label}
                          </span>
                        </td>
                        <td className="p-4 text-center">
                          <div className="flex items-center justify-center gap-2">
                            {canPay && p.status !== 'paid' && (
                              <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={() => handlePay(p.id)}
                                className="px-4 py-2 rounded-lg bg-primary text-white font-bold text-xs hover:bg-primary/90 transition-colors"
                              >
                                Pagar
                              </motion.button>
                            )}
                            {isAdmin && p.status !== 'paid' && (
                              <motion.button
                                whileHover={{ scale: 1.1 }}
                                onClick={() => handleGenerateLink(p.id)}
                                className="p-2 rounded-lg hover:bg-primary/20 text-primary transition-colors"
                                title="Generar link de pago"
                              >
                                <Link2 className="w-4 h-4" />
                              </motion.button>
                            )}
                          </div>
                        </td>
                      </motion.tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Mobile Card View */}
            <div className="md:hidden space-y-3 p-4">
              {filteredPayments.map((p, idx) => {
                const st = STATUS_MAP[p.status];
                return (
                  <motion.div
                    key={p.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.05 }}
                    className="p-4 rounded-lg bg-[rgba(255,255,255,0.04)] border border-[rgba(255,255,255,0.1)] hover:border-primary/50 transition-all"
                  >
                    <div className="flex items-start justify-between gap-3 mb-3">
                      <div>
                        <p className="font-bold text-foreground">Unidad {p.unit}</p>
                        <p className="text-xs text-muted-foreground">{p.concept}</p>
                      </div>
                      <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold ${st.class}`}>
                        <st.icon className="w-3 h-3" />
                        {st.label}
                      </span>
                    </div>
                    <div className="grid grid-cols-3 gap-2 mb-3 text-xs">
                      <div className="p-2 rounded-lg bg-[rgba(255,255,255,0.05)]">
                        <p className="text-muted-foreground">Monto</p>
                        <p className="font-bold text-foreground">${p.amount.toLocaleString()}</p>
                      </div>
                      <div className="p-2 rounded-lg bg-[rgba(255,255,255,0.05)]">
                        <p className="text-muted-foreground">Interés</p>
                        <p className="font-bold text-orange-400">{p.interest > 0 ? `$${p.interest.toLocaleString()}` : '-'}</p>
                      </div>
                      <div className="p-2 rounded-lg bg-[rgba(255,255,255,0.05)]">
                        <p className="text-muted-foreground">Saldo</p>
                        <p className="font-bold text-amber-400">${p.balance.toLocaleString()}</p>
                      </div>
                    </div>
                    {canPay && p.status !== 'paid' && (
                      <button
                        onClick={() => handlePay(p.id)}
                        className="w-full py-2 rounded-lg bg-primary text-white font-bold text-xs hover:bg-primary/90 transition-colors"
                      >
                        Realizar Pago
                      </button>
                    )}
                  </motion.div>
                );
              })}
            </div>
          </motion.div>
        </>
      )}

      {/* Fee Modal */}
      {/* Create/Edit Modal */}
      <FloatingContainer
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        title={editingFee ? 'Editar Cuota' : 'Nueva Cuota'}
        icon={<CreditCard className="w-5 h-5" />}
        size="md"
      >
        <div className="space-y-5">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <ReceiptText className="w-4 h-4 text-[#0F7A5C]" />
              <label className="block text-sm font-bold text-gray-800">Nombre Concepto *</label>
            </div>
            <input
              value={feeName}
              onChange={e => setFeeName(e.target.value)}
              placeholder="Ej: Cuota Extraordinaria"
              className="w-full px-4 py-3 rounded-xl bg-white border border-gray-200 hover:border-gray-300
                text-gray-900 placeholder-gray-400 font-medium
                focus:outline-none focus:ring-2 focus:ring-offset-0 focus:ring-[#1b4a3a]
                focus:border-[#1b4a3a] focus:bg-white/95
                transition-all duration-200 shadow-sm hover:shadow-md"
            />
          </div>

          <div>
            <div className="flex items-center gap-2 mb-2">
              <FileText className="w-4 h-4 text-[#0F7A5C]" />
              <label className="block text-sm font-bold text-gray-800">Descripción</label>
            </div>
            <input
              value={feeDesc}
              onChange={e => setFeeDesc(e.target.value)}
              placeholder="Descripción corta"
              className="w-full px-4 py-3 rounded-xl bg-white border border-gray-200 hover:border-gray-300
                text-gray-900 placeholder-gray-400 font-medium
                focus:outline-none focus:ring-2 focus:ring-offset-0 focus:ring-[#1b4a3a]
                focus:border-[#1b4a3a] focus:bg-white/95
                transition-all duration-200 shadow-sm hover:shadow-md"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <DollarSign className="w-4 h-4 text-[#0F7A5C]" />
                <label className="block text-sm font-bold text-gray-800">Monto</label>
              </div>
              <input
                type="number"
                value={feeAmount}
                onChange={e => setFeeAmount(e.target.value)}
                placeholder="0 (Coeficiente)"
                className="w-full px-4 py-3 rounded-xl bg-white border border-gray-200 hover:border-gray-300
                  text-gray-900 placeholder-gray-400 font-medium
                  focus:outline-none focus:ring-2 focus:ring-offset-0 focus:ring-[#1b4a3a]
                  focus:border-[#1b4a3a] focus:bg-white/95
                  transition-all duration-200 shadow-sm hover:shadow-md"
              />
            </div>

            <div>
              <div className="flex items-center gap-2 mb-2">
                <Tag className="w-4 h-4 text-[#0F7A5C]" />
                <label className="block text-sm font-bold text-gray-800">Tipo</label>
              </div>
              <select
                value={feeType}
                onChange={e => setFeeType(e.target.value as any)}
                className="w-full px-3 py-3 rounded-xl bg-white border border-gray-200 hover:border-gray-300
                  text-gray-900 font-medium
                  focus:outline-none focus:ring-2 focus:ring-offset-0 focus:ring-[#1b4a3a]
                  focus:border-[#1b4a3a]
                  transition-all duration-200 shadow-sm"
              >
                <option value="ordinary">Ordinaria</option>
                <option value="extraordinary">Extraordinaria</option>
                <option value="special_fund">Fondo Especial</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Calendar className="w-4 h-4 text-[#0F7A5C]" />
                <label className="block text-sm font-bold text-gray-800">Frecuencia</label>
              </div>
              <select
                value={feeFreq}
                onChange={e => setFeeFreq(e.target.value as any)}
                className="w-full px-3 py-3 rounded-xl bg-white border border-gray-200 hover:border-gray-300
                  text-gray-900 font-medium
                  focus:outline-none focus:ring-2 focus:ring-offset-0 focus:ring-[#1b4a3a]
                  focus:border-[#1b4a3a]
                  transition-all duration-200 shadow-sm"
              >
                <option value="monthly">Mensual</option>
                <option value="quarterly">Trimestral</option>
                <option value="annual">Anual</option>
                <option value="one_time">Única vez</option>
              </select>
            </div>

            <div>
              <div className="flex items-center gap-2 mb-2">
                <Calendar className="w-4 h-4 text-[#0F7A5C]" />
                <label className="block text-sm font-bold text-gray-800">Día Pago</label>
              </div>
              <input
                type="number"
                value={feeDueDay}
                onChange={e => setFeeDueDay(e.target.value)}
                className="w-full px-4 py-3 rounded-xl bg-white border border-gray-200 hover:border-gray-300
                  text-gray-900 placeholder-gray-400 font-medium
                  focus:outline-none focus:ring-2 focus:ring-offset-0 focus:ring-[#1b4a3a]
                  focus:border-[#1b4a3a] focus:bg-white/95
                  transition-all duration-200 shadow-sm hover:shadow-md"
              />
            </div>

            <div>
              <div className="flex items-center gap-2 mb-2">
                <Percent className="w-4 h-4 text-[#0F7A5C]" />
                <label className="block text-sm font-bold text-gray-800">Interés %</label>
              </div>
              <input
                type="number"
                step="0.1"
                value={feeInterest}
                onChange={e => setFeeInterest(e.target.value)}
                className="w-full px-4 py-3 rounded-xl bg-white border border-gray-200 hover:border-gray-300
                  text-gray-900 placeholder-gray-400 font-medium
                  focus:outline-none focus:ring-2 focus:ring-offset-0 focus:ring-[#1b4a3a]
                  focus:border-[#1b4a3a] focus:bg-white/95
                  transition-all duration-200 shadow-sm hover:shadow-md"
              />
            </div>
          </div>

          <div className="flex gap-3 pt-4 border-t border-gray-200">
            <motion.button
              whileHover={{ scale: 1.03, y: -2 }}
              whileTap={{ scale: 0.97 }}
              type="button"
              onClick={() => setShowModal(false)}
              className="flex-1 px-5 py-3 rounded-xl font-semibold
                bg-gray-100 hover:bg-gray-200 text-gray-800
                transition-all duration-200 shadow-sm hover:shadow-md"
            >
              Cancelar
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.03, y: -2 }}
              whileTap={{ scale: 0.97 }}
              onClick={handleSaveFee}
              className="flex-1 px-5 py-3 rounded-xl font-semibold text-white
                bg-gradient-to-r from-[#1b4a3a] to-[#0f3429] hover:from-[#0f3429] hover:to-[#082820]
                shadow-lg hover:shadow-xl
                transition-all duration-200"
            >
              {editingFee ? 'Guardar Cambios' : 'Crear Cuota'}
            </motion.button>
          </div>
        </div>
      </FloatingContainer>

      {/* Payment Modal */}
      {selectedPaymentId && (
        <PaymentModal
          isOpen={showPaymentModal}
          onClose={() => {
            setShowPaymentModal(false);
            setSelectedPaymentId(null);
          }}
          amount={payments.find(p => p.id === selectedPaymentId)?.amount || 0}
          description={`Pago de cuota - ${payments.find(p => p.id === selectedPaymentId)?.unit || ''}`}
          onPaymentMethodSelected={handlePaymentMethodSelected}
        />
      )}
    </div>
  );
};

export default PaymentsPage;
