import { HttpClient, httpResource } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { StayDto } from '../types/stayDto';
import { Stay } from '../types/Stay';

@Injectable({
  providedIn: 'root',
})
export class Stays {
  http = inject(HttpClient);
  apiUrl = environment.apiUrl;

  stays = httpResource<{ stays: Stay[] }>(() => ({
    url: `${this.apiUrl}/stays`,
    credentials: 'include',
  }));

  createStay(stayDto: StayDto) {
    return this.http.post(`${this.apiUrl}/stays`, stayDto, { withCredentials: true });
  }
}
