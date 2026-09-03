import { Component, ChangeDetectorRef } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { IonContent, AlertController } from '@ionic/angular';
import { AuthService } from '../../../core/services/auth';
import { TranslatePipe } from '@ngx-translate/core';

const EMAIL_REGEX = /^[a-zA-Z0-9](?:[a-zA-Z0-9._%+-]*[a-zA-Z0-9])?@[a-zA-Z0-9](?:[a-zA-Z0-9-]*[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]*[a-zA-Z0-9])?)*\.[a-zA-Z]{2,}$/;

const COMMON_DOMAINS = [
  'gmail.com', 'yahoo.com', 'yahoo.fr', 'outlook.com', 'outlook.fr',
  'hotmail.com', 'hotmail.fr', 'icloud.com', 'live.com', 'live.fr',
  'protonmail.com', 'aol.com', 'orange.fr', 'free.fr', 'laposte.net'
];

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, IonContent, TranslatePipe],
  templateUrl: './signup.page.html',
  styleUrls: ['./signup.page.scss']
})
export class SignupPage {
  fullName = '';
  email = '';
  password = '';
  loading = false;
  showPassword = false;
  errorMessage = '';

  constructor(
    private auth: AuthService,
    private router: Router,
    private alertCtrl: AlertController,
    private cdr: ChangeDetectorRef
  ) {}

  togglePassword() {
    this.showPassword = !this.showPassword;
  }

  goBack() {
    this.router.navigateByUrl('/onboarding');
  }

  private isSuspiciousDomain(email: string): boolean {
    const domain = email.split('@')[1]?.toLowerCase();
    if (!domain) return false;

    return COMMON_DOMAINS.some(known => {
      if (domain === known) return false;
      const base = known.split('.')[0];
      const domainBase = domain.split('.')[0];
      return base.startsWith(domainBase) && domainBase.length < base.length && domainBase.length >= 3;
    });
  }

  async onSubmit() {
    if (!this.fullName.trim() || !this.email || !this.password) {
      await this.showAlert('Champs manquants', 'Veuillez remplir tous les champs obligatoires.');
      return;
    }

    const cleanEmail = this.email.trim();

    if (!EMAIL_REGEX.test(cleanEmail)) {
      await this.showAlert('Email invalide', 'Le format de l\'adresse email n\'est pas valide. Exemple : nom@domaine.com');
      return;
    }

    if (this.isSuspiciousDomain(cleanEmail)) {
      const domain = cleanEmail.split('@')[1];
      await this.showAlert(
        'Domaine suspect',
        `L'adresse "${domain}" ressemble à une faute de frappe. Vérifiez qu'il ne manque pas de lettres (ex : gmail.com, yahoo.com).`
      );
      return;
    }

    if (this.password.length < 6) {
      await this.showAlert('Mot de passe trop court', 'Le mot de passe doit comporter au moins 6 caractères.');
      return;
    }

    this.errorMessage = '';
    this.loading = true;
    this.cdr.detectChanges();

    try {
      await this.auth.signUp(cleanEmail, this.password, this.fullName.trim());
      this.router.navigateByUrl('/tabs/dashboard');
    } catch (e: any) {
      const status = e?.status ?? e?.originalError?.status;
      const msg = (e?.message ?? '').toLowerCase();

      if (status === 429 || msg.includes('too many') || msg.includes('rate limit')) {
        await this.showAlert(
          'Trop de tentatives',
          'Vous avez effectué trop de tentatives d\'inscription récemment. Merci de patienter quelques minutes avant de réessayer.'
        );
      } else if (msg.includes('already registered') || msg.includes('already exists') || msg.includes('user already')) {
        await this.showAlert(
          'Compte existant',
          'Un compte existe déjà avec cet email. Essayez de vous connecter à la place.'
        );
      } else {
        await this.showAlert('Erreur', e.message ?? "Erreur lors de l'inscription");
      }
    } finally {
      this.loading = false;
      this.cdr.detectChanges();
    }
  }

  async onGoogle() {
    try {
      await this.auth.signInWithGoogle();
    } catch (e: any) {
      await this.showAlert('Erreur', e.message ?? 'Erreur de connexion Google');
    }
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