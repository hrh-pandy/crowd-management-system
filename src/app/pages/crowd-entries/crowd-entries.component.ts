// import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
// import { EntryExitService } from './entry-exit.service';  // Using your EntryExitService
// import { AnalyticsContextService } from '../../core/services/analytics-context.service';  // Used in AI code for additional context

// @Component({
//   selector: 'app-crowd-entries',
//   templateUrl: './crowd-entries.component.html',
//   styleUrls: ['./crowd-entries.component.css']
// })
// export class CrowdEntriesComponent implements OnInit {

//   entries: any[] = [];        // Store entries
//   page = 1;                   // Current page number
//   limit = 10;                 // Number of entries per page
//   total = 0;                  // Total number of entries
//   totalPages = 0;             // Total number of pages for pagination
//   loading = false;            // Loading state

//   constructor(
//     private entryExitService: EntryExitService,
//     private analyticsContext: AnalyticsContextService,
//     private cdr: ChangeDetectorRef
//   ) {}

//   ngOnInit(): void {
//     console.log('CrowdEntries ngOnInit');
//     this.analyticsContext.context$.subscribe(() => {
//       console.log('Context changed, loading entries');
//       this.page = 1;  // Reset to first page when site changes
//       this.loadEntries();
//     });
//   }

// //   loadEntries() {
// //     this.loading = true;

// //     // Make the API call to fetch the entries
// //     this.entryExitService.getEntryExit(this.page, this.limit).subscribe({
// //       next: (res: any) => {
// //         console.log('API Response:', res);  // Debug the response structure
// //         // Extract entries and handle pagination data from the response
// //         let data: any[] = [];
// //         if (res.data && Array.isArray(res.data)) {
// //           data = res.data;
// //         } else if (res.data && res.data.entries && Array.isArray(res.data.entries)) {
// //           data = res.data.entries;
// //         } else if (res.entries && Array.isArray(res.entries)) {
// //           data = res.entries;
// //         } else if (res.records && Array.isArray(res.records)) {
// //           data = res.records;
// //         } else if (Array.isArray(res)) {
// //           data = res;
// //         }
// //         this.entries = [...data];
// //         console.log('Entries set:', this.entries);
// //         this.total = res.totalRecords || res.total || (res.data && res.data.total) || 0;  // Total entries count
// //         this.totalPages = res.totalPages || Math.ceil(this.total / this.limit); // Calculate total pages
// //         this.loading = false;  // Set loading to false once data is loaded
// //         this.cdr.detectChanges();
// //       },
// //       error: (err) => {
// //         console.error(err);  // Log any error for debugging
// //         this.loading = false; // Stop loading on error
// //       }
// //     });
// //   }

// //   // Pagination Methods
// //   prevPage() {
// //     if (this.page > 1) {
// //       this.page--;  // Decrease the page number
// //       this.loadEntries();  // Reload the entries for the new page
// //     }
// //   }

// //   nextPage() {
// //     if (this.page < this.totalPages) {
// //       this.page++;  // Increase the page number
// //       this.loadEntries();  // Reload the entries for the new page
// //     }
// //   }

// //   // Method to change the page number directly
// //   changePage(page: number) {
// //     if (page >= 1 && page <= this.totalPages) {
// //       this.page = page;  // Set the new page number
// //       this.loadEntries();  // Reload entries for the selected page
// //     }
// //   }
// // }


// loadEntries() {
//   this.loading = true;

//   this.entryExitService.getEntryExit(this.page, this.limit).subscribe({
//     next: (res: any) => {
//       console.log('API Response:', res);
      
//       // Extract data
//       let data: any[] = [];
//       if (res.data && Array.isArray(res.data)) {
//         data = res.data;
//       } else if (res.data && res.data.entries && Array.isArray(res.data.entries)) {
//         data = res.data.entries;
//       } else if (res.entries && Array.isArray(res.entries)) {
//         data = res.entries;
//       } else if (res.records && Array.isArray(res.records)) {
//         data = res.records;
//       } else if (Array.isArray(res)) {
//         data = res;
//       }
      
//       this.entries = [...data];
//       this.total = res.totalRecords || res.total || (res.data && res.data.total) || 0;
//       this.totalPages = res.totalPages || Math.ceil(this.total / this.limit);
      
//       this.loading = false;  // ✅ Stop loading
//       this.cdr.detectChanges();
//     },
//     error: (err) => {
//       console.error(err);
//       this.loading = false;  // ✅ Stop loading even on error
//       this.cdr.detectChanges();
//     }
//   });
// }
// }




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

  // Fixed pagination methods
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