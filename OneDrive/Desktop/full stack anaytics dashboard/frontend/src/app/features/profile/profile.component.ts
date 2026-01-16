import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService, User } from '../../core/services/auth.service';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div class="profile-container">
      <div class="profile-header">
        <div class="avatar-large">{{ (currentUser?.fullName || 'U')[0] }}</div>
        <div class="user-info" *ngIf="currentUser">
          <h2>{{ currentUser.fullName }}</h2>
          <p>{{ currentUser.email }}</p>
          <span class="role-badge">{{ currentUser.role || 'User' }}</span>
        </div>
        <div class="user-info" *ngIf="!currentUser && !loading">
          <h2>Loading Profile...</h2>
        </div>
      </div>

      <div class="settings-card">
        <h3>Account Settings</h3>
        
        <div *ngIf="success" class="alert-success">Profile updated successfully!</div>
        <div *ngIf="error" class="alert-error">{{error}}</div>
        
        <form [formGroup]="profileForm" (ngSubmit)="saveChanges()">
          <div class="form-row">
            <div class="form-group">
              <label>Full Name</label>
              <input type="text" formControlName="fullName" placeholder="Your full name">
            </div>
            <div class="form-group">
              <label>Email Address</label>
              <input type="email" formControlName="email" placeholder="email@example.com">
            </div>
          </div>
          
          <div class="form-group">
            <label>Bio</label>
            <textarea formControlName="bio" rows="4" placeholder="Tell us about yourself..."></textarea>
          </div>

          <div class="actions">
            <button type="submit" class="btn-primary" [disabled]="loading || profileForm.invalid">
              {{ loading ? 'Saving...' : 'Save Changes' }}
            </button>
          </div>
        </form>
      </div>
    </div>
  `,
  styles: [`
    @import 'variables';
    @import 'mixins';

    .alert-success { background: rgba($success, 0.1); color: $success; padding: 12px; border-radius: 8px; margin-bottom: 16px; border: 1px solid $success; font-size: 14px; }
    .alert-error { background: rgba($error, 0.1); color: $error; padding: 12px; border-radius: 8px; margin-bottom: 16px; border: 1px solid $error; font-size: 14px; }

    .profile-container {
      max-width: 800px;
      margin: 0 auto;
      display: flex;
      flex-direction: column;
      gap: $spacing-xl;
    }

    .profile-header {
      display: flex;
      align-items: center;
      gap: $spacing-xl;
      
      .avatar-large {
        width: 100px;
        height: 100px;
        border-radius: 50%;
        background: linear-gradient(135deg, $primary, $secondary);
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 40px;
        font-weight: bold;
        color: white;
        box-shadow: 0 10px 30px rgba($primary, 0.4);
      }

      .user-info {
        h2 { margin-bottom: 4px; color: white; }
        p { color: $text-secondary; margin-bottom: $spacing-sm; }
        .role-badge {
          background: rgba($primary, 0.2);
          color: $primary;
          padding: 4px 12px;
          border-radius: 20px;
          font-size: $font-size-sm;
          font-weight: 600;
          text-transform: capitalize;
        }
      }
    }

    .settings-card {
      @include glass;
      padding: $spacing-xl;
      border-radius: $radius-lg;

      h3 { margin-bottom: $spacing-lg; border-bottom: 1px solid rgba(255,255,255,0.1); padding-bottom: $spacing-md; color: $accent; }
    }

    .form-row {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: $spacing-lg;
      
      @include mobile { grid-template-columns: 1fr; }
    }

    .form-group {
      margin-bottom: $spacing-lg;
      
      label {
        display: block;
        margin-bottom: $spacing-sm;
        color: $text-secondary;
        font-size: 13px;
      }

      input, textarea {
        width: 100%;
        padding: $spacing-md;
        background: rgba(0,0,0,0.2);
        border: 1px solid rgba(255,255,255,0.1);
        border-radius: $radius-md;
        color: white;
        font-size: 14px;
        
        &:focus { border-color: $primary; outline: none; box-shadow: 0 0 0 2px rgba($primary, 0.2); }
      }
    }

    .actions {
      display: flex;
      justify-content: flex-end;
    }

    .btn-primary {
      padding: $spacing-md $spacing-xl;
      background: $primary;
      color: white;
      border: none;
      border-radius: $radius-md;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.2s;
      
      &:hover:not(:disabled) { background: lighten($primary, 5%); transform: translateY(-1px); }
      &:disabled { opacity: 0.5; cursor: not-allowed; }
    }
  `]
})
export class ProfileComponent implements OnInit {
  profileForm: FormGroup;
  loading = false;
  success = false;
  error: string | null = null;
  currentUser: User | null = null;

  constructor(private fb: FormBuilder, private authService: AuthService) {
    this.profileForm = this.fb.group({
      fullName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      bio: ['']
    });
  }

  ngOnInit() {
    this.loadProfile();
  }

  loadProfile() {
    this.loading = true;
    this.authService.getProfile().subscribe({
      next: (user) => {
        this.currentUser = user;
        this.profileForm.patchValue({
          fullName: user.fullName,
          email: user.email,
          bio: user.bio
        });
        this.loading = false;
      },
      error: (err) => {
        this.error = "Token expired or server error. Please login again.";
        this.loading = false;
        console.error(err);
      }
    });
  }

  saveChanges() {
    if (this.profileForm.valid) {
      this.loading = true;
      this.error = null;
      this.success = false;

      this.authService.updateProfile(this.profileForm.value).subscribe({
        next: (updatedUser) => {
          this.currentUser = updatedUser;
          this.success = true;
          this.loading = false;
          setTimeout(() => this.success = false, 3000);
        },
        error: (err) => {
          this.error = err.error?.detail || "Failed to update profile.";
          this.loading = false;
        }
      });
    }
  }
}
