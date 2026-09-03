import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonInput, IonButton, IonIcon } from '@ionic/angular';
import { CategoryIconPickerComponent } from '../category-icon-picker/category-icon-picker';
import { CategoryOption } from '../../../core/constants/categories.constants';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
  selector: 'app-budget-form-modal',
  standalone: true,
  imports: [CommonModule, FormsModule, IonInput, IonButton, IonIcon, CategoryIconPickerComponent,TranslatePipe],
  templateUrl: './budget-form-modal.html',
  styleUrls: ['./budget-form-modal.scss']
})
export class BudgetFormModalComponent {
  @Input() open = false;
  @Output() close = new EventEmitter<void>();
  @Output() create = new EventEmitter<{ name: string; amount: number; category: CategoryOption }>();

  name = '';
  amount: number | null = null;
  selectedCategory: CategoryOption | null = null;

  onSelectCategory(cat: CategoryOption) {
    this.selectedCategory = cat;
  }

  onSubmit() {
    if (!this.name || !this.amount || !this.selectedCategory) return;
    this.create.emit({ name: this.name, amount: this.amount, category: this.selectedCategory });
    this.reset();
  }

  onClose() {
    this.reset();
    this.close.emit();
  }

  private reset() {
    this.name = '';
    this.amount = null;
    this.selectedCategory = null;
  }
}