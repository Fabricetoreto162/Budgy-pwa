import { Injectable, signal, inject } from '@angular/core';
import { Router } from '@angular/router';
import { supabase } from '../../data/supabase/supabase-client';
import type { User, Session } from '@supabase/supabase-js';

@Injectable({ providedIn: 'root' })
export class AuthService {
  readonly currentUser = signal<User | null>(null);
  readonly currentSession = signal<Session | null>(null);
  readonly ready = signal(false);

  private readonly router = inject(Router);
  private readonly initPromise: Promise<void>;

  constructor() {
    this.initPromise = this.initializeAuth();
  }

  /**
   * Initialise l'état d'authentification en traitant d'abord les tokens/codes OAuth de l'URL,
   * puis en restaurant la session persistante.
   */
  private async initializeAuth(): Promise<void> {
    try {
      if (typeof window !== 'undefined') {
        await this.handleOAuthRedirectInUrl();
      }

      // Si la session n'a pas encore été fixée par les tokens d'URL, récupérer la session Supabase
      if (!this.currentUser()) {
        const { data } = await supabase.auth.getSession();
        if (data?.session) {
          this.currentSession.set(data.session);
          this.currentUser.set(data.session.user);
        }
      }
    } catch (err) {
      console.error('Erreur lors de l’initialisation de l’authentification:', err);
    } finally {
      this.ready.set(true);
    }

    // Écoute réactive de tout changement d'état d'authentification
    supabase.auth.onAuthStateChange((event, session) => {
      this.currentSession.set(session ?? null);
      this.currentUser.set(session?.user ?? null);
      this.ready.set(true);

      // Si l'utilisateur est authentifié et se trouve encore sur une page d'authentification,
      // on le redirige automatiquement vers le dashboard dès la première tentative
      if (session?.user && (event === 'SIGNED_IN' || event === 'USER_UPDATED' || event === 'INITIAL_SESSION')) {
        const path = window.location.pathname;
        if (path.includes('/auth/') || path === '/onboarding') {
          this.router.navigateByUrl('/tabs/dashboard', { replaceUrl: true });
        }
      } else if (event === 'SIGNED_OUT') {
        this.currentUser.set(null);
        this.currentSession.set(null);
      }
    });
  }

  /**
   * Traite les tokens OAuth (Implicit grant dans le hash) ou le code (PKCE dans la search query)
   * afin que la session soit prête avant l'exécution des route guards.
   */
  private async handleOAuthRedirectInUrl(): Promise<void> {
    const hash = window.location.hash;
    const search = window.location.search;

    // Cas 1 : Implicit Grant Flow (hash contient #access_token=...&refresh_token=...)
    if (hash && hash.includes('access_token=')) {
      try {
        const hashParams = new URLSearchParams(hash.startsWith('#') ? hash.slice(1) : hash);
        const accessToken = hashParams.get('access_token');
        const refreshToken = hashParams.get('refresh_token');

        if (accessToken && refreshToken) {
          const { data, error } = await supabase.auth.setSession({
            access_token: accessToken,
            refresh_token: refreshToken
          });
          if (!error && data?.session) {
            this.currentSession.set(data.session);
            this.currentUser.set(data.session.user);
            this.cleanUrlAfterOAuth();
            return;
          }
        }
      } catch (e) {
        console.warn('Erreur lors du traitement des tokens OAuth dans le hash:', e);
      }
    }

    // Cas 2 : PKCE Flow (search query contient ?code=...)
    if (search && search.includes('code=')) {
      try {
        const searchParams = new URLSearchParams(search);
        const code = searchParams.get('code');
        if (code) {
          const { data, error } = await supabase.auth.exchangeCodeForSession(code);
          if (!error && data?.session) {
            this.currentSession.set(data.session);
            this.currentUser.set(data.session.user);
            this.cleanUrlAfterOAuth();
            return;
          }
        }
      } catch (e) {
        console.warn('Erreur lors de l’échange du code PKCE:', e);
      }
    }
  }

  /** Nettoie l'URL des paramètres OAuth résolus sans recharger la page */
  private cleanUrlAfterOAuth(): void {
    if (typeof window !== 'undefined' && window.history?.replaceState) {
      const cleanPath = window.location.pathname || '/tabs/dashboard';
      window.history.replaceState(null, document.title, cleanPath);
    }
  }

  /** Attend que l'état d'auth initial soit entièrement résolu */
  async waitUntilReady(): Promise<void> {
    await this.initPromise;
  }

  async signUp(email: string, password: string, fullName?: string) {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: fullName ? { full_name: fullName } : undefined
      }
    });
    if (error) throw error;

    if (data?.session) {
      this.currentSession.set(data.session);
      this.currentUser.set(data.user);
      this.ready.set(true);
    }
    return data;
  }

  async signIn(email: string, password: string) {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) throw error;

    // Mise à jour immédiate et synchrone de l'état pour que authGuard réussisse dès la 1ère tentative
    if (data?.session) {
      this.currentSession.set(data.session);
      this.currentUser.set(data.user);
      this.ready.set(true);
    }
    return data;
  }

  async signInWithGoogle() {
    const redirectTo = window.location.origin + '/tabs/dashboard';
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo,
        queryParams: {
          access_type: 'offline',
          prompt: 'select_account'
        }
      }
    });
    if (error) throw error;
  }

  async signOut() {
    this.currentUser.set(null);
    this.currentSession.set(null);
    await supabase.auth.signOut();
  }

  isAuthenticated(): boolean {
    return !!this.currentUser();
  }
}
