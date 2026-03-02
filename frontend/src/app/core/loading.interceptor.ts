import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { finalize, Observable } from 'rxjs';
import { LoadingService } from './loading.service';

@Injectable()
export class LoadingInterceptor implements HttpInterceptor {

  constructor(private loading: LoadingService) {}

  intercept(req: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    const isLogin = req.url.includes('/auth/login');
    const minDisplayMs = isLogin ? 0 : 1000;
    this.loading.show(
      isLogin
        ? { title: 'Accediendo…', subtitle: 'Iniciando sesión' }
        : { title: 'Buscando localidades…', subtitle: 'Cargando puntos del mapa' },
      minDisplayMs
    );
    return next.handle(req).pipe(finalize(() => this.loading.hide()));
  }
}
