import { ScanLine } from 'lucide-react';
import { APP_NAME } from '../../constants/app';

export function AppLogo() {
  return (
    <div className="app-logo" aria-label={APP_NAME}>
      <span className="app-logo__mark">
        <ScanLine size={22} />
      </span>
      <span className="app-logo__text">{APP_NAME}</span>
    </div>
  );
}
