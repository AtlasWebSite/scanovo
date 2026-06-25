import type { ScanDocument } from '../types/document';

function thumbnail(title: string, tone: string): string {
  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" width="720" height="960" viewBox="0 0 720 960">
      <rect width="720" height="960" fill="#f1f5f9"/>
      <rect x="92" y="78" width="536" height="804" rx="34" fill="#ffffff"/>
      <rect x="146" y="148" width="156" height="18" rx="9" fill="${tone}"/>
      <rect x="146" y="214" width="374" height="20" rx="10" fill="#111827"/>
      <rect x="146" y="284" width="420" height="15" rx="7.5" fill="#cbd5e1"/>
      <rect x="146" y="334" width="378" height="15" rx="7.5" fill="#cbd5e1"/>
      <rect x="146" y="384" width="406" height="15" rx="7.5" fill="#cbd5e1"/>
      <rect x="146" y="434" width="318" height="15" rx="7.5" fill="#cbd5e1"/>
      <rect x="146" y="540" width="428" height="118" rx="20" fill="#eef2ff"/>
      <rect x="178" y="580" width="222" height="14" rx="7" fill="#94a3b8"/>
      <rect x="178" y="622" width="318" height="14" rx="7" fill="#94a3b8"/>
      <rect x="146" y="744" width="188" height="70" rx="16" fill="${tone}"/>
      <text x="176" y="790" fill="#ffffff" font-family="Inter, Arial" font-size="24" font-weight="700">${title.slice(0, 14)}</text>
    </svg>
  `;

  return `data:image/svg+xml,${encodeURIComponent(svg)}`;
}

const now = new Date();

function daysAgo(days: number): string {
  const date = new Date(now);
  date.setDate(now.getDate() - days);
  return date.toISOString();
}

export const sampleDocuments: ScanDocument[] = [
  {
    id: 'doc-rent',
    name: 'Contrato de aluguel',
    createdAt: daysAgo(0),
    updatedAt: daysAgo(0),
    favorite: true,
    sizeKb: 842,
    status: 'Processado',
    pages: [{ id: 'page-rent-1', imageUrl: thumbnail('Contrato', '#2563eb'), filter: 'sharp', rotation: 0, createdAt: daysAgo(0) }],
  },
  {
    id: 'doc-receipt',
    name: 'Recibo de pagamento',
    createdAt: daysAgo(1),
    updatedAt: daysAgo(1),
    favorite: false,
    sizeKb: 426,
    status: 'Exportado',
    pages: [{ id: 'page-receipt-1', imageUrl: thumbnail('Recibo', '#0f766e'), filter: 'contrast', rotation: 0, createdAt: daysAgo(1) }],
  },
  {
    id: 'doc-school',
    name: 'Documento escolar',
    createdAt: daysAgo(3),
    updatedAt: daysAgo(2),
    favorite: true,
    sizeKb: 1210,
    status: 'Processado',
    pages: [
      { id: 'page-school-1', imageUrl: thumbnail('Escola', '#7c3aed'), filter: 'original', rotation: 0, createdAt: daysAgo(3) },
      { id: 'page-school-2', imageUrl: thumbnail('Pagina 2', '#7c3aed'), filter: 'gray', rotation: 0, createdAt: daysAgo(3) },
    ],
  },
  {
    id: 'doc-invoice',
    name: 'Nota fiscal',
    createdAt: daysAgo(5),
    updatedAt: daysAgo(5),
    favorite: false,
    sizeKb: 536,
    status: 'Rascunho',
    pages: [{ id: 'page-invoice-1', imageUrl: thumbnail('Fiscal', '#0284c7'), filter: 'bw', rotation: 0, createdAt: daysAgo(5) }],
  },
  {
    id: 'doc-id',
    name: 'RG digitalizado',
    createdAt: daysAgo(8),
    updatedAt: daysAgo(8),
    favorite: false,
    sizeKb: 688,
    status: 'Processado',
    pages: [{ id: 'page-id-1', imageUrl: thumbnail('RG', '#475569'), filter: 'sharp', rotation: 0, createdAt: daysAgo(8) }],
  },
  {
    id: 'doc-homework',
    name: 'Trabalho da escola',
    createdAt: daysAgo(13),
    updatedAt: daysAgo(10),
    favorite: true,
    sizeKb: 1540,
    status: 'Exportado',
    pages: [
      { id: 'page-homework-1', imageUrl: thumbnail('Trabalho', '#16a34a'), filter: 'sharp', rotation: 0, createdAt: daysAgo(13) },
      { id: 'page-homework-2', imageUrl: thumbnail('Anexo', '#16a34a'), filter: 'original', rotation: 0, createdAt: daysAgo(13) },
      { id: 'page-homework-3', imageUrl: thumbnail('Notas', '#16a34a'), filter: 'contrast', rotation: 0, createdAt: daysAgo(13) },
    ],
  },
];
