import { useCallback, useEffect, useMemo, useState } from 'react';
import { loadDocuments, saveDocuments } from '../services/storage';
import type { PageFilter, ScanDocument, ScanPage } from '../types/document';
import { createId } from '../utils/id';

export function useDocuments() {
  const [documents, setDocuments] = useState<ScanDocument[]>(() => loadDocuments());

  useEffect(() => {
    saveDocuments(documents);
  }, [documents]);

  const recentDocuments = useMemo(
    () =>
      [...documents]
        .sort((first, second) => new Date(second.updatedAt).getTime() - new Date(first.updatedAt).getTime())
        .slice(0, 6),
    [documents],
  );

  const favorites = useMemo(() => documents.filter((document) => document.favorite), [documents]);

  const upsertDocument = useCallback((document: ScanDocument) => {
    setDocuments((currentDocuments) => {
      const exists = currentDocuments.some((currentDocument) => currentDocument.id === document.id);

      if (!exists) {
        return [document, ...currentDocuments];
      }

      return currentDocuments.map((currentDocument) =>
        currentDocument.id === document.id ? document : currentDocument,
      );
    });
  }, []);

  const createDocumentFromPages = useCallback((pages: ScanPage[], name = 'Novo documento') => {
    const now = new Date().toISOString();
    const document: ScanDocument = {
      id: createId('doc'),
      name,
      createdAt: now,
      updatedAt: now,
      favorite: false,
      sizeKb: estimateDocumentSize(pages),
      status: 'Rascunho',
      pages,
    };

    setDocuments((currentDocuments) => [document, ...currentDocuments]);
    return document;
  }, []);

  const deleteDocument = useCallback((documentId: string) => {
    setDocuments((currentDocuments) =>
      currentDocuments.filter((currentDocument) => currentDocument.id !== documentId),
    );
  }, []);

  const duplicateDocument = useCallback((documentId: string) => {
    let duplicatedDocument: ScanDocument | null = null;

    setDocuments((currentDocuments) => {
      const sourceDocument = currentDocuments.find((document) => document.id === documentId);

      if (!sourceDocument) {
        return currentDocuments;
      }

      const now = new Date().toISOString();
      duplicatedDocument = {
        ...sourceDocument,
        id: createId('doc'),
        name: `${sourceDocument.name} copia`,
        createdAt: now,
        updatedAt: now,
        favorite: false,
        pages: sourceDocument.pages.map((page) => ({ ...page, id: createId('page') })),
      };

      return [duplicatedDocument, ...currentDocuments];
    });

    return duplicatedDocument;
  }, []);

  const toggleFavorite = useCallback((documentId: string) => {
    setDocuments((currentDocuments) =>
      currentDocuments.map((document) =>
        document.id === documentId
          ? { ...document, favorite: !document.favorite, updatedAt: new Date().toISOString() }
          : document,
      ),
    );
  }, []);

  const renameDocument = useCallback((documentId: string, name: string) => {
    const safeName = name.trim();

    if (!safeName) {
      throw new Error('Informe um nome para o documento.');
    }

    setDocuments((currentDocuments) =>
      currentDocuments.map((document) =>
        document.id === documentId
          ? { ...document, name: safeName, updatedAt: new Date().toISOString() }
          : document,
      ),
    );
  }, []);

  const updateDocumentPages = useCallback((documentId: string, pages: ScanPage[], status: ScanDocument['status']) => {
    setDocuments((currentDocuments) =>
      currentDocuments.map((document) =>
        document.id === documentId
          ? {
              ...document,
              pages,
              status,
              sizeKb: estimateDocumentSize(pages),
              updatedAt: new Date().toISOString(),
            }
          : document,
      ),
    );
  }, []);

  const updatePageFilter = useCallback((documentId: string, pageId: string, filter: PageFilter) => {
    setDocuments((currentDocuments) =>
      currentDocuments.map((document) =>
        document.id === documentId
          ? {
              ...document,
              updatedAt: new Date().toISOString(),
              pages: document.pages.map((page) => (page.id === pageId ? { ...page, filter } : page)),
            }
          : document,
      ),
    );
  }, []);

  return {
    documents,
    recentDocuments,
    favorites,
    setDocuments,
    upsertDocument,
    createDocumentFromPages,
    deleteDocument,
    duplicateDocument,
    toggleFavorite,
    renameDocument,
    updateDocumentPages,
    updatePageFilter,
  };
}

function estimateDocumentSize(pages: ScanPage[]): number {
  const bytes = pages.reduce((total, page) => total + Math.round(page.imageUrl.length * 0.73), 0);
  return Math.max(84, Math.round(bytes / 1024));
}
