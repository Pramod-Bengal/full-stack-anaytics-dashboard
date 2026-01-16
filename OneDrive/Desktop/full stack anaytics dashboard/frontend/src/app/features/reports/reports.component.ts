import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AnalyticsService, AnalyticsData } from '../../core/services/analytics.service';

@Component({
  selector: 'app-reports',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  template: `
    <div class="reports-container">
      <div class="header-actions">
        <h2>Detailed Reports & Data Entry</h2>
        <div class="btn-group">
          <button class="btn-primary" (click)="showForm = !showForm">
            {{ showForm ? 'Close Form' : '+ Add New Entry' }}
          </button>
          <button class="btn-secondary" (click)="downloadCSV()" [disabled]="loading">Download CSV</button>
        </div>
      </div>

      <!-- Quick Add Form -->
      <div class="form-card" *ngIf="showForm">
        <h3>Add New Metric</h3>
        <form [formGroup]="dataForm" (ngSubmit)="saveData()">
          <div class="form-grid">
            <div class="form-group">
              <label>Metric Name</label>
              <input type="text" formControlName="metricName" placeholder="e.g. CPU Usage">
            </div>
            <div class="form-group">
              <label>Value</label>
              <input type="number" formControlName="value" placeholder="e.g. 85">
            </div>
            <div class="form-group">
              <label>Category</label>
              <input type="text" formControlName="category" placeholder="e.g. System">
            </div>
          </div>
          <div class="form-actions">
            <button type="submit" class="btn-submit" [disabled]="dataForm.invalid || loading">
              {{ loading ? 'Saving...' : 'Save Record' }}
            </button>
          </div>
          <div class="success-msg" *ngIf="success">Metric added successfully!</div>
          <div class="error-msg" *ngIf="formError">{{formError}}</div>
        </form>
      </div>

      <div *ngIf="loading && !realData.length" class="loading-state">Loading real-time data...</div>
      <div *ngIf="error" class="error-state">{{error}}</div>

      <div class="table-card" *ngIf="!error">
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Metric</th>
              <th>Category</th>
              <th>Value</th>
              <th>Date</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr *ngFor="let item of realData">
              <td>#{{item.id}}</td>
              <td>{{item.metric_name}}</td>
              <td>{{item.category}}</td>
              <td><span class="value-tag">{{item.value}}</span></td>
              <td>{{item.recorded_at | date:'mediumDate'}}</td>
              <td>
                <button class="btn-icon delete" (click)="deleteEntry(item.id!)" title="Delete Entry">🗑️</button>
              </td>
            </tr>
          </tbody>
        </table>
        
        <div *ngIf="realData.length === 0 && !loading" class="empty-msg">
          No data found in the SQL database. Use the button above to add some!
        </div>
      </div>
    </div>
  `,
  styles: [`
    @import 'variables';
    @import 'mixins';

    .reports-container {
      display: flex;
      flex-direction: column;
      gap: $spacing-lg;
    }

    .header-actions {
      @include flex-between;
      margin-bottom: $spacing-md;
      
      .btn-group {
        display: flex;
        gap: $spacing-md;
      }
    }

    .form-card {
      @include glass;
      padding: $spacing-xl;
      border-radius: $radius-lg;
      border: 1px solid rgba($primary, 0.2);
      margin-bottom: $spacing-lg;

      h3 { margin-bottom: $spacing-lg; color: $accent; }
      
      .form-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
        gap: $spacing-lg;
        margin-bottom: $spacing-lg;
      }

      .form-group {
        display: flex;
        flex-direction: column;
        gap: 6px;
        label { font-size: 13px; color: $text-secondary; }
        input {
          padding: 10px;
          background: rgba(0,0,0,0.2);
          border: 1px solid rgba(255,255,255,0.1);
          border-radius: $radius-md;
          color: white;
          &:focus { border-color: $accent; outline: none; }
        }
      }

      .btn-submit {
        padding: 10px 24px;
        background: $accent;
        color: white;
        border: none;
        border-radius: $radius-md;
        font-weight: 600;
        cursor: pointer;
        &:disabled { opacity: 0.5; cursor: not-allowed; }
      }

      .success-msg { color: $success; margin-top: $spacing-md; font-size: 14px; }
      .error-msg { color: $error; margin-top: $spacing-md; font-size: 14px; }
    }

    .table-card {
      @include glass;
      border-radius: $radius-lg;
      overflow-x: auto;
      padding: $spacing-md;

      table {
        width: 100%;
        border-collapse: collapse;
        min-width: 600px;
        
        th, td {
          padding: $spacing-md;
          text-align: left;
          border-bottom: 1px solid rgba(255,255,255,0.05);
        }

        th { color: $text-secondary; font-weight: 500; font-size: $font-size-sm; text-transform: uppercase; }
        
        .value-tag {
          background: rgba($primary, 0.1);
          color: $primary;
          padding: 2px 8px;
          border-radius: 4px;
          font-weight: 600;
        }
      }
    }

    .btn-icon {
      background: none;
      border: none;
      cursor: pointer;
      font-size: 16px;
      padding: 4px;
      border-radius: 4px;
      transition: background 0.2s;
      &:hover { background: rgba(255,255,255,0.1); }
      &.delete:hover { background: rgba($error, 0.1); }
    }

    .btn-primary {
      padding: 8px 16px;
      background: $primary;
      color: white;
      border: none;
      border-radius: $radius-md;
      cursor: pointer;
      font-weight: 500;
    }

    .btn-secondary {
      padding: 8px 16px;
      background: rgba(255,255,255,0.1);
      color: white;
      border: 1px solid rgba(255,255,255,0.1);
      border-radius: $radius-md;
      cursor: pointer;
    }

    .loading-state, .error-state, .empty-msg {
      padding: $spacing-xl;
      text-align: center;
      color: $text-secondary;
      @include glass;
      border-radius: $radius-lg;
    }
  `]
})
export class ReportsComponent implements OnInit {
  realData: AnalyticsData[] = [];
  loading = true;
  error: string | null = null;
  formError: string | null = null;
  success = false;
  showForm = false;
  dataForm: FormGroup;

  constructor(
    private analyticsService: AnalyticsService,
    private fb: FormBuilder
  ) {
    this.dataForm = this.fb.group({
      metricName: ['', Validators.required],
      value: [0, [Validators.required, Validators.min(0)]],
      category: ['', Validators.required]
    });
  }

  ngOnInit() {
    this.refreshData();
  }

  refreshData() {
    this.loading = true;
    this.analyticsService.getAllAnalyticsData(0, 100).subscribe({
      next: (data) => {
        this.realData = data.sort((a, b) => (b.id || 0) - (a.id || 0));
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Failed to connect to backend SQL database.';
        this.loading = false;
      }
    });
  }

  saveData() {
    if (this.dataForm.valid) {
      this.loading = true;
      this.formError = null;
      const { metricName, value, category } = this.dataForm.value;

      this.analyticsService.createAnalyticsData(metricName, value, category).subscribe({
        next: () => {
          this.success = true;
          this.dataForm.reset({ value: 0 });
          this.refreshData();
          setTimeout(() => this.success = false, 3000);
        },
        error: (err) => {
          this.formError = 'Failed to save data. Please try again.';
          this.loading = false;
        }
      });
    }
  }

  deleteEntry(id: number) {
    if (confirm('Are you sure you want to delete this metric?')) {
      this.analyticsService.deleteAnalyticsData(id).subscribe({
        next: () => this.refreshData(),
        error: () => alert('Failed to delete entry.')
      });
    }
  }

  downloadCSV() {
    if (!this.realData.length) return;
    const headers = ['ID', 'Metric', 'Category', 'Value', 'Date'];
    const rows = this.realData.map(d => `${d.id},"${d.metric_name}","${d.category}",${d.value},${d.recorded_at}`);
    const csvContent = [headers.join(','), ...rows].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'analytics_report.csv';
    a.click();
  }
}
