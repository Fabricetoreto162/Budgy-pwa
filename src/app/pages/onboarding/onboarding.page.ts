import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { IonContent } from '@ionic/angular';
import { TranslatePipe } from '@ngx-translate/core';
import { STORAGE_KEYS } from '../../core/constants/app.constants';

@Component({
  selector: 'app-onboarding',
  standalone: true,
  imports: [IonContent, TranslatePipe],
  templateUrl: './onboarding.page.html',
  styleUrls: ['./onboarding.page.scss']
})
export class OnboardingPage {
  constructor(private router: Router) {}

  goToSignup() {
    localStorage.setItem(STORAGE_KEYS.onboardingSeen, 'true');
    this.router.navigateByUrl('/auth/signup');
  }

  goToLogin() {
    localStorage.setItem(STORAGE_KEYS.onboardingSeen, 'true');
    this.router.navigateByUrl('/auth/login');
  }

  skipOnboarding() {
    localStorage.setItem(STORAGE_KEYS.onboardingSeen, 'true');
    this.router.navigateByUrl('/auth/login');
  }
}