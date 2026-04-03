import {
  HttpInterceptorFn,
  HttpRequest,
  HttpHandlerFn,
  HttpErrorResponse,
  HttpEvent,
} from '@angular/common/http';
import { inject } from '@angular/core';
import { BehaviorSubject, Observable, catchError, filter, switchMap, take, throwError } from 'rxjs';
import { Router } from '@angular/router';
import { Auth } from '../services/auth';
import { ToastService } from '../services/toast-service';

// Außerhalb der Funktion → bleibt zwischen Requests bestehen
let isRefreshing = false;
const refreshTokenSubject = new BehaviorSubject<string | null>(null);

// Routen die KEINEN Token brauchen
const PUBLIC_URLS = ['/api/v1/auth/login', '/api/v1/auth/register', '/api/v1/auth/refresh'];

export const authInterceptor: HttpInterceptorFn = (
  req: HttpRequest<unknown>,
  next: HttpHandlerFn,
): Observable<HttpEvent<unknown>> => {
  const authService = inject(Auth);
  const router = inject(Router);
  const toastService = inject(ToastService);

  const isPublic = PUBLIC_URLS.some((url) => req.url.includes(url));

  // Token anhängen (außer public routes)
  const authReq = addToken(req, authService.getAccessToken(), isPublic);

  return next(authReq).pipe(
    catchError((error: HttpErrorResponse) => {
      // Nur 401 von geschützten Routen → Refresh versuchen
      if (error.status === 401 && !isPublic) {
        return handle401(authReq, next, authService, router, toastService);
      }
      return throwError(() => error);
    }),
  );
};

// ─── Helper: Token an Request anhängen ────────────────────────────────────────
function addToken(
  req: HttpRequest<unknown>,
  token: string | null,
  isPublic: boolean,
): HttpRequest<unknown> {
  if (!token || isPublic) return req;

  return req.clone({
    setHeaders: { Authorization: `Bearer ${token}` },
  });
}

// ─── Helper: 401 → Refresh → Retry ────────────────────────────────────────────
function handle401(
  req: HttpRequest<unknown>,
  next: HttpHandlerFn,
  authService: Auth,
  router: Router,
  toastService: ToastService,
): Observable<HttpEvent<unknown>> {
  if (!isRefreshing) {
    // Erster 401 → Refresh starten
    isRefreshing = true;
    refreshTokenSubject.next(null); // Wartende Requests blockieren

    return authService.refreshToken().pipe(
      switchMap(({ token }) => {
        isRefreshing = false;
        refreshTokenSubject.next(token); // Wartende Requests freigeben

        // Original-Request mit neuem Token wiederholen
        return next(addToken(req, token, false));
      }),
      catchError((err) => {
        // Refresh fehlgeschlagen → Logout
        isRefreshing = false;
        refreshTokenSubject.next(null);
        toastService.showError('Nicht Autorisiert! Bitte einloggen');
        authService.logout().subscribe();
        router.navigate(['/']);
        return throwError(() => err);
      }),
    );
  }

  // Weitere parallele 401s → auf neuen Token warten
  return refreshTokenSubject.pipe(
    filter((token) => token !== null),
    take(1),
    switchMap((token) => next(addToken(req, token, false))),
  );
}
