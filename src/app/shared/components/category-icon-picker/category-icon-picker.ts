import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CATEGORY_OPTIONS, CategoryOption } from '../../../core/constants/categories.constants';
import { IonIcon } from '@ionic/angular';

@Component({
  selector: 'app-category-icon-picker',
  standalone: true,
  imports: [CommonModule, IonIcon],
  templateUrl: './category-icon-picker.html',
  styleUrls: ['./category-icon-picker.scss']
})
export class CategoryIconPickerComponent {
  @Input() selectedId: string | null = null;
  @Output() select = new EventEmitter<CategoryOption>();

  readonly options = CATEGORY_OPTIONS;

  onPick(option: CategoryOption) {
    this.selectedId = option.id;
    this.select.emit(option);
  }
}