import { Settings } from 'lucide-react';
import { APP_NAME } from '../../constants/app';
import { IconButton } from '../ui/IconButton';

interface HeaderProps {
  title: string;
  subtitle?: string;
  onProfile: () => void;
}

export function Header({ onProfile, subtitle, title }: HeaderProps) {
  return (
    <header className="content-header">
      <div>
        <span>{APP_NAME}</span>
        <h1>{title}</h1>
        {subtitle ? <p>{subtitle}</p> : null}
      </div>
      <IconButton icon={Settings} label="Abrir perfil e configuracoes" onClick={onProfile} />
    </header>
  );
}
