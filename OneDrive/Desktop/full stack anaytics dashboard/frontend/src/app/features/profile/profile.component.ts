import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div class="profile-container">
      <div class="profile-header">
        <div class="avatar-large">U</div>
        <div class="user-info">
          <h2>User Name</h2>
          <p>user&#64;example.com</p>
          <span class="role-badge">Administrator</span>
        </div>
      </div>

      <div class="settings-card">
        <h3>Account Settings</h3>
        <form [formGroup]="profileForm">
          <div class="form-row">
            <div class="form-group">
              <label>Full Name</label>
              <input type="text" formControlName="fullName">
            </div>
            <div class="form-group">
              <label>Email Address</label>
              <input type="email" formControlName="email">
            </div>
          </div>
          
          <div class="form-group">
            <label>Bio</label>
            <textarea formControlName="bio" rows="4"></textarea>
          </div>

          <div class="actions">
            <button class="btn-primary">Save Changes</button>
          </div>
        </form>
      </div>
    </div>
  `,
  styles: [`
    @import 'variables';
    @import 'mixins';

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
        h2 { margin-bottom: 4px; }
        p { color: $text-secondary; margin-bottom: $spacing-sm; }
        .role-badge {
          background: rgba($primary, 0.2);
          color: $primary;
          padding: 4px 12px;
          border-radius: 20px;
          font-size: $font-size-sm;
          font-weight: 600;
        }
      }
    }

    .settings-card {
      @include glass;
      padding: $spacing-xl;
      border-radius: $radius-lg;

      h3 { margin-bottom: $spacing-lg; border-bottom: 1px solid rgba(255,255,255,0.1); padding-bottom: $spacing-md; }
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
      }

      input, textarea {
        width: 100%;
        padding: $spacing-md;
        background: rgba(0,0,0,0.2);
        border: 1px solid rgba(255,255,255,0.1);
        border-radius: $radius-md;
        color: white;
        
        &:focus { border-color: $primary; }
      }
    }

    .btn-primary {
      padding: $spacing-md $spacing-xl;
      background: $primary;
      color: white;
      border-radius: $radius-md;
      font-weight: 600;
      
      &:hover { background: lighten($primary, 5%); }
    }
  `]
})
export class ProfileComponent {
  profileForm: FormGroup;

  constructor(private fb: FormBuilder) {
    this.profileForm = this.fb.group({
      fullName: ['User Name'],
      email: ['user@example.com'],
      bio: ['Full stack developer located in San Francisco.']
    });
  }
}
