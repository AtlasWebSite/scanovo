import type { ButtonHTMLAttributes } from 'react';
import type { LucideIcon } from 'lucide-react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  icon?: LucideIcon;
  loading?: boolean;
}

export function Button({
  children,
  className = '',
  disabled,
  icon: Icon,
  loading,
  size = 'md',
  type = 'button',
  variant = 'primary',
  ...props
}: ButtonProps) {
  return (
    <button
      className={`button button--${variant} button--${size} ${className}`}
      disabled={disabled || loading}
      type={type}
      {...props}
    >
      {loading ? <span className="spinner" aria-hidden="true" /> : Icon ? <Icon size={18} /> : null}
      <span>{children}</span>
    </button>
  );
}
