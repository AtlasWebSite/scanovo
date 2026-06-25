import { Chrome, Lock, Mail } from 'lucide-react';
import { useState } from 'react';
import { APP_NAME } from '../constants/app';
import { AppLogo } from '../components/layout/AppLogo';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';

interface LoginPageProps {
  onLogin: (email: string) => void;
}

export function LoginPage({ onLogin }: LoginPageProps) {
  const [email, setEmail] = useState('marina@scanovo.app');
  const [password, setPassword] = useState('scanovo123');
  const [errors, setErrors] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const nextErrors = {
      email: email.includes('@') ? '' : 'Informe um e-mail valido.',
      password: password.length >= 6 ? '' : 'Use pelo menos 6 caracteres.',
    };

    setErrors(nextErrors);

    if (nextErrors.email || nextErrors.password) {
      return;
    }

    setLoading(true);
    window.setTimeout(() => {
      setLoading(false);
      onLogin(email);
    }, 650);
  }

  return (
    <main className="login-page">
      <section className="login-visual" aria-hidden="true">
        <div className="scan-sheet scan-sheet--one" />
        <div className="scan-sheet scan-sheet--two" />
        <div className="login-visual__panel">
          <span>PDF pronto</span>
          <strong>3 paginas alinhadas</strong>
        </div>
      </section>
      <section className="login-card">
        <AppLogo />
        <div className="login-card__intro">
          <p>Digitalizacao premium</p>
          <h1>Organize documentos em PDF com velocidade e precisao.</h1>
          <span>
            {APP_NAME} transforma imagens em arquivos limpos, pesquisaveis no seu fluxo e prontos para compartilhar.
          </span>
        </div>
        <form onSubmit={handleSubmit}>
          <Input
            autoComplete="email"
            error={errors.email}
            label="E-mail"
            onChange={(event) => setEmail(event.target.value)}
            placeholder="voce@empresa.com"
            type="email"
            value={email}
          />
          <Input
            autoComplete="current-password"
            error={errors.password}
            label="Senha"
            onChange={(event) => setPassword(event.target.value)}
            placeholder="Sua senha"
            type="password"
            value={password}
          />
          <Button className="login-card__submit" icon={Lock} loading={loading} size="lg" type="submit">
            Entrar
          </Button>
          <Button icon={Chrome} variant="secondary" size="lg" onClick={() => onLogin(email || 'google@scanovo.app')}>
            Entrar com Google
          </Button>
        </form>
        <div className="login-links">
          <button type="button">Criar conta</button>
          <button type="button">Recuperar senha</button>
        </div>
        <div className="login-security">
          <Mail size={16} />
          Autenticacao visual simulada. Nenhum dado sensivel e enviado.
        </div>
      </section>
    </main>
  );
}
