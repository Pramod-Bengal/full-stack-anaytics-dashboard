import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AnalyticsService, AnalyticsData } from '../../core/services/analytics.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="dashboard-container">
      <div class="stats-grid">
        <div class="stat-card">
          <div class="icon-area glass-accent">📊</div>
          <div class="info">
            <span class="label">Total Records</span>
            <span class="value">{{ totalRecords }}</span>
            <span class="trend positive">Live Data</span>
          </div>
        </div>
        <div class="stat-card">
          <div class="icon-area glass-primary">📂</div>
          <div class="info">
            <span class="label">Categories</span>
            <span class="value">{{ uniqueCategories }}</span>
            <span class="trend">SQL Storage</span>
          </div>
        </div>
        <div class="stat-card">
          <div class="icon-area glass-warning">⏱️</div>
          <div class="info">
            <span class="label">Avg Value</span>
            <span class="value">{{ avgValue | number:'1.0-0' }}</span>
            <span class="trend">Real-time</span>
          </div>
        </div>
      </div>

      <div class="charts-section">
        <div class="chart-card main-chart">
          <div class="chart-header">
            <h3>Recent Metrics Activity</h3>
            <button class="btn-seed" (click)="seedSampleData()">Seed Sample Data</button>
          </div>
          <div class="chart-placeholder">
            <div class="bars">
              <div *ngFor="let item of recentData" 
                   class="bar-wrapper" 
                   [title]="item.metric_name + ': ' + item.value">
                <div class="bar" [style.height.%]="(item.value / maxVal) * 100"></div>
                <span class="bar-label">{{ item.metric_name | slice:0:8 }}</span>
              </div>
            </div>
            <div *ngIf="recentData.length === 0" class="no-data-overlay">
              No data stored yet. Click "Seed Data" or use the "Data Storage" page.
            </div>
          </div>
        </div>
        <div class="chart-card pie-chart">
          <h3>Storage Status</h3>
          <div class="status-circle">
            <div class="percentage">{{ totalRecords > 0 ? 'ACTIVE' : 'READY' }}</div>
            <svg viewBox="0 0 36 36" class="circular-chart">
              <path class="circle-bg" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
              <path class="circle" [attr.stroke-dasharray]="(totalRecords > 0 ? 100 : 0) + ', 100'" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
            </svg>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    @import 'variables';
    @import 'mixins';

    .dashboard-container {
      display: flex;
      flex-direction: column;
      gap: $spacing-xl;
    }

    .stats-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
      gap: $spacing-lg;
    }

    .stat-card {
      @include glass;
      padding: $spacing-lg;
      border-radius: $radius-lg;
      display: flex;
      align-items: center;
      gap: $spacing-lg;
      @include card-hover;

      .icon-area {
        width: 60px;
        height: 60px;
        border-radius: $radius-md;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: $font-size-xl;
        background: rgba(255,255,255,0.05);

        &.glass-accent { background: rgba($success, 0.1); color: $success; }
        &.glass-primary { background: rgba($primary, 0.1); color: $primary; }
        &.glass-warning { background: rgba($warning, 0.1); color: $warning; }
      }

      .info {
        display: flex;
        flex-direction: column;
        
        .label {
          color: $text-secondary;
          font-size: $font-size-sm;
          margin-bottom: 4px;
        }
        .value {
          font-size: $font-size-xl;
          font-weight: 700;
          color: $text-main;
        }
        .trend {
          font-size: $font-size-sm;
          font-weight: 500;
          margin-top: 4px;
          color: $text-muted;
          
          &.positive { color: $success; }
        }
      }
    }

    .charts-section {
      display: grid;
      grid-template-columns: 2fr 1fr;
      gap: $spacing-lg;

      @include tablet {
        grid-template-columns: 1fr;
      }
    }

    .chart-card {
      @include glass;
      padding: $spacing-xl;
      border-radius: $radius-lg;
      min-height: 400px;
      display: flex;
      flex-direction: column;
    }

    .chart-header {
      @include flex-between;
      margin-bottom: $spacing-lg;

      .btn-seed {
        padding: 6px 12px;
        background: rgba($accent, 0.1);
        border: 1px solid $accent;
        color: $accent;
        border-radius: $radius-sm;
        cursor: pointer;
        font-size: 12px;
        &:hover { background: $accent; color: white; }
      }
    }

    .chart-placeholder {
      flex: 1;
      position: relative;
      display: flex;
      align-items: flex-end;
      padding-bottom: 30px;
      
      .bars {
        width: 100%;
        height: 250px;
        display: flex;
        align-items: flex-end;
        justify-content: space-around;
        
        .bar-wrapper {
          flex: 1;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 8px;
          max-width: 60px;
          
          .bar {
            width: 80%;
            background: linear-gradient(to top, $primary, $secondary);
            border-radius: $radius-sm $radius-sm 2px 2px;
            opacity: 0.8;
            transition: height 0.6s cubic-bezier(0.175, 0.885, 0.32, 1.275);
            &:hover { opacity: 1; filter: brightness(1.2); }
          }
          
          .bar-label {
            font-size: 10px;
            color: $text-muted;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
            width: 100%;
            text-align: center;
          }
        }
      }
    }

    .no-data-overlay {
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      color: $text-muted;
      text-align: center;
      font-size: 14px;
    }

    .status-circle {
      position: relative;
      width: 200px;
      height: 200px;
      margin: auto;
      
      .percentage {
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        font-size: 20px;
        font-weight: 800;
        color: $success;
      }
    }

    .circular-chart {
      display: block;
      margin: 10px auto;
      max-width: 80%;
      max-height: 250px;
    }

    .circle-bg {
      fill: none;
      stroke: rgba(255,255,255,0.05);
      stroke-width: 3;
    }

    .circle {
      fill: none;
      stroke-width: 3;
      stroke-linecap: round;
      stroke: $success;
      transition: stroke-dasharray 1s ease;
    }
  `]
})
export class DashboardComponent implements OnInit {
  totalRecords = 0;
  uniqueCategories = 0;
  avgValue = 0;
  recentData: AnalyticsData[] = [];
  maxVal = 100;

  constructor(private analyticsService: AnalyticsService) { }

  ngOnInit() {
    this.loadDashboardData();
  }

  loadDashboardData() {
    this.analyticsService.getAllAnalyticsData(0, 10).subscribe({
      next: (data) => {
        this.recentData = data;
        this.totalRecords = data.length > 0 ? Math.max(data.length, data[0].id || 0) : 0; // Using ID as proxy for total if skip/limit not set

        // Get all to calculate real stats (in production you'd have a summary API)
        this.analyticsService.getAllAnalyticsData(0, 500).subscribe(all => {
          this.totalRecords = all.length;
          this.uniqueCategories = new Set(all.map(d => d.category)).size;
          this.avgValue = all.length > 0 ? all.reduce((acc, curr) => acc + curr.value, 0) / all.length : 0;
          this.maxVal = Math.max(...all.map(d => d.value), 100);
        });
      },
      error: (err) => console.error('Dashboard load failed', err)
    });
  }

  seedSampleData() {
    const samples: AnalyticsData[] = [
      { metric_name: 'CPU Usage', value: 45, category: 'System' },
      { metric_name: 'Memory', value: 72, category: 'System' },
      { metric_name: 'Requests', value: 850, category: 'App' },
      { metric_name: 'DB Latency', value: 12, category: 'DB' },
      { metric_name: 'Cache Hit', value: 94, category: 'Cache' }
    ];

    this.analyticsService.createBulkAnalyticsData(samples).subscribe({
      next: () => this.loadDashboardData(),
      error: (err) => console.error('Seeding failed', err)
    });
  }
}
