import { navigationItems } from '../../constants/app';
import type { AppPage } from '../../types/document';
import { AppLogo } from './AppLogo';

interface SidebarProps {
  activePage: AppPage;
  onNavigate: (page: AppPage) => void;
}

export function Sidebar({ activePage, onNavigate }: SidebarProps) {
  return (
    <aside className="sidebar">
      <AppLogo />
      <nav aria-label="Principal">
        {navigationItems.map((item) => {
          const Icon = item.icon;
          return (
            <button
              className={activePage === item.page ? 'is-active' : ''}
              key={item.page}
              onClick={() => onNavigate(item.page)}
              type="button"
            >
              <Icon size={19} />
              <span>{item.label}</span>
            </button>
          );
        })}
      </nav>
    </aside>
  );
}
