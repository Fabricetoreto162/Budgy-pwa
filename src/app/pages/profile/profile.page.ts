import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { IonContent, IonIcon, IonToggle } from '@ionic/angular';
import { addIcons } from 'ionicons';
import {
  personOutline,
  chevronForwardOutline,
  notificationsOutline,
  cashOutline,
  moonOutline,
  helpCircleOutline,
  informationCircleOutline,
  logOutOutline,
  pencilOutline
} from 'ionicons/icons';
import { AuthService } from '../../core/services/auth';
import { ProfileService } from '../../core/services/profile';
import { ThemeService } from '../../core/services/theme';
import { Profile } from '../../core/models/profile.model';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, IonContent, IonIcon, IonToggle, TranslatePipe],
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss']
})
export class ProfilePage implements OnInit {
  profile: Profile | null = null;
  darkMode = false;
  notificationsEnabled = true;

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
      notificationsOutline,
      cashOutline,
      moonOutline,
      helpCircleOutline,
      informationCircleOutline,
      logOutOutline,
      pencilOutline
    });
  }

  async ngOnInit() {
    this.profile = await this.profileSvc.getMine();
    this.darkMode = this.theme.getTheme() === 'dark';
    this.cdr.detectChanges();
  }

  async toggleDarkMode() {
    this.darkMode = !this.darkMode;
    this.theme.setTheme(this.darkMode ? 'dark' : 'light');
    await this.profileSvc.update({ dark_mode: this.darkMode });
  }

  toggleNotifications() {
    this.notificationsEnabled = !this.notificationsEnabled;
  }

  async logout() {
    await this.auth.signOut();
    this.router.navigateByUrl('/auth/login');
  }
}