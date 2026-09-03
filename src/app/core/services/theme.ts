import { Injectable } from '@angular/core';
import { STORAGE_KEYS } from '../constants/app.constants';

export type AppTheme = 'light' | 'dark' | 'system';

@Injectable({ providedIn: 'root' })
export class ThemeService {

  getTheme(): AppTheme {
    return (localStorage.getItem(STORAGE_KEYS.theme) as AppTheme) ?? 'system';
  }

  setTheme(theme: AppTheme): void {
    localStorage.setItem(STORAGE_KEYS.theme, theme);
    this.applyTheme(theme);
  }

  applyTheme(theme: AppTheme): void {
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const isDark = theme === 'dark' || (theme === 'system' && prefersDark);
    document.documentElement.classList.toggle('ion-palette-dark', isDark);
  }
}
