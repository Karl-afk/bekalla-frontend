import { inject, Injectable } from '@angular/core';
import { LoginDto } from '../types/loginDto';
import { HttpClient } from '@angular/common/http';
import { catchError, Observable, tap, throwError } from 'rxjs';
import { Router } from '@angular/router';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class Auth {
  private http = inject(HttpClient);
  private apiUrl = environment.apiUrl;
  login(loginDto: LoginDto) {
    return this.http.post<{ token: string; message: string }>(
      `${this.apiUrl}/auth/login`,
      loginDto,
      {
        withCredentials: true,
      },
    );
  }

  logout() {
    localStorage.removeItem('token');
  }

  refreshToken(): Observable<{ token: string }> {
    return this.http
      .post<{ token: string }>(
        `${this.apiUrl}/auth/refresh`,
        {},
        {
          withCredentials: true, // Refresh Cookie!
        },
      )
      .pipe(
        tap(({ token }) => {
          localStorage.setItem('token', token);
        }),
      );
  }
}
