import { FileSearch, ImagePlus } from 'lucide-react';
import { quickActions } from '../constants/app';
import type { ScanDocument } from '../types/document';
import { DocumentGrid } from '../components/documents/DocumentGrid';
import { Header } from '../components/layout/Header';
import { Button } from '../components/ui/Button';
import { EmptyState } from '../components/ui/EmptyState';
import { SearchBar } from '../components/ui/SearchBar';

interface HomePageProps {
  documents: ScanDocument[];
  search: string;
  onDelete: (document: ScanDocument) => void;
  onDuplicate: (document: ScanDocument) => void;
  onExport: (document: ScanDocument) => void;
  onFavorite: (document: ScanDocument) => void;
  onImport: () => void;
  onNavigateFiles: () => void;
  onOpen: (document: ScanDocument) => void;
  onProfile: () => void;
  onRename: (document: ScanDocument) => void;
  onScan: () => void;
  onSearch: (value: string) => void;
  onShare: (document: ScanDocument) => void;
}

export function HomePage({
  documents,
  onDelete,
  onDuplicate,
  onExport,
  onFavorite,
  onImport,
  onNavigateFiles,
  onOpen,
  onProfile,
  onRename,
  onScan,
  onSearch,
  onShare,
  search,
}: HomePageProps) {
  return (
    <div className="page-flow">
      <Header onProfile={onProfile} title="Bom dia, Marina" subtitle="Seu espaco de digitalizacao esta pronto." />
      <SearchBar onChange={(event) => onSearch(event.target.value)} value={search} />
      <section className="quick-panel">
        <div className="section-title">
          <div>
            <span>Acoes rapidas</span>
            <h2>Comece em poucos cliques</h2>
          </div>
          <Button icon={ImagePlus} onClick={onImport} variant="secondary">
            Importar
          </Button>
        </div>
        <div className="quick-actions">
          {quickActions.slice(0, 5).map((action) => {
            const Icon = action.icon;
            const handleClick = action.id === 'scan' ? onScan : action.id === 'import' ? onImport : onNavigateFiles;
            return (
              <button className={`quick-action quick-action--${action.tone}`} key={action.id} onClick={handleClick} type="button">
                <Icon size={22} />
                <span>{action.label}</span>
              </button>
            );
          })}
        </div>
      </section>
      <section className="page-section">
        <div className="section-title">
          <div>
            <span>Recentes</span>
            <h2>Documentos recentes</h2>
          </div>
          <button className="text-button" onClick={onNavigateFiles} type="button">
            Ver todos
          </button>
        </div>
        {documents.length ? (
          <DocumentGrid
            documents={documents}
            onDelete={onDelete}
            onDuplicate={onDuplicate}
            onExport={onExport}
            onFavorite={onFavorite}
            onOpen={onOpen}
            onRename={onRename}
            onShare={onShare}
          />
        ) : (
          <EmptyState
            actionLabel="Digitalizar agora"
            description="Crie seu primeiro documento a partir da camera ou de uma imagem."
            icon={FileSearch}
            onAction={onScan}
            title="Nenhum documento encontrado"
          />
        )}
      </section>
    </div>
  );
}
