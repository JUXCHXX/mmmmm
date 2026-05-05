import { motion } from 'framer-motion';
import { TrendingUp, AlertCircle, CheckCircle, DollarSign, BarChart3, Lightbulb, CreditCard, Calendar, Bot } from 'lucide-react';

interface AIFinancialAnalyzserProps {
  monthlyFee: number;
  currentBalance: number;
  pendingPayments: number;
  paymentHistory: { month: string; paid: boolean; amount: number }[];
}

interface AnalysisResult {
  status: 'excellent' | 'good' | 'warning' | 'critical';
  message: string;
  tips: string[];
  nextPaymentDate: string;
  annualSpend: number;
}

export const AIFinancialAnalyzer = ({
  monthlyFee,
  currentBalance,
  pendingPayments,
  paymentHistory,
}: AIFinancialAnalyzserProps) => {
  const analyzeFinancialStatus = (): AnalysisResult => {
    const paidCount = paymentHistory.filter(p => p.paid).length;
    const paymentRate = (paidCount / paymentHistory.length) * 100;
    const annualSpend = monthlyFee * 12;

    let status: 'excellent' | 'good' | 'warning' | 'critical' = 'good';
    let message = '';
    const tips: string[] = [];

    // Determinar estado
    if (pendingPayments === 0 && paymentRate === 100) {
      status = 'excellent';
      message = '¡Excelente! Tu cuenta está al día. Mantén este ritmo.';
      tips.push('Tu histórico de pagos es impecable');
      tips.push('Considera automatizar tus pagos para evitar olvidos');
      tips.push('Mantente al día y mejora tu historial de crédito');
    } else if (pendingPayments === 0 && paymentRate >= 90) {
      status = 'good';
      message = 'Tu cuenta está en buen estado. Solo algunos pagos pendientes.';
      tips.push('Buen histórico de pagos');
      tips.push('Paga los pendientes antes del 5 del mes próximo');
      tips.push('Los pagos automáticos pueden ayudarte a mantenerte al día');
    } else if (pendingPayments > 0 && pendingPayments <= 2) {
      status = 'warning';
      message = 'Tienes pagos vencidos. Te recomendamos regularizar tu situación.';
      tips.push(`${pendingPayments} pagos pendientes requieren atención inmediata`);
      tips.push('Los intereses por mora pueden aumentar tus deudas');
      tips.push('Contacta a administración si tienes dificultades para pagar');
    } else {
      status = 'critical';
      message = 'Cuenta crítica. Debes regularizar tus pagos urgentemente.';
      tips.push('Múltiples pagos vencidos afectan tu permiso de residencia');
      tips.push('Comunícate con administración para un plan de pagos');
      tips.push('Actúa ahora para evitar sanciones legales');
    }

    return {
      status,
      message,
      tips,
      nextPaymentDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toLocaleDateString('es-CO'),
      annualSpend,
    };
  };

  const analysis = analyzeFinancialStatus();

  const statusConfig = {
    excellent: { color: 'from-emerald-500 to-green-400', bgColor: 'bg-emerald-50', borderColor: 'border-emerald-500' },
    good: { color: 'from-blue-500 to-cyan-400', bgColor: 'bg-blue-50', borderColor: 'border-blue-500' },
    warning: { color: 'from-amber-500 to-orange-400', bgColor: 'bg-amber-50', borderColor: 'border-amber-500' },
    critical: { color: 'from-red-500 to-pink-400', bgColor: 'bg-red-50', borderColor: 'border-red-500' },
  };

  const config = statusConfig[analysis.status];

  return (
    <div className="space-y-6">
      {/* Estado Actual */}
      <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className={`rounded-xl p-6 text-white bg-gradient-to-r ${config.color}`}>
        <div className="flex items-start justify-between mb-4">
          <div>
            <h3 className="text-2xl font-bold mb-1">Estado de tu Cuenta</h3>
            <p className="text-sm opacity-90">{analysis.message}</p>
          </div>
          <div className="text-4xl">
            {analysis.status === 'excellent' && <CheckCircle className="h-10 w-10" />}
            {analysis.status === 'good' && <TrendingUp className="h-10 w-10" />}
            {analysis.status === 'warning' && <AlertCircle className="h-10 w-10" />}
            {analysis.status === 'critical' && <AlertCircle className="h-10 w-10" />}
          </div>
        </div>

        {/* Barra de estado */}
        <div className="flex gap-3 text-sm">
          <div className="flex-1">
            <p className="opacity-75 mb-1">Pagos Realizados</p>
            <div className="h-2 bg-white/30 rounded-full overflow-hidden">
              <div
                className="h-full bg-white transition-all duration-500"
                style={{
                  width: `${(paymentHistory.filter(p => p.paid).length / paymentHistory.length) * 100}%`,
                }}
              />
            </div>
          </div>
          <span className="min-w-fit font-bold">
            {paymentHistory.filter(p => p.paid).length}/{paymentHistory.length}
          </span>
        </div>
      </motion.div>

      {/* Resumen Financiero */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="grid grid-cols-1 md:grid-cols-3 gap-4"
      >
        {/* Cuota Mensual */}
        <div className="p-4 rounded-lg bg-gradient-to-br from-[#0D4A3E]/5 to-[#0F7A5C]/5 border border-[#0F7A5C]/30">
          <div className="flex items-center gap-2 mb-3">
            <CreditCard className="w-5 h-5 text-[#0F7A5C]" />
            <p className="text-xs font-bold text-[#0F7A5C] uppercase">Cuota Mensual</p>
          </div>
          <p className="text-2xl font-bold text-[#0D4A3E]">${monthlyFee.toLocaleString()}</p>
          <p className="text-xs text-[#0D4A3E]/60 mt-2">Vence el 1° de cada mes</p>
        </div>

        {/* Cuota Anual */}
        <div className="p-4 rounded-lg bg-gradient-to-br from-[#0D4A3E]/5 to-[#0F7A5C]/5 border border-[#0F7A5C]/30">
          <div className="flex items-center gap-2 mb-3">
            <BarChart3 className="w-5 h-5 text-[#0F7A5C]" />
            <p className="text-xs font-bold text-[#0F7A5C] uppercase">Anual Estimado</p>
          </div>
          <p className="text-2xl font-bold text-[#0D4A3E]">${analysis.annualSpend.toLocaleString()}</p>
          <p className="text-xs text-[#0D4A3E]/60 mt-2">12 meses × cuota</p>
        </div>

        {/* Pendiente */}
        <div
          className={`p-4 rounded-lg bg-gradient-to-br border-2 ${
            pendingPayments === 0
              ? 'from-emerald-500/10 to-green-500/10 border-emerald-500/30'
              : 'from-red-500/10 to-pink-500/10 border-red-500/30'
          }`}
        >
          <div className="flex items-center gap-2 mb-3">
            {pendingPayments === 0 ? (
              <CheckCircle className="w-5 h-5 text-emerald-600" />
            ) : (
              <AlertCircle className="w-5 h-5 text-red-600" />
            )}
            <p className={`text-xs font-bold uppercase ${pendingPayments === 0 ? 'text-emerald-600' : 'text-red-600'}`}>
              {pendingPayments === 0 ? 'Sin Pendientes' : 'Pagos Vencidos'}
            </p>
          </div>
          <p className="text-2xl font-bold text-[#0D4A3E]">{pendingPayments === 0 ? '$0' : `${pendingPayments}`}</p>
          <p className={`text-xs mt-2 ${pendingPayments === 0 ? 'text-emerald-600' : 'text-red-600'}`}>
            {pendingPayments === 0 ? '¡Cuenta al día!' : `${pendingPayments} cuota${pendingPayments > 1 ? 's' : ''}`}
          </p>
        </div>
      </motion.div>

      {/* Próximo Pago */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="p-5 rounded-lg bg-gradient-to-r from-blue-50 to-cyan-50 border border-blue-200"
      >
        <div className="flex items-start gap-3">
          <Calendar className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
          <div className="flex-1">
            <p className="text-sm font-bold text-blue-900 mb-1">Próximo Pago Debido</p>
            <p className="text-xl font-bold text-blue-600">{analysis.nextPaymentDate}</p>
            <p className="text-xs text-blue-600 mt-1">Recuerda: Pagar a tiempo protege tu historial de crédito</p>
          </div>
        </div>
      </motion.div>

      {/* Recomendaciones IA */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="space-y-3"
      >
        <div className="flex items-center gap-2 mb-4">
          <Lightbulb className="w-5 h-5 text-amber-500" />
          <h4 className="font-bold text-[#0D4A3E] text-lg">Recomendaciones Personalizadas</h4>
        </div>

        <div className="space-y-2">
          {analysis.tips.map((tip, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 + idx * 0.05 }}
              className="flex items-start gap-3 p-3 rounded-lg bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200"
            >
              <TrendingUp className="w-4 h-4 text-amber-600 mt-0.5 flex-shrink-0" />
              <p className="text-sm text-amber-900">{tip}</p>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Historial de Pagos */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="space-y-3"
      >
        <h4 className="font-bold text-[#0D4A3E] text-lg">Últimos Pagos</h4>

        <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
          {paymentHistory.slice(-6).reverse().map((payment, idx) => (
            <div
              key={idx}
              className={`p-3 rounded-lg text-center transition-all ${
                payment.paid
                  ? 'bg-emerald-100 border border-emerald-500'
                  : 'bg-red-100 border border-red-500'
              }`}
            >
              <p className="text-xs font-bold text-[#0D4A3E] mb-1 truncate">{payment.month}</p>
              {payment.paid ? (
                <CheckCircle className="w-4 h-4 text-emerald-600 mx-auto mb-1" />
              ) : (
                <AlertCircle className="w-4 h-4 text-red-600 mx-auto mb-1" />
              )}
              <p className={`text-xs font-bold ${payment.paid ? 'text-emerald-700' : 'text-red-700'}`}>
                {payment.paid ? 'Pagado' : 'Pendiente'}
              </p>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Disclaimer */}
      <div className="p-3 bg-blue-50 border border-blue-100 rounded-lg">
        <p className="text-xs text-blue-700">
          <span className="inline-flex items-center gap-1 font-bold">
            <Bot className="h-3.5 w-3.5" />
            Nota IA:
          </span>{' '}
          Este análisis es generado automáticamente basado en tu historial de pagos. Para un asesoramiento
          detallado, contacta a la administración del conjunto.
        </p>
      </div>
    </div>
  );
};

export default AIFinancialAnalyzer;
