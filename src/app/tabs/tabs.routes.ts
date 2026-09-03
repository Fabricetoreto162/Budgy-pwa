import { Routes } from '@angular/router';

export const tabsRoutes: Routes = [

  {
    path: 'dashboard',
    loadComponent: () =>
      import('../pages/dashboard/dashboard.page')
        .then(m => m.DashboardPage)
  },

  {
    path: 'budgets',
    loadComponent: () =>
      import('../pages/budgets/budgets.page')
        .then(m => m.BudgetsPage)
  },

  {
    path: 'budgets/:id',
    loadComponent: () =>
      import('../pages/budget-detail/budget-detail.page')
        .then(m => m.BudgetDetailPage)
  },

  {
    path: 'transactions',
    loadComponent: () =>
      import('../pages/transactions/transactions.page')
        .then(m => m.TransactionsPage)
  },

  {
    path: 'stats',
    loadComponent: () =>
      import('../pages/stats/stats.page')
        .then(m => m.StatsPage)
  },

  {
    path: 'profile',
    loadComponent: () =>
      import('../pages/profile/profile.page')
        .then(m => m.ProfilePage)
  },

  {
    path: '',
    redirectTo: 'dashboard',
    pathMatch: 'full'
  }

];