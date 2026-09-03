import { Injectable, signal } from '@angular/core';

export interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed'; platform: string }>;
}

@Injectable({ providedIn: 'root' })
export class PwaService {
  private deferredPrompt: BeforeInstallPromptEvent | null = null;
  public readonly isInstalled = signal<boolean>(false);
  public readonly canPrompt = signal<boolean>(false);
  public readonly isIOSDevice = signal<boolean>(false);

  constructor() {
    this.initPwaListeners();
  }

  private initPwaListeners(): void {
    if (typeof window === 'undefined') return;

    // Detect if already installed / running in standalone mode
    const isStandalone =
      window.matchMedia('(display-mode: standalone)').matches ||
      (window.navigator as any).standalone === true;
    this.isInstalled.set(isStandalone);

    // Detect iOS
    const ua = window.navigator.userAgent.toLowerCase();
    const isIOS = /iphone|ipad|ipod/.test(ua);
    this.isIOSDevice.set(isIOS);

    // Listen for native beforeinstallprompt event
    window.addEventListener('beforeinstallprompt', (e: Event) => {
      e.preventDefault();
      this.deferredPrompt = e as BeforeInstallPromptEvent;
      this.canPrompt.set(true);
    });

    // Listen for appinstalled
    window.addEventListener('appinstalled', () => {
      this.isInstalled.set(true);
      this.canPrompt.set(false);
      this.deferredPrompt = null;
    });
  }

  public get hasNativePrompt(): boolean {
    return !!this.deferredPrompt;
  }

  public async promptInstall(): Promise<{ outcome: 'accepted' | 'dismissed' | 'manual'; isIOS: boolean }> {
    if (this.deferredPrompt) {
      try {
        await this.deferredPrompt.prompt();
        const choice = await this.deferredPrompt.userChoice;
        if (choice.outcome === 'accepted') {
          this.isInstalled.set(true);
          this.deferredPrompt = null;
          this.canPrompt.set(false);
        }
        return { outcome: choice.outcome, isIOS: false };
      } catch (err) {
        console.warn('Erreur lors du prompt PWA:', err);
      }
    }

    return {
      outcome: 'manual',
      isIOS: this.isIOSDevice()
    };
  }
}
