import { CheckCircle2, Info, XCircle } from 'lucide-react';
import { useToast } from '../../hooks/useToast';

const icons = {
  success: CheckCircle2,
  error: XCircle,
  info: Info,
};

export function ToastStack() {
  const { dismissToast, toasts } = useToast();

  return (
    <div className="toast-stack" aria-live="polite">
      {toasts.map((toast) => {
        const Icon = icons[toast.type];
        return (
          <button
            className={`toast toast--${toast.type}`}
            key={toast.id}
            onClick={() => dismissToast(toast.id)}
            type="button"
          >
            <Icon size={20} />
            <span>
              <strong>{toast.title}</strong>
              {toast.description ? <small>{toast.description}</small> : null}
            </span>
          </button>
        );
      })}
    </div>
  );
}
