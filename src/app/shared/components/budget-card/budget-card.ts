import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Budget } from '../../../core/models/budget.model';
import { ProgressBarComponent } from '../progress-bar/progress-bar';
import { formatFCFA, percentSpent } from '../../../core/utils/currency.utils';
import { IonIcon } from '@ionic/angular';

@Component({
  selector: 'app-budget-card',
  standalone: true,
  imports: [CommonModule, IonIcon, ProgressBarComponent],
  templateUrl: './budget-card.html',
  styleUrls: ['./budget-card.scss']
})
export class BudgetCardComponent {
  @Input({ required: true }) budget!: Budget;
  @Input() layout: 'grid' | 'list' = 'grid';

  get percent(): number {
    return percentSpent(this.budget.spent, this.budget.amount);
  }

  formatFCFA = formatFCFA;
}