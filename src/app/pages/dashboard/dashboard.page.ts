import { CommonModule } from '@angular/common';
import { Component, OnInit, OnDestroy, HostListener, ChangeDetectorRef } from '@angular/core';
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
  downloadOutline,
  phonePortraitOutline,
  shareOutline,
  sparklesOutline
} from 'ionicons/icons';
import { addIcons } from 'ionicons';

import { Budget } from '../../core/models/budget.model';
import { Transaction } from '../../core/models/transaction.model';
import { BudgetsService } from '../../core/services/budgets';
import { TransactionsService } from '../../core/services/transactions';
import { StatsService, DashboardStats } from '../../core/services/stats';
import { AuthService } from '../../core/services/auth';
import { PwaService } from '../../core/services/pwa';
import { BudgetCardComponent } from '../../shared/components/budget-card/budget-card';
import { KpiCardComponent } from '../../shared/components/kpi-card/kpi-card';
import { StatLineChartComponent } from '../../shared/components/stat-line-chart/stat-line-chart';
import { StatDonutChartComponent } from '../../shared/components/stat-donut-chart/stat-donut-chart';
import { ProgressBarComponent } from '../../shared/components/progress-bar/progress-bar';
import { PageLoaderComponent } from '../../shared/components/page-loader/page-loader';
import { formatFCFA, percentSpent } from '../../core/utils/currency.utils';
import { formatShortDate } from '../../core/utils/date.utils';

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
export class DashboardPage implements OnInit, OnDestroy {
  budgets: Budget[] = [];
  recentTransactions: any[] = [];
  stats: DashboardStats | null = null;
  totalBalance = 0;
  loading = true;

  // PWA Install Popup states (20s on each dashboard visit)
  showInstallCard = false;
  showInstallGuideModal = false;
  pwaCountdown = 20;
  private pwaTimer: any = null;
  private pwaCountdownInterval: any = null;

  constructor(
    private budgetsSvc: BudgetsService,
    private txSvc: TransactionsService,
    private statsSvc: StatsService,
    public auth: AuthService,
    public pwaSvc: PwaService,
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
      downloadOutline,
      phonePortraitOutline,
      shareOutline,
      sparklesOutline
    });
  }

  async ngOnInit() {
    await this.loadDashboardData();
    this.triggerPwaPopup();
  }

  async ionViewWillEnter() {
    await this.loadDashboardData();
    this.triggerPwaPopup();
  }

  ionViewWillLeave() {
    this.clearPwaTimers();
  }

  ngOnDestroy() {
    this.clearPwaTimers();
  }

  /** Déclenche le popup PWA pendant 20 secondes à chaque visite */
  triggerPwaPopup() {
    this.clearPwaTimers();

    // Si déjà installé en mode standalone PWA natif, pas besoin d'afficher l'invite d'installation
    if (this.pwaSvc.isInstalled()) {
      this.showInstallCard = false;
      return;
    }

    this.pwaCountdown = 20;
    this.showInstallCard = true;
    this.cdr.detectChanges();

    // Décompte visuel seconde par seconde
    this.pwaCountdownInterval = setInterval(() => {
      if (this.pwaCountdown > 1) {
        this.pwaCountdown--;
        this.cdr.detectChanges();
      } else {
        this.pwaCountdown = 0;
      }
    }, 1000);

    // Disparition automatique après exactement 20 secondes
    this.pwaTimer = setTimeout(() => {
      this.dismissInstallCard();
    }, 20000);
  }

  private clearPwaTimers() {
    if (this.pwaTimer) {
      clearTimeout(this.pwaTimer);
      this.pwaTimer = null;
    }
    if (this.pwaCountdownInterval) {
      clearInterval(this.pwaCountdownInterval);
      this.pwaCountdownInterval = null;
    }
  }

  async installPwa() {
    const result = await this.pwaSvc.promptInstall();

    if (result.outcome === 'accepted') {
      this.dismissInstallCard();
    } else if (result.outcome === 'manual') {
      // Pas de prompt automatique supporté (ex: iOS Safari ou navigateur bureau sans prompt direct)
      this.showInstallGuideModal = true;
      this.clearPwaTimers();
      this.cdr.detectChanges();
    }
  }

  dismissInstallCard() {
    this.clearPwaTimers();
    this.showInstallCard = false;
    this.cdr.detectChanges();
  }

  closeInstallGuide() {
    this.showInstallGuideModal = false;
    this.cdr.detectChanges();
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