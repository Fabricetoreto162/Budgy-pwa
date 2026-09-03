import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { IonContent, IonIcon } from '@ionic/angular';
import { addIcons } from 'ionicons';
import { chevronBackOutline, arrowForwardOutline } from 'ionicons/icons';

import { StatsService, DashboardStats } from '../../core/services/stats';
import { TransactionsService } from '../../core/services/transactions';
import { KpiCardComponent } from '../../shared/components/kpi-card/kpi-card';
import { ProgressBarComponent } from '../../shared/components/progress-bar/progress-bar';
import { TransactionItemComponent } from '../../shared/components/transaction-item/transaction-item';
import { formatFCFA } from '../../core/utils/currency.utils';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
  selector: 'app-stats',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    IonContent,
    IonIcon,
    KpiCardComponent,
    ProgressBarComponent,
    TransactionItemComponent,
    TranslatePipe
  ],
  templateUrl: './stats.page.html',
  styleUrls: ['./stats.page.scss']
})
export class StatsPage implements OnInit {
  stats: DashboardStats | null = null;
  recentTransactions: any[] = [];
  loading = true;

  constructor(
    private statsSvc: StatsService,
    private txSvc: TransactionsService,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {
    addIcons({ chevronBackOutline, arrowForwardOutline });
  }

  async ngOnInit() {
    this.loading = true;
    const [stats, transactions] = await Promise.all([
      this.statsSvc.getDashboardStats(),
      this.txSvc.getRecent(30)
    ]);

    this.stats = stats;
    this.recentTransactions = transactions.slice(0, 3);
    this.loading = false;
    this.cdr.detectChanges();
  }

  goBack() {
    this.router.navigateByUrl('/tabs/dashboard');
  }

  get categoryPercents(): { label: string; value: number; color: string; percent: number }[] {
    if (!this.stats) return [];
    const total = this.stats.byCategory.reduce((sum, c) => sum + c.value, 0);
    if (total <= 0) return this.stats.byCategory.map(c => ({ ...c, percent: 0 }));

    return this.stats.byCategory.map(c => ({
      ...c,
      percent: Math.round((c.value / total) * 100)
    }));
  }

  get budgetsProgress(): number {
    if (!this.stats || this.stats.budgetsTotal === 0) return 0;
    return Math.round((this.stats.budgetsReached / this.stats.budgetsTotal) * 100);
  }

  formatFCFA = formatFCFA;
}