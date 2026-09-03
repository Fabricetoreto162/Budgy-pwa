import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonContent, IonIcon } from '@ionic/angular';
import { addIcons } from 'ionicons';
import { chevronDownOutline, filterOutline, checkmarkOutline } from 'ionicons/icons';
import { Transaction } from '../../core/models/transaction.model';
import { TransactionsService } from '../../core/services/transactions';
import { TransactionItemComponent } from '../../shared/components/transaction-item/transaction-item';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
  selector: 'app-transactions',
  standalone: true,
  imports: [CommonModule, IonContent, IonIcon, TransactionItemComponent, TranslatePipe],
  templateUrl: './transactions.page.html',
  styleUrls: ['./transactions.page.scss']
})
export class TransactionsPage implements OnInit {
  transactions: any[] = [];
  loading = true;

  periodOptions = [
    { label: 'Derniers 7 jours', days: 7 },
    { label: 'Derniers 30 jours', days: 30 },
    { label: 'Derniers 90 jours', days: 90 }
  ];
  selectedPeriod = this.periodOptions[1]; // 30 jours par défaut

  dropdownOpen = false;

  constructor(
    private txSvc: TransactionsService,
    private cdr: ChangeDetectorRef
  ) {
    addIcons({ chevronDownOutline, filterOutline, checkmarkOutline });
  }

  async ngOnInit() {
    await this.loadTransactions();
  }

  async loadTransactions() {
    this.loading = true;
    this.transactions = await this.txSvc.getRecent(this.selectedPeriod.days);
    this.loading = false;
    this.cdr.detectChanges();
  }

  toggleDropdown() {
    this.dropdownOpen = !this.dropdownOpen;
  }

  async selectPeriod(option: { label: string; days: number }) {
    this.selectedPeriod = option;
    this.dropdownOpen = false;
    await this.loadTransactions();
  }

  onFilterIconClick() {
    // Placeholder — prêt pour un futur filtre par catégorie
    console.log('Filtre catégorie à venir');
  }
}