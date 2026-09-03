import { Component, Input, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-page-loader',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './page-loader.html',
  styleUrls: ['./page-loader.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PageLoaderComponent {
  @Input() message: string = 'Chargement de vos finances...';
}
