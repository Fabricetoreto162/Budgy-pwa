
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { IonContent, IonIcon, IonInput, IonButton } from '@ionic/angular';
import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { addIcons } from 'ionicons';
import { chevronBackOutline, addOutline, closeOutline } from 'ionicons/icons';
import { Budget } from '../../core/models/budget.model';
import { Transaction } from '../../core/models/transaction.model';
import { BudgetsService } from '../../core/services/budgets';
import { TransactionsService } from '../../core/services/transactions';
import { ProgressBarComponent } from '../../shared/components/progress-bar/progress-bar';
import { TransactionItemComponent } from '../../shared/components/transaction-item/transaction-item';
import { formatFCFA, percentSpent } from '../../core/utils/currency.utils';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
  selector: 'app-budget-detail',
  standalone: true,
  imports: [CommonModule, FormsModule, IonContent, IonIcon, IonInput, IonButton, ProgressBarComponent, TransactionItemComponent, TranslatePipe],
  templateUrl: './budget-detail.page.html',
  styleUrls: ['./budget-detail.page.scss']
})
export class BudgetDetailPage implements OnInit {
  budget!: Budget;
  transactions: Transaction[] = [];
  activeTab: 'transactions' | 'stats' = 'transactions';
  showForm = false;

  newDescription = '';
  newAmount: number | null = null;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private budgetsSvc: BudgetsService,
    private txSvc: TransactionsService,
    private cdr: ChangeDetectorRef
  ) {
    addIcons({ chevronBackOutline, addOutline, closeOutline });
  }

  async ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id')!;
    await this.load(id);
  }

  async load(id: string) {
    this.budget = await this.budgetsSvc.getById(id);
    this.transactions = await this.txSvc.getByBudget(id);
    this.cdr.detectChanges();
  }

  get percent(): number {
    return percentSpent(this.budget.spent, this.budget.amount);
  }

  get remaining(): number {
    return Math.max(0, this.budget.amount - this.budget.spent);
  }

  formatFCFA = formatFCFA;

  goBack() {
    this.router.navigateByUrl('/tabs/budgets');
  }

  async addExpense() {
    if (!this.newDescription || !this.newAmount) return;
    await this.txSvc.create({
      budget_id: this.budget.id,
      amount: this.newAmount,
      description: this.newDescription
    });
    this.newDescription = '';
    this.newAmount = null;
    this.showForm = false;
    await this.load(this.budget.id);
  }

  async removeBudget() {
    await this.budgetsSvc.remove(this.budget.id);
    this.router.navigateByUrl('/tabs/budgets');
  }
}