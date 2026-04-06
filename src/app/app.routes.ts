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
  {
    path: 'stays/:id',
    title: 'Aufenthalt bearbeiten',
    loadComponent: () => import('./pages/edit-stay/edit-stay').then((m) => m.EditStay),
    canActivate: [authGuard],
  },
  {
    path: 'default-tasks',
    title: 'Standard Aufgaben',
    loadComponent: () => import('./pages/default-tasks/default-tasks').then((m) => m.DefaultTasks),
    canActivate: [authGuard],
  },
  {
    path: 'reminder',
    title: 'Reminder',
    loadComponent: () => import('./pages/reminder/reminder').then((m) => m.Reminder),
    canActivate: [authGuard],
  },
];
