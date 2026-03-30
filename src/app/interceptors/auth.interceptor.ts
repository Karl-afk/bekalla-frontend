import {
  HttpInterceptorFn,
  HttpRequest,
  HttpHandlerFn,
  HttpEvent,
  HttpErrorResponse,
} from '@angular/common/http';
import { inject } from '@angular/core';
import { Auth } from '../services/auth';
import { Router } from '@angular/router';
import { catchError, switchMap, throwError } from 'rxjs';
const cnt = 0;
export const authInterceptor: HttpInterceptorFn = (
  req: HttpRequest<unknown>,
  next: HttpHandlerFn,
) => {
  const authService = inject(Auth);
  const router = inject(Router);
  const token = localStorage.getItem('token'); // Dein Access Token

  let authReq = req;

  // Token hinzufügen (außer bei public routes)
  if (token) {
    authReq = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`,
      },
    });
  }

  return next(authReq).pipe(
    catchError((error: HttpErrorResponse) => {
      console.log('🚀 ~ authInterceptor ~ error:', error);
      if (error.status === 401) {
        return authService.refreshToken().pipe(
          switchMap((response) => {
            // Token refreshed → Original Request RETRY!
            const retryReq = req.clone({
              setHeaders: { Authorization: `Bearer ${response.token}` },
            });
            return next(retryReq);
          }),
          catchError((refreshError) => {
            console.log('🚀 ~ authInterceptor ~ refreshError:', refreshError);
            // Refresh fehlgeschlagen → Logout
            authService.logout();
            router.navigate(['/']);
            return throwError(() => refreshError);
          }),
        );
      }
      return throwError(() => error);
    }),
  );
};
