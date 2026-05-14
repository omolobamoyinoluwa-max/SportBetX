import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, AlertCircle, CheckCircle, RefreshCw } from 'lucide-react';

export type ToastType = 'error' | 'success' | 'info';

export interface ToastMessage {
  id: string;
  type: ToastType;
  message: string;
  retryable?: boolean;
  onRetry?: () => void;
}

interface ToastProps {
  toasts: ToastMessage[];
  onDismiss: (id: string) => void;
}

export const Toast: React.FC<ToastProps> = ({ toasts, onDismiss }) => {
  return (
    <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2">
      <AnimatePresence>
        {toasts.map((toast) => (
          <ToastItem key={toast.id} toast={toast} onDismiss={onDismiss} />
        ))}
      </AnimatePresence>
    </div>
  );
};

const ToastItem: React.FC<{ toast: ToastMessage; onDismiss: (id: string) => void }> = ({
  toast,
  onDismiss,
}) => {
  useEffect(() => {
    if (!toast.retryable) {
      const timer = setTimeout(() => onDismiss(toast.id), 5000);
      return () => clearTimeout(timer);
    }
  }, [toast.id, toast.retryable, onDismiss]);

  const bgColor =
    toast.type === 'error'
      ? 'bg-red-600'
      : toast.type === 'success'
      ? 'bg-green-600'
      : 'bg-blue-600';

  const Icon = toast.type === 'error' ? AlertCircle : CheckCircle;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className={`${bgColor} text-white rounded-lg shadow-lg p-4 max-w-sm flex items-start gap-3`}
    >
      <Icon className="w-5 h-5 mt-0.5 flex-shrink-0" />
      <div className="flex-1 text-sm">{toast.message}</div>
      <div className="flex items-center gap-2 flex-shrink-0">
        {toast.retryable && toast.onRetry && (
          <button
            onClick={toast.onRetry}
            className="flex items-center gap-1 text-xs bg-white/20 hover:bg-white/30 rounded px-2 py-1"
          >
            <RefreshCw className="w-3 h-3" />
            Retry
          </button>
        )}
        <button onClick={() => onDismiss(toast.id)} className="hover:opacity-75">
          <X className="w-4 h-4" />
        </button>
      </div>
    </motion.div>
  );
};
