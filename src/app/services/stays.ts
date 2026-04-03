import { HttpClient, httpResource } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { StayDto } from '../types/stayDto';
import { Stay } from '../types/Stay';
import { Task } from '../types/Task';
import { UpdateStayDto } from '../types/updateStayDto';

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

  update(
    payload: {
      tasks: Task[];
      title: string | null;
      startDate: Date | null;
      endDate: Date | null;
    },
    id: string,
  ) {
    const updateStayDto: UpdateStayDto = {
      title: payload.title,
      startDate: this.formatDate(payload.startDate),
      endDate: this.formatDate(payload.endDate),
      tasks: payload.tasks,
    };
    return this.http.put(`${this.apiUrl}/stays/${id}`, updateStayDto, { withCredentials: true });
  }

  deleteStay(stayId: string) {
    return this.http.delete(`${this.apiUrl}/stays/${stayId}`, { withCredentials: true });
  }

  formatDate(date: Date | null): string {
    if (!date) return '';
    var d = new Date(date),
      month = '' + (d.getMonth() + 1),
      day = '' + d.getDate(),
      year = d.getFullYear();

    if (month.length < 2) month = '0' + month;
    if (day.length < 2) day = '0' + day;

    return [year, month, day].join('-');
  }
}
