import {
  Copy,
  Download,
  Edit3,
  ExternalLink,
  Heart,
  MoreVertical,
  Share2,
  Star,
  Trash2,
} from 'lucide-react';
import { useState } from 'react';
import type { ScanDocument } from '../../types/document';
import { formatRelativeDate } from '../../utils/date';
import { getFilterStyle } from '../../utils/image';
import { IconButton } from '../ui/IconButton';

interface DocumentCardProps {
  document: ScanDocument;
  view?: 'grid' | 'list';
  onDelete: (document: ScanDocument) => void;
  onDuplicate: (document: ScanDocument) => void;
  onExport: (document: ScanDocument) => void;
  onFavorite: (document: ScanDocument) => void;
  onOpen: (document: ScanDocument) => void;
  onRename: (document: ScanDocument) => void;
  onShare: (document: ScanDocument) => void;
}

export function DocumentCard({
  document,
  onDelete,
  onDuplicate,
  onExport,
  onFavorite,
  onOpen,
  onRename,
  onShare,
  view = 'grid',
}: DocumentCardProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const coverPage = document.pages[0];

  return (
    <article className={`document-card document-card--${view}`}>
      <button className="document-card__cover" onClick={() => onOpen(document)} type="button">
        {coverPage ? (
          <img
            alt=""
            src={coverPage.imageUrl}
            style={{ filter: getFilterStyle(coverPage.filter), transform: `rotate(${coverPage.rotation}deg)` }}
          />
        ) : (
          <span>PDF</span>
        )}
      </button>
      <div className="document-card__body">
        <div>
          <h3>{document.name}</h3>
          <p>
            {formatRelativeDate(document.updatedAt)} · {document.pages.length} pag.
          </p>
          <small>
            {document.sizeKb} KB · {document.status}
          </small>
        </div>
        <div className="document-card__actions">
          <IconButton
            active={document.favorite}
            icon={document.favorite ? Star : Heart}
            label={document.favorite ? 'Remover dos favoritos' : 'Favoritar'}
            onClick={() => onFavorite(document)}
          />
          <div className="menu-wrap">
            <IconButton icon={MoreVertical} label="Acoes do documento" onClick={() => setMenuOpen((open) => !open)} />
            {menuOpen ? (
              <div className="action-menu">
                <button onClick={() => onOpen(document)} type="button">
                  <ExternalLink size={16} /> Abrir
                </button>
                <button onClick={() => onRename(document)} type="button">
                  <Edit3 size={16} /> Renomear
                </button>
                <button onClick={() => onShare(document)} type="button">
                  <Share2 size={16} /> Compartilhar
                </button>
                <button onClick={() => onExport(document)} type="button">
                  <Download size={16} /> Baixar PDF
                </button>
                <button onClick={() => onDuplicate(document)} type="button">
                  <Copy size={16} /> Duplicar
                </button>
                <button className="danger" onClick={() => onDelete(document)} type="button">
                  <Trash2 size={16} /> Excluir
                </button>
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </article>
  );
}
