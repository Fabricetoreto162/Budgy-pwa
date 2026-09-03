import { Component, Input, OnChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BaseChartDirective } from 'ng2-charts';
import { ChartConfiguration } from 'chart.js';

@Component({
  selector: 'app-stat-bar-chart',
  standalone: true,
  imports: [CommonModule, BaseChartDirective],
  templateUrl: './stat-bar-chart.html',
  styleUrls: ['./stat-bar-chart.scss']
})
export class StatBarChartComponent implements OnChanges {
  @Input() data: { label: string; value: number; color: string }[] = [];

  chartData: ChartConfiguration<'bar'>['data'] = { labels: [], datasets: [] };
  chartOptions: ChartConfiguration<'bar'>['options'] = {
    responsive: true,
    plugins: { legend: { display: false } }
  };

  ngOnChanges() {
    this.chartData = {
      labels: this.data.map(d => d.label),
      datasets: [{
        data: this.data.map(d => d.value),
        backgroundColor: this.data.map(d => d.color)
      }]
    };
  }
}