export type DocumentStatus = 'Processado' | 'Rascunho' | 'Exportado';

export type PageFilter = 'original' | 'sharp' | 'bw' | 'gray' | 'contrast';

export type AppPage = 'home' | 'files' | 'scanner' | 'favorites' | 'profile' | 'editor';

export interface ScanPage {
  id: string;
  imageUrl: string;
  filter: PageFilter;
  rotation: number;
  createdAt: string;
}

export interface ScanDocument {
  id: string;
  name: string;
  createdAt: string;
  updatedAt: string;
  pages: ScanPage[];
  favorite: boolean;
  sizeKb: number;
  status: DocumentStatus;
}

export interface UserProfile {
  name: string;
  email: string;
  plan: string;
  pdfQuality: 'Compacto' | 'Equilibrado' | 'Alta qualidade';
  theme: 'Claro' | 'Escuro';
  language: 'Portugues' | 'English' | 'Espanol';
}

export interface ToastMessage {
  id: string;
  type: 'success' | 'error' | 'info';
  title: string;
  description?: string;
}
