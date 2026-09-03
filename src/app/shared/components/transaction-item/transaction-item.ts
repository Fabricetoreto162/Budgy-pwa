import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonIcon } from '@ionic/angular';
import { Transaction } from '../../../core/models/transaction.model';
import { formatFCFA } from '../../../core/utils/currency.utils';
import { formatDayTime } from '../../../core/utils/date.utils';

@Component({
  selector: 'app-transaction-item',
  standalone: true,
  imports: [CommonModule, IonIcon],
  templateUrl: './transaction-item.html',
  styleUrls: ['./transaction-item.scss']
})
export class TransactionItemComponent {
  @Input({ required: true }) transaction!: Transaction;
  @Input() icon = 'pricetag-outline';
  @Input() color = '#F5A623';
  @Input() categoryName = '';

  formatFCFA = formatFCFA;
  formatDayTime = formatDayTime;
}