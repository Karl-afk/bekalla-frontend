import { Component, inject, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { FloatLabelModule } from 'primeng/floatlabel';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { Auth } from '../../services/auth';
import { LoginDto } from '../../types/loginDto';
import { catchError, EMPTY } from 'rxjs';
import { MessageModule } from 'primeng/message';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  imports: [FloatLabelModule, InputTextModule, ButtonModule, ReactiveFormsModule, MessageModule],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login {
  auth = inject(Auth);
  router = inject(Router);
  loginForm = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', Validators.required),
  });

  errorMessage = signal<string | null>(null);

  async onSubmit() {
    const loginDto = this.loginForm.value as LoginDto;
    this.auth
      .login(loginDto)
      .pipe(
        catchError((err) => {
          console.log('🚀 ~ Login ~ onSubmit ~ err:', err);
          this.errorMessage.set(err.error?.message || 'An error occurred during login.');
          return EMPTY;
        }),
      )
      .subscribe((res) => {
        console.log('🚀 ~ Login ~ onSubmit ~ res:', res);
        this.auth.isLoggedIn.set(true);
        localStorage.setItem('token', res.token);
        this.router.navigate(['/dashboard']);
      });
  }
}
