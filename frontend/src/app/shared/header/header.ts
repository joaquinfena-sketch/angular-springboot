import { Component } from '@angular/core';
import { NgClass, NgFor, NgIf } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { SelectionStore } from '../../core/state/selection.store';
import { Input } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../core/auth/auth.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [NgClass, NgFor, NgIf, RouterLink, MatButtonModule, MatIconModule],
  templateUrl: './header.html',
  styleUrl: './header.scss',
})
export class Header {
  @Input() title = 'Accidentes Mortales Andalucía';
  @Input() showProvinceButtons = true;
  @Input() tone: 'blue' | 'pink' = 'blue';

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

  constructor(
    public selection: SelectionStore,
    public auth: AuthService
  ) {}

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
