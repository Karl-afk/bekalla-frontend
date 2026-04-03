import { HttpClient } from '@angular/common/http';
import { inject } from '@angular/core';
import { CanActivateFn, RedirectCommand, Router } from '@angular/router';
import { environment } from '../../environments/environment';

export const authGuard: CanActivateFn = (route, state) => {
  const token = localStorage.getItem('token');
  const router = inject(Router);
  const httpClient = inject(HttpClient);

  if (token) return true;

  httpClient.get(`${environment.apiUrl}/auth/refresh`, { withCredentials: true }).subscribe({
    next: (res: any) => {
      // Token is valid, do nothing
      localStorage.setItem('token', res.token);
      return true;
    },
    error: () => {
      const loginPath = router.parseUrl('/');
      return new RedirectCommand(loginPath, { skipLocationChange: true });
    },
  });
  return true;
};
