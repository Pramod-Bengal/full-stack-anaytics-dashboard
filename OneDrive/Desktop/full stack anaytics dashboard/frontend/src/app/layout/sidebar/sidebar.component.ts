import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <aside class="sidebar-container">
      <div class="logo-area">
        <h2>Analytics</h2>
      </div>
      
      <nav class="nav-links">
        <a routerLink="/dashboard" routerLinkActive="active" class="nav-item">
          <span class="icon">📊</span>
          <span class="label">Dashboard</span>
        </a>
        <a routerLink="/reports" routerLinkActive="active" class="nav-item">
          <span class="icon">📈</span>
          <span class="label">Reports</span>
        </a>
        <a routerLink="/profile" routerLinkActive="active" class="nav-item">
          <span class="icon">👤</span>
          <span class="label">Profile</span>
        </a>
        <a routerLink="/admin" routerLinkActive="active" class="nav-item admin">
          <span class="icon">🛡️</span>
          <span class="label">Admin</span>
        </a>
      </nav>

      <div class="footer">
        <p>© 2025</p>
      </div>
    </aside>
  `,
  styles: [`
    @import 'variables';
    @import 'mixins';

    .sidebar-container {
      height: 100%;
      background: $bg-card;
      border-right: 1px solid rgba(255,255,255,0.05);
      display: flex;
      flex-direction: column;
      padding: $spacing-md;
    }

    .logo-area {
      padding: $spacing-md 0 $spacing-xl;
      h2 {
        color: $primary;
        font-size: $font-size-xl;
        margin: 0;
        letter-spacing: 1px;
      }
    }

    .nav-links {
      flex: 1;
      display: flex;
      flex-direction: column;
      gap: $spacing-sm;
    }

    .nav-item {
      display: flex;
      align-items: center;
      padding: $spacing-md;
      border-radius: $radius-md;
      color: $text-secondary;
      transition: all 0.2s ease;
      font-weight: 500;

      .icon {
        margin-right: $spacing-md;
        font-size: $font-size-lg;
      }

      &:hover {
        background: $bg-hover;
        color: $text-main;
        transform: translateX(4px);
      }

      &.active {
        background: rgba($primary, 0.15);
        color: $primary;
        
        &::before {
          content: '';
          position: absolute;
          left: 0;
          height: 60%;
          width: 3px;
          background: $primary;
          border-radius: 0 4px 4px 0;
        }
      }

      &.admin {
        margin-top: $spacing-xl;
        border-top: 1px solid rgba(255,255,255,0.05);
        padding-top: $spacing-lg;
      }
    }

    .footer {
      padding-top: $spacing-md;
      border-top: 1px solid rgba(255,255,255,0.05);
      p {
        color: $text-muted;
        font-size: $font-size-sm;
        text-align: center;
      }
    }
  `]
})
export class SidebarComponent { }
