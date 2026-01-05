import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../core/services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule],
  template: `
    <header class="header">
      <div class="left">
        <h1>Overview</h1>
      </div>
      <div class="right">
        <div class="user-profile" *ngIf="isLoggedIn()">
          <div class="avatar">{{ userInitial }}</div>
          <span class="name">Logged In</span>
          <button class="btn-logout" (click)="logout()">Logout</button>
        </div>
        <div class="auth-links" *ngIf="!isLoggedIn()">
           <button class="btn-login" (click)="goToLogin()">Login</button>
        </div>
      </div>
    </header>
  `,
  styles: [`
    @import 'variables';
    
    .header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: $spacing-lg 0;
      margin-bottom: $spacing-md;
    }

    h1 {
      margin: 0;
      font-size: $font-size-xxl;
    }

    .user-profile {
      display: flex;
      align-items: center;
      gap: $spacing-sm;
      padding: $spacing-sm $spacing-md;
      background: $bg-card;
      border-radius: $radius-xl;
      border: 1px solid rgba(255,255,255,0.05);

      .avatar {
        width: 32px;
        height: 32px;
        background: $primary;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        font-weight: bold;
        color: white;
      }
      
      .name {
        font-weight: 500;
        font-size: $font-size-sm;
        color: $text-secondary;
      }

      .btn-logout {
        background: transparent;
        border: none;
        color: $error;
        font-size: $font-size-sm;
        cursor: pointer;
        margin-left: $spacing-sm;
        &:hover { text-decoration: underline; }
      }
    }

    .btn-login {
       padding: 8px 16px;
       background: $primary;
       border: none;
       border-radius: $radius-md;
       color: white;
       cursor: pointer;
    }
  `]
})
export class HeaderComponent {
  constructor(private authService: AuthService, private router: Router) { }

  isLoggedIn(): boolean {
    return this.authService.isLoggedIn();
  }

  get userInitial(): string {
    return 'U'; // Simplified
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/auth/login']);
  }

  goToLogin() {
    this.router.navigate(['/auth/login']);
  }
}
