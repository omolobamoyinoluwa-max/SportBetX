import { useState, useCallback } from 'react';
import { ToastMessage, ToastType } from '../components/Toast';

let idCounter = 0;

export function useToast() {
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const addToast = useCallback(
    (message: string, type: ToastType = 'info', options?: { retryable?: boolean; onRetry?: () => void }) => {
      const id = String(++idCounter);
      setToasts((prev) => [...prev, { id, type, message, ...options }]);
      return id;
    },
    []
  );

  const dismiss = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const showStellarError = useCallback(
    (error: { message: string; code: string; retryable: boolean }, onRetry?: () => void) => {
      addToast(error.message, 'error', {
        retryable: error.retryable,
        onRetry: error.retryable ? onRetry : undefined,
      });
    },
    [addToast]
  );

  return { toasts, addToast, dismiss, showStellarError };
}
