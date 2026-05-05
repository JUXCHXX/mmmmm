import React from 'react';
import { Loader2, X } from 'lucide-react';

/**
 * Base Button Component
 * Reusable button with variants and states
 */
type ButtonVariant = 'primary' | 'secondary' | 'danger' | 'ghost';
type ButtonSize = 'sm' | 'md' | 'lg';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  isLoading?: boolean;
  children: React.ReactNode;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant = 'primary', size = 'md', isLoading = false, disabled, children, className = '', ...props }, ref) => {
    const baseClasses = 'font-medium rounded-lg transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed';
    const variantClasses = {
      primary: 'bg-blue-600 text-white hover:bg-blue-700',
      secondary: 'bg-gray-200 text-gray-900 hover:bg-gray-300',
      danger: 'bg-red-600 text-white hover:bg-red-700',
      ghost: 'bg-transparent text-gray-700 hover:bg-gray-100',
    };
    const sizeClasses = {
      sm: 'px-3 py-1.5 text-sm',
      md: 'px-4 py-2 text-base',
      lg: 'px-6 py-3 text-lg',
    };

    return (
      <button
        ref={ref}
        disabled={disabled || isLoading}
        className={`${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${className}`}
        {...props}
      >
        {isLoading ? (
          <span className="inline-flex items-center gap-2">
            <Loader2 className="h-4 w-4 animate-spin" />
            <span>Cargando...</span>
          </span>
        ) : children}
      </button>
    );
  }
);

Button.displayName = 'Button';

/**
 * Base Card Component
 * Reusable card container with glass-morphism
 */
interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  variant?: 'glass' | 'light' | 'bordered';
}

export const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ children, variant = 'glass', className = '', ...props }, ref) => {
    const variantClasses = {
      glass: 'bg-white rounded-xl border border-black/8 shadow-sm hover:shadow-md p-5',
      light: 'bg-white dark:bg-gray-900 rounded-lg shadow-sm p-5',
      bordered: 'border border-gray-200 dark:border-gray-700 rounded-lg p-5',
    };

    return (
      <div ref={ref} className={`${variantClasses[variant]} ${className}`} {...props}>
        {children}
      </div>
    );
  }
);

Card.displayName = 'Card';

/**
 * Base Input Component
 * Reusable input with validation states
 */
interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  hint?: string;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, hint, className = '', ...props }, ref) => {
    return (
      <div className="w-full">
        {label && (
          <label className="block text-sm font-medium text-foreground mb-2">
            {label}
          </label>
        )}
        <input
          ref={ref}
          className={`w-full px-4 py-2 rounded-lg bg-white dark:bg-gray-900 border transition-colors
            ${error ? 'border-red-500' : 'border-gray-300 dark:border-gray-700'}
            focus:outline-none focus:ring-2 focus:ring-blue-500
            ${className}`}
          {...props}
        />
        {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
        {hint && <p className="text-gray-500 text-sm mt-1">{hint}</p>}
      </div>
    );
  }
);

Input.displayName = 'Input';

/**
 * Base Modal Component
 * Reusable modal with portal rendering
 */
interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
  size?: 'sm' | 'md' | 'lg';
}

export const Modal: React.FC<ModalProps> = ({ isOpen, onClose, title, children, footer, size = 'md' }) => {
  if (!isOpen) return null;

  const sizeClasses = {
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-lg',
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm transition-opacity"
        onClick={onClose}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => e.key === 'Escape' && onClose()}
        aria-label="Close modal"
      />

      {/* Modal */}
      <div
        className={`relative bg-white dark:bg-gray-900 rounded-lg shadow-lg ${sizeClasses[size]} w-full`}
        role="dialog"
        aria-labelledby="modal-title"
        aria-modal="true"
      >
        {/* Header */}
        {title && (
          <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
            <h2 id="modal-title" className="text-lg font-semibold text-foreground">
              {title}
            </h2>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 transition-colors"
              aria-label="Close modal"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        )}

        {/* Content */}
        <div className="p-6">{children}</div>

        {/* Footer */}
        {footer && <div className="flex justify-end gap-3 p-6 border-t border-gray-200 dark:border-gray-700">{footer}</div>}
      </div>
    </div>
  );
};

Modal.displayName = 'Modal';

export default {
  Button,
  Card,
  Input,
  Modal,
};
