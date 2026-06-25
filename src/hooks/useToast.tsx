import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from 'react';
import type { ToastMessage } from '../types/document';
import { createId } from '../utils/id';

interface ToastContextValue {
  toasts: ToastMessage[];
  showToast: (toast: Omit<ToastMessage, 'id'>) => void;
  dismissToast: (id: string) => void;
}

const ToastContext = createContext<ToastContextValue | null>(null);

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const dismissToast = useCallback((id: string) => {
    setToasts((currentToasts) => currentToasts.filter((toast) => toast.id !== id));
  }, []);

  const showToast = useCallback(
    (toast: Omit<ToastMessage, 'id'>) => {
      const toastMessage = { ...toast, id: createId('toast') };
      setToasts((currentToasts) => [toastMessage, ...currentToasts].slice(0, 4));
      window.setTimeout(() => dismissToast(toastMessage.id), 4200);
    },
    [dismissToast],
  );

  const value = useMemo(
    () => ({ toasts, showToast, dismissToast }),
    [dismissToast, showToast, toasts],
  );

  return <ToastContext.Provider value={value}>{children}</ToastContext.Provider>;
}

export function useToast() {
  const context = useContext(ToastContext);

  if (!context) {
    throw new Error('useToast precisa estar dentro de ToastProvider.');
  }

  return context;
}
