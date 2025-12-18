



import { Component, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { SiteService } from '../core/services/site.service';
import { AnalyticsContextService } from '../core/services/analytics-context.service';
import { getDayRangeUtc } from '../core/services/utils/date-utils';

@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [RouterModule, FormsModule, CommonModule],
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.css']
})
export class LayoutComponent implements OnInit {
  sites: any[] = [];
  selectedSite: any;

  constructor(
    private siteService: SiteService,
    private analyticsContext: AnalyticsContextService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadSites();
  }

  loadSites() {
    this.siteService.getSites().subscribe({
      next: (res: any) => {
        this.sites = res.sites || res || [];
        console.log('Sites loaded:', this.sites);
        if (this.sites.length) {
          this.onSiteChange(this.sites[0]);
        }
      },
      error: err => console.error('Sites error:', err)
    });
  }

  onSiteChange(site: any) {
    this.selectedSite = site;
    console.log('Site changed to:', site);

    const { fromUtc, toUtc } = getDayRangeUtc(site.timezone, 'today');

    this.analyticsContext.setContext({
      siteId: site.siteId,
      timezone: site.timezone,
      fromUtc,
      toUtc
    });
  }

  logout() {
    // Clear any stored authentication tokens
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    sessionStorage.clear();
    
    // Navigate to login page
    this.router.navigate(['/login']);
    
    console.log('User logged out');
  }
}