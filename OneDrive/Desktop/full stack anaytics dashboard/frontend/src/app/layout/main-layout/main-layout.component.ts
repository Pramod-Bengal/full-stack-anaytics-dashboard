import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { SidebarComponent } from '../sidebar/sidebar.component';
import { HeaderComponent } from '../header/header.component';

@Component({
    selector: 'app-main-layout',
    standalone: true,
    imports: [CommonModule, RouterOutlet, SidebarComponent, HeaderComponent],
    template: `
    <div class="layout-wrapper">
      <app-sidebar class="sidebar"></app-sidebar>
      <div class="main-content">
        <app-header></app-header>
        <div class="content-body">
          <router-outlet></router-outlet>
        </div>
      </div>
    </div>
  `,
    styles: [`
    .layout-wrapper {
      display: flex;
      height: 100vh;
      overflow: hidden;
    }
    .sidebar {
      width: 260px;
      flex-shrink: 0;
      transition: width 0.3s ease;
      
      @media (max-width: 768px) {
        display: none; // Hiding for now, will implement mobile toggle later
      }
    }
    .main-content {
      flex: 1;
      display: flex;
      flex-direction: column;
      overflow: hidden;
      background-color: #121212; // Match bg-dark
    }
    .content-body {
      flex: 1;
      overflow-y: auto;
      padding: 24px;
    }
  `]
})
export class MainLayoutComponent { }
