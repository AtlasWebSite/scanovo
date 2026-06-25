import { HardDrive, LogOut, Moon, ShieldCheck, Sparkles } from 'lucide-react';
import type { ScanDocument, UserProfile } from '../types/document';
import { Header } from '../components/layout/Header';
import { Button } from '../components/ui/Button';

interface ProfilePageProps {
  documents: ScanDocument[];
  onLogout: () => void;
  onProfile: () => void;
  onUpdateUser: (user: UserProfile) => void;
  user: UserProfile;
}

export function ProfilePage({ documents, onLogout, onProfile, onUpdateUser, user }: ProfilePageProps) {
  const storageUsed = documents.reduce((total, document) => total + document.sizeKb, 0);

  return (
    <div className="page-flow">
      <Header onProfile={onProfile} title="Perfil" subtitle="Preferencias locais e plano simulado." />
      <section className="profile-hero">
        <div className="avatar">MC</div>
        <div>
          <h2>{user.name}</h2>
          <p>{user.email}</p>
        </div>
        <span>
          <Sparkles size={16} /> {user.plan}
        </span>
      </section>
      <section className="settings-grid">
        <div className="setting-row">
          <div>
            <ShieldCheck size={20} />
            <span>
              <strong>Qualidade do PDF</strong>
              <small>Controle tamanho e nitidez das exportacoes.</small>
            </span>
          </div>
          <select
            aria-label="Qualidade do PDF"
            onChange={(event) => onUpdateUser({ ...user, pdfQuality: event.target.value as UserProfile['pdfQuality'] })}
            value={user.pdfQuality}
          >
            <option>Compacto</option>
            <option>Equilibrado</option>
            <option>Alta qualidade</option>
          </select>
        </div>
        <div className="setting-row">
          <div>
            <Moon size={20} />
            <span>
              <strong>Tema</strong>
              <small>Modo escuro preparado para expansao.</small>
            </span>
          </div>
          <select
            aria-label="Tema"
            onChange={(event) => onUpdateUser({ ...user, theme: event.target.value as UserProfile['theme'] })}
            value={user.theme}
          >
            <option>Claro</option>
            <option>Escuro</option>
          </select>
        </div>
        <div className="setting-row">
          <div>
            <HardDrive size={20} />
            <span>
              <strong>Armazenamento usado</strong>
              <small>{storageUsed} KB em documentos locais.</small>
            </span>
          </div>
          <div className="storage-meter" aria-label={`${storageUsed} KB usados`}>
            <span style={{ width: `${Math.min(100, storageUsed / 45)}%` }} />
          </div>
        </div>
      </section>
      <Button icon={LogOut} onClick={onLogout} variant="danger">
        Sair
      </Button>
    </div>
  );
}
