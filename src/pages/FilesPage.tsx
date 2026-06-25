import { CalendarDays, Grid2X2, List, SearchX, SortAsc, Star } from 'lucide-react';
import { useMemo, useState } from 'react';
import type { ScanDocument } from '../types/document';
import { DocumentGrid } from '../components/documents/DocumentGrid';
import { Header } from '../components/layout/Header';
import { EmptyState } from '../components/ui/EmptyState';
import { IconButton } from '../components/ui/IconButton';
import { SearchBar } from '../components/ui/SearchBar';

interface FilesPageProps {
  documents: ScanDocument[];
  favoritesOnly?: boolean;
  onDelete: (document: ScanDocument) => void;
  onDuplicate: (document: ScanDocument) => void;
  onExport: (document: ScanDocument) => void;
  onFavorite: (document: ScanDocument) => void;
  onOpen: (document: ScanDocument) => void;
  onProfile: () => void;
  onRename: (document: ScanDocument) => void;
  onScan: () => void;
  onShare: (document: ScanDocument) => void;
}

type SortMode = 'date' | 'name' | 'favorites';

export function FilesPage({
  documents,
  favoritesOnly,
  onDelete,
  onDuplicate,
  onExport,
  onFavorite,
  onOpen,
  onProfile,
  onRename,
  onScan,
  onShare,
}: FilesPageProps) {
  const [search, setSearch] = useState('');
  const [sortMode, setSortMode] = useState<SortMode>('date');
  const [view, setView] = useState<'grid' | 'list'>('grid');

  const filteredDocuments = useMemo(() => {
    const normalizedSearch = search.trim().toLowerCase();
    const baseDocuments = favoritesOnly ? documents.filter((document) => document.favorite) : documents;
    const matchingDocuments = normalizedSearch
      ? baseDocuments.filter((document) => document.name.toLowerCase().includes(normalizedSearch))
      : baseDocuments;

    return [...matchingDocuments].sort((first, second) => {
      if (sortMode === 'name') {
        return first.name.localeCompare(second.name);
      }

      if (sortMode === 'favorites') {
        return Number(second.favorite) - Number(first.favorite);
      }

      return new Date(second.updatedAt).getTime() - new Date(first.updatedAt).getTime();
    });
  }, [documents, favoritesOnly, search, sortMode]);

  return (
    <div className="page-flow">
      <Header
        onProfile={onProfile}
        title={favoritesOnly ? 'Favoritos' : 'Arquivos'}
        subtitle={favoritesOnly ? 'Documentos marcados para acesso rapido.' : 'Todos os PDFs e rascunhos salvos.'}
      />
      <section className="files-toolbar">
        <SearchBar onChange={(event) => setSearch(event.target.value)} value={search} />
        <div className="segmented" aria-label="Ordenacao">
          <button className={sortMode === 'date' ? 'is-active' : ''} onClick={() => setSortMode('date')} type="button">
            <CalendarDays size={16} /> Data
          </button>
          <button className={sortMode === 'name' ? 'is-active' : ''} onClick={() => setSortMode('name')} type="button">
            <SortAsc size={16} /> Nome
          </button>
          <button className={sortMode === 'favorites' ? 'is-active' : ''} onClick={() => setSortMode('favorites')} type="button">
            <Star size={16} /> Favoritos
          </button>
        </div>
        <div className="view-toggle">
          <IconButton active={view === 'grid'} icon={Grid2X2} label="Visualizar em grade" onClick={() => setView('grid')} />
          <IconButton active={view === 'list'} icon={List} label="Visualizar em lista" onClick={() => setView('list')} />
        </div>
      </section>
      {filteredDocuments.length ? (
        <DocumentGrid
          documents={filteredDocuments}
          onDelete={onDelete}
          onDuplicate={onDuplicate}
          onExport={onExport}
          onFavorite={onFavorite}
          onOpen={onOpen}
          onRename={onRename}
          onShare={onShare}
          view={view}
        />
      ) : (
        <EmptyState
          actionLabel="Digitalizar documento"
          description={search ? 'Tente buscar por outro nome ou ajuste os filtros.' : 'Adicione paginas pela camera ou por upload.'}
          icon={SearchX}
          onAction={onScan}
          title="Nenhum documento encontrado"
        />
      )}
    </div>
  );
}
