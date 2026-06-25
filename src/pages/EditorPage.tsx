import { ArrowLeft, ChevronDown, ChevronUp, Download, FilePlus2, PencilLine } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { PageThumbnail } from '../components/documents/PageThumbnail';
import { EditToolbar } from '../components/scanner/EditToolbar';
import { FilterSelector } from '../components/scanner/FilterSelector';
import { Button } from '../components/ui/Button';
import { IconButton } from '../components/ui/IconButton';
import { Input } from '../components/ui/Input';
import type { PageFilter, ScanDocument, ScanPage } from '../types/document';
import { cropDocumentImage, getFilterStyle, readFileAsDataUrl, validateImageFile } from '../utils/image';
import { createId } from '../utils/id';

interface EditorPageProps {
  document: ScanDocument;
  exporting?: boolean;
  onBack: () => void;
  onExport: (document: ScanDocument) => void;
  onSave: (documentId: string, pages: ScanPage[], name: string) => void;
  onError: (message: string) => void;
  onSuccess: (message: string) => void;
}

export function EditorPage({ document, exporting, onBack, onError, onExport, onSave, onSuccess }: EditorPageProps) {
  const [pages, setPages] = useState<ScanPage[]>(document.pages);
  const [name, setName] = useState(document.name);
  const [selectedPageId, setSelectedPageId] = useState(document.pages[0]?.id ?? '');
  const [filtersOpen, setFiltersOpen] = useState(true);
  const [saving, setSaving] = useState(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    setPages(document.pages);
    setName(document.name);
    setSelectedPageId(document.pages[0]?.id ?? '');
  }, [document]);

  const selectedPage = pages.find((page) => page.id === selectedPageId) ?? pages[0];
  const selectedIndex = pages.findIndex((page) => page.id === selectedPage?.id);

  function updateSelectedPage(updater: (page: ScanPage) => ScanPage) {
    if (!selectedPage) {
      onError('Nenhuma pagina selecionada.');
      return;
    }

    setPages((currentPages) => currentPages.map((page) => (page.id === selectedPage.id ? updater(page) : page)));
  }

  function handleRotate() {
    updateSelectedPage((page) => ({ ...page, rotation: (page.rotation + 90) % 360 }));
  }

  async function handleCrop() {
    if (!selectedPage) {
      onError('Nenhuma pagina selecionada.');
      return;
    }

    try {
      const imageUrl = await cropDocumentImage(selectedPage.imageUrl);
      updateSelectedPage((page) => ({ ...page, imageUrl }));
      onSuccess('Bordas ajustadas.');
    } catch (error) {
      onError(error instanceof Error ? error.message : 'Nao foi possivel cortar a pagina.');
    }
  }

  function handleDeletePage() {
    if (!selectedPage) {
      return;
    }

    const nextPages = pages.filter((page) => page.id !== selectedPage.id);
    setPages(nextPages);
    setSelectedPageId(nextPages[0]?.id ?? '');
  }

  function handleMove(direction: -1 | 1) {
    if (selectedIndex < 0) {
      return;
    }

    const targetIndex = selectedIndex + direction;

    if (targetIndex < 0 || targetIndex >= pages.length) {
      return;
    }

    const nextPages = [...pages];
    const [movedPage] = nextPages.splice(selectedIndex, 1);
    nextPages.splice(targetIndex, 0, movedPage);
    setPages(nextPages);
  }

  async function handleFileChange(fileList: FileList | null) {
    const file = fileList?.[0];

    if (!file) {
      return;
    }

    const validationError = validateImageFile(file);

    if (validationError) {
      onError(validationError);
      return;
    }

    try {
      const imageUrl = await readFileAsDataUrl(file);
      const page: ScanPage = {
        id: createId('page'),
        imageUrl,
        filter: 'sharp',
        rotation: 0,
        createdAt: new Date().toISOString(),
      };
      setPages((currentPages) => [...currentPages, page]);
      setSelectedPageId(page.id);
      onSuccess('Pagina adicionada.');
    } catch {
      onError('Nao foi possivel importar a imagem.');
    }
  }

  function handleSave() {
    const safeName = name.trim();

    if (!safeName) {
      onError('Informe um nome para o documento.');
      return;
    }

    if (pages.length === 0) {
      onError('Adicione pelo menos uma pagina para criar o PDF.');
      return;
    }

    setSaving(true);
    window.setTimeout(() => {
      onSave(document.id, pages, safeName);
      setSaving(false);
      onSuccess('Documento salvo com sucesso.');
    }, 500);
  }

  function handleExport() {
    const draftDocument = { ...document, name: name.trim() || document.name, pages };
    onExport(draftDocument);
  }

  return (
    <div className="editor-page">
      <header className="editor-header">
        <IconButton icon={ArrowLeft} label="Voltar" onClick={onBack} />
        <Input
          label="Nome do documento"
          onChange={(event) => setName(event.target.value)}
          value={name}
        />
        <Button icon={Download} loading={exporting} onClick={handleExport}>
          Exportar PDF
        </Button>
      </header>
      <main className="editor-workspace">
        <aside className="page-strip">
          <div className="page-strip__top">
            <strong>Paginas</strong>
            <IconButton icon={FilePlus2} label="Adicionar pagina" onClick={() => fileInputRef.current?.click()} />
          </div>
          <div className="page-strip__controls">
            <IconButton disabled={selectedIndex <= 0} icon={ChevronUp} label="Mover pagina para cima" onClick={() => handleMove(-1)} />
            <IconButton
              disabled={selectedIndex < 0 || selectedIndex >= pages.length - 1}
              icon={ChevronDown}
              label="Mover pagina para baixo"
              onClick={() => handleMove(1)}
            />
          </div>
          {pages.map((page, index) => (
            <PageThumbnail
              active={selectedPage?.id === page.id}
              index={index}
              key={page.id}
              onSelect={() => setSelectedPageId(page.id)}
              page={page}
            />
          ))}
        </aside>
        <section className="preview-panel">
          {selectedPage ? (
            <div className="document-preview">
              <img
                alt="Previa da pagina selecionada"
                src={selectedPage.imageUrl}
                style={{ filter: getFilterStyle(selectedPage.filter), transform: `rotate(${selectedPage.rotation}deg)` }}
              />
              <div className="crop-overlay" aria-hidden="true">
                <span />
                <span />
                <span />
                <span />
              </div>
            </div>
          ) : (
            <div className="editor-empty">
              <PencilLine size={34} />
              <h2>Nenhuma pagina</h2>
              <p>Adicione uma imagem para continuar.</p>
            </div>
          )}
        </section>
        <aside className="editor-side">
          <EditToolbar
            onAddPage={() => fileInputRef.current?.click()}
            onCrop={() => void handleCrop()}
            onDeletePage={handleDeletePage}
            onRotate={handleRotate}
            onSave={handleSave}
            onToggleFilters={() => setFiltersOpen((open) => !open)}
            saving={saving}
          />
          {filtersOpen && selectedPage ? (
            <FilterSelector
              activeFilter={selectedPage.filter}
              onChange={(filter: PageFilter) => updateSelectedPage((page) => ({ ...page, filter }))}
            />
          ) : null}
        </aside>
      </main>
      <input
        accept="image/png,image/jpeg,image/webp"
        hidden
        onChange={(event) => void handleFileChange(event.target.files)}
        ref={fileInputRef}
        type="file"
      />
    </div>
  );
}
