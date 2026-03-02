import { Component } from '@angular/core';

import { Header } from '../../shared/header/header';
import { AccidentFormComponent } from './accident-form';

@Component({
  selector: 'app-accident-form-page',
  standalone: true,
  imports: [Header, AccidentFormComponent],
  templateUrl: './accident-form-page.html',
})
export class AccidentFormPageComponent {}

