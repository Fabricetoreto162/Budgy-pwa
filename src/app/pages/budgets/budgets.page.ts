import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { IonIcon } from '@ionic/angular';
import { addIcons } from 'ionicons';
import { addOutline, chevronBackOutline, walletOutline } from 'ionicons/icons';
import { Budget } from '../../core/models/budget.model';
import { BudgetsService } from '../../core/services/budgets';
import { BudgetCardComponent } from '../../shared/components/budget-card/budget-card';
import { BudgetFormModalComponent } from '../../shared/components/budget-form-modal/budget-form-modal';
import { PageLoaderComponent } from '../../shared/components/page-loader/page-loader';
import { CategoryOption } from '../../core/constants/categories.constants';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
  selector: 'app-budgets',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    IonIcon,
    BudgetCardComponent,
    BudgetFormModalComponent,
    PageLoaderComponent,
    TranslatePipe
  ],
  templateUrl: './budgets.page.html',
  styleUrls: ['./budgets.page.scss']
})
export class BudgetsPage implements OnInit {
  budgets: Budget[] = [];
  modalOpen = false;
  loading = true;

  constructor(
    private budgetsSvc: BudgetsService,
    private route: ActivatedRoute,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {
    addIcons({ addOutline, chevronBackOutline, walletOutline });
  }

  async ngOnInit() {
    this.route.queryParams.subscribe(params => {
      if (params['create']) {
        this.modalOpen = true;
        this.cdr.detectChanges();
      }
    });
    await this.load();
  }

  async ionViewWillEnter() {
    await this.load();
  }

  async load() {
    this.loading = true;
    this.cdr.detectChanges();
    try {
      this.budgets = await this.budgetsSvc.getAll();
    } catch (err) {
      console.error('Erreur chargement budgets:', err);
      this.budgets = [];
    } finally {
      this.loading = false;
      this.cdr.detectChanges();
    }
  }

  goBack() {
    this.router.navigateByUrl('/tabs/dashboard');
  }

  openCreate() {
    this.modalOpen = true;
    this.cdr.detectChanges();
  }

  closeModal() {
    this.modalOpen = false;
    this.router.navigate([], { queryParams: {} });
    this.cdr.detectChanges();
  }

  async onCreate(payload: { name: string; amount: number; category: CategoryOption }) {
    await this.budgetsSvc.create({
      name: payload.name,
      amount: payload.amount,
      icon: payload.category.icon,
      color: payload.category.color
    });
    this.closeModal();
    await this.load();
  }
}
