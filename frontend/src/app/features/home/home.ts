import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';

import { Header } from '../../shared/header/header';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [Header, RouterLink, MatButtonModule],
  templateUrl: './home.html',
  styleUrl: './home.scss',
})
export class HomeComponent {}

