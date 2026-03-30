import { Routes } from '@angular/router';
import { authGuard } from './guards/auth-guard';

export const routes: Routes = [
  {
    path: '',
    title: 'Login',
    loadComponent: () => import('./pages/login/login').then((m) => m.Login),
  },
  {
    path: 'dashboard',
    title: 'Dashboard',
    loadComponent: () => import('./pages/dashboard/dashboard').then((m) => m.Dashboard),
    canActivate: [authGuard],
  },
  {
    path: 'stays/new',
    title: 'Neuen Aufenthalt anlegen',
    loadComponent: () => import('./pages/new-stay/new-stay').then((m) => m.NewStay),
    canActivate: [authGuard],
  },
];
