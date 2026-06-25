import type { Session } from '@supabase/supabase-js';
import { defaultUser, saveUser } from './storage';
import { getAuthRedirectUrl, isSupabaseConfigured, supabase } from './supabase';
import type { UserProfile } from '../types/document';

export function createUserFromSession(session: Session): UserProfile {
  const metadata = session.user.user_metadata;
  const name =
    readString(metadata.full_name) ||
    readString(metadata.name) ||
    session.user.email?.split('@')[0] ||
    defaultUser.name;

  return {
    ...defaultUser,
    name,
    email: session.user.email ?? defaultUser.email,
    avatarUrl: readString(metadata.avatar_url) || readString(metadata.picture),
    authProvider: 'Google',
    plan: 'Pro Cloud',
  };
}

export async function getCurrentSession(): Promise<Session | null> {
  if (!supabase) {
    return null;
  }

  const { data, error } = await supabase.auth.getSession();

  if (error) {
    throw error;
  }

  return data.session;
}

export async function signInWithGoogle(): Promise<void> {
  if (!isSupabaseConfigured || !supabase) {
    throw new Error('Configure o Supabase para ativar o login com Google.');
  }

  const { error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      queryParams: {
        access_type: 'offline',
        prompt: 'consent',
      },
      redirectTo: getAuthRedirectUrl(),
    },
  });

  if (error) {
    throw error;
  }
}

export async function signOutFromSupabase(): Promise<void> {
  if (!supabase) {
    return;
  }

  const { error } = await supabase.auth.signOut();

  if (error) {
    throw error;
  }
}

export function persistAuthenticatedUser(user: UserProfile): void {
  saveUser(user);
}

function readString(value: unknown): string {
  return typeof value === 'string' ? value : '';
}
