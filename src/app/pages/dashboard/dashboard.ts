import { Component, computed, effect, inject } from '@angular/core';
import { CardModule } from 'primeng/card';
import { Stays } from '../../services/stays';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { RouterLink } from '@angular/router';
import { PanelModule } from 'primeng/panel';

@Component({
  selector: 'app-dashboard',
  imports: [CardModule, CommonModule, ButtonModule, RouterLink, PanelModule],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css',
})
export class Dashboard {
  staysService = inject(Stays);
  stays = this.staysService.stays;
  currentStays = computed(() =>
    // this.stays.value()?.filter((stay: any) => new Date(stay.endDate) >= new Date()),
    this.stays.value()?.stays.filter((stay: any) => new Date(stay.endDate) >= new Date()),
  );
  pastStays = computed(() =>
    // this.stays.value()?.filter((stay: any) => new Date(stay.endDate) >= new Date()),
    this.stays.value()?.stays.filter((stay: any) => new Date(stay.endDate) < new Date()),
  );
  upcomingStays = computed(() =>
    // this.stays.value()?.filter((stay: any) => new Date(stay.endDate) >= new Date()),
    this.stays.value()?.stays.filter((stay: any) => new Date(stay.startDate) >= new Date()),
  );

  constructor() {
    effect(() => {});
  }
}
