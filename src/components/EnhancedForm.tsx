import React from 'react';
import { motion } from 'framer-motion';
import { AlertCircle, CheckCircle, Info } from 'lucide-react';

/**
 * Enhanced Form Components
 * Interactive, colorful, and visually appealing
 */

interface EnhancedFormFieldProps {
  label: string;
  placeholder?: string;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void;
  type?: 'text' | 'email' | 'number' | 'password' | 'textarea' | 'select';
  error?: string;
  hint?: string;
  required?: boolean;
  icon?: React.ReactNode;
  options?: { label: string; value: string }[];
  disabled?: boolean;
  autoFocus?: boolean;
}

export const EnhancedFormField: React.FC<EnhancedFormFieldProps> = ({
  label,
  placeholder,
  value,
  onChange,
  type = 'text',
  error,
  hint,
  required,
  icon,
  options,
  disabled,
  autoFocus,
}) => {
  const hasError = !!error;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-2"
    >
      {/* Label */}
      <div className="flex items-center gap-2">
        <label className="block text-sm font-semibold text-gray-700">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
        {icon && <div className="text-gray-400">{icon}</div>}
      </div>

      {/* Input wrapper */}
      <div className="relative group">
        {type === 'textarea' ? (
          <textarea
            placeholder={placeholder}
            value={value}
            onChange={onChange}
            disabled={disabled}
            autoFocus={autoFocus}
            className={`w-full px-4 py-3 rounded-xl font-medium
              bg-white border-2 transition-all duration-200
              focus:outline-none focus:ring-2 focus:ring-blue-300
              disabled:opacity-50 disabled:cursor-not-allowed
              placeholder-gray-400 text-gray-900 resize-none
              ${hasError
                ? 'border-red-300 focus:border-red-500 focus:ring-red-200'
                : 'border-gray-200 focus:border-blue-500'
              }
              hover:border-gray-300`}
            rows={4}
          />
        ) : type === 'select' ? (
          <select
            value={value}
            onChange={onChange}
            disabled={disabled}
            autoFocus={autoFocus}
            className={`w-full px-4 py-3 rounded-xl font-medium
              bg-white border-2 appearance-none cursor-pointer
              transition-all duration-200
              focus:outline-none focus:ring-2 focus:ring-blue-300
              disabled:opacity-50 disabled:cursor-not-allowed
              text-gray-900
              ${hasError
                ? 'border-red-300 focus:border-red-500 focus:ring-red-200'
                : 'border-gray-200 focus:border-blue-500'
              }
              hover:border-gray-300`}
          >
            <option value="">Seleccionar...</option>
            {options?.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        ) : (
          <input
            type={type}
            placeholder={placeholder}
            value={value}
            onChange={onChange}
            disabled={disabled}
            autoFocus={autoFocus}
            className={`w-full px-4 py-3 rounded-xl font-medium
              bg-white border-2 transition-all duration-200
              focus:outline-none focus:ring-2 focus:ring-blue-300
              disabled:opacity-50 disabled:cursor-not-allowed
              placeholder-gray-400 text-gray-900
              ${hasError
                ? 'border-red-300 focus:border-red-500 focus:ring-red-200'
                : 'border-gray-200 focus:border-blue-500'
              }
              hover:border-gray-300`}
          />
        )}

        {/* Floating gradient on focus */}
        <div className="absolute inset-0 rounded-xl pointer-events-none opacity-0
          group-focus-within:opacity-100 transition-opacity duration-200
          bg-gradient-to-r from-blue-500/0 via-blue-500/0 to-cyan-500/0" />
      </div>

      {/* Error or hint message */}
      {error && (
        <motion.div
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          className="flex items-center gap-2 text-red-600 text-sm"
        >
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          <span>{error}</span>
        </motion.div>
      )}
      {hint && !error && (
        <motion.div
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          className="flex items-center gap-2 text-gray-500 text-sm"
        >
          <Info className="w-4 h-4 flex-shrink-0" />
          <span>{hint}</span>
        </motion.div>
      )}
    </motion.div>
  );
};

/**
 * Enhanced Form Container with visual feedback
 */
interface EnhancedFormProps {
  children: React.ReactNode;
  onSubmit?: (e: React.FormEvent) => void;
  className?: string;
}

export const EnhancedForm: React.FC<EnhancedFormProps> = ({ children, onSubmit, className = '' }) => {
  return (
    <form onSubmit={onSubmit} className={`space-y-6 ${className}`}>
      {/* Grid layout for form fields */}
      <div className="space-y-5 bg-gradient-to-br from-blue-50/50 to-cyan-50/30 p-6 rounded-2xl
        border border-blue-100 backdrop-blur-sm">
        {children}
      </div>
    </form>
  );
};

/**
 * Enhanced Button for form actions
 */
interface EnhancedButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger' | 'success';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
  icon?: React.ReactNode;
  fullWidth?: boolean;
  children: React.ReactNode;
}

const BUTTON_VARIANTS = {
  primary: 'bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 text-white shadow-lg hover:shadow-xl',
  secondary: 'bg-gray-100 hover:bg-gray-200 text-gray-900 border border-gray-300',
  danger: 'bg-gradient-to-r from-red-600 to-red-500 hover:from-red-700 hover:to-red-600 text-white shadow-lg',
  success: 'bg-gradient-to-r from-emerald-600 to-green-500 hover:from-emerald-700 hover:to-green-600 text-white shadow-lg',
};

const BUTTON_SIZES = {
  sm: 'px-3 py-1.5 text-sm',
  md: 'px-5 py-2.5 text-base',
  lg: 'px-6 py-3 text-lg',
};

export const EnhancedButton: React.FC<EnhancedButtonProps> = ({
  variant = 'primary',
  size = 'md',
  loading = false,
  icon,
  fullWidth = false,
  children,
  disabled,
  ...props
}) => {
  return (
    <motion.button
      whileHover={{ scale: disabled ? 1 : 1.02 }}
      whileTap={{ scale: disabled ? 1 : 0.98 }}
      disabled={disabled || loading}
      className={`relative rounded-xl font-semibold transition-all duration-200
        flex items-center justify-center gap-2
        ${BUTTON_VARIANTS[variant]}
        ${BUTTON_SIZES[size]}
        ${fullWidth ? 'w-full' : ''}
        ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
        outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-blue-400`}
      {...props}
    >
      {loading ? (
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
          className="w-4 h-4 border border-transparent border-t-white rounded-full"
        />
      ) : icon ? (
        <motion.div
          initial={{ scale: 0.8 }}
          animate={{ scale: 1 }}
        >
          {icon}
        </motion.div>
      ) : null}
      {children}
    </motion.button>
  );
};

/**
 * Form section divider with decorative elements
 */
interface FormSectionProps {
  title?: string;
  icon?: React.ReactNode;
  children: React.ReactNode;
}

export const FormSection: React.FC<FormSectionProps> = ({ title, icon, children }) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-4"
    >
      {title && (
        <div className="flex items-center gap-3 pb-3 border-b-2 border-blue-200">
          {icon && <div className="text-blue-600 text-lg">{icon}</div>}
          <h3 className="text-lg font-bold text-gray-900">{title}</h3>
        </div>
      )}
      <div className="space-y-5">
        {children}
      </div>
    </motion.div>
  );
};

export default {
  EnhancedFormField,
  EnhancedForm,
  EnhancedButton,
  FormSection,
};
