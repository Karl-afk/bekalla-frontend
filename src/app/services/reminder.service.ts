import { HttpClient, httpResource } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

export type ReminderFrequency = 'once' | 'daily' | 'weekly' | 'monthly';

export type Reminder = {
  id: string;
  title: string;
  body: string;
  frequency: ReminderFrequency;
  scheduleValue: string | null;
  time: string;
  isActive: boolean;
  createdAt: string;
};

export type CreateReminder = Omit<Reminder, 'id' | 'createdAt'>;

@Injectable({
  providedIn: 'root',
})
export class ReminderService {
  private http = inject(HttpClient);
  private readonly baseUrl = environment.apiUrl + '/reminders';

  reminders = httpResource<{ reminders: Reminder[] }>(() => ({
    url: this.baseUrl,
    credentials: 'include',
  }));

  getAll(): Observable<{ reminders: Reminder[] }> {
    return this.http.get<{ reminders: Reminder[] }>(this.baseUrl);
  }

  create(data: CreateReminder): Observable<{ reminder: Reminder }> {
    return this.http.post<{ reminder: Reminder }>(this.baseUrl, data);
  }

  update(id: string, data: CreateReminder): Observable<{ reminder: Reminder }> {
    return this.http.put<{ reminder: Reminder }>(`${this.baseUrl}/${id}`, data);
  }

  toggle(id: string): Observable<{ isActive: boolean }> {
    return this.http.patch<{ isActive: boolean }>(`${this.baseUrl}/${id}/toggle`, {});
  }

  delete(id: string): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }
}
