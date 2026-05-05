import { motion, AnimatePresence } from 'framer-motion';
import { CreditCard, Smartphone, Building2, Copy, Check, ArrowRight, CheckCircle, Loader } from 'lucide-react';
import { useState } from 'react';
import { FloatingModalUnified } from './FloatingModalUnified';
import { toast } from '@/hooks/use-toast';

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  amount: number;
  description?: string;
  onPaymentMethodSelected?: (method: string) => void;
}

type PaymentStep = 'selection' | 'validating' | 'success';

export const PaymentModal = ({ isOpen, onClose, amount, description, onPaymentMethodSelected }: PaymentModalProps) => {
  const [selectedMethod, setSelectedMethod] = useState<string | null>(null);
  const [copied, setCopied] = useState<string | null>(null);
  const [paymentStep, setPaymentStep] = useState<PaymentStep>('selection');
  const [selectedMethodName, setSelectedMethodName] = useState<string>('');

  const paymentMethods = [
    {
      id: 'nequi',
      name: 'Nequi',
      icon: Smartphone,
      description: 'Transferencia inmediata desde tu celular',
      details: 'Abre la app Nequi, selecciona transferir y escanea el código QR',
      color: 'from-[#FF5E00] to-[#FF7A00]',
      borderColor: 'border-[#FF7A00]/30',
      accountNumber: '+57 300 123 4567',
    },
    {
      id: 'pse',
      name: 'PSE (Pagos Seguros en Línea)',
      icon: Building2,
      description: 'Acceso directo a tu cuenta bancaria',
      details: 'Valida con tu usuario y contraseña bancaria for máxima seguridad',
      color: 'from-[#0F7A5C] to-[#06584D]',
      borderColor: 'border-[#0F7A5C]/30',
      accountNumber: 'Cuenta PSE: 1234567890',
    },
    {
      id: 'credit_card',
      name: 'Tarjeta de Crédito / Débito',
      icon: CreditCard,
      description: 'Visa, Mastercard, American Express',
      details: 'Pago seguro con cifrado de puntos de venta',
      color: 'from-[#2563EB] to-[#1D4ED8]',
      borderColor: 'border-[#2563EB]/30',
      accountNumber: 'Terminación: ••••••••',
    },
    {
      id: 'bank_transfer',
      name: 'Transferencia Bancaria',
      icon: Building2,
      description: 'Desde tu cuenta corriente o ahorros',
      details: 'Transacciones 24/7 desde cualquier banco',
      color: 'from-[#7C3AED] to-[#6D28D9]',
      borderColor: 'border-[#7C3AED]/30',
      accountNumber: 'Cuenta: 1234567890',
    },
  ];

  const copyToClipboard = (text: string, method: string) => {
    navigator.clipboard.writeText(text);
    setCopied(method);
    toast({ title: 'Copiado', description: 'Información copiada al portapapeles' });
    setTimeout(() => setCopied(null), 2000);
  };

  const handleMethodSelect = (methodId: string) => {
    setSelectedMethod(methodId);
    if (onPaymentMethodSelected) {
      onPaymentMethodSelected(methodId);
    }
  };

  const handleConfirmPayment = () => {
    const method = paymentMethods.find(m => m.id === selectedMethod);
    if (method) {
      setSelectedMethodName(method.name);
      setPaymentStep('validating');

      // Simulamos el proceso de validación con timeout
      setTimeout(() => {
        setPaymentStep('success');
        // Auto close después de 3 segundos
        setTimeout(() => {
          setPaymentStep('selection');
          setSelectedMethod(null);
          onClose();
        }, 3000);
      }, 2500);
    }
  };

  const handleModalClose = () => {
    if (paymentStep === 'selection') {
      setSelectedMethod(null);
      onClose();
    }
  };

  return (
    <FloatingModalUnified
      isOpen={isOpen}
      onClose={handleModalClose}
      title={paymentStep === 'validating' ? 'Validando Pago' : paymentStep === 'success' ? 'Pago Confirmado' : 'Métodos de Pago'}
      icon={paymentStep === 'success' ? <CheckCircle className="w-5 h-5 text-emerald-400" /> : <CreditCard className="w-5 h-5" />}
      size="lg"
      footer={
        paymentStep === 'selection' ? (
          <div className="flex gap-3 justify-end">
            <button
              onClick={handleModalClose}
              className="px-4 py-2 rounded-lg border border-[rgba(255,255,255,0.10)] text-sm text-foreground hover:bg-[rgba(255,255,255,0.05)] transition-colors"
            >
              Cancelar
            </button>
            <button
              disabled={!selectedMethod}
              onClick={handleConfirmPayment}
              className={`px-6 py-2 rounded-lg text-sm font-medium flex items-center gap-2 transition-all ${
                selectedMethod
                  ? 'bg-gradient-to-r from-[#0D4A3E] to-[#0D4A3E] text-white hover:shadow-lg'
                  : 'bg-muted text-muted-foreground cursor-not-allowed'
              }`}
            >
              Confirmar <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        ) : null
      }
    >
      <AnimatePresence mode="wait">
        {/* SELECTION SCREEN */}
        {paymentStep === 'selection' && (
          <motion.div
            key="selection"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
          >
            {/* Amount Display */}
            <div className="mb-6 p-4 rounded-xl bg-gradient-to-r from-[#0F7A5C]/10 to-[#0D4A3E]/10 border border-[#0F7A5C]/20">
              <p className="text-xs text-muted-foreground uppercase tracking-widest mb-2">Monto a Pagar</p>
              <p className="text-3xl font-black text-foreground">
                ${amount.toLocaleString('es-CO', { minimumFractionDigits: 0 })}
              </p>
              {description && <p className="text-xs text-muted-foreground mt-2">{description}</p>}
            </div>

            {/* Payment Methods Grid */}
            <div className="space-y-3">
              <p className="text-sm font-semibold text-foreground mb-4">Selecciona tu método de pago:</p>
              {paymentMethods.map((method, idx) => {
                const IconComponent = method.icon;
                const isSelected = selectedMethod === method.id;

                return (
                  <motion.div
                    key={method.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.05 }}
                    onClick={() => handleMethodSelect(method.id)}
                    className={`cursor-pointer rounded-xl p-4 border-2 transition-all group ${
                      isSelected
                        ? `bg-gradient-to-br ${method.color} border-white/40 shadow-lg`
                        : `${method.borderColor} border-transparent hover:border-white/20 hover:shadow-md`
                    }`}
                  >
                    {/* Header with icon and title */}
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-3 flex-1">
                        <div
                          className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 ${
                            isSelected
                              ? 'bg-white/20'
                              : 'bg-gradient-to-br ' + method.color
                          }`}
                        >
                          <IconComponent className={`w-5 h-5 ${isSelected ? 'text-white' : 'text-white'}`} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className={`font-bold text-sm ${isSelected ? 'text-white' : 'text-foreground'}`}>
                            {method.name}
                          </p>
                          <p className={`text-xs ${isSelected ? 'text-white/80' : 'text-muted-foreground'}`}>
                            {method.description}
                          </p>
                        </div>
                      </div>
                      {/* Checkmark */}
                      <AnimatePresence>
                        {isSelected && (
                          <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            exit={{ scale: 0 }}
                            className="flex-shrink-0 ml-2"
                          >
                            <div className="w-6 h-6 rounded-full bg-white/30 flex items-center justify-center">
                              <Check className="w-4 h-4 text-white" strokeWidth={3} />
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>

                    {/* Details */}
                    <p className={`text-xs mb-3 ${isSelected ? 'text-white/70' : 'text-muted-foreground'}`}>
                      {method.details}
                    </p>

                    {/* Account details with copy button */}
                    {isSelected && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="mt-3 pt-3 border-t border-white/20"
                      >
                        <div className="flex items-center justify-between gap-2 p-2 rounded-lg bg-white/10">
                          <code className="text-xs font-mono text-white/90">{method.accountNumber}</code>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              copyToClipboard(method.accountNumber, method.id);
                            }}
                            className="p-1 hover:bg-white/20 rounded transition-colors flex-shrink-0"
                          >
                            {copied === method.id ? (
                              <Check className="w-4 h-4 text-white" />
                            ) : (
                              <Copy className="w-4 h-4 text-white/70 hover:text-white" />
                            )}
                          </button>
                        </div>
                      </motion.div>
                    )}
                  </motion.div>
                );
              })}
            </div>

            {/* Security Notice */}
            <div className="mt-6 p-3 rounded-lg bg-primary/5 border border-primary/20">
              <p className="text-xs text-muted-foreground flex items-start gap-2">
                <CheckCircle className="mt-0.5 h-4 w-4 text-primary" />
                <span>
                  Todos tus pagos están protegidos con encriptación de nivel bancario. Tu información es segura.
                </span>
              </p>
            </div>
          </motion.div>
        )}

        {/* VALIDATING SCREEN */}
        {paymentStep === 'validating' && (
          <motion.div
            key="validating"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.3 }}
            className="flex flex-col items-center justify-center py-16 px-4"
          >
            {/* Animated circular loader */}
            <motion.div
              className="relative w-24 h-24 mb-8"
              animate={{ rotate: 360 }}
              transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
            >
              <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-[#0F7A5C] border-r-[#0D4A3E]" />
              <div className="absolute inset-2 rounded-full border-4 border-transparent border-b-[#0F7A5C]/50 border-l-[#0D4A3E]/50" />
            </motion.div>

            {/* Animated amount */}
            <motion.div
              className="text-center mb-6"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <p className="text-2xl font-black text-foreground mb-2">
                ${amount.toLocaleString('es-CO', { minimumFractionDigits: 0 })}
              </p>
              <p className="text-sm text-muted-foreground">{selectedMethodName}</p>
            </motion.div>

            {/* Status messages with animation */}
            <div className="space-y-3 w-full max-w-sm">
              {[
                { text: 'Conectando con mercado de pagos...', delay: 0 },
                { text: 'Validando información bancaria...', delay: 0.5 },
                { text: 'Procesando transacción...', delay: 1 },
              ].map((item, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: item.delay }}
                  className="flex items-center gap-3 p-3 rounded-lg bg-[rgba(255,255,255,0.04)]"
                >
                  <motion.div
                    className="w-2 h-2 rounded-full bg-[#0D4A3E]"
                    animate={{ scale: [1, 1.5, 1] }}
                    transition={{ duration: 1, delay: item.delay + 0.3, repeat: Infinity }}
                  />
                  <p className="text-xs text-muted-foreground">{item.text}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}

        {/* SUCCESS SCREEN */}
        {paymentStep === 'success' && (
          <motion.div
            key="success"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ type: 'spring', stiffness: 200, damping: 20 }}
            className="flex flex-col items-center justify-center py-16 px-4"
          >
            {/* Success checkmark animation */}
            <motion.div
              className="relative w-20 h-20 mb-6"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', stiffness: 300, damping: 10 }}
            >
              <motion.div
                className="absolute inset-0 rounded-full bg-emerald-500/20"
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
              />
              <div className="absolute inset-0 rounded-full bg-gradient-to-br from-emerald-500 to-green-600 flex items-center justify-center">
                <motion.div
                  initial={{ scale: 0, rotate: -180 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
                >
                  <CheckCircle className="w-10 h-10 text-white" />
                </motion.div>
              </div>
            </motion.div>

            {/* Success message */}
            <motion.div
              className="text-center mb-6"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <p className="text-xl font-black text-foreground mb-2">¡Pago Completado!</p>
              <p className="text-2xl font-black text-emerald-500 mb-3">
                ${amount.toLocaleString('es-CO', { minimumFractionDigits: 0 })}
              </p>
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Método: {selectedMethodName}</p>
                <p className="text-xs text-muted-foreground">
                  ID Transacción: {Math.random().toString(36).substring(7).toUpperCase()}
                </p>
              </div>
            </motion.div>

            {/* Confetti-like dots */}
            <div className="relative w-full h-16 mb-4">
              {[...Array(5)].map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute w-1.5 h-1.5 rounded-full bg-emerald-400"
                  initial={{ opacity: 0, y: 0 }}
                  animate={{
                    opacity: [1, 0],
                    y: [0, -40],
                    x: [0, Math.cos((i / 5) * Math.PI * 2) * 40],
                  }}
                  transition={{
                    duration: 1.5,
                    delay: 0.2,
                    repeat: Infinity,
                  }}
                  style={{ left: '50%', bottom: 0 }}
                />
              ))}
            </div>

            <p className="text-xs text-muted-foreground mt-4">Cerrando en 3 segundos...</p>
          </motion.div>
        )}
      </AnimatePresence>
    </FloatingModalUnified>
  );
};

export default PaymentModal;
