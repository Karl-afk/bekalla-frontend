import { Component, computed, inject } from '@angular/core';
import { CardModule } from 'primeng/card';
import { Stays } from '../../services/stays';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { RouterLink } from '@angular/router';
import { PanelModule } from 'primeng/panel';
import { StayCard } from '../../components/stay-card/stay-card';
import { ToastService } from '../../services/toast-service';

@Component({
  selector: 'app-dashboard',
  imports: [CardModule, CommonModule, ButtonModule, RouterLink, PanelModule, StayCard],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css',
})
export class Dashboard {
  now = this.toDateOnly(new Date());
  staysService = inject(Stays);
  toastService = inject(ToastService);
  stays = this.staysService.stays;
  currentStays = computed(() =>
    this.stays.value()?.stays.filter((stay: any) => {
      const end = this.toDateOnly(stay.endDate);
      const start = this.toDateOnly(stay.startDate);
      return this.now <= end && this.now >= start;
    }),
  );
  pastStays = computed(() =>
    this.stays.value()?.stays.filter((stay: any) => {
      const end = this.toDateOnly(stay.endDate);
      const start = this.toDateOnly(stay.startDate);
      return end < this.now && start < this.now;
    }),
  );
  upcomingStays = computed(() =>
    this.stays.value()?.stays.filter((stay: any) => {
      const start = this.toDateOnly(stay.startDate);
      return start > this.now;
    }),
  );

  constructor() {}

  toDateOnly(dateString: string | Date) {
    const d = new Date(dateString);
    d.setHours(0, 0, 0, 0);
    return d.getTime();
  }
}
