import { GripVertical, Trash2 } from 'lucide-react';
import type { ScanPage } from '../../types/document';
import { getFilterStyle } from '../../utils/image';
import { IconButton } from '../ui/IconButton';

interface PageThumbnailProps {
  page: ScanPage;
  index: number;
  active?: boolean;
  onSelect?: () => void;
  onDelete?: () => void;
}

export function PageThumbnail({ active, index, onDelete, onSelect, page }: PageThumbnailProps) {
  return (
    <button
      className={`page-thumb ${active ? 'is-active' : ''}`}
      onClick={onSelect}
      type="button"
      aria-label={`Pagina ${index + 1}`}
    >
      <span className="page-thumb__image">
        <img
          alt={`Pagina ${index + 1}`}
          src={page.imageUrl}
          style={{ filter: getFilterStyle(page.filter), transform: `rotate(${page.rotation}deg)` }}
        />
      </span>
      <span className="page-thumb__meta">
        <GripVertical size={14} aria-hidden="true" />
        <strong>{index + 1}</strong>
        {onDelete ? (
          <IconButton
            className="page-thumb__delete"
            icon={Trash2}
            label={`Excluir pagina ${index + 1}`}
            onClick={(event) => {
              event.stopPropagation();
              onDelete();
            }}
            variant="danger"
          />
        ) : null}
      </span>
    </button>
  );
}
