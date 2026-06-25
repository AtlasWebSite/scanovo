import { ArrowRight, FilePlus2, Trash2 } from 'lucide-react';
import { useState } from 'react';
import { PageThumbnail } from '../components/documents/PageThumbnail';
import { ScannerView } from '../components/scanner/ScannerView';
import { Button } from '../components/ui/Button';
import { EmptyState } from '../components/ui/EmptyState';
import type { ScanDocument, ScanPage } from '../types/document';
import { createId } from '../utils/id';

interface ScannerPageProps {
  onBack: () => void;
  onCreateDocument: (pages: ScanPage[]) => ScanDocument;
  onEditDocument: (document: ScanDocument) => void;
  onError: (message: string) => void;
  onSuccess: (message: string) => void;
}

export function ScannerPage({ onBack, onCreateDocument, onEditDocument, onError, onSuccess }: ScannerPageProps) {
  const [capturedPages, setCapturedPages] = useState<ScanPage[]>([]);
  const [selectedPageId, setSelectedPageId] = useState<string | null>(null);

  function handleCapture(imageUrl: string) {
    const page: ScanPage = {
      id: createId('page'),
      imageUrl,
      filter: 'sharp',
      rotation: 0,
      createdAt: new Date().toISOString(),
    };

    setCapturedPages((pages) => [...pages, page]);
    setSelectedPageId(page.id);
    onSuccess('Pagina capturada com sucesso.');
  }

  function handleContinue() {
    if (capturedPages.length === 0) {
      onError('Adicione pelo menos uma pagina para criar o PDF.');
      return;
    }

    const document = onCreateDocument(capturedPages);
    onEditDocument(document);
  }

  return (
    <div className="scanner-page">
      <ScannerView onBack={onBack} onCapture={handleCapture} onError={onError} />
      <aside className="capture-tray">
        <div className="capture-tray__header">
          <div>
            <span>Previa</span>
            <h2>{capturedPages.length} pagina(s)</h2>
          </div>
          <Button disabled={capturedPages.length === 0} icon={ArrowRight} onClick={handleContinue}>
            Editar
          </Button>
        </div>
        {capturedPages.length ? (
          <div className="capture-list">
            {capturedPages.map((page, index) => (
              <PageThumbnail
                active={selectedPageId === page.id}
                index={index}
                key={page.id}
                onDelete={() => setCapturedPages((pages) => pages.filter((currentPage) => currentPage.id !== page.id))}
                onSelect={() => setSelectedPageId(page.id)}
                page={page}
              />
            ))}
          </div>
        ) : (
          <EmptyState
            description="Capture pela camera, use o botao de demonstracao ou importe uma imagem."
            icon={FilePlus2}
            title="Nenhuma pagina adicionada"
          />
        )}
        {capturedPages.length ? (
          <button className="clear-pages" onClick={() => setCapturedPages([])} type="button">
            <Trash2 size={16} /> Limpar paginas
          </button>
        ) : null}
      </aside>
    </div>
  );
}
