import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Edit2 } from 'lucide-react';

/**
 * DISEÑO ÚNICO PROFESIONAL - FloatingEditModal
 * Paleta: Azul Oscuro (#023047) + Verde Esmeralda (#0F7A5C)
 * Basado en CondoInfoModal - diseño consistente
 */

interface FloatingEditModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  subtitle?: string;
  icon?: React.ReactNode;
  children: React.ReactNode;
  onSubmit?: (e: React.FormEvent) => void;
}

export const FloatingEditModal: React.FC<FloatingEditModalProps> = ({
  isOpen,
  onClose,
  title,
  subtitle,
  icon,
  children,
  onSubmit,
}) => {
  const defaultIcon = icon || <Edit2 className="w-5 h-5" />;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm"
          />

          {/* Modal - DISEÑO CONDOINFOM AL */}
          <motion.div
            initial={{ opacity: 0, scale: 0.92, y: 30 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.92, y: 30 }}
            transition={{ type: 'spring', damping: 20, stiffness: 300 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none"
          >
            <div className="pointer-events-auto max-w-sm md:max-w-2xl w-full max-h-[88vh]">
              {/* Modal body - DISEÑO ÚNICO */}
              <div className="relative rounded-2xl overflow-hidden bg-white shadow-2xl h-full flex flex-col border border-[#0D4A3E]/15">

                {/* Barra superior - Gradiente oficial */}
                <div className="h-1.5 bg-gradient-to-r from-[#0D4A3E] via-[#0F7A5C] to-[#0D4A3E]" />

                {/* Header */}
                <form onSubmit={onSubmit} className="h-full flex flex-col">
                  <div className="bg-gradient-to-r from-[#0D4A3E]/5 to-[#0F7A5C]/5 px-4 md:px-8 py-5 md:py-6 border-b border-[#0D4A3E]/10">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-3 mb-2">
                          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-[#0D4A3E] to-[#0D4A3E] flex items-center justify-center text-white shadow-lg flex-shrink-0">
                            {defaultIcon}
                          </div>
                          <h2 className="text-xl md:text-2xl font-bold text-[#0D4A3E] truncate">
                            {title}
                          </h2>
                        </div>
                        {subtitle && (
                          <div className="flex items-center gap-2 text-sm text-[#0D4A3E]/70 ml-13">
                            <span className="truncate">{subtitle}</span>
                          </div>
                        )}
                      </div>
                      <motion.button
                        type="button"
                        whileHover={{ scale: 1.15, rotate: 90 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={onClose}
                        className="p-2 hover:bg-[#0D4A3E]/10 transition-colors rounded-lg flex-shrink-0"
                        aria-label="Cerrar"
                      >
                        <X className="w-5 h-5 text-[#0D4A3E]" strokeWidth={2.5} />
                      </motion.button>
                    </div>
                  </div>

                  {/* Contenido scrollable */}
                  <div className="flex-1 overflow-y-auto">
                    <div className="p-4 md:p-8 space-y-6">
                      {children}
                    </div>
                  </div>

                  {/* Footer - Botones de acción */}
                  <div className="bg-gradient-to-r from-[#0D4A3E]/5 to-[#0F7A5C]/5 px-4 md:px-8 py-4 md:py-5 border-t border-[#0D4A3E]/10 flex gap-3">
                    <motion.button
                      type="button"
                      whileHover={{ scale: 1.03, y: -1 }}
                      whileTap={{ scale: 0.97 }}
                      onClick={onClose}
                      className="flex-1 px-5 py-2.5 rounded-xl font-semibold
                        bg-gray-100 hover:bg-gray-200 text-gray-700
                        transition-all duration-200 shadow-sm hover:shadow-md"
                    >
                      Cancelar
                    </motion.button>
                    <motion.button
                      type="submit"
                      whileHover={{ scale: 1.03, y: -1 }}
                      whileTap={{ scale: 0.97 }}
                      className="flex-1 px-5 py-2.5 rounded-xl font-semibold text-white
                        bg-gradient-to-r from-[#0D4A3E] to-[#0D4A3E]
                        hover:from-[#0F7A5C] hover:to-[#0D4A3E]
                        transition-all duration-200 shadow-lg hover:shadow-xl"
                    >
                      Guardar
                    </motion.button>
                  </div>
                </form>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

/**
 * Floating form field para uso dentro de FloatingEditModal
 */
interface FloatingFormFieldProps {
  label: string;
  placeholder?: string;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  type?: 'text' | 'email' | 'number' | 'textarea';
  icon?: React.ReactNode;
  required?: boolean;
}

export const FloatingFormField: React.FC<FloatingFormFieldProps> = ({
  label,
  placeholder,
  value,
  onChange,
  type = 'text',
  icon,
  required = false,
}) => {
  const baseClass = `w-full px-4 py-2.5 rounded-lg border border-[#0D4A3E]/20
    focus:border-[#0D4A3E] focus:ring-2 focus:ring-[#0D4A3E]/20 focus:outline-none
    transition-all duration-200 bg-white text-gray-800 placeholder:text-gray-400`;

  return (
    <div>
      <label className="block text-sm font-semibold text-[#0D4A3E] mb-2.5">
        {icon && <span className="inline-block mr-2">{icon}</span>}
        {label}
        {required && <span className="text-[#0F7A5C]">*</span>}
      </label>
      {type === 'textarea' ? (
        <textarea
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          className={`${baseClass} min-h-[100px] resize-none`}
          required={required}
        />
      ) : (
        <input
          type={type}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          className={baseClass}
          required={required}
        />
      )}
    </div>
  );
};

export default FloatingEditModal;
