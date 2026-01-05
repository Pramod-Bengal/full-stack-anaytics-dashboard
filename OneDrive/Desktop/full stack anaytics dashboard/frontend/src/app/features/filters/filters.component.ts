import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'app-filters',
    standalone: true,
    imports: [CommonModule],
    template: `
    <div class="filters-container">
      <h2>Filters & Insights</h2>
      
      <div class="filter-panel">
        <div class="controls">
          <div class="control-group">
            <label>Date Range</label>
            <select>
              <option>Last 7 Days</option>
              <option>Last 30 Days</option>
              <option>Year to Date</option>
            </select>
          </div>
          <div class="control-group">
            <label>Region</label>
            <select>
              <option>All Regions</option>
              <option>North America</option>
              <option>Europe</option>
              <option>Asia</option>
            </select>
          </div>
          <div class="control-group">
            <label>Device Type</label>
            <div class="checkboxes">
              <label><input type="checkbox" checked> Desktop</label>
              <label><input type="checkbox" checked> Mobile</label>
            </div>
          </div>
        </div>
        <button class="btn-primary">Apply Filters</button>
      </div>

      <div class="insights-grid">
        <div class="insight-card highlight">
          <h3>AI Insight</h3>
          <p>Traffic from <strong>Mobile</strong> devices has increased by <strong>15%</strong> this weekend compared to last.</p>
        </div>
        <div class="insight-card">
          <h3>Conversion Opportunity</h3>
          <p>Users from <strong>Europe</strong> are dropping off at the checkout page. Consider optimizing the payment gateway.</p>
        </div>
        <div class="insight-card alert">
          <h3>Performance Alert</h3>
          <p>Server response time spiked to <strong>400ms</strong> yesterday at 2:00 PM UTC.</p>
        </div>
      </div>
    </div>
  `,
    styles: [`
    @import 'variables';
    @import 'mixins';

    .filters-container {
      display: flex;
      flex-direction: column;
      gap: $spacing-lg;
    }

    .filter-panel {
      @include glass;
      padding: $spacing-lg;
      border-radius: $radius-lg;
      
      .controls {
        display: grid;
        grid-template-columns: repeat(3, 1fr);
        gap: $spacing-lg;
        margin-bottom: $spacing-lg;
        
        @include mobile { grid-template-columns: 1fr; }
      }

      .btn-primary {
        background: $primary;
        color: white;
        padding: $spacing-sm $spacing-xl;
        border-radius: $radius-md;
        font-weight: 600;
        width: 100%;
      }
    }

    .control-group {
      label {
        display: block;
        color: $text-secondary;
        font-size: $font-size-sm;
        margin-bottom: $spacing-sm;
      }

      select {
        width: 100%;
        padding: $spacing-md;
        background: rgba(0,0,0,0.2);
        border: 1px solid rgba(255,255,255,0.1);
        border-radius: $radius-md;
        color: white;
        cursor: pointer;
        
        &:focus { border-color: $primary; }
      }

      .checkboxes {
        display: flex;
        gap: $spacing-md;
        
        label {
          color: white;
          display: flex;
          align-items: center;
          gap: 8px;
          cursor: pointer;
        }
      }
    }

    .insights-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
      gap: $spacing-lg;
    }

    .insight-card {
      @include glass;
      padding: $spacing-lg;
      border-radius: $radius-lg;
      border-left: 4px solid $text-muted;

      h3 { font-size: $font-size-lg; margin-bottom: $spacing-md; }
      p { line-height: 1.6; color: $text-secondary; strong { color: white; } }

      &.highlight { border-left-color: $secondary; h3 { color: $secondary; } }
      &.alert { border-left-color: $error; h3 { color: $error; } }
    }
  `]
})
export class FiltersComponent { }
