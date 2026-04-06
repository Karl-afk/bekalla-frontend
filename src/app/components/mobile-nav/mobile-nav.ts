import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';

type NavItem = {
  label: string;
  icon: string; // PrimeIcons class
  route: string;
  badge?: number; // z.B. für ungelesene Notifications
};

@Component({
  selector: 'app-mobile-nav',
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './mobile-nav.html',
  styleUrl: './mobile-nav.css',
})
export class MobileNav {
  navItems: NavItem[] = [
    { label: 'Dashboard', icon: 'pi-home', route: '/dashboard' },
    { label: 'Erinnerungen', icon: 'pi-bell', route: '/reminder' },
    { label: 'Default Tasks', icon: 'pi-cog', route: '/default-tasks' },
  ];
}
