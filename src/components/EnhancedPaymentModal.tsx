import { motion } from 'framer-motion';
import { CreditCard, Smartphone, Building2, DollarSign, CheckCircle, Lock, ArrowRight, RefreshCw, Clock, AlertTriangle, Lightbulb } from 'lucide-react';
import { FloatingModalUnified } from './FloatingModalUnified';
import { useState } from 'react';

interface EnhancedPaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  monthlyFee: number;
  unitInfo?: { unit: string; tower: string };
  pendingAmount?: number;
}

type PaymentMethod = 'nequi' | 'pse' | 'tarjeta' | 'transferencia';

interface PaymentMethodConfig {
  id: PaymentMethod;
  name: string;
  icon: React.ReactNode;
  description: string;
  color: string;
  bgColor: string;
  estimatedTime: string;
  fee: number;
}

const PAYMENT_METHODS: PaymentMethodConfig[] = [
  {
    id: 'nequi',
    name: 'Nequi',
    icon: <Smartphone className="w-6 h-6" />,
    description: 'Transferencia instantánea desde celular',
    color: 'text-[#FF7A00]',
    bgColor: 'from-[#FF7A00]/10 to-orange-50',
    estimatedTime: '1-2 minutos',
    fee: 0,
  },
  {
    id: 'pse',
    name: 'PSE',
    icon: <Building2 className="w-6 h-6" />,
    description: 'Pago directo desde tu cuenta bancaria',
    color: 'text-[#0F7A5C]',
    bgColor: 'from-[#0F7A5C]/10 to-emerald-50',
    estimatedTime: '1 hora',
    fee: 0,
  },
  {
    id: 'tarjeta',
    name: 'Tarjeta de Crédito',
    icon: <CreditCard className="w-6 h-6" />,
    description: 'Visa, MasterCard, American Express',
    color: 'text-[#2563EB]',
    bgColor: 'from-blue-500/10 to-blue-50',
    estimatedTime: 'Inmediato',
    fee: 2.9,
  },
  {
    id: 'transferencia',
    name: 'Transferencia Bancaria',
    icon: <ArrowRight className="w-6 h-6" />,
    description: 'Transferencia desde cualquier banco',
    color: 'text-[#7C3AED]',
    bgColor: 'from-purple-500/10 to-purple-50',
    estimatedTime: '1-2 días hábiles',
    fee: 0,
  },
];

export const EnhancedPaymentModal = ({
  isOpen,
  onClose,
  monthlyFee,
  unitInfo,
  pendingAmount = 0,
}: EnhancedPaymentModalProps) => {
  const [selectedMethod, setSelectedMethod] = useState<PaymentMethod>('nequi');
  const [processingPayment, setProcessingPayment] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);

  const totalAmount = monthlyFee + pendingAmount;
  const selectedMethodConfig = PAYMENT_METHODS.find(m => m.id === selectedMethod);
  const fee = selectedMethodConfig ? (totalAmount * selectedMethodConfig.fee) / 100 : 0;
  const finalAmount = totalAmount + fee;

  const handlePayment = async () => {
    setProcessingPayment(true);
    // Simular procesamiento de pago
    await new Promise(resolve => setTimeout(resolve, 2000));
    setPaymentSuccess(true);
    setTimeout(() => {
      setPaymentSuccess(false);
      setProcessingPayment(false);
      onClose();
    }, 2500);
  };

  return (
    <FloatingModalUnified
      isOpen={isOpen}
      onClose={() => {
        onClose();
        setPaymentSuccess(false);
      }}
      title="Realizar Pago de Cuota"
      icon={<CreditCard className="w-5 h-5" />}
      size="lg"
      footer={
        paymentSuccess ? null : (
          <div className="flex gap-2">
            <button
              onClick={onClose}
              disabled={processingPayment}
              className="flex-1 h-10 rounded-lg border border-[#0D2654] bg-transparent text-[#0D2654] hover:bg-[#0D2654]/5 transition-colors text-sm font-semibold disabled:opacity-50"
            >
              Cancelar
            </button>
            <button
              onClick={handlePayment}
              disabled={processingPayment}
              className="flex h-10 flex-1 items-center justify-center gap-2 rounded-lg bg-[#2DC89A] text-sm font-semibold text-white shadow-[0_8px_18px_rgba(45,200,154,0.28)] transition-all hover:bg-[#24B98D] hover:shadow-[0_12px_24px_rgba(45,200,154,0.32)] disabled:opacity-50"
            >
              {processingPayment ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  Procesando...
                </>
              ) : (
                <>
                  <Lock className="w-4 h-4" />
                  Realizar Pago
                </>
              )}
            </button>
          </div>
        )
      }
    >
      {paymentSuccess ? (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="flex flex-col items-center justify-center py-12"
        >
          <motion.div animate={{ scale: [1, 1.1, 1] }} transition={{ duration: 1, repeat: 2 }}>
            <CheckCircle className="w-16 h-16 text-emerald-500 mb-4" />
          </motion.div>
          <h3 className="text-2xl font-bold text-[#0D4A3E] mb-2">¡Pago Realizado!</h3>
          <p className="text-sm text-[#0D4A3E]/70 text-center max-w-md mb-4">Tu pago ha sido procesado exitosamente.</p>
          <div className="w-full space-y-3">
            <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-lg">
              <p className="text-xs text-emerald-600 mb-1 font-bold">MONTO PAGADO</p>
              <p className="text-2xl font-bold text-emerald-700">${finalAmount.toLocaleString()}</p>
            </div>
            <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <p className="text-xs text-blue-600 mb-1 font-bold">REFERENCIA DE TRANSACCIÓN</p>
              <p className="text-sm font-mono text-blue-700">TRX-{Math.random().toString(36).substr(2, 9).toUpperCase()}</p>
            </div>
          </div>
        </motion.div>
      ) : (
        <div className="space-y-6">
          {/* Resumen de Pago */}
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-3">
            <div className="p-5 rounded-xl bg-gradient-to-r from-[#0D4A3E]/5 to-[#0F7A5C]/5 border border-[#0F7A5C]/20">
              {unitInfo && (
                <>
                  <p className="text-xs font-bold text-[#0F7A5C] uppercase mb-2">Tu Unidad</p>
                  <p className="text-lg font-bold text-[#0D4A3E] mb-4">
                    Apto {unitInfo.unit} - {unitInfo.tower}
                  </p>
                </>
              )}

              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-[#0D4A3E]">Cuota Mensual:</span>
                  <span className="font-bold text-[#0D4A3E]">${monthlyFee.toLocaleString()}</span>
                </div>
                {pendingAmount > 0 && (
                  <div className="flex justify-between text-red-600">
                    <span>Pagos Pendientes:</span>
                    <span className="font-bold">${pendingAmount.toLocaleString()}</span>
                  </div>
                )}
              </div>
            </div>
          </motion.div>

          {/* Seleccionar Método de Pago */}
          <div className="space-y-3">
            <h3 className="text-sm font-bold text-[#0D4A3E] uppercase">Selecciona tu Método de Pago</h3>
            <div className="grid grid-cols-2 gap-3">
              {PAYMENT_METHODS.map((method, idx) => (
                <motion.button
                  key={method.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.05 }}
                  onClick={() => setSelectedMethod(method.id)}
                  className={`p-4 rounded-lg border-2 transition-all text-left group ${
                    selectedMethod === method.id
                      ? `bg-gradient-to-br ${method.bgColor} border-current`
                      : `bg-white border-gray-200 hover:border-gray-300`
                  }`}
                >
                  <div className={`${method.color} mb-2`}>{method.icon}</div>
                  <p className={`font-bold text-sm ${method.color}`}>{method.name}</p>
                  <p className="text-xs text-gray-600 mt-1 group-hover:text-gray-700">{method.description}</p>
                  <div className="mt-2 pt-2 border-t border-gray-200 group-hover:border-gray-300">
                    <p className="text-xs text-gray-500">
                      <span className="inline-flex items-center gap-1 font-bold">
                        <Clock className="h-3.5 w-3.5" />
                        {method.estimatedTime}
                      </span>
                    </p>
                  </div>
                </motion.button>
              ))}
            </div>
          </div>

          {/* Resumen Final */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="p-5 rounded-xl bg-gradient-to-br from-gray-50 to-blue-50 border border-blue-200"
          >
            <h4 className="font-bold text-[#0D4A3E] mb-3 flex items-center gap-2">
              <DollarSign className="w-5 h-5 text-[#0F7A5C]" />
              Resumen de Pago
            </h4>

            <div className="space-y-2 text-sm mb-4">
              <div className="flex justify-between">
                <span className="text-[#0D4A3E]">Monto Base:</span>
                <span className="font-semibold text-[#0D4A3E]">${totalAmount.toLocaleString()}</span>
              </div>

              {selectedMethodConfig && selectedMethodConfig.fee > 0 && (
                <div className="flex justify-between text-amber-600">
                  <span>Comisión ({selectedMethodConfig.fee}%):</span>
                  <span className="font-semibold">${fee.toLocaleString('es-CO', { maximumFractionDigits: 0 })}</span>
                </div>
              )}

              <div className="border-t pt-2 flex justify-between font-bold text-xl text-[#0D4A3E]">
                <span>Total a Pagar:</span>
                <span className="text-[#0F7A5C]">${finalAmount.toLocaleString('es-CO', { maximumFractionDigits: 0 })}</span>
              </div>
            </div>

            {selectedMethodConfig && selectedMethodConfig.fee > 0 && (
              <p className="text-xs text-amber-600 mb-3">
                <span className="inline-flex items-center gap-1.5">
                  <AlertTriangle className="h-3.5 w-3.5" />
                  Se aplica una comisión por este método de pago.
                </span>
              </p>
            )}

            {selectedMethodConfig && (
              <p className="text-xs text-blue-700 bg-white p-2 rounded border border-blue-200">
                <span className="inline-flex items-center gap-1 font-bold">
                  <CheckCircle className="h-3.5 w-3.5" />
                  Seguro:
                </span>{' '}
                Todos los pagos están protegidos con encriptación SSL de nivel bancario. Tus datos están 100%
                seguros.
              </p>
            )}
          </motion.div>

          {/* Ti ps */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="p-4 bg-amber-50 border border-amber-200 rounded-lg"
          >
            <p className="text-xs text-amber-700 leading-relaxed">
              <span className="inline-flex items-center gap-1 font-bold">
                <Lightbulb className="h-3.5 w-3.5" />
                Consejo:
              </span>{' '}
              Para evitar sanciones por mora, te recomendamos activar pagos automáticos en tu banco o usar la
              opción "Recordarme" en plataformas de pago.
            </p>
          </motion.div>
        </div>
      )}
    </FloatingModalUnified>
  );
};

export default EnhancedPaymentModal;
