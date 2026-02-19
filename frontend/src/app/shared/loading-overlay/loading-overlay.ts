import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { LoadingService } from '../../core/loading.service';

@Component({
  selector: 'app-loading-overlay',
  standalone: true,
  imports: [CommonModule, MatProgressSpinnerModule],
  templateUrl: './loading-overlay.html',
  styleUrls: ['./loading-overlay.scss']
})
export class LoadingOverlayComponent {

  loading$;

  constructor(private loading: LoadingService) {
    this.loading$ = this.loading.loading$;
  }
}
