import {
  Archive,
  Camera,
  FileHeart,
  FilePlus2,
  Files,
  FolderKanban,
  Home,
  ImagePlus,
  Star,
  UserRound,
} from 'lucide-react';
import type { AppPage } from '../types/document';

export const APP_NAME = 'Scanovo';

export const navigationItems: Array<{ page: AppPage; label: string; icon: typeof Home }> = [
  { page: 'home', label: 'Inicio', icon: Home },
  { page: 'files', label: 'Arquivos', icon: Files },
  { page: 'scanner', label: 'Digitalizar', icon: Camera },
  { page: 'favorites', label: 'Favoritos', icon: FileHeart },
  { page: 'profile', label: 'Perfil', icon: UserRound },
];

export const quickActions = [
  { id: 'scan', label: 'Digitalizar', icon: Camera, tone: 'primary' },
  { id: 'import', label: 'Importar imagem', icon: ImagePlus, tone: 'teal' },
  { id: 'pdf', label: 'Criar PDF', icon: FilePlus2, tone: 'violet' },
  { id: 'organize', label: 'Organizar', icon: FolderKanban, tone: 'slate' },
  { id: 'favorites', label: 'Favoritos', icon: Star, tone: 'amber' },
  { id: 'archive', label: 'Arquivar', icon: Archive, tone: 'green' },
] as const;

export const filterLabels = {
  original: 'Original',
  sharp: 'Documento nitido',
  bw: 'Preto e branco',
  gray: 'Escala de cinza',
  contrast: 'Alto contraste',
} as const;
