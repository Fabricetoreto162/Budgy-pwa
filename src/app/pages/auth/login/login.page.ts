import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AlertController } from '@ionic/angular';
import { AuthService } from '../../../core/services/auth';
import { TranslatePipe } from '@ngx-translate/core';

const EMAIL_REGEX = /^[a-zA-Z0-9](?:[a-zA-Z0-9._%+-]*[a-zA-Z0-9])?@[a-zA-Z0-9](?:[a-zA-Z0-9-]*[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]*[a-zA-Z0-9])?)*\.[a-zA-Z]{2,}$/;

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, TranslatePipe],
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss']
})
export class LoginPage implements OnInit {
  email = '';
  password = '';
  loading = false;
  googleLoading = false;
  showPassword = false;
  errorMessage = '';

  constructor(
    private auth: AuthService,
    private router: Router,
    private alertCtrl: AlertController,
    private cdr: ChangeDetectorRef
  ) {}

  async ngOnInit() {
    await this.auth.waitUntilReady();
    if (this.auth.isAuthenticated()) {
      this.router.navigateByUrl('/tabs/dashboard', { replaceUrl: true });
    }
  }

  togglePassword() {
    this.showPassword = !this.showPassword;
  }

  goBack() {
    this.router.navigateByUrl('/onboarding');
  }

  async onSubmit() {
    if (this.loading || this.googleLoading) return;

    if (!this.email || !this.password) {
      await this.showAlert('Champs manquants', 'Veuillez remplir tous les champs.');
      return;
    }

    const cleanEmail = this.email.trim();

    if (!EMAIL_REGEX.test(cleanEmail)) {
      await this.showAlert('Email invalide', 'Le format de l\'adresse email n\'est pas valide. Exemple : nom@domaine.com');
      return;
    }

    this.errorMessage = '';
    this.loading = true;
    this.cdr.detectChanges();

    try {
      await this.auth.signIn(cleanEmail, this.password);
      await this.router.navigateByUrl('/tabs/dashboard', { replaceUrl: true });
    } catch (e: any) {
      await this.showAlert('Erreur de connexion', this.formatAuthError(e));
    } finally {
      this.loading = false;
      this.cdr.detectChanges();
    }
  }

  async onGoogle() {
    if (this.loading || this.googleLoading) return;

    this.errorMessage = '';
    this.googleLoading = true;
    this.cdr.detectChanges();

    try {
      await this.auth.signInWithGoogle();
    } catch (e: any) {
      this.googleLoading = false;
      this.cdr.detectChanges();
      await this.showAlert('Erreur de connexion', this.formatAuthError(e));
    }
  }

  private formatAuthError(e: any): string {
    const msg = (e?.message ?? '').toLowerCase();
    if (msg.includes('invalid login credentials') || msg.includes('invalid_grant')) {
      return 'Email ou mot de passe incorrect.';
    }
    if (msg.includes('email not confirmed')) {
      return 'Veuillez confirmer votre adresse email avant de vous connecter.';
    }
    if (msg.includes('too many requests') || msg.includes('rate limit')) {
      return 'Trop de tentatives récentes. Veuillez patienter quelques instants avant de réessayer.';
    }
    if (msg.includes('network') || msg.includes('failed to fetch')) {
      return 'Problème de connexion réseau. Veuillez vérifier votre accès à internet.';
    }
    return e?.message ?? 'Une erreur est survenue lors de la connexion.';
  }

  private async showAlert(header: string, message: string) {
    this.errorMessage = message;
    const alert = await this.alertCtrl.create({
      header,
      message,
      buttons: ['OK'],
      cssClass: 'budgy-alert'
    });
    await alert.present();
    this.cdr.detectChanges();
  }
}