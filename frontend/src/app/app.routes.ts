import { Routes } from '@angular/router';

import { authGuard } from './core/auth/auth.guard';
import { LoginComponent } from './features/login/login';
import { HomeComponent } from './features/home/home';
import { MapPageComponent } from './features/map/map-page';
import { AccidentFormPageComponent } from './features/accident-form/accident-form-page';

export const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'login' },
  { path: 'login', component: LoginComponent },

  { path: 'home', component: HomeComponent, canActivate: [authGuard] },
  { path: 'map', component: MapPageComponent, canActivate: [authGuard] },
  { path: 'form', component: AccidentFormPageComponent, canActivate: [authGuard] },
  { path: '**', redirectTo: '' },
];
