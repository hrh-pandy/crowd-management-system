




import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { AnalyticsContextService } from './analytics-context.service';

@Injectable({
  providedIn: 'root'
})
export class DashboardService {

  constructor(
    private http: HttpClient,
    private context: AnalyticsContextService
  ) {}

  // ✅ FIXED: Implemented getEntryExit properly
  getEntryExit(payload: {
    pageSize: number;
    pageNumber: number;
    siteId: string;
    fromUtc: number;
    toUtc: number;
  }) {
    return this.http.post<any>(
      `${environment.apiUrl}/analytics/entry-exit`,
      payload
    );
  }

  getFootfall() {
    return this.http.post<any>(
      `${environment.apiUrl}/analytics/footfall`,
      this.context.getPayload()
    );
  }

  getDwellTime() {
    return this.http.post<any>(
      `${environment.apiUrl}/analytics/dwell`,
      this.context.getPayload()
    );
  }

  getOccupancyTimeline() {
    return this.http.post<any>(
      `${environment.apiUrl}/analytics/occupancy`,
      this.context.getPayload()
    );
  }

  getDemographics() {
    return this.http.post<any>(
      `${environment.apiUrl}/analytics/demographics`,
      this.context.getPayload()
    );
  }
}
