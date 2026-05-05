import { AnimatePresence, motion } from 'framer-motion';
import { X } from 'lucide-react';
import React from 'react';

type ModalSize = 'sm' | 'md' | 'lg' | 'xl';

interface FloatingModalUnifiedProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  icon?: React.ReactNode;
  children: React.ReactNode;
  size?: ModalSize;
  footer?: React.ReactNode;
}

const sizeMap: Record<ModalSize, string> = {
  sm: 'max-w-sm',
  md: 'max-w-2xl',
  lg: 'max-w-4xl',
  xl: 'max-w-5xl',
};

export const FloatingModalUnified: React.FC<FloatingModalUnifiedProps> = ({
  isOpen,
  onClose,
  title,
  icon,
  children,
  size = 'lg',
  footer,
}) => {
  const sizeClass = sizeMap[size] || sizeMap.lg;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-40 bg-slate-950/45 backdrop-blur-sm"
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.94, y: 28 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.94, y: 28 }}
            transition={{ type: 'spring', damping: 22, stiffness: 280 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none"
          >
            <div className={`pointer-events-auto ${sizeClass} max-h-[88vh] w-full`}>
              <div className="relative flex h-full flex-col overflow-hidden rounded-[12px] border border-[#D1D9E6] bg-white shadow-[0_18px_40px_rgba(13,38,84,0.22)]">
                <div className="sublevel-header rounded-none border-b border-white/10 px-4 py-4 md:px-8 md:py-5">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex min-w-0 flex-1 items-center gap-3">
                      {icon && (
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white/14 text-white shadow-[0_8px_18px_rgba(0,0,0,0.14)]">
                          {icon}
                        </div>
                      )}
                      <h2 className="truncate text-lg font-bold text-white md:text-xl">{title}</h2>
                    </div>

                    <motion.button
                      type="button"
                      whileHover={{ scale: 1.12, rotate: 90 }}
                      whileTap={{ scale: 0.92 }}
                      onClick={onClose}
                      className="shrink-0 rounded-lg p-2 text-white transition-colors hover:bg-white/12"
                      aria-label="Cerrar"
                    >
                      <X className="h-5 w-5" strokeWidth={2.5} />
                    </motion.button>
                  </div>
                </div>

                <div className="flex-1 overflow-y-auto">
                  <div className="space-y-6 p-4 md:p-8">{children}</div>
                </div>

                {footer && (
                  <div className="border-t border-[#DDE5F0] bg-[#F8FBFF] px-4 py-4 md:px-8 md:py-5">
                    {footer}
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default FloatingModalUnified;
