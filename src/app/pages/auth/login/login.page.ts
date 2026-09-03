import { Component } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { IonContent, AlertController } from '@ionic/angular';
import { AuthService } from '../../../core/services/auth';
import { TranslatePipe } from '@ngx-translate/core';

const EMAIL_REGEX = /^[a-zA-Z0-9](?:[a-zA-Z0-9._%+-]*[a-zA-Z0-9])?@[a-zA-Z0-9](?:[a-zA-Z0-9-]*[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]*[a-zA-Z0-9])?)*\.[a-zA-Z]{2,}$/;

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, IonContent, TranslatePipe],
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss']
})
export class LoginPage {
  email = '';
  password = '';
  loading = false;
  showPassword = false;
  errorMessage = '';

  constructor(
    private auth: AuthService,
    private router: Router,
    private alertCtrl: AlertController
  ) {}

  togglePassword() {
    this.showPassword = !this.showPassword;
  }

  goBack() {
    this.router.navigateByUrl('/onboarding');
  }

  async onSubmit() {
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
    try {
      await this.auth.signIn(cleanEmail, this.password);
      this.router.navigateByUrl('/tabs/dashboard');
    } catch (e: any) {
      await this.showAlert('Erreur de connexion', e.message ?? 'Email ou mot de passe incorrect');
    } finally {
      this.loading = false;
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
  }
}