import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AnalyticsService, AnalyticsData } from '../../core/services/analytics.service';

@Component({
  selector: 'app-reports',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="reports-container">
      <div class="header-actions">
        <h2>Detailed Reports</h2>
        <button class="btn-secondary" (click)="downloadCSV()" [disabled]="loading">Download CSV</button>
      </div>

      <div *ngIf="loading" class="loading-state">Loading real-time data...</div>
      <div *ngIf="error" class="error-state">{{error}}</div>

      <div class="table-card" *ngIf="!loading && !error">
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Metric</th>
              <th>Category</th>
              <th>Value</th>
              <th>Date</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            <tr *ngFor="let item of realData">
              <td>#{{item.id}}</td>
              <td>{{item.metric_name}}</td>
              <td>{{item.category}}</td>
              <td>{{item.value}}</td>
              <td>{{item.recorded_at | date:'mediumDate'}}</td>
              <td>
                <span class="status-badge active">Stored</span>
              </td>
            </tr>
          </tbody>
        </table>
        
        <div *ngIf="realData.length === 0" class="empty-msg">
          No data found in the SQL database.
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

    .loading-state, .error-state, .empty-msg {
      padding: $spacing-xl;
      text-align: center;
      color: $text-secondary;
      @include glass;
      border-radius: $radius-lg;
    }

    .error-state { color: $error; }

    .header-actions {
      @include flex-between;
      
      .btn-secondary {
        padding: $spacing-sm $spacing-md;
        background: rgba(255,255,255,0.1);
        color: $text-main;
        border: 1px solid rgba(255,255,255,0.2);
        border-radius: $radius-md;
        cursor: pointer;
        transition: background 0.2s;
        
        &:hover {
          background: rgba(255,255,255,0.2);
        }
        &:disabled { opacity: 0.5; cursor: not-allowed; }
      }
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

        th {
          color: $text-secondary;
          font-weight: 500;
          font-size: $font-size-sm;
          text-transform: uppercase;
        }

        tr:last-child td {
          border-bottom: none;
        }

        tr:hover td {
          background: rgba(255,255,255,0.02);
        }
      }
    }

    .status-badge {
      padding: 4px 8px;
      border-radius: 12px;
      font-size: 11px;
      font-weight: 600;
      text-transform: uppercase;

      &.active { background: rgba($success, 0.2); color: $success; }
      &.pending { background: rgba($warning, 0.2); color: $warning; }
      &.archived { background: rgba($text-muted, 0.2); color: $text-muted; }
    }
  `]
})
export class ReportsComponent implements OnInit {
  realData: AnalyticsData[] = [];
  loading = true;
  error: string | null = null;

  constructor(private analyticsService: AnalyticsService) { }

  ngOnInit() {
    this.refreshData();
  }

  refreshData() {
    this.loading = true;
    this.analyticsService.getAllAnalyticsData().subscribe({
      next: (data) => {
        this.realData = data;
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Failed to connect to backend SQL database.';
        this.loading = false;
        console.error(err);
      }
    });
  }

  downloadCSV() {
    if (!this.realData || !this.realData.length) return;

    const headers = ['ID', 'Metric Name', 'Category', 'Value', 'Recorded At'];
    const csvRows = [headers.join(',')];

    for (const item of this.realData) {
      const row = [
        item.id,
        `"${item.metric_name}"`,
        `"${item.category}"`,
        item.value,
        item.recorded_at
      ];
      csvRows.push(row.join(','));
    }

    const csvString = csvRows.join('\n');
    const blob = new Blob([csvString], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');

    if (link.download !== undefined) {
      const url = URL.createObjectURL(blob);
      link.setAttribute('href', url);
      link.setAttribute('download', 'analytics_live_report.csv');
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  }
}
