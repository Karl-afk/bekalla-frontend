import { inject, Injectable, Injector } from '@angular/core';
import {
  HttpInterceptorFn,
  HttpRequest,
  HttpHandlerFn,
  HttpErrorResponse,
} from '@angular/common/http';
import { catchError, throwError } from 'rxjs';
import { Toast } from '../services/toast';

export const errorInterceptor: HttpInterceptorFn = (
  req: HttpRequest<unknown>,
  next: HttpHandlerFn,
) => {
  const injector = inject(Injector);
  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      let userMessage = 'Ein unerwarteter Fehler ist aufgetreten';
      const toastService = injector.get(Toast);

      if (error.status === 0) {
        userMessage = 'Keine Internetverbindung. Bitte prüfen Sie Ihre Verbindung.';
      } else if (error.status >= 500) {
        userMessage = 'Serverfehler. Bitte versuchen Sie es später erneut.';
      } else if (error.status === 401) {
        userMessage = 'Nicht autorisiert. Bitte neu einloggen.';
        // Optional: Redirect zu Login
      } else if (error.status === 403) {
        userMessage = 'Zugriff verweigert.';
      } else if (error.status === 404) {
        userMessage = 'Gefundene Ressource nicht verfügbar.';
      } else {
        // Backend Error Message parsen (z.B. { message: '...' })
        userMessage = error.error?.message || error.message || userMessage;
      }

      console.error('HTTP Error:', error);

      // Globale Notification (Toast, Snackbar etc.)
      showNotification(userMessage);
      toastService.showError(userMessage);

      return throwError(() => error); // Error weiterleiten für Component-Handling
    }),
  );
};

// Notification Service (Beispiel)
function showNotification(message: string) {
  // MatSnackBar, Toastr, etc.
  console.log('🔔 Notification:', message);
}
