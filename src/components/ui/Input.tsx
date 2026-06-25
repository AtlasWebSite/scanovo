import type { InputHTMLAttributes } from 'react';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
}

export function Input({ className = '', error, id, label, ...props }: InputProps) {
  const inputId = id ?? label.toLowerCase().replace(/\s+/g, '-');

  return (
    <label className={`field ${className}`} htmlFor={inputId}>
      <span>{label}</span>
      <input aria-invalid={Boolean(error)} id={inputId} {...props} />
      {error ? <small role="alert">{error}</small> : null}
    </label>
  );
}
