import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';

import { Router } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, RouterModule, ReactiveFormsModule],
  template: `
    <div class="auth-container">
      <div class="auth-card">
        <div class="header">
          <h2>Create Account</h2>
          <p>Join us to track your growth</p>
        </div>
        
        <div *ngIf="error" class="error-banner">{{error}}</div>
        <div *ngIf="success" class="success-banner">Registration successful! Redirecting...</div>

        <form [formGroup]="registerForm" (ngSubmit)="onSubmit()">
          <div class="form-group">
            <label for="name">Full Name</label>
            <input type="text" id="name" formControlName="fullName" placeholder="Enter your name" [class.error]="isFieldInvalid('fullName')">
            <span class="error-msg" *ngIf="isFieldInvalid('fullName')">Name is required</span>
          </div>

          <div class="form-group">
            <label for="email">Email</label>
            <input type="email" id="email" formControlName="email" placeholder="Enter your email" [class.error]="isFieldInvalid('email')">
            <span class="error-msg" *ngIf="isFieldInvalid('email')">Please enter a valid email</span>
          </div>

          <div class="form-group">
            <label for="password">Password</label>
            <input type="password" id="password" formControlName="password" placeholder="Create a password" [class.error]="isFieldInvalid('password')">
            <span class="error-msg" *ngIf="isFieldInvalid('password')">Min 6 characters required</span>
          </div>

          <div class="form-actions">
            <button type="submit" class="btn-primary" [disabled]="registerForm.invalid || loading">
              <span *ngIf="!loading">Sign Up</span>
              <span *ngIf="loading">Creating account...</span>
            </button>
          </div>
        </form>

        <div class="footer">
          <p>Already have an account? <a routerLink="/auth/login">Login</a></p>
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
      background: radial-gradient(circle at top left, rgba($accent, 0.1), transparent 40%),
                  radial-gradient(circle at bottom right, rgba($primary, 0.1), transparent 40%);
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

    .success-banner {
      background: rgba($success, 0.1);
      color: $success;
      padding: $spacing-md;
      border-radius: $radius-md;
      margin-bottom: $spacing-lg;
      border: 1px solid rgba($success, 0.2);
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
          border-color: $accent;
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
      background: linear-gradient(135deg, $accent, darken($accent, 10%));
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
        color: $accent;
        font-weight: 500;
        &:hover {
          text-decoration: underline;
        }
      }
    }
  `]
})
export class RegisterComponent {
  registerForm: FormGroup;
  loading = false;
  error: string | null = null;
  success = false;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.registerForm = this.fb.group({
      fullName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  isFieldInvalid(field: string): boolean {
    const control = this.registerForm.get(field);
    return !!(control && control.invalid && (control.dirty || control.touched));
  }

  onSubmit() {
    if (this.registerForm.valid) {
      this.loading = true;
      this.error = null;
      this.authService.register(this.registerForm.value).subscribe({
        next: () => {
          this.loading = false;
          this.success = true;
          setTimeout(() => this.router.navigate(['/auth/login']), 2000);
        },
        error: (err) => {
          this.loading = false;
          this.error = err.error?.detail || 'An error occurred during registration.';
        }
      });
    }
  }
}
