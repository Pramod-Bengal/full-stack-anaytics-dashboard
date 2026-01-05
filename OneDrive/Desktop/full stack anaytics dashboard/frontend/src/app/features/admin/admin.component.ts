import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService, User } from '../../core/services/auth.service';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div class="admin-container">
      <div class="header">
        <h2>User Management</h2>
        <button class="btn-primary" (click)="showForm = !showForm">
          {{ showForm ? 'Close' : '+ Add New User' }}
        </button>
      </div>

      <!-- Add User Form -->
      <div class="form-card" *ngIf="showForm">
        <h3>Create New User</h3>
        <form [formGroup]="userForm" (ngSubmit)="addUser()">
          <div class="form-grid">
            <div class="form-group">
              <label>Full Name</label>
              <input type="text" formControlName="fullName" placeholder="Full name">
            </div>
            <div class="form-group">
              <label>Email</label>
              <input type="email" formControlName="email" placeholder="Email address">
            </div>
            <div class="form-group">
              <label>Password</label>
              <input type="password" formControlName="password" placeholder="Password">
            </div>
            <div class="form-group">
              <label>Role</label>
              <select formControlName="role">
                <option value="user">User</option>
                <option value="admin">Admin</option>
                <option value="editor">Editor</option>
              </select>
            </div>
          </div>
          <div class="form-actions">
            <button type="submit" class="btn-submit" [disabled]="userForm.invalid || loading">
              {{ loading ? 'Creating...' : 'Create User' }}
            </button>
          </div>
          <div class="error-msg" *ngIf="error">{{error}}</div>
          <div class="success-msg" *ngIf="success">User created successfully!</div>
        </form>
      </div>

      <div class="users-grid">
        <div class="user-card" *ngFor="let user of users">
          <div class="card-header">
            <div class="avatar">{{user.fullName ? user.fullName[0] : 'U'}}</div>
            <div class="status active"></div>
          </div>
          <h3>{{user.fullName || 'Unnamed User'}}</h3>
          <p class="email">{{user.email}}</p>
          <div class="role-tag">{{user.role}}</div>
          
          <div class="actions">
            <button class="btn-icon">✏️</button>
            <button class="btn-icon delete">🗑️</button>
          </div>
        </div>
      </div>
      
      <div *ngIf="users.length === 0" class="empty-state">
        <p>No real users found. Try adding one!</p>
      </div>
    </div>
  `,
  styles: [`
    @import 'variables';
    @import 'mixins';

    .admin-container {
      display: flex;
      flex-direction: column;
      gap: $spacing-lg;
      padding: $spacing-lg;
    }

    .header {
      @include flex-between;
      margin-bottom: $spacing-md;
      
      .btn-primary {
        padding: $spacing-sm $spacing-lg;
        background: $primary;
        color: white;
        border-radius: $radius-md;
        cursor: pointer;
        border: none;
        font-weight: 500;
        transition: opacity 0.2s;
        &:hover { opacity: 0.9; }
      }
    }

    .form-card {
      @include glass;
      padding: $spacing-xl;
      border-radius: $radius-lg;
      margin-bottom: $spacing-xl;
      border: 1px solid rgba(255,255,255,0.1);

      h3 { margin-bottom: $spacing-lg; color: $accent; }

      .form-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
        gap: $spacing-md;
        margin-bottom: $spacing-lg;
      }

      .form-group {
        display: flex;
        flex-direction: column;
        gap: 6px;

        label { font-size: 12px; color: $text-secondary; }
        input, select {
          padding: 10px;
          background: rgba(0,0,0,0.2);
          border: 1px solid rgba(255,255,255,0.1);
          border-radius: $radius-md;
          color: white;
          width: 100%;
          &:focus { border-color: $accent; }
        }
      }

      .btn-submit {
        padding: 12px 24px;
        background: $accent;
        color: white;
        border-radius: $radius-md;
        cursor: pointer;
        border: none;
        font-weight: 600;
        &:disabled { opacity: 0.5; cursor: not-allowed; }
      }

      .error-msg { color: $error; margin-top: 10px; font-size: 14px; }
      .success-msg { color: $success; margin-top: 10px; font-size: 14px; }
    }

    .users-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
      gap: $spacing-lg;
    }

    .user-card {
      @include glass;
      @include card-hover;
      padding: $spacing-lg;
      border-radius: $radius-lg;
      display: flex;
      flex-direction: column;
      align-items: center;
      text-align: center;
      position: relative;

      .card-header {
        position: relative;
        margin-bottom: $spacing-md;
        
        .avatar {
          width: 60px;
          height: 60px;
          border-radius: 50%;
          background: rgba($primary, 0.1);
          color: $primary;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: $font-size-xl;
          font-weight: bold;
          border: 2px solid rgba($primary, 0.2);
        }

        .status {
          position: absolute;
          bottom: 2px;
          right: 2px;
          width: 12px;
          height: 12px;
          border-radius: 50%;
          background: $text-muted;
          border: 2px solid $bg-card;
          
          &.active { background: $success; }
        }
      }

      h3 { margin: 0; font-size: $font-size-lg; }
      .email { color: $text-secondary; font-size: $font-size-sm; margin-bottom: $spacing-md; }
      
      .role-tag {
        background: rgba(255,255,255,0.05);
        padding: 4px 12px;
        border-radius: 12px;
        font-size: 11px;
        text-transform: uppercase;
        letter-spacing: 1px;
        margin-bottom: $spacing-lg;
        color: $accent;
      }

      .actions {
        display: flex;
        gap: $spacing-sm;
        
        .btn-icon {
          width: 32px;
          height: 32px;
          border-radius: 50%;
          background: rgba(255,255,255,0.05);
          color: $text-secondary;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.2s;
          cursor: pointer;
          border: none;
          
          &:hover {
            background: white;
            color: black;
          }
          
          &.delete:hover {
            background: $error;
            color: white;
          }
        }
      }
    }

    .empty-state {
      text-align: center;
      padding: $spacing-xl;
      color: $text-secondary;
    }
  `]
})
export class AdminComponent implements OnInit {
  users: any[] = [];
  showForm = false;
  userForm: FormGroup;
  loading = false;
  error: string | null = null;
  success = false;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private http: HttpClient
  ) {
    this.userForm = this.fb.group({
      fullName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      role: ['user', Validators.required]
    });
  }

  ngOnInit() {
    this.loadUsers();
  }

  loadUsers() {
    // Since we are admins, we can see everyone
    const token = this.authService.getToken();
    if (!token) return;

    this.http.get<any[]>('http://localhost:8000/users/', {
      headers: { 'Authorization': `Bearer ${token}` }
    }).subscribe({
      next: (data) => {
        this.users = data.map(u => ({
          fullName: u.full_name,
          email: u.email,
          role: u.role,
          active: u.is_active
        }));
      },
      error: (err) => console.error('Failed to load users', err)
    });
  }

  addUser() {
    if (this.userForm.valid) {
      this.loading = true;
      this.error = null;
      this.success = false;

      this.authService.register(this.userForm.value).subscribe({
        next: () => {
          this.loading = false;
          this.success = true;
          this.userForm.reset({ role: 'user' });
          this.loadUsers();
          setTimeout(() => {
            this.success = false;
            this.showForm = false;
          }, 2000);
        },
        error: (err) => {
          this.loading = false;
          this.error = err.error?.detail || 'Failed to create user.';
        }
      });
    }
  }
}
