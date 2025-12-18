



import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { EntryExitService } from './entry-exit.service';
import { AnalyticsContextService } from '../../core/services/analytics-context.service';

@Component({
  selector: 'app-crowd-entries',
  templateUrl: './crowd-entries.component.html',
  styleUrls: ['./crowd-entries.component.css']
})
export class CrowdEntriesComponent implements OnInit {

  entries: any[] = [];
  page = 1;
  limit = 10;
  total = 0;
  totalPages = 0;
  loading = false;

  constructor(
    private entryExitService: EntryExitService,
    private analyticsContext: AnalyticsContextService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    console.log('CrowdEntries ngOnInit');
    this.analyticsContext.context$.subscribe(() => {
      console.log('Context changed, loading entries');
      this.page = 1;
      this.loadEntries();
    });
  }

  loadEntries() {
    this.loading = true;

    this.entryExitService.getEntryExit(this.page, this.limit).subscribe({
      next: (res: any) => {
        console.log('API Response:', res);
        
        // Extract entries
        let data: any[] = [];
        if (res.data && Array.isArray(res.data)) {
          data = res.data;
        } else if (res.data && res.data.entries && Array.isArray(res.data.entries)) {
          data = res.data.entries;
        } else if (res.entries && Array.isArray(res.entries)) {
          data = res.entries;
        } else if (res.records && Array.isArray(res.records)) {
          data = res.records;
        } else if (Array.isArray(res)) {
          data = res;
        }
        
        this.entries = [...data];
        console.log('Entries set:', this.entries);
        
        // Calculate pagination
        this.total = res.totalRecords || res.total || (res.data && res.data.total) || 0;
        this.totalPages = res.totalPages || Math.ceil(this.total / this.limit);
        
        console.log('Page:', this.page, 'Total:', this.total, 'TotalPages:', this.totalPages);
        
        this.loading = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('API Error:', err);
        this.loading = false;
        this.cdr.detectChanges();
      }
    });
  }


  prevPage() {
    console.log('prevPage clicked, current page:', this.page);
    if (this.page > 1 && !this.loading) {
      this.page--;
      console.log('Going to page:', this.page);
      this.loadEntries();
    }
  }

  nextPage() {
    console.log('nextPage clicked, current page:', this.page, 'totalPages:', this.totalPages);
    if (this.page < this.totalPages && !this.loading) {
      this.page++;
      console.log('Going to page:', this.page);
      this.loadEntries();
    }
  }

  // Direct page change
  goToPage(pageNumber: number) {
    console.log('goToPage called with:', pageNumber);
    if (pageNumber >= 1 && pageNumber <= this.totalPages && !this.loading) {
      this.page = pageNumber;
      this.loadEntries();
    }
  }
}