import type { ScanDocument } from '../types/document';

export async function exportDocumentToPdf(document: ScanDocument): Promise<void> {
  if (document.pages.length === 0) {
    throw new Error('Adicione pelo menos uma pagina para criar o PDF.');
  }

  const { jsPDF } = await import('jspdf');
  const pdf = new jsPDF({ orientation: 'portrait', unit: 'pt', format: 'a4' });
  const pageWidth = pdf.internal.pageSize.getWidth();
  const pageHeight = pdf.internal.pageSize.getHeight();

  for (const [index, page] of document.pages.entries()) {
    if (index > 0) {
      pdf.addPage();
    }

    const image = await loadImage(page.imageUrl);
    const ratio = Math.min((pageWidth - 48) / image.width, (pageHeight - 48) / image.height);
    const width = image.width * ratio;
    const height = image.height * ratio;
    const x = (pageWidth - width) / 2;
    const y = (pageHeight - height) / 2;
    pdf.addImage(page.imageUrl, 'JPEG', x, y, width, height, undefined, 'FAST', page.rotation);
  }

  pdf.save(`${sanitizeFileName(document.name)}.pdf`);
}

function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const image = new Image();
    image.onload = () => resolve(image);
    image.onerror = () => reject(new Error('Nao foi possivel exportar uma das paginas.'));
    image.src = src;
  });
}

function sanitizeFileName(name: string): string {
  const cleanName = name
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9-_ ]/gi, '')
    .trim()
    .replace(/\s+/g, '-')
    .toLowerCase();

  return cleanName || 'documento-scanovo';
}
