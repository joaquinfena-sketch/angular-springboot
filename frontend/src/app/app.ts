import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { Header  } from './shared/header/header';
import { MapComponent } from './features/map/map';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { LoadingInterceptor } from './core/loading.interceptor';
import { LoadingOverlayComponent } from './shared/loading-overlay/loading-overlay';


@Component({
  selector: 'app-root',
  imports: [ Header, MapComponent, LoadingOverlayComponent],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
  protected readonly title = signal('proyecto_angular');
}
