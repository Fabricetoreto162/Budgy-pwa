import { Component, Input, OnChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BaseChartDirective } from 'ng2-charts';
import { ChartConfiguration } from 'chart.js';

@Component({
  selector: 'app-stat-line-chart',
  standalone: true,
  imports: [CommonModule, BaseChartDirective],
  templateUrl: './stat-line-chart.html',
  styleUrls: ['./stat-line-chart.scss']
})
export class StatLineChartComponent implements OnChanges {
  @Input() data: { month: string; value: number }[] = [];

  chartData: ChartConfiguration<'line'>['data'] = { labels: [], datasets: [] };
  chartOptions: ChartConfiguration<'line'>['options'] = {
    responsive: true,
    plugins: { legend: { display: false } },
    scales: { y: { beginAtZero: true } }
  };

  ngOnChanges() {
    this.chartData = {
      labels: this.data.map(d => d.month),
      datasets: [{
        data: this.data.map(d => d.value),
        borderColor: '#F5A623',
        backgroundColor: 'rgba(245, 166, 35, 0.15)',
        fill: true,
        tension: 0.4
      }]
    };
  }
}