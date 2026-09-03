import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth';
import { STORAGE_KEYS } from '../constants/app.constants';

export const rootGuard: CanActivateFn = async () => {
  const auth = inject(AuthService);
  const router = inject(Router);

  await auth.waitUntilReady();

  if (auth.isAuthenticated()) {
    return router.parseUrl('/tabs/dashboard');
  }

  const onboardingSeen = localStorage.getItem(STORAGE_KEYS.onboardingSeen);
  if (onboardingSeen) {
    return router.parseUrl('/auth/login');
  }

  return router.parseUrl('/onboarding');
};