import { inject, Injectable, signal } from '@angular/core';
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
  isLoggedIn = signal<boolean>(!!localStorage.getItem('token'));

  getAccessToken(): string | null {
    return localStorage.getItem('token');
  }

  setAccessToken(token: string): void {
    localStorage.setItem('token', token);
    this.isLoggedIn.set(true);
  }
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
    this.isLoggedIn.set(false);
    return this.http.post(
      `${this.apiUrl}/auth/logout`,
      {},
      {
        withCredentials: true, // Refresh Cookie!
      },
    );
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
