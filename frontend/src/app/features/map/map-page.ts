import { Component } from '@angular/core';

import { Header } from '../../shared/header/header';
import { MapComponent } from './map';

@Component({
  selector: 'app-map-page',
  standalone: true,
  imports: [Header, MapComponent],
  templateUrl: './map-page.html',
})
export class MapPageComponent {}

