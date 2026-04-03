import { Component, inject, signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { Auth } from '../../services/auth';
import { DividerModule } from 'primeng/divider';

@Component({
  selector: 'app-sidenav',
  imports: [RouterLink, ButtonModule, DividerModule],
  templateUrl: './sidenav.html',
  styleUrl: './sidenav.css',
})
export class Sidenav {
  authService = inject(Auth);
  router = inject(Router);
  collapsed = signal(false);
  logout() {
    this.authService.logout().subscribe(() => this.router.navigateByUrl('/'));
  }

  toggleSidebar() {}
}
