import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AnalyticsService, AnalyticsData } from '../../core/services/analytics.service';

@Component({
    selector: 'app-data-storage-example',
    standalone: true,
    imports: [CommonModule, FormsModule],
    templateUrl: './data-storage-example.component.html',
    styleUrls: ['./data-storage-example.component.scss']
})
export class DataStorageExampleComponent implements OnInit {
    // ============================================
    // PROPERTIES
    // ============================================

    // Form data for creating new analytics
    newMetricName: string = '';
    newValue: number = 0;
    newCategory: string = '';

    // List of all analytics data
    analyticsDataList: AnalyticsData[] = [];

    // Loading and error states
    isLoading: boolean = false;
    errorMessage: string = '';
    successMessage: string = '';

    constructor(private analyticsService: AnalyticsService) { }

    ngOnInit(): void {
        // Load existing data when component initializes
        this.loadAnalyticsData();
    }

    // ============================================
    // METHOD 1: CREATE - Store Single Record
    // ============================================
    /**
     * This method demonstrates how to store a SINGLE analytics record
     * in the database from the frontend.
     * 
     * Flow: Component → Service → HTTP Request → Backend API → Database
     */
    storeAnalyticsData(): void {
        // Validate input
        if (!this.newMetricName || !this.newCategory) {
            this.errorMessage = 'Please fill in all fields';
            return;
        }

        this.isLoading = true;
        this.errorMessage = '';
        this.successMessage = '';

        // Call the service to store data
        this.analyticsService.createAnalyticsData(
            this.newMetricName,
            this.newValue,
            this.newCategory
        ).subscribe({
            next: (response) => {
                console.log('✅ Data stored successfully:', response);

                this.successMessage = `Analytics data stored! ID: ${response.id}`;

                // Clear form
                this.newMetricName = '';
                this.newValue = 0;
                this.newCategory = '';

                // Reload the list to show new data
                this.loadAnalyticsData();

                this.isLoading = false;
            },
            error: (error) => {
                console.error('❌ Error storing data:', error);
                this.errorMessage = error.error?.detail || 'Failed to store data';
                this.isLoading = false;
            }
        });
    }

    // ============================================
    // METHOD 2: CREATE - Store Multiple Records (Bulk)
    // ============================================
    /**
     * This method demonstrates how to store MULTIPLE analytics records
     * at once (bulk insert).
     */
    storeBulkAnalyticsData(): void {
        const bulkData: AnalyticsData[] = [
            { metric_name: 'page_views', value: 1500, category: 'website' },
            { metric_name: 'clicks', value: 250, category: 'ads' },
            { metric_name: 'conversions', value: 45, category: 'sales' },
            { metric_name: 'bounce_rate', value: 35, category: 'website' },
            { metric_name: 'session_duration', value: 180, category: 'engagement' }
        ];

        this.isLoading = true;

        this.analyticsService.createBulkAnalyticsData(bulkData).subscribe({
            next: (response) => {
                console.log('✅ Bulk data stored:', response);
                this.successMessage = `${response.count} records stored successfully!`;
                this.loadAnalyticsData();
                this.isLoading = false;
            },
            error: (error) => {
                console.error('❌ Error storing bulk data:', error);
                this.errorMessage = 'Failed to store bulk data';
                this.isLoading = false;
            }
        });
    }

    // ============================================
    // METHOD 3: READ - Load All Analytics Data
    // ============================================
    /**
     * This method demonstrates how to RETRIEVE data from the database.
     * 
     * Flow: Component → Service → HTTP Request → Backend API → Database → Response
     */
    loadAnalyticsData(category?: string): void {
        this.isLoading = true;

        this.analyticsService.getAllAnalyticsData(0, 100, category).subscribe({
            next: (data) => {
                console.log('✅ Analytics data loaded:', data);
                this.analyticsDataList = data;
                this.isLoading = false;
            },
            error: (error) => {
                console.error('❌ Error loading data:', error);
                this.errorMessage = 'Failed to load analytics data';
                this.isLoading = false;
            }
        });
    }

    // ============================================
    // METHOD 4: UPDATE - Update Existing Record
    // ============================================
    /**
     * This method demonstrates how to UPDATE existing data in the database.
     */
    updateAnalyticsData(id: number, newValue: number): void {
        this.analyticsService.updateAnalyticsData(id, undefined, newValue).subscribe({
            next: (response) => {
                console.log('✅ Data updated:', response);
                this.successMessage = 'Data updated successfully!';
                this.loadAnalyticsData();
            },
            error: (error) => {
                console.error('❌ Error updating data:', error);
                this.errorMessage = 'Failed to update data';
            }
        });
    }

    // ============================================
    // METHOD 5: DELETE - Remove Record
    // ============================================
    /**
     * This method demonstrates how to DELETE data from the database.
     */
    deleteAnalyticsData(id: number): void {
        if (!confirm('Are you sure you want to delete this record?')) {
            return;
        }

        this.analyticsService.deleteAnalyticsData(id).subscribe({
            next: (response) => {
                console.log('✅ Data deleted:', response);
                this.successMessage = 'Data deleted successfully!';
                this.loadAnalyticsData();
            },
            error: (error) => {
                console.error('❌ Error deleting data:', error);
                this.errorMessage = 'Failed to delete data';
            }
        });
    }

    // ============================================
    // HELPER METHODS
    // ============================================

    /**
     * Filter data by category
     */
    filterByCategory(category: string): void {
        this.loadAnalyticsData(category);
    }

    /**
     * Clear all messages
     */
    clearMessages(): void {
        this.errorMessage = '';
        this.successMessage = '';
    }
}
