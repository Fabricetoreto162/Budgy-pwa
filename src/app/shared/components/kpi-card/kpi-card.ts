import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonIcon } from '@ionic/angular';

@Component({
  selector: 'app-kpi-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './kpi-card.html',
  styleUrls: ['./kpi-card.scss']
})
export class KpiCardComponent {
  @Input() label = '';
  @Input() value = '';
  @Input() trend: string | null = null; // ex: "+12,5%"
  @Input() trendPositive = true;
  @Input() icon: string | null = null;
  @Input() dark = false; // true pour la card "Solde total"
  @Input() subLabel: string | null = null; // ex: "sur 8" pour "Budgets actifs"
}