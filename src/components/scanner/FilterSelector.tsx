import { filterLabels } from '../../constants/app';
import type { PageFilter } from '../../types/document';

const filters = Object.entries(filterLabels) as Array<[PageFilter, string]>;

interface FilterSelectorProps {
  activeFilter: PageFilter;
  onChange: (filter: PageFilter) => void;
}

export function FilterSelector({ activeFilter, onChange }: FilterSelectorProps) {
  return (
    <div className="filter-selector" aria-label="Filtros">
      {filters.map(([filter, label]) => (
        <button
          className={activeFilter === filter ? 'is-active' : ''}
          key={filter}
          onClick={() => onChange(filter)}
          type="button"
        >
          {label}
        </button>
      ))}
    </div>
  );
}
