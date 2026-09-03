import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-progress-bar',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './progress-bar.html',
  styleUrls: ['./progress-bar.scss']
})
export class ProgressBarComponent {
  @Input() percent = 0;
  @Input() color = 'var(--app-primary)';
  @Input() showLabel = false;
}