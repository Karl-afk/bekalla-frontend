import { HttpClient, httpResource } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Task } from '../types/Task';
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs';

export type DefaultTask = {
  id: string;
  title: string;
  category: string;
  isDone: boolean;
  amount: number | null;
};

export type CreateDefaultTask = Omit<DefaultTask, 'id'>;
export type UpdateDefaultTask = Partial<CreateDefaultTask>;

@Injectable({
  providedIn: 'root',
})
export class DefaultTasksService {
  private http = inject(HttpClient);
  apiUrl = environment.apiUrl + '/default-tasks';

  defaultTasks = httpResource<{ defaultTasks: Task[] }>(() => ({
    url: `${this.apiUrl}`,
    credentials: 'include',
  }));

  getById(id: string): Observable<{ defaultTask: DefaultTask }> {
    return this.http.get<{ defaultTask: DefaultTask }>(`${this.apiUrl}/${id}`, {
      withCredentials: true,
    });
  }

  // POST /api/default-tasks
  create(data: CreateDefaultTask): Observable<{ defaultTask: DefaultTask }> {
    return this.http.post<{ defaultTask: DefaultTask }>(this.apiUrl, data, {
      withCredentials: true,
    });
  }

  // PUT /api/default-tasks/:id
  update(id: string, data: CreateDefaultTask): Observable<{ defaultTask: DefaultTask }> {
    return this.http.put<{ defaultTask: DefaultTask }>(`${this.apiUrl}/${id}`, data, {
      withCredentials: true,
    });
  }

  // PATCH /api/default-tasks/:id
  patch(id: string, data: UpdateDefaultTask): Observable<{ defaultTask: DefaultTask }> {
    return this.http.patch<{ defaultTask: DefaultTask }>(`${this.apiUrl}/${id}`, data, {
      withCredentials: true,
    });
  }

  // DELETE /api/default-tasks/:id
  delete(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`, { withCredentials: true });
  }
}
