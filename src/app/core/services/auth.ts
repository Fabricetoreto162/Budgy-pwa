import { Injectable, signal } from '@angular/core';
import { supabase } from '../../data/supabase/supabase-client';
import type { User } from '@supabase/supabase-js';

@Injectable({ providedIn: 'root' })
export class AuthService {
  readonly currentUser = signal<User | null>(null);
  readonly ready = signal(false);

  constructor() {
    supabase.auth.getSession().then(({ data }) => {
      this.currentUser.set(data.session?.user ?? null);
      this.ready.set(true);
    });

    supabase.auth.onAuthStateChange((_event, session) => {
      this.currentUser.set(session?.user ?? null);
      this.ready.set(true);
    });
  }

  /** Attend que l'état d'auth initial soit résolu (évite les faux redirects du guard) */
  async waitUntilReady(): Promise<void> {
    if (this.ready()) return;
    await new Promise<void>(resolve => {
      const check = setInterval(() => {
        if (this.ready()) {
          clearInterval(check);
          resolve();
        }
      }, 30);
    });
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
    return data;
  }

  async signIn(email: string, password: string) {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) throw error;
    return data;
  }

  async signInWithGoogle() {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: window.location.origin + '/tabs/dashboard' }
    });
    if (error) throw error;
  }

  async signOut() {
    await supabase.auth.signOut();
  }

  isAuthenticated(): boolean {
    return !!this.currentUser();
  }
}