import { Component } from '@angular/core';
import { NgFor } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { SelectionStore } from '../../core/state/selection.store';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [NgFor, MatButtonModule],
  templateUrl: './header.html',
  styleUrl: './header.scss',
})
export class Header {
  readonly provinces = [
    'Almería',
    'Cádiz',
    'Córdoba',
    'Granada',
    'Huelva',
    'Jaén',
    'Málaga',
    'Sevilla',
  ];

  constructor(public selection: SelectionStore) {}

  toggleAndalucia() {
    if (this.selection.isAllSelected(this.provinces)) {
      this.selection.clear();
    } else {
      this.selection.setAll(this.provinces);
    }
  }

  isAndaluciaSelected() {
    return this.selection.isAllSelected(this.provinces);
  }
}
