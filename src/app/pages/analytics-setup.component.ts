


import { Component, OnInit } from '@angular/core';
// import { SiteService } from '../../core/services/site.service';
// import { AnalyticsContextService } from '../../core/services/analytics-context.service';
// import { getDayRangeUtc } from '../../core/utils/date-utils';
import { SiteService } from '../core/services/site.service';
import { AnalyticsContextService } from '../core/services/analytics-context.service';
import { getDayRangeUtc } from '../core/services/utils/date-utils';

@Component({
  selector: 'app-analytics-filter',
  templateUrl: './analytics-filter.component.html'
})
export class AnalyticsFilterComponent implements OnInit {

  sites: any[] = [];
  selectedSite!: any;
  selectedDay: 'today' | 'yesterday' = 'today';

  constructor(
    private siteService: SiteService,
    private context: AnalyticsContextService
  ) {}

  ngOnInit(): void {
    this.siteService.getSites().subscribe(res => {
      this.sites = res;

      this.onSiteChange(this.sites[0]);
    });
  }

  onSiteChange(site: any) {
    this.selectedSite = site;

    const { fromUtc, toUtc } = getDayRangeUtc(
      site.timezone,
      this.selectedDay
    );

    this.context.setContext({
      siteId: site.siteId,
      timezone: site.timezone,
      fromUtc,
      toUtc
    });
  }

  onDayChange(day: 'today' | 'yesterday') {
    this.selectedDay = day;
    this.onSiteChange(this.selectedSite);
  }
}

