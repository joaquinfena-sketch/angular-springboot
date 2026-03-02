import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export type OverlayMessageVariant = 'info' | 'error';

export interface OverlayMessage {
  title: string;
  subtitle?: string;
  variant?: OverlayMessageVariant;
  tone?: 'blue' | 'pink';
}

/** Mensaje mostrado mientras hay una petición en curso (spinner). */
export interface LoadingMessage {
  title: string;
  subtitle?: string;
}

@Injectable({ providedIn: 'root' })
export class LoadingService {

  private _loading = new BehaviorSubject<boolean>(false);
  loading$ = this._loading.asObservable();

  /** Mensaje del spinner actual (p. ej. "Accediendo..." en login). Si no se setea, el overlay usa el por defecto. */
  private _loadingMessage = new BehaviorSubject<LoadingMessage | null>(null);
  loadingMessage$ = this._loadingMessage.asObservable();

  private _message = new BehaviorSubject<OverlayMessage | null>(null);
  message$ = this._message.asObservable();

  private messageTimer: number | null = null;
  private showStartedAt: number | null = null;
  private minShowTimer: ReturnType<typeof setTimeout> | null = null;
  private minDisplayMsForCurrentShow = 0;

  /** Muestra el spinner. minDisplayMs: tiempo mínimo visible (0 = ocultar en cuanto llegue hide; solo mapa usa 2000). */
  show(loadingMessage?: LoadingMessage, minDisplayMs = 0) {
    this._loadingMessage.next(loadingMessage ?? null);
    this.showStartedAt = Date.now();
    this.minDisplayMsForCurrentShow = minDisplayMs;
    this._loading.next(true);
  }

  hide() {
    if (this.minShowTimer != null) {
      clearTimeout(this.minShowTimer);
      this.minShowTimer = null;
    }
    const started = this.showStartedAt;
    if (started == null) {
      this._loading.next(false);
      this._loadingMessage.next(null);
      return;
    }
    const minMs = this.minDisplayMsForCurrentShow;
    if (minMs <= 0) {
      this.doHide();
      return;
    }
    const elapsed = Date.now() - started;
    const remaining = minMs - elapsed;
    if (remaining <= 0) {
      this.doHide();
      return;
    }
    this.minShowTimer = setTimeout(() => {
      this.minShowTimer = null;
      this.doHide();
    }, remaining);
  }

  private doHide() {
    this.showStartedAt = null;
    this._loading.next(false);
    this._loadingMessage.next(null);
  }

  showMessage(message: OverlayMessage, durationMs = 3500) {
    this._message.next(message);

    if (this.messageTimer != null) {
      window.clearTimeout(this.messageTimer);
      this.messageTimer = null;
    }

    this.messageTimer = window.setTimeout(() => {
      this._message.next(null);
      this.messageTimer = null;
    }, durationMs);
  }

  clearMessage() {
    if (this.messageTimer != null) {
      window.clearTimeout(this.messageTimer);
      this.messageTimer = null;
    }
    this._message.next(null);
  }
}
