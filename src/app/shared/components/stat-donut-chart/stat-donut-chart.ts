import { Component, Input, OnChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BaseChartDirective } from 'ng2-charts';
import { ChartConfiguration } from 'chart.js';
import { formatFCFA } from '../../../core/utils/currency.utils';

@Component({
  selector: 'app-stat-donut-chart',
  standalone: true,
  imports: [CommonModule, BaseChartDirective],
  templateUrl: './stat-donut-chart.html',
  styleUrls: ['./stat-donut-chart.scss']
})
export class StatDonutChartComponent implements OnChanges {
  @Input() data: { label: string; value: number; color: string }[] = [];

  chartData: ChartConfiguration<'doughnut'>['data'] = { labels: [], datasets: [] };
  chartOptions: ChartConfiguration<'doughnut'>['options'] = {
    responsive: true,
    maintainAspectRatio: false,
    cutout: '72%',
    plugins: { legend: { display: false } }
  };

  total = 0;

  ngOnChanges() {
    this.total = this.data.reduce((sum, d) => sum + d.value, 0);

    this.chartData = {
      labels: this.data.map(d => d.label),
      datasets: [{
        data: this.data.map(d => d.value),
        backgroundColor: this.data.map(d => d.color),
        borderWidth: 0
      }]
    };
  }

  formatFCFA = formatFCFA;

  percentOf(value: number): number {
    if (this.total <= 0) return 0;
    return Math.round((value / this.total) * 100);
  }
}