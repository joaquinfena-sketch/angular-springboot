import { ApplicationConfig, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient, withInterceptorsFromDi, HTTP_INTERCEPTORS } from '@angular/common/http';
import { routes } from './app.routes';
import { LoadingInterceptor } from './core/loading.interceptor';
import { AuthInterceptor } from './core/auth/auth.interceptor';
import { GetAccidentPointsPort, GetAccidentReportsPort } from './core/port/out/accident.port';
import { AccidentHttpAdapter } from './adapter/out/http/accident-http.adapter';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(routes),

    provideHttpClient(withInterceptorsFromDi()),

    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: LoadingInterceptor, multi: true },

    // Arquitectura hexagonal: adaptador HTTP implementa los puertos de salida
    AccidentHttpAdapter,
    { provide: GetAccidentPointsPort, useExisting: AccidentHttpAdapter },
    { provide: GetAccidentReportsPort, useExisting: AccidentHttpAdapter },
  ]
};

