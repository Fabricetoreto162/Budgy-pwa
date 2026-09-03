import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';
import { guestGuard } from './core/guards/guest.guard';
import { rootGuard } from './core/guards/root.guard';

export const routes: Routes = [
  {
    path: '',
    canActivate: [rootGuard],
    children: []
  },
  {
    path: 'auth/callback',
    canActivate: [rootGuard],
    children: []
  },
  { path: 'onboarding', loadComponent: () => import('./pages/onboarding/onboarding.page').then(m => m.OnboardingPage) },
  {
    path: 'auth/login',
    canActivate: [guestGuard],
    loadComponent: () => import('./pages/auth/login/login.page').then(m => m.LoginPage)
  },
  {
    path: 'auth/signup',
    canActivate: [guestGuard],
    loadComponent: () => import('./pages/auth/signup/signup.page').then(m => m.SignupPage)
  },
  {
    path: 'tabs',
    canActivate: [authGuard],
    loadComponent: () => import('./tabs/tabs.page').then(m => m.TabsPage),
    loadChildren: () => import('./tabs/tabs.routes').then(m => m.tabsRoutes)
  }
];