import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';

import { Router } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, RouterModule, ReactiveFormsModule],
  template: `
    <div class="auth-container">
      <div class="auth-card">
        <div class="header">
          <h2>Welcome Back</h2>
          <p>Login to your analytics dashboard</p>
        </div>
        
        <div *ngIf="error" class="error-banner">{{error}}</div>

        <form [formGroup]="loginForm" (ngSubmit)="onSubmit()">
          <div class="form-group">
            <label for="email">Email</label>
            <input type="email" id="email" formControlName="email" placeholder="Enter your email" [class.error]="isFieldInvalid('email')">
            <span class="error-msg" *ngIf="isFieldInvalid('email')">Please enter a valid email</span>
          </div>

          <div class="form-group">
            <label for="password">Password</label>
            <input type="password" id="password" formControlName="password" placeholder="Enter your password" [class.error]="isFieldInvalid('password')">
            <span class="error-msg" *ngIf="isFieldInvalid('password')">Password is required</span>
          </div>

          <div class="form-actions">
            <button type="submit" class="btn-primary" [disabled]="loginForm.invalid || loading">
              <span *ngIf="!loading">Login</span>
              <span *ngIf="loading">Logging in...</span>
            </button>
          </div>
        </form>

        <div class="footer">
          <p>Don't have an account? <a routerLink="/auth/register">Sign up</a></p>
        </div>
      </div>
    </div>
  `,
  styles: [`
    @import 'variables';
    @import 'mixins';

    .auth-container {
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
      background: radial-gradient(circle at top right, rgba($primary, 0.1), transparent 40%),
                  radial-gradient(circle at bottom left, rgba($secondary, 0.1), transparent 40%);
    }

    .auth-card {
      @include glass;
      width: 100%;
      max-width: 420px;
      padding: $spacing-xl;
      border-radius: $radius-lg;
      margin: $spacing-md;

      .header {
        text-align: center;
        margin-bottom: $spacing-xl;
        
        h2 {
          margin-bottom: $spacing-xs;
          font-size: $font-size-xxl;
        }
        p {
          color: $text-secondary;
        }
      }
    }

    .error-banner {
      background: rgba($error, 0.1);
      color: $error;
      padding: $spacing-md;
      border-radius: $radius-md;
      margin-bottom: $spacing-lg;
      border: 1px solid rgba($error, 0.2);
    }

    .form-group {
      margin-bottom: $spacing-lg;
      
      label {
        display: block;
        margin-bottom: $spacing-sm;
        color: $text-secondary;
        font-size: $font-size-sm;
      }

      input {
        width: 100%;
        padding: $spacing-md;
        background: rgba(0,0,0,0.2);
        border: 1px solid rgba(255,255,255,0.1);
        border-radius: $radius-md;
        color: $text-main;
        transition: all 0.2s;

        &:focus {
          border-color: $primary;
          background: rgba(0,0,0,0.3);
        }

        &.error {
          border-color: $error;
        }
      }

      .error-msg {
        color: $error;
        font-size: $font-size-sm;
        margin-top: 4px;
        display: block;
      }
    }

    .btn-primary {
      width: 100%;
      padding: $spacing-md;
      background: linear-gradient(135deg, $primary, darken($primary, 10%));
      color: white;
      border-radius: $radius-md;
      font-weight: 600;
      transition: opacity 0.2s;

      &:disabled {
        opacity: 0.5;
        cursor: not-allowed;
      }

      &:not(:disabled):hover {
        opacity: 0.9;
      }
    }

    .footer {
      margin-top: $spacing-xl;
      text-align: center;
      font-size: $font-size-sm;
      color: $text-secondary;

      a {
        color: $primary;
        font-weight: 500;
        &:hover {
          text-decoration: underline;
        }
      }
    }
  `]
})
export class LoginComponent {
  loginForm: FormGroup;
  loading = false;
  error: string | null = null;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    });
  }

  isFieldInvalid(field: string): boolean {
    const control = this.loginForm.get(field);
    return !!(control && control.invalid && (control.dirty || control.touched));
  }

  onSubmit() {
    if (this.loginForm.valid) {
      this.loading = true;
      this.error = null;
      this.authService.login(this.loginForm.value).subscribe({
        next: () => {
          this.loading = false;
          this.router.navigate(['/dashboard']);
        },
        error: (err) => {
          this.loading = false;
          this.error = err.error?.detail || 'Invalid email or password.';
        }
      });
    }
  }
}
