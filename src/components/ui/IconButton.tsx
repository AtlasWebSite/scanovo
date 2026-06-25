import type { ButtonHTMLAttributes } from 'react';
import type { LucideIcon } from 'lucide-react';

interface IconButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  icon: LucideIcon;
  label: string;
  active?: boolean;
  variant?: 'light' | 'dark' | 'primary' | 'danger';
}

export function IconButton({
  active,
  className = '',
  icon: Icon,
  label,
  type = 'button',
  variant = 'light',
  ...props
}: IconButtonProps) {
  return (
    <button
      aria-label={label}
      className={`icon-button icon-button--${variant} ${active ? 'is-active' : ''} ${className}`}
      title={label}
      type={type}
      {...props}
    >
      <Icon size={18} />
    </button>
  );
}
