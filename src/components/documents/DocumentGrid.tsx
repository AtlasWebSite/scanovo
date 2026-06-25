import type { ScanDocument } from '../../types/document';
import { DocumentCard } from './DocumentCard';

interface DocumentGridProps {
  documents: ScanDocument[];
  view?: 'grid' | 'list';
  onDelete: (document: ScanDocument) => void;
  onDuplicate: (document: ScanDocument) => void;
  onExport: (document: ScanDocument) => void;
  onFavorite: (document: ScanDocument) => void;
  onOpen: (document: ScanDocument) => void;
  onRename: (document: ScanDocument) => void;
  onShare: (document: ScanDocument) => void;
}

export function DocumentGrid({ documents, view = 'grid', ...actions }: DocumentGridProps) {
  return (
    <div className={`document-grid document-grid--${view}`}>
      {documents.map((document) => (
        <DocumentCard document={document} key={document.id} view={view} {...actions} />
      ))}
    </div>
  );
}
