import { navigationItems } from '../../constants/app';
import type { AppPage } from '../../types/document';

interface BottomNavigationProps {
  activePage: AppPage;
  onNavigate: (page: AppPage) => void;
}

export function BottomNavigation({ activePage, onNavigate }: BottomNavigationProps) {
  return (
    <nav className="bottom-nav" aria-label="Principal">
      {navigationItems.map((item) => {
        const Icon = item.icon;
        const isScan = item.page === 'scanner';
        return (
          <button
            className={`${activePage === item.page ? 'is-active' : ''} ${isScan ? 'bottom-nav__scan' : ''}`}
            key={item.page}
            onClick={() => onNavigate(item.page)}
            type="button"
          >
            <Icon size={isScan ? 24 : 20} />
            <span>{item.label}</span>
          </button>
        );
      })}
    </nav>
  );
}
