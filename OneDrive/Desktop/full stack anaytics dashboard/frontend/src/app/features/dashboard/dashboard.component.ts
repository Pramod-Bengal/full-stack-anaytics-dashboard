import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AnalyticsService, AnalyticsData } from '../../core/services/analytics.service';
import { RouterModule } from '@angular/router';

@Component({
    selector: 'app-dashboard',
    standalone: true,
    imports: [CommonModule, RouterModule],
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
            <span class="trend">SQL Compute</span>
          </div>
        </div>
      </div>

      <div class="charts-section">
        <div class="chart-card main-chart">
          <div class="chart-header">
            <h3>Recent Metrics Activity</h3>
            <div class="actions">
              <button class="btn-seed" (click)="seedSampleData()">Seed Data</button>
              <a routerLink="/reports" class="btn-add">Add Metric</a>
            </div>
          </div>
          
          <div class="chart-container">
            <div *ngIf="recentData.length > 0" class="bars">
              <div *ngFor="let item of recentData" 
                   class="bar-wrapper" 
                   [title]="item.metric_name + ': ' + item.value">
                <div class="bar-outer">
                   <div class="bar-inner" [style.height.%]="(item.value / maxVal) * 100">
                     <span class="value-popup">{{ item.value }}</span>
                   </div>
                </div>
                <span class="bar-label">{{ item.metric_name | slice:0:10 }}</span>
              </div>
            </div>
            
            <div *ngIf="recentData.length === 0" class="empty-chart">
              <div class="empty-icon">📈</div>
              <p>No analytics data saved in your database yet.</p>
              <button class="btn-primary" (click)="seedSampleData()">Seed Sample Data</button>
            </div>
          </div>
        </div>

        <div class="chart-card stats-breakdown">
          <h3>Category Insights</h3>
          <div class="category-list">
             <div *ngFor="let cat of categoryStats" class="cat-item">
               <div class="cat-info">
                 <span class="cat-name">{{ cat.name }}</span>
                 <span class="cat-count">{{ cat.count }} records</span>
               </div>
               <div class="cat-bar-bg">
                 <div class="cat-bar-fill" [style.width.%]="(cat.count / totalRecords) * 100"></div>
               </div>
             </div>
             <div *ngIf="categoryStats.length === 0" class="empty-msg">
               Sync your data to see category insights.
             </div>
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
        .label { color: $text-secondary; font-size: $font-size-sm; margin-bottom: 4px; }
        .value { font-size: $font-size-xl; font-weight: 700; color: $text-main; }
        .trend { font-size: $font-size-sm; font-weight: 500; margin-top: 4px; color: $text-muted; &.positive { color: $success; } }
      }
    }

    .charts-section {
      display: grid;
      grid-template-columns: 2.5fr 1fr;
      gap: $spacing-lg;
      @include tablet { grid-template-columns: 1fr; }
    }

    .chart-card {
      @include glass;
      padding: $spacing-xl;
      border-radius: $radius-lg;
      min-height: 450px;
      display: flex;
      flex-direction: column;

      h3 { margin-bottom: $spacing-lg; color: $text-main; font-size: $font-size-lg; }
    }

    .chart-header {
      @include flex-between;
      margin-bottom: $spacing-xl;
      .actions { display: flex; gap: $spacing-sm; }
      
      .btn-seed { padding: 6px 12px; background: rgba($warning, 0.1); border: 1px solid $warning; color: $warning; border-radius: $radius-sm; cursor: pointer; font-size: 12px; &:hover { background: $warning; color: white; } }
      .btn-add { padding: 6px 12px; background: rgba($primary, 0.1); border: 1px solid $primary; color: $primary; border-radius: $radius-sm; cursor: pointer; font-size: 12px; text-decoration: none; &:hover { background: $primary; color: white; } }
    }

    .chart-container {
      flex: 1;
      display: flex;
      flex-direction: column;
      justify-content: flex-end;
      position: relative;
    }

    .bars {
      display: flex;
      align-items: flex-end;
      justify-content: space-around;
      height: 300px;
      padding-bottom: 20px;
      border-bottom: 1px solid rgba(255,255,255,0.05);

      .bar-wrapper {
        flex: 1;
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 12px;
        max-width: 60px;
        
        .bar-outer {
          width: 24px;
          height: 250px;
          background: rgba(255,255,255,0.03);
          border-radius: 12px;
          display: flex;
          align-items: flex-end;
          position: relative;
          
          .bar-inner {
            width: 100%;
            background: linear-gradient(180deg, $secondary 0%, $primary 100%);
            border-radius: 12px;
            transition: height 1s cubic-bezier(0.4, 0, 0.2, 1);
            position: relative;
            
            &:hover {
              filter: brightness(1.2);
              .value-popup { opacity: 1; transform: translateX(-50%) translateY(-10px); }
            }

            .value-popup {
              position: absolute;
              top: -30px;
              left: 50%;
              transform: translateX(-50%);
              background: white;
              color: black;
              padding: 2px 6px;
              border-radius: 4px;
              font-size: 10px;
              font-weight: 800;
              opacity: 0;
              transition: all 0.2s;
              pointer-events: none;
              white-space: nowrap;
            }
          }
        }
        
        .bar-label { font-size: 10px; color: $text-muted; text-align: center; width: 100%; }
      }
    }

    .category-list {
      display: flex;
      flex-direction: column;
      gap: $spacing-md;
      
      .cat-item {
        .cat-info { @include flex-between; margin-bottom: 4px; .cat-name { font-size: 14px; color: $text-secondary; } .cat-count { font-size: 12px; color: $text-muted; } }
        .cat-bar-bg { height: 6px; background: rgba(255,255,255,0.05); border-radius: 3px; overflow: hidden; .cat-bar-fill { height: 100%; background: $accent; border-radius: 3px; transition: width 0.6s ease; } }
      }
    }

    .empty-chart {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      height: 300px;
      text-align: center;
      
      .empty-icon { font-size: 48px; margin-bottom: $spacing-md; opacity: 0.3; }
      p { color: $text-muted; margin-bottom: $spacing-lg; }
      .btn-primary { padding: 10px 20px; background: $primary; color: white; border: none; border-radius: $radius-md; cursor: pointer; }
    }
  `]
})
export class DashboardComponent implements OnInit {
    totalRecords = 0;
    uniqueCategories = 0;
    avgValue = 0;
    recentData: AnalyticsData[] = [];
    categoryStats: { name: string, count: number }[] = [];
    maxVal = 100;

    constructor(private analyticsService: AnalyticsService) { }

    ngOnInit() {
        this.loadDashboardData();
    }

    loadDashboardData() {
        this.analyticsService.getAllAnalyticsData(0, 500).subscribe({
            next: (all) => {
                this.totalRecords = all.length;
                this.recentData = all.sort((a, b) => (b.id || 0) - (a.id || 0)).slice(0, 10).reverse();

                if (all.length > 0) {
                    this.uniqueCategories = new Set(all.map(d => d.category)).size;
                    this.avgValue = all.reduce((acc, curr) => acc + curr.value, 0) / all.length;
                    this.maxVal = Math.max(...all.map(d => d.value), 100);

                    // Calculate category stats
                    const counts: { [key: string]: number } = {};
                    all.forEach(d => counts[d.category] = (counts[d.category] || 0) + 1);
                    this.categoryStats = Object.keys(counts).map(name => ({ name, count: counts[name] }))
                        .sort((a, b) => b.count - a.count)
                        .slice(0, 5);
                } else {
                    this.uniqueCategories = 0;
                    this.avgValue = 0;
                    this.maxVal = 100;
                    this.categoryStats = [];
                }
            },
            error: (err) => console.error('Dashboard load failed', err)
        });
    }

    seedSampleData() {
        const samples: AnalyticsData[] = [
            { metric_name: 'CPU Load', value: 42, category: 'System' },
            { metric_name: 'RAM Usage', value: 68, category: 'System' },
            { metric_name: 'Disk I/O', value: 25, category: 'System' },
            { metric_name: 'Daily Active Users', value: 850, category: 'User' },
            { metric_name: 'New Signups', value: 45, category: 'User' },
            { metric_name: 'API Latency', value: 120, category: 'Performance' },
            { metric_name: 'Error Rate', value: 2, category: 'Performance' }
        ];

        this.analyticsService.createBulkAnalyticsData(samples).subscribe({
            next: () => {
                console.log('Seed successful');
                this.loadDashboardData();
            },
            error: (err) => console.error('Seeding failed', err)
        });
    }
}
