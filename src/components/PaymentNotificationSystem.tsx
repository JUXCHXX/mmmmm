import { motion, AnimatePresence } from 'framer-motion';
import { Bell, X, Clock, AlertCircle, CheckCircle, Info } from 'lucide-react';
import { useState } from 'react';

interface PaymentNotification {
  id: string;
  type: 'reminder' | 'overdue' | 'success' | 'warning';
  title: string;
  description: string;
  daysUntil?: number;
  amount?: number;
  timestamp: Date;
}

interface PaymentNotificationSystemProps {
  notifications: PaymentNotification[];
  onDismiss: (id: string) => void;
  onViewPayments?: () => void;
}

const NotificationConfig = {
  reminder: {
    icon: <Clock className="w-5 h-5" />,
    color: 'from-blue-500 to-cyan-400',
    bgColor: 'bg-blue-50',
    borderColor: 'border-blue-200',
    textColor: 'text-blue-700',
  },
  overdue: {
    icon: <AlertCircle className="w-5 h-5" />,
    color: 'from-red-500 to-pink-400',
    bgColor: 'bg-red-50',
    borderColor: 'border-red-200',
    textColor: 'text-red-700',
  },
  success: {
    icon: <CheckCircle className="w-5 h-5" />,
    color: 'from-emerald-500 to-green-400',
    bgColor: 'bg-emerald-50',
    borderColor: 'border-emerald-200',
    textColor: 'text-emerald-700',
  },
  warning: {
    icon: <Info className="w-5 h-5" />,
    color: 'from-amber-500 to-orange-400',
    bgColor: 'bg-amber-50',
    borderColor: 'border-amber-200',
    textColor: 'text-amber-700',
  },
};

export const PaymentNotificationSystem = ({
  notifications,
  onDismiss,
  onViewPayments,
}: PaymentNotificationSystemProps) => {
  const [visibleNotifications, setVisibleNotifications] = useState<string[]>(
    notifications.map(n => n.id)
  );

  const handleDismiss = (id: string) => {
    setVisibleNotifications(prev => prev.filter(notifId => notifId !== id));
    setTimeout(() => onDismiss(id), 300);
  };

  if (notifications.length === 0) return null;

  return (
    <div className="fixed top-20 right-4 z-40 space-y-3 max-w-md">
      <AnimatePresence>
        {notifications.map(notification => {
          const config = NotificationConfig[notification.type];
          const isVisible = visibleNotifications.includes(notification.id);

          if (!isVisible) return null;

          return (
            <motion.div
              key={notification.id}
              initial={{ opacity: 0, y: -20, x: 20 }}
              animate={{ opacity: 1, y: 0, x: 0 }}
              exit={{ opacity: 0, y: -20, x: 20 }}
              transition={{ type: 'spring', stiffness: 300, damping: 25 }}
              className={`${config.bgColor} border-2 ${config.borderColor} rounded-xl p-4 shadow-lg backdrop-blur-sm`}
            >
              <div className="flex items-start gap-3">
                {/* Icon */}
                <div className={`flex-shrink-0 p-2 rounded-lg bg-gradient-to-r ${config.color} text-white`}>
                  {config.icon}
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <h3 className={`font-bold text-sm ${config.textColor} mb-1`}>{notification.title}</h3>
                  <p className={`text-xs ${config.textColor} opacity-80 mb-2`}>{notification.description}</p>

                  {/* Extra Info */}
                  {(notification.daysUntil !== undefined || notification.amount !== undefined) && (
                    <div className="flex gap-3 text-xs">
                      {notification.daysUntil !== undefined && (
                        <span className={`font-semibold ${config.textColor}`}>
                          {notification.daysUntil === 0
                            ? 'Hoy'
                            : notification.daysUntil === 1
                              ? 'Mañana'
                              : `En ${notification.daysUntil} días`}
                        </span>
                      )}
                      {notification.amount !== undefined && (
                        <span className={`font-bold ${config.textColor}`}>
                          ${notification.amount.toLocaleString()}
                        </span>
                      )}
                    </div>
                  )}

                  {/* Action Button */}
                  {notification.type === 'reminder' && onViewPayments && (
                    <button
                      onClick={onViewPayments}
                      className="mt-2 px-3 py-1 rounded-lg bg-white/50 hover:bg-white transition-colors text-xs font-semibold text-[#0D4A3E]"
                    >
                      Ver Detalles
                    </button>
                  )}
                </div>

                {/* Close Button */}
                <button
                  onClick={() => handleDismiss(notification.id)}
                  className={`flex-shrink-0 p-1 hover:bg-white/30 transition-colors rounded-lg`}
                  aria-label="Cerrar notificación"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
};

export default PaymentNotificationSystem;
