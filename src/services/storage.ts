import { sampleDocuments } from '../data/sampleDocuments';
import type { ScanDocument, UserProfile } from '../types/document';

const DOCUMENTS_KEY = 'scanovo.documents.v1';
const USER_KEY = 'scanovo.user.v1';

export const defaultUser: UserProfile = {
  name: 'Marina Costa',
  email: 'marina@scanovo.app',
  plan: 'Pro Simulado',
  pdfQuality: 'Equilibrado',
  theme: 'Claro',
  language: 'Portugues',
  authProvider: 'Demo',
};

export function loadDocuments(): ScanDocument[] {
  try {
    const stored = localStorage.getItem(DOCUMENTS_KEY);

    if (!stored) {
      saveDocuments(sampleDocuments);
      return sampleDocuments;
    }

    const parsed = JSON.parse(stored) as ScanDocument[];
    return Array.isArray(parsed) ? parsed : sampleDocuments;
  } catch {
    return sampleDocuments;
  }
}

export function saveDocuments(documents: ScanDocument[]): void {
  localStorage.setItem(DOCUMENTS_KEY, JSON.stringify(documents));
}

export function loadUser(): UserProfile {
  try {
    const stored = localStorage.getItem(USER_KEY);
    return stored ? { ...defaultUser, ...JSON.parse(stored) } : defaultUser;
  } catch {
    return defaultUser;
  }
}

export function saveUser(user: UserProfile): void {
  localStorage.setItem(USER_KEY, JSON.stringify(user));
}
