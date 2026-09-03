import { CommonModule } from '@angular/common';
import { Component, OnInit, HostListener, ChangeDetectorRef } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { IonIcon } from '@ionic/angular';
import {
  notificationsOutline,
  trendingUpOutline,
  arrowForwardOutline,
  walletOutline,
  addOutline,
  cardOutline,
  receiptOutline,
  checkmarkCircleOutline,
  chevronDownOutline,
  logOutOutline,
  closeOutline,
  downloadOutline
} from 'ionicons/icons';
import { addIcons } from 'ionicons';

import { Budget } from '../../core/models/budget.model';
import { Transaction } from '../../core/models/transaction.model';
import { BudgetsService } from '../../core/services/budgets';
import { TransactionsService } from '../../core/services/transactions';
import { StatsService, DashboardStats } from '../../core/services/stats';
import { AuthService } from '../../core/services/auth';
import { BudgetCardComponent } from '../../shared/components/budget-card/budget-card';
import { KpiCardComponent } from '../../shared/components/kpi-card/kpi-card';
import { StatLineChartComponent } from '../../shared/components/stat-line-chart/stat-line-chart';
import { StatDonutChartComponent } from '../../shared/components/stat-donut-chart/stat-donut-chart';
import { ProgressBarComponent } from '../../shared/components/progress-bar/progress-bar';
import { PageLoaderComponent } from '../../shared/components/page-loader/page-loader';
import { formatFCFA, percentSpent } from '../../core/utils/currency.utils';
import { formatShortDate } from '../../core/utils/date.utils';

const PWA_DISMISSED_KEY = 'budgy_pwa_install_dismissed';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    IonIcon,
    BudgetCardComponent,
    KpiCardComponent,
    StatLineChartComponent,
    StatDonutChartComponent,
    ProgressBarComponent,
    PageLoaderComponent
  ],
  templateUrl: './dashboard.page.html',
  styleUrls: ['./dashboard.page.scss']
})
export class DashboardPage implements OnInit {
  budgets: Budget[] = [];
  recentTransactions: any[] = [];
  stats: DashboardStats | null = null;
  totalBalance = 0;
  loading = true;

  showInstallCard = false;
  private deferredPrompt: any = null;

  constructor(
    private budgetsSvc: BudgetsService,
    private txSvc: TransactionsService,
    private statsSvc: StatsService,
    public auth: AuthService,
    private cdr: ChangeDetectorRef,
    private router: Router
  ) {
    addIcons({
      notificationsOutline,
      trendingUpOutline,
      arrowForwardOutline,
      walletOutline,
      addOutline,
      cardOutline,
      receiptOutline,
      checkmarkCircleOutline,
      chevronDownOutline,
      logOutOutline,
      closeOutline,
      downloadOutline
    });
  }

  async ngOnInit() {
    await this.loadDashboardData();
  }

  async ionViewWillEnter() {
    await this.loadDashboardData();
  }

  async loadDashboardData() {
    this.loading = true;
    this.cdr.detectChanges();
    try {
      const [budgets, transactions, stats] = await Promise.all([
        this.budgetsSvc.getAll(),
        this.txSvc.getRecent(30),
        this.statsSvc.getDashboardStats()
      ]);

      this.budgets = budgets ?? [];
      this.recentTransactions = (transactions ?? []).slice(0, 4);
      this.stats = stats;

      this.totalBalance = this.budgets.reduce(
        (sum, budget) => sum + (budget.amount - budget.spent),
        0
      );
    } catch (error) {
      console.error('Erreur lors du chargement du dashboard :', error);
      this.budgets = [];
      this.recentTransactions = [];
      this.totalBalance = 0;
    } finally {
      this.loading = false;
      this.cdr.detectChanges();
    }
  }


  /** Capture l'événement natif du navigateur pour proposer l'installation PWA */
  @HostListener('window:beforeinstallprompt', ['$event'])
  onBeforeInstallPrompt(event: Event) {
    event.preventDefault();
    this.deferredPrompt = event;

    const alreadyDismissed = localStorage.getItem(PWA_DISMISSED_KEY);
    if (!alreadyDismissed) {
      this.showInstallCard = true;
      this.cdr.detectChanges();
    }
  }

  /** Se déclenche quand l'app vient d'être installée */
  @HostListener('window:appinstalled')
  onAppInstalled() {
    this.showInstallCard = false;
    this.deferredPrompt = null;
    this.cdr.detectChanges();
  }

  async installPwa() {
    if (!this.deferredPrompt) return;

    this.deferredPrompt.prompt();
    const { outcome } = await this.deferredPrompt.userChoice;

    if (outcome === 'accepted') {
      this.showInstallCard = false;
    } else {
      // L'utilisateur a refusé dans la popup native — on ne réaffiche pas immédiatement
      localStorage.setItem(PWA_DISMISSED_KEY, 'true');
      this.showInstallCard = false;
    }

    this.deferredPrompt = null;
    this.cdr.detectChanges();
  }

  dismissInstallCard() {
    localStorage.setItem(PWA_DISMISSED_KEY, 'true');
    this.showInstallCard = false;
  }

  async logout() {
    await this.auth.signOut();
    this.router.navigateByUrl('/auth/login');
  }

  formatFCFA = formatFCFA;
  formatShortDate = formatShortDate;
  percentSpent = percentSpent;

  get firstName(): string {
    const meta = this.auth.currentUser()?.user_metadata as any;
    return meta?.full_name?.split(' ')[0] ?? 'Fabrice';
  }
}