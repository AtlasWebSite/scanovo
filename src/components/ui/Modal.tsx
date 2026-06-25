import { X } from 'lucide-react';
import type { ReactNode } from 'react';
import { IconButton } from './IconButton';

interface ModalProps {
  children: ReactNode;
  onClose: () => void;
  title: string;
}

export function Modal({ children, onClose, title }: ModalProps) {
  return (
    <div className="modal-backdrop" role="presentation" onMouseDown={onClose}>
      <section
        aria-modal="true"
        className="modal"
        role="dialog"
        aria-labelledby="modal-title"
        onMouseDown={(event) => event.stopPropagation()}
      >
        <header className="modal__header">
          <h2 id="modal-title">{title}</h2>
          <IconButton icon={X} label="Fechar" onClick={onClose} />
        </header>
        {children}
      </section>
    </div>
  );
}
