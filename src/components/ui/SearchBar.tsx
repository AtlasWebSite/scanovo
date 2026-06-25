import { Search } from 'lucide-react';
import type { InputHTMLAttributes } from 'react';

interface SearchBarProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
}

export function SearchBar({ label = 'Buscar documentos', ...props }: SearchBarProps) {
  return (
    <label className="search-bar">
      <span className="sr-only">{label}</span>
      <Search size={18} aria-hidden="true" />
      <input placeholder={label} {...props} />
    </label>
  );
}
