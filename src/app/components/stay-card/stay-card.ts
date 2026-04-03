import { Component, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Stay } from '../../types/Stay';
import { CardModule } from 'primeng/card';
import { DividerModule } from 'primeng/divider';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-stay-card',
  imports: [RouterLink, CardModule, CommonModule, DividerModule],
  templateUrl: './stay-card.html',
  styleUrl: './stay-card.css',
})
export class StayCard {
  stay = input.required<Stay>();
}
