import { Component, inject, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Sidenav } from './components/sidenav/sidenav';
import { ToastModule } from 'primeng/toast';
import { Auth } from './services/auth';
import { SwPush, SwUpdate, VersionReadyEvent } from '@angular/service-worker';
import { filter } from 'rxjs';
import { PushNotificationService } from './services/push-notification.service';
import { ToastService } from './services/toast-service';
import { ButtonModule } from 'primeng/button';
import { MobileNav } from './components/mobile-nav/mobile-nav';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Sidenav, ToastModule, ButtonModule, MobileNav],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {
  protected readonly title = signal('bekalla-frontend');
  authService = inject(Auth);
  private swUpdate = inject(SwUpdate);
  private push = inject(PushNotificationService);
  swPush: SwPush = inject(SwPush);
  private toastService = inject(ToastService);
  ngOnInit() {
    if (this.swUpdate.isEnabled) {
      this.swUpdate.versionUpdates
        .pipe(filter((e): e is VersionReadyEvent => e.type === 'VERSION_READY'))
        .subscribe(() => {
          if (confirm('Update verfügbar! Jetzt neu laden?')) {
            window.location.reload();
          }
        });
    }
    this.push.handleNotificationClicks();
  }

  enableNotifications() {
    this.push.subscribe().subscribe(() => {
      this.toastService.showSuccess('Push Notifications aktiviert!');
    });
  }
}
