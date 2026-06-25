import { useEffect, useMemo, useState } from 'react';
import {
  createUserFromSession,
  getCurrentSession,
  persistAuthenticatedUser,
  signInWithGoogle,
  signOutFromSupabase,
} from '../services/auth';
import { isSupabaseConfigured, supabase } from '../services/supabase';
import { defaultUser, loadUser, saveUser } from '../services/storage';
import type { UserProfile } from '../types/document';

export function useAuth() {
  const [ready, setReady] = useState(false);
  const [authenticated, setAuthenticated] = useState(false);
  const [user, setUser] = useState<UserProfile>(() => loadUser());
  const [googleLoading, setGoogleLoading] = useState(false);

  useEffect(() => {
    let mounted = true;

    async function loadSession() {
      try {
        const session = await getCurrentSession();

        if (!mounted) {
          return;
        }

        if (!session) {
          setReady(true);
          return;
        }

        const sessionUser = createUserFromSession(session);
        setUser(sessionUser);
        persistAuthenticatedUser(sessionUser);
        setAuthenticated(true);
      } finally {
        if (mounted) {
          setReady(true);
        }
      }
    }

    void loadSession();

    if (!supabase) {
      return () => {
        mounted = false;
      };
    }

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!session) {
        setAuthenticated(false);
        return;
      }

      const sessionUser = createUserFromSession(session);
      setUser(sessionUser);
      persistAuthenticatedUser(sessionUser);
      setAuthenticated(true);
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  const authStatus = useMemo(
    () => ({
      googleAvailable: isSupabaseConfigured,
      googleLoading,
      ready,
    }),
    [googleLoading, ready],
  );

  function loginWithDemo(email: string) {
    const nextUser = {
      ...defaultUser,
      ...user,
      email,
      authProvider: 'Demo' as const,
    };
    setUser(nextUser);
    saveUser(nextUser);
    setAuthenticated(true);
  }

  async function loginWithGoogle() {
    setGoogleLoading(true);

    try {
      await signInWithGoogle();
    } finally {
      setGoogleLoading(false);
    }
  }

  async function logout() {
    await signOutFromSupabase();
    setAuthenticated(false);
    setUser(loadUser());
  }

  function updateUser(nextUser: UserProfile) {
    setUser(nextUser);
    saveUser(nextUser);
  }

  return {
    authenticated,
    authStatus,
    loginWithDemo,
    loginWithGoogle,
    logout,
    updateUser,
    user,
  };
}
