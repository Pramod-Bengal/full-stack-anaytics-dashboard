import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

// ============================================
// INTERFACES - Define Data Structures
// ============================================
export interface AnalyticsData {
    id?: number;
    metric_name: string;
    value: number;
    category: string;
    recorded_at?: string;
}

export interface AnalyticsResponse {
    message: string;
    id?: number;
    metric_name?: string;
    value?: number;
    category?: string;
    recorded_at?: string;
}

@Injectable({
    providedIn: 'root'
})
export class AnalyticsService {
    private apiUrl = 'http://localhost:8000/analytics';

    constructor(private http: HttpClient) { }

    /**
     * Get authentication headers with JWT token
     */
    private getHeaders(): HttpHeaders {
        const token = localStorage.getItem('access_token');
        return new HttpHeaders({
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        });
    }

    // ============================================
    // CREATE - Store Single Analytics Data
    // ============================================
    /**
     * Store a single analytics record in the database
     * 
     * Example usage:
     * this.analyticsService.createAnalyticsData('page_views', 1500, 'website')
     *   .subscribe({
     *     next: (response) => console.log('Data stored:', response),
     *     error: (error) => console.error('Error:', error)
     *   });
     */
    createAnalyticsData(
        metricName: string,
        value: number,
        category: string
    ): Observable<AnalyticsResponse> {
        const params = {
            metric_name: metricName,
            value: value,
            category: category
        };

        return this.http.post<AnalyticsResponse>(
            `${this.apiUrl}/data`,
            null,
            {
                headers: this.getHeaders(),
                params: params
            }
        );
    }

    // ============================================
    // CREATE - Store Multiple Analytics Data (Bulk)
    // ============================================
    /**
     * Store multiple analytics records at once
     * 
     * Example usage:
     * const dataList = [
     *   { metric_name: 'page_views', value: 1500, category: 'website' },
     *   { metric_name: 'clicks', value: 250, category: 'ads' }
     * ];
     * this.analyticsService.createBulkAnalyticsData(dataList).subscribe(...);
     */
    createBulkAnalyticsData(dataList: AnalyticsData[]): Observable<any> {
        return this.http.post<any>(
            `${this.apiUrl}/data/bulk`,
            dataList,
            { headers: this.getHeaders() }
        );
    }

    // ============================================
    // READ - Get All Analytics Data
    // ============================================
    /**
     * Retrieve all analytics data with optional filters
     * 
     * Example usage:
     * this.analyticsService.getAllAnalyticsData(0, 50, 'website')
     *   .subscribe(data => console.log('Analytics data:', data));
     */
    getAllAnalyticsData(
        skip: number = 0,
        limit: number = 100,
        category?: string
    ): Observable<AnalyticsData[]> {
        let params: any = { skip, limit };

        if (category) {
            params.category = category;
        }

        return this.http.get<AnalyticsData[]>(
            `${this.apiUrl}/data`,
            {
                headers: this.getHeaders(),
                params: params
            }
        );
    }

    // ============================================
    // READ - Get Single Analytics Data by ID
    // ============================================
    /**
     * Get a specific analytics record by ID
     */
    getAnalyticsById(id: number): Observable<AnalyticsData> {
        return this.http.get<AnalyticsData>(
            `${this.apiUrl}/data/${id}`,
            { headers: this.getHeaders() }
        );
    }

    // ============================================
    // UPDATE - Update Analytics Data
    // ============================================
    /**
     * Update an existing analytics record (Admin only)
     * 
     * Example usage:
     * this.analyticsService.updateAnalyticsData(1, 'new_metric', 2000, 'updated')
     *   .subscribe(response => console.log('Updated:', response));
     */
    updateAnalyticsData(
        id: number,
        metricName?: string,
        value?: number,
        category?: string
    ): Observable<AnalyticsResponse> {
        const params: any = {};

        if (metricName) params.metric_name = metricName;
        if (value !== undefined) params.value = value;
        if (category) params.category = category;

        return this.http.put<AnalyticsResponse>(
            `${this.apiUrl}/data/${id}`,
            null,
            {
                headers: this.getHeaders(),
                params: params
            }
        );
    }

    // ============================================
    // DELETE - Delete Analytics Data
    // ============================================
    /**
     * Delete an analytics record (Admin only)
     */
    deleteAnalyticsData(id: number): Observable<any> {
        return this.http.delete<any>(
            `${this.apiUrl}/data/${id}`,
            { headers: this.getHeaders() }
        );
    }

}
