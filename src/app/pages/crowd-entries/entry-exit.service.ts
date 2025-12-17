import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AnalyticsContextService } from '../../core/services/analytics-context.service';
import { of } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class EntryExitService {

  constructor(private http: HttpClient, private context: AnalyticsContextService) {}

  getEntryExit(page = 1, limit = 10) {
    const payload = {
      ...this.context.getPayload(),
      pageSize: limit,
      pageNumber: page
    };
    return this.http.post<any>(
      `https://hiring-dev.internal.kloudspot.com/api/analytics/entry-exit`,
      payload
    );
  }
}
