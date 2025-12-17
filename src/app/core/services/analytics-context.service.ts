// import { Injectable } from '@angular/core';

// @Injectable({ providedIn: 'root' })
// export class AnalyticsContextService {

//   siteId!: string;
//   timezone!: string;
//   fromUtc!: number;
//   toUtc!: number;

//   setContext(data: {
//     siteId: string;
//     timezone: string;
//     fromUtc: number;
//     toUtc: number;
//   }) {
//     this.siteId = data.siteId;
//     this.timezone = data.timezone;
//     this.fromUtc = data.fromUtc;
//     this.toUtc = data.toUtc;
//   }

//   getPayload() {
//     return {
//       siteId: this.siteId,
//       fromUtc: this.fromUtc,
//       toUtc: this.toUtc
//     };
//   }
// }


import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class AnalyticsContextService {
  private contextSubject = new BehaviorSubject<{
    siteId: string;
    timezone: string;
    fromUtc: number;
    toUtc: number;
  }>({
    siteId: '',
    timezone: '',
    fromUtc: 0,
    toUtc: 0
  });

  context$ = this.contextSubject.asObservable();

  setContext(data: {
    siteId: string;
    timezone: string;
    fromUtc: number;
    toUtc: number;
  }) {
    this.contextSubject.next(data);
  }

  getPayload() {
    return {
      siteId: this.contextSubject.value.siteId,
      fromUtc: this.contextSubject.value.fromUtc,
      toUtc: this.contextSubject.value.toUtc
    };
  }

  getCurrentContext() {
    return this.contextSubject.value;
  }
}
