import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { LoadingService, OverlayMessage, LoadingMessage } from '../../core/loading.service';
import { combineLatest, map, Observable } from 'rxjs';

@Component({
  selector: 'app-loading-overlay',
  standalone: true,
  imports: [CommonModule, MatProgressSpinnerModule],
  templateUrl: './loading-overlay.html',
  styleUrls: ['./loading-overlay.scss']
})
export class LoadingOverlayComponent {

  vm$: Observable<{
    loading: boolean;
    loadingMessage: LoadingMessage | null;
    message: OverlayMessage | null;
  }>;

  constructor(private loading: LoadingService) {
    this.vm$ = combineLatest([
      this.loading.loading$,
      this.loading.loadingMessage$,
      this.loading.message$,
    ]).pipe(
      map(([loading, loadingMessage, message]) => ({ loading, loadingMessage, message }))
    );
  }
}
