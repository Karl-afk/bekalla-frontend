import { inject } from '@angular/core';
import { CanActivateFn, RedirectCommand, Router } from '@angular/router';

export const authGuard: CanActivateFn = (route, state) => {
  const token = localStorage.getItem('token');
  const router = inject(Router);
  if (!token) {
    const loginPath = router.parseUrl('/');
    return new RedirectCommand(loginPath, { skipLocationChange: true });
  }
  return true;
};
