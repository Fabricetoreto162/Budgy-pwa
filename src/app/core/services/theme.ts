import { Injectable } from '@angular/core';
import { STORAGE_KEYS } from '../constants/app.constants';

export type AppTheme = 'light' | 'dark' | 'system';

@Injectable({ providedIn: 'root' })
export class ThemeService {
  private mediaQueryListener?: (e: MediaQueryListEvent) => void;

  constructor() {
    this.initSystemListener();
  }

  private initSystemListener(): void {
    if (typeof window !== 'undefined' && window.matchMedia) {
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
      this.mediaQueryListener = (e: MediaQueryListEvent) => {
        if (this.getTheme() === 'system') {
          this.applyDarkClass(e.matches);
        }
      };
      if (mediaQuery.addEventListener) {
        mediaQuery.addEventListener('change', this.mediaQueryListener);
      } else if ((mediaQuery as any).addListener) {
        (mediaQuery as any).addListener(this.mediaQueryListener);
      }
    }
  }

  getTheme(): AppTheme {
    if (typeof localStorage === 'undefined') return 'light';
    return (localStorage.getItem(STORAGE_KEYS.theme) as AppTheme) ?? 'light';
  }

  isDarkMode(): boolean {
    const theme = this.getTheme();
    if (theme === 'dark') return true;
    if (theme === 'light') return false;
    return typeof window !== 'undefined' && window.matchMedia
      ? window.matchMedia('(prefers-color-scheme: dark)').matches
      : false;
  }

  setTheme(theme: AppTheme): void {
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem(STORAGE_KEYS.theme, theme);
    }
    this.applyTheme(theme);
  }

  applyTheme(theme: AppTheme): void {
    const prefersDark = typeof window !== 'undefined' && window.matchMedia
      ? window.matchMedia('(prefers-color-scheme: dark)').matches
      : false;
    const isDark = theme === 'dark' || (theme === 'system' && prefersDark);
    this.applyDarkClass(isDark);
  }

  private applyDarkClass(isDark: boolean): void {
    if (typeof document === 'undefined') return;

    // Apply classes and data-theme to both html (documentElement) and body
    document.documentElement.classList.toggle('ion-palette-dark', isDark);
    document.documentElement.classList.toggle('dark', isDark);
    document.body.classList.toggle('ion-palette-dark', isDark);
    document.body.classList.toggle('dark', isDark);
    document.documentElement.setAttribute('data-theme', isDark ? 'dark' : 'light');
    document.body.setAttribute('data-theme', isDark ? 'dark' : 'light');
  }
}

