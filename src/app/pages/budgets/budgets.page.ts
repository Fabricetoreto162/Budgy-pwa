import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { IonContent, IonIcon } from '@ionic/angular';
import { addIcons } from 'ionicons';
import { addOutline, chevronBackOutline, walletOutline } from 'ionicons/icons';
import { Budget } from '../../core/models/budget.model';
import { BudgetsService } from '../../core/services/budgets';
import { BudgetCardComponent } from '../../shared/components/budget-card/budget-card';
import { BudgetFormModalComponent } from '../../shared/components/budget-form-modal/budget-form-modal';
import { CategoryOption } from '../../core/constants/categories.constants';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
  selector: 'app-budgets',
  standalone: true,
  imports: [CommonModule, RouterLink, IonContent, IonIcon, BudgetCardComponent, BudgetFormModalComponent, TranslatePipe],
  templateUrl: './budgets.page.html',
  styleUrls: ['./budgets.page.scss']
})
export class BudgetsPage implements OnInit {
  budgets: Budget[] = [];
  modalOpen = false;

  constructor(
    private budgetsSvc: BudgetsService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    addIcons({ addOutline, chevronBackOutline, walletOutline });
  }

  async ngOnInit() {
    await this.load();
    this.route.queryParams.subscribe(params => {
      if (params['create']) this.modalOpen = true;
    });
  }

  async load() {
    this.budgets = await this.budgetsSvc.getAll();
  }

  goBack() {
    this.router.navigateByUrl('/tabs/dashboard');
  }

  openCreate() {
    this.modalOpen = true;
  }

  closeModal() {
    this.modalOpen = false;
    this.router.navigate([], { queryParams: {} });
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