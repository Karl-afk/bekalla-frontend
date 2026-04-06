import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { SwPush } from '@angular/service-worker';
import { catchError, EMPTY, switchMap } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class PushNotificationService {
  private swPush = inject(SwPush);
  private http = inject(HttpClient);
  apiUrl = environment.apiUrl;

  subscribe() {
    return this.http.get<{ publicKey: string }>(`${this.apiUrl}/notify/public-key`).pipe(
      switchMap(({ publicKey }) => this.swPush.requestSubscription({ serverPublicKey: publicKey })),
      switchMap((subscription) => this.http.post(`${this.apiUrl}/notify/subscribe`, subscription)),
      catchError((err) => {
        console.error('Push subscription failed:', err);
        return EMPTY;
      }),
    );
  }

  // Auf Notification-Klick reagieren (z.B. zu URL navigieren)
  handleNotificationClicks() {
    this.swPush.notificationClicks.subscribe(({ notification }) => {
      const url = notification.data?.url;
      if (url) window.open(url, '_blank');
    });
  }
}
