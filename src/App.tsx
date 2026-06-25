import { useMemo, useRef, useState } from 'react';
import { BottomNavigation } from './components/layout/BottomNavigation';
import { FloatingScanButton } from './components/layout/FloatingScanButton';
import { Sidebar } from './components/layout/Sidebar';
import { ConfirmDialog } from './components/ui/ConfirmDialog';
import { Button } from './components/ui/Button';
import { Input } from './components/ui/Input';
import { Modal } from './components/ui/Modal';
import { ToastStack } from './components/ui/ToastStack';
import { useDocuments } from './hooks/useDocuments';
import { useAuth } from './hooks/useAuth';
import { ToastProvider, useToast } from './hooks/useToast';
import { exportDocumentToPdf } from './services/pdf';
import { EditorPage } from './pages/EditorPage';
import { FilesPage } from './pages/FilesPage';
import { HomePage } from './pages/HomePage';
import { LoginPage } from './pages/LoginPage';
import { ProfilePage } from './pages/ProfilePage';
import { ScannerPage } from './pages/ScannerPage';
import type { AppPage, ScanDocument, ScanPage, UserProfile } from './types/document';
import { createId } from './utils/id';
import { readFileAsDataUrl, validateImageFile } from './utils/image';

function ScanovoApp() {
  const {
    createDocumentFromPages,
    deleteDocument,
    documents,
    duplicateDocument,
    favorites,
    recentDocuments,
    renameDocument,
    toggleFavorite,
    updateDocumentPages,
  } = useDocuments();
  const { showToast } = useToast();
  const {
    authenticated,
    authStatus,
    loginWithDemo,
    loginWithGoogle,
    logout,
    updateUser,
    user,
  } = useAuth();
  const [activePage, setActivePage] = useState<AppPage>('home');
  const [editingDocumentId, setEditingDocumentId] = useState<string | null>(null);
  const [homeSearch, setHomeSearch] = useState('');
  const [documentToDelete, setDocumentToDelete] = useState<ScanDocument | null>(null);
  const [documentToRename, setDocumentToRename] = useState<ScanDocument | null>(null);
  const [renameValue, setRenameValue] = useState('');
  const [exportingId, setExportingId] = useState<string | null>(null);
  const importInputRef = useRef<HTMLInputElement | null>(null);

  const editingDocument = documents.find((document) => document.id === editingDocumentId) ?? null;
  const searchedRecentDocuments = useMemo(() => {
    const query = homeSearch.trim().toLowerCase();
    return query
      ? recentDocuments.filter((document) => document.name.toLowerCase().includes(query))
      : recentDocuments;
  }, [homeSearch, recentDocuments]);

  if (!authStatus.ready) {
    return (
      <>
        <div className="auth-loading">
          <span className="spinner" aria-hidden="true" />
          Preparando sua sessao
        </div>
        <ToastStack />
      </>
    );
  }

  if (!authenticated) {
    return (
      <>
        <LoginPage
          googleAvailable={authStatus.googleAvailable}
          googleLoading={authStatus.googleLoading}
          onGoogleLogin={async () => {
            try {
              await loginWithGoogle();
            } catch (error) {
              showToast({
                type: 'error',
                title: 'Login Google indisponivel.',
                description: error instanceof Error ? error.message : 'Verifique a configuracao do Supabase.',
              });
            }
          }}
          onLogin={(email) => {
            loginWithDemo(email);
            showToast({ type: 'success', title: 'Bem-vindo ao Scanovo.' });
          }}
        />
        <ToastStack />
      </>
    );
  }

  function navigate(page: AppPage) {
    setActivePage(page);
  }

  function openEditor(document: ScanDocument) {
    setEditingDocumentId(document.id);
    setActivePage('editor');
  }

  function handleCreateDocument(pages: ScanPage[]) {
    return createDocumentFromPages(pages, `Documento ${new Date().toLocaleDateString('pt-BR')}`);
  }

  function handleFavorite(document: ScanDocument) {
    toggleFavorite(document.id);
    showToast({
      type: 'success',
      title: document.favorite ? 'Removido dos favoritos.' : 'Adicionado aos favoritos.',
    });
  }

  async function handleExport(document: ScanDocument) {
    if (document.pages.length === 0) {
      showToast({ type: 'error', title: 'Adicione pelo menos uma pagina para criar o PDF.' });
      return;
    }

    try {
      setExportingId(document.id);
      await exportDocumentToPdf(document);
      updateDocumentPages(document.id, document.pages, 'Exportado');
      showToast({ type: 'success', title: 'PDF exportado com sucesso.' });
    } catch (error) {
      showToast({
        type: 'error',
        title: 'Erro ao exportar PDF.',
        description: error instanceof Error ? error.message : 'Tente novamente em instantes.',
      });
    } finally {
      setExportingId(null);
    }
  }

  function handleShare(document: ScanDocument) {
    if (navigator.share) {
      void navigator
        .share({ title: document.name, text: `Documento ${document.name} criado no Scanovo.` })
        .catch(() => showToast({ type: 'info', title: 'Compartilhamento cancelado.' }));
      return;
    }

    void navigator.clipboard?.writeText(document.name);
    showToast({ type: 'success', title: 'Link simulado copiado.' });
  }

  async function handleImportFile(fileList: FileList | null) {
    const file = fileList?.[0];

    if (!file) {
      return;
    }

    const validationError = validateImageFile(file);

    if (validationError) {
      showToast({ type: 'error', title: validationError });
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
      const document = createDocumentFromPages([page], file.name.replace(/\.[^/.]+$/, '') || 'Imagem importada');
      showToast({ type: 'success', title: 'Imagem importada com sucesso.' });
      openEditor(document);
    } catch {
      showToast({ type: 'error', title: 'Nao foi possivel importar a imagem.' });
    } finally {
      if (importInputRef.current) {
        importInputRef.current.value = '';
      }
    }
  }

  function handleSaveEditor(documentId: string, pages: ScanPage[], name: string) {
    try {
      renameDocument(documentId, name);
      updateDocumentPages(documentId, pages, 'Processado');
    } catch (error) {
      showToast({
        type: 'error',
        title: error instanceof Error ? error.message : 'Nao foi possivel salvar o documento.',
      });
    }
  }

  function confirmRename() {
    if (!documentToRename) {
      return;
    }

    try {
      renameDocument(documentToRename.id, renameValue);
      setDocumentToRename(null);
      showToast({ type: 'success', title: 'Documento renomeado.' });
    } catch (error) {
      showToast({
        type: 'error',
        title: error instanceof Error ? error.message : 'Nao foi possivel renomear.',
      });
    }
  }

  function renderPage() {
    if (activePage === 'scanner') {
      return (
        <ScannerPage
          onBack={() => navigate('home')}
          onCreateDocument={handleCreateDocument}
          onEditDocument={openEditor}
          onError={(message) => showToast({ type: 'error', title: message })}
          onSuccess={(message) => showToast({ type: 'success', title: message })}
        />
      );
    }

    if (activePage === 'editor') {
      if (!editingDocument) {
        return (
          <HomePage
            documents={searchedRecentDocuments}
            onDelete={setDocumentToDelete}
            onDuplicate={(document) => {
              const duplicatedDocument = duplicateDocument(document.id);
              if (duplicatedDocument) openEditor(duplicatedDocument);
            }}
            onExport={handleExport}
            onFavorite={handleFavorite}
            onImport={() => importInputRef.current?.click()}
            onNavigateFiles={() => navigate('files')}
            onOpen={openEditor}
            onProfile={() => navigate('profile')}
            onRename={(document) => {
              setDocumentToRename(document);
              setRenameValue(document.name);
            }}
            onScan={() => navigate('scanner')}
            onSearch={setHomeSearch}
            onShare={handleShare}
            search={homeSearch}
          />
        );
      }

      return (
        <EditorPage
          document={editingDocument}
          exporting={exportingId === editingDocument.id}
          onBack={() => navigate('files')}
          onError={(message) => showToast({ type: 'error', title: message })}
          onExport={handleExport}
          onSave={handleSaveEditor}
          onSuccess={(message) => showToast({ type: 'success', title: message })}
        />
      );
    }

    if (activePage === 'files' || activePage === 'favorites') {
      return (
        <FilesPage
          documents={activePage === 'favorites' ? favorites : documents}
          favoritesOnly={activePage === 'favorites'}
          onDelete={setDocumentToDelete}
          onDuplicate={(document) => {
            duplicateDocument(document.id);
            showToast({ type: 'success', title: 'Documento duplicado.' });
          }}
          onExport={handleExport}
          onFavorite={handleFavorite}
          onOpen={openEditor}
          onProfile={() => navigate('profile')}
          onRename={(document) => {
            setDocumentToRename(document);
            setRenameValue(document.name);
          }}
          onScan={() => navigate('scanner')}
          onShare={handleShare}
        />
      );
    }

    if (activePage === 'profile') {
      return (
        <ProfilePage
          documents={documents}
          onLogout={() => {
            void logout();
            showToast({ type: 'info', title: 'Sessao encerrada.' });
          }}
          onProfile={() => navigate('profile')}
          onUpdateUser={(nextUser) => {
            updateUser(nextUser);
            showToast({ type: 'success', title: 'Configuracao salva.' });
          }}
          user={user}
        />
      );
    }

    return (
      <HomePage
        documents={searchedRecentDocuments}
        onDelete={setDocumentToDelete}
        onDuplicate={(document) => {
          duplicateDocument(document.id);
          showToast({ type: 'success', title: 'Documento duplicado.' });
        }}
        onExport={handleExport}
        onFavorite={handleFavorite}
        onImport={() => importInputRef.current?.click()}
        onNavigateFiles={() => navigate('files')}
        onOpen={openEditor}
        onProfile={() => navigate('profile')}
        onRename={(document) => {
          setDocumentToRename(document);
          setRenameValue(document.name);
        }}
        onScan={() => navigate('scanner')}
        onSearch={setHomeSearch}
        onShare={handleShare}
        search={homeSearch}
      />
    );
  }

  return (
    <>
      <div className={activePage === 'scanner' ? 'app-shell app-shell--scanner' : 'app-shell'}>
        {activePage !== 'scanner' ? <Sidebar activePage={activePage} onNavigate={navigate} /> : null}
        <main className="app-content">{renderPage()}</main>
        {activePage !== 'scanner' ? <FloatingScanButton onClick={() => navigate('scanner')} /> : null}
        {activePage !== 'scanner' ? <BottomNavigation activePage={activePage} onNavigate={navigate} /> : null}
      </div>
      <input
        accept="image/png,image/jpeg,image/webp"
        hidden
        onChange={(event) => void handleImportFile(event.target.files)}
        ref={importInputRef}
        type="file"
      />
      {documentToDelete ? (
        <ConfirmDialog
          confirmLabel="Excluir"
          description={`Excluir "${documentToDelete.name}" remove o documento deste dispositivo.`}
          onCancel={() => setDocumentToDelete(null)}
          onConfirm={() => {
            deleteDocument(documentToDelete.id);
            setDocumentToDelete(null);
            showToast({ type: 'success', title: 'Documento excluido.' });
          }}
          title="Excluir documento"
        />
      ) : null}
      {documentToRename ? (
        <Modal onClose={() => setDocumentToRename(null)} title="Renomear documento">
          <div className="rename-form">
            <Input
              autoFocus
              label="Nome"
              onChange={(event) => setRenameValue(event.target.value)}
              value={renameValue}
            />
            <div className="modal-actions">
              <Button variant="secondary" onClick={() => setDocumentToRename(null)}>
                Cancelar
              </Button>
              <Button onClick={confirmRename}>Salvar</Button>
            </div>
          </div>
        </Modal>
      ) : null}
      <ToastStack />
    </>
  );
}

export default function App() {
  return (
    <ToastProvider>
      <ScanovoApp />
    </ToastProvider>
  );
}
