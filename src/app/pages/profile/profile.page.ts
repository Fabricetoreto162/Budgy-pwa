import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { IonIcon, IonToggle } from '@ionic/angular';
import { addIcons } from 'ionicons';
import {
  personOutline,
  chevronForwardOutline,
  cashOutline,
  moonOutline,
  logOutOutline,
  pencilOutline
} from 'ionicons/icons';
import { AuthService } from '../../core/services/auth';
import { ProfileService } from '../../core/services/profile';
import { ThemeService } from '../../core/services/theme';
import { Profile } from '../../core/models/profile.model';
import { PageLoaderComponent } from '../../shared/components/page-loader/page-loader';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, IonIcon, IonToggle, PageLoaderComponent, TranslatePipe],
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss']
})
export class ProfilePage implements OnInit {
  profile: Profile | null = null;
  darkMode = false;
  loading = true;

  constructor(
    private auth: AuthService,
    private profileSvc: ProfileService,
    private theme: ThemeService,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {
    addIcons({
      personOutline,
      chevronForwardOutline,
      cashOutline,
      moonOutline,
      logOutOutline,
      pencilOutline
    });
  }

  async ngOnInit() {
    await this.loadProfile();
  }

  async ionViewWillEnter() {
    await this.loadProfile();
  }

  async loadProfile() {
    this.loading = true;
    this.cdr.detectChanges();
    try {
      this.profile = await this.profileSvc.getMine();
      this.darkMode = this.theme.isDarkMode();
    } catch (err) {
      console.error('Erreur chargement profil:', err);
    } finally {
      this.loading = false;
      this.cdr.detectChanges();
    }
  }

  async onDarkModeChange(event: any) {
    const isChecked = event?.detail ? !!event.detail.checked : !this.darkMode;
    this.darkMode = isChecked;
    this.theme.setTheme(isChecked ? 'dark' : 'light');
    this.cdr.detectChanges();
    try {
      await this.profileSvc.update({ dark_mode: isChecked });
    } catch (err) {
      console.warn('Erreur mise à jour dark_mode sur profil:', err);
    }
  }

  async toggleDarkMode(event?: any) {
    await this.onDarkModeChange(event);
  }

  async logout() {
    await this.auth.signOut();
    this.router.navigateByUrl('/auth/login');
  }
}