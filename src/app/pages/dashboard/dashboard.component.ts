

// import {
//   Component,
//   OnInit,
//   OnDestroy,
//   ViewChild,
//   ElementRef
// } from '@angular/core';
// import { Chart } from 'chart.js/auto';
// import zoomPlugin from 'chartjs-plugin-zoom';

// import { DashboardService } from '../../core/services/dashboard.service';
// import { SiteService } from '../../core/services/site.service';
// import { AnalyticsContextService } from '../../core/services/analytics-context.service';
// import { getDayRangeUtc } from '../../core/services/utils/date-utils';


// const liveLinePlugin = {
//   id: 'liveLine',
//   afterDatasetsDraw(chart: any) {
//     const { ctx, chartArea, scales } = chart;
//     const meta = chart.getDatasetMeta(0);
//     if (!meta?.data?.length) return;

//     const lastPoint = meta.data[meta.data.length - 1];
//     const x = lastPoint.x;
//     const yTop = chartArea.top;
//     const yBottom = chartArea.bottom;

//     ctx.save();

//     // Vertical line
//     ctx.strokeStyle = '#dc2626';
//     ctx.setLineDash([6, 6]);
//     ctx.lineWidth = 2;

//     ctx.beginPath();
//     ctx.moveTo(x, yTop);
//     ctx.lineTo(x, yBottom);
//     ctx.stroke();

//     // LIVE badge
//     ctx.fillStyle = '#dc2626';
//     ctx.fillRect(x - 18, yTop - 26, 36, 20);

//     ctx.fillStyle = '#ffffff';
//     ctx.font = 'bold 11px sans-serif';
//     ctx.textAlign = 'center';
//     ctx.fillText('LIVE', x, yTop - 12);

//     ctx.restore();
//   }
// };




// const hoverLinePlugin = {
//   id: 'hoverLine',
//   afterEvent(chart: any, args: any) {
//     const { event } = args;
//     chart.$hoverX = event.x;
//   },
//   afterDraw(chart: any) {
//     if (!chart.$hoverX) return;

//     const ctx = chart.ctx;
//     const yScale = chart.scales.y;

//     ctx.save();
//     ctx.strokeStyle = 'rgba(13,148,136,0.5)';
//     ctx.lineWidth = 1;
//     ctx.setLineDash([2, 2]);

//     ctx.beginPath();
//     ctx.moveTo(chart.$hoverX, yScale.top);
//     ctx.lineTo(chart.$hoverX, yScale.bottom);
//     ctx.stroke();

//     ctx.restore();
//   }
// };




// Chart.register(hoverLinePlugin);
// Chart.register(liveLinePlugin);
// Chart.register(zoomPlugin);

// @Component({
//   selector: 'app-dashboard',
//   templateUrl: './dashboard.component.html',
//   styleUrls: ['./dashboard.component.css']
// })
// export class DashboardComponent implements OnInit, OnDestroy {


//   loading = false;

  
//   liveOccupancy = 0;
//   footfall = 0;
//   avgDwellTime = '';


//   @ViewChild('occupancyChart', { static: false })
//   occupancyCanvas!: ElementRef<HTMLCanvasElement>;

//   @ViewChild('demographicsChart', { static: false })
//   demographicsCanvas!: ElementRef<HTMLCanvasElement>;

//   @ViewChild('demographicsLineChart', { static: false })
//   demographicsLineCanvas!: ElementRef<HTMLCanvasElement>;

//   @ViewChild('footfallChart', { static: false })
//   footfallCanvas!: ElementRef<HTMLCanvasElement>;

  
//   private occupancyChart?: Chart;
//   private demographicsChart?: Chart;
//   private demographicsLineChart?: Chart;
//   private footfallChart?: Chart;

//   constructor(
//     private dashboardService: DashboardService,
//     private analyticsContext: AnalyticsContextService
//   ) {}

  
//   ngOnInit(): void {
//     this.analyticsContext.context$.subscribe(() => {
//       this.loading = true;
      
//       this.loadKPIs();
//       this.loadOccupancyTimeline();
//       this.loadDemographics();
//       this.loadFootfallByHour();


//       setTimeout(() => {
//         this.renderDemographicsLineChart();
//       });
//     });
//     setInterval(() => {
//   if (!this.occupancyChart) return;

//   const dataset = this.occupancyChart.data.datasets[0].data as number[];
//   const last = dataset[dataset.length - 1] || 110;

//   const next = Math.max(100, Math.min(130, last + (Math.random() * 6 - 3)));

//   dataset.push(Math.round(next));
//   this.occupancyChart.data.labels!.push(
//     new Date().getHours() + ':' + new Date().getMinutes().toString().padStart(2, '0')
//   );

//   if (dataset.length > 20) {
//     dataset.shift();
//     this.occupancyChart.data.labels!.shift();
//   }

//   this.occupancyChart.update('active');
// }, 5000);

//   }

//   ngOnDestroy(): void {
//     this.occupancyChart?.destroy();
//     this.demographicsChart?.destroy();
//     this.demographicsLineChart?.destroy();
//     this.footfallChart?.destroy();
//   }


//   loadKPIs() {
//     this.dashboardService.getFootfall().subscribe(res => {
//       this.footfall = res.footfall ?? 0;
//       this.checkAllLoaded();
//     });

//     this.dashboardService.getDwellTime().subscribe(res => {
//       const mins = Math.floor(res.avgDwellMinutes || 0);
//       const secs = Math.round(((res.avgDwellMinutes || 0) - mins) * 60);
//       this.avgDwellTime = `${mins} min ${secs} sec`;
//       this.checkAllLoaded();
//     });
//   }


//   loadOccupancyTimeline() {
//     this.dashboardService.getOccupancyTimeline().subscribe(res => {
//       if (!res?.buckets?.length) {
//         this.checkAllLoaded();
//         return;
//       }

//       const labels: string[] = [];
//       const values: (number | null)[] = [];

//       res.buckets.forEach((b: any) => {
//         labels.push(b.local.split(' ')[1].slice(0, 5));
//         values.push(b.avg > 0 ? Math.round(b.avg) : null);
//       });

//       this.liveOccupancy =
//         [...values].reverse().find(v => v !== null) ?? 0;

//       this.renderOccupancyChart(labels, values);
//       this.checkAllLoaded();
//     });
//   }

// renderOccupancyChart(labels: string[], values: (number | null)[]) {
//   this.occupancyChart?.destroy();

//   const ctx = this.occupancyCanvas.nativeElement.getContext('2d');
//   if (!ctx) return;

//   // Build full 24-hour timeline
//   const fullLabels: string[] = [];
//   const fullValues: (number | null)[] = [];

//   const map = new Map<string, number | null>();
//   labels.forEach((l, i) => map.set(l, values[i]));

//   for (let h = 0; h < 24; h++) {
//     const label = `${h.toString().padStart(2, '0')}:00`;
//     fullLabels.push(label);
//     fullValues.push(map.get(label) ?? null);
//   }

//   // Gradient fill
//   const gradient = ctx.createLinearGradient(0, 0, 0, 320);
//   gradient.addColorStop(0, 'rgba(13,148,136,0.25)');
//   gradient.addColorStop(1, 'rgba(13,148,136,0.00)');

//   this.occupancyChart = new Chart(ctx, {
//     type: 'line',
//     data: {
//       labels: fullLabels,
// datasets: [{
//   data: values,
//   borderColor: '#0d9488',
//   borderWidth: 3,
//   fill: true,
//   backgroundColor: 'rgba(13,148,136,0.12)',
//   tension: 0.45,
//   spanGaps: true,

//   pointRadius: 3,
//   pointBackgroundColor: '#0d9488',

//   pointHoverRadius: 7,
//   pointHoverBackgroundColor: '#ffffff',
//   pointHoverBorderColor: '#0d9488',
//   pointHoverBorderWidth: 2
// }]


//     },
// options: {
//   responsive: true,
//   maintainAspectRatio: false,

//   animation: {
//     duration: 900,
//     easing: 'easeOutQuart'
//   },

// interaction: {
//   mode: 'index',
//   intersect: false
// },

// plugins: {
//   legend: { display: false },

//   tooltip: {
//     enabled: true,
//     mode: 'index',
//     intersect: false
//   },

//   zoom: {
//     zoom: {
//       wheel: {
//         enabled: true
//       },
//       pinch: {
//         enabled: true
//       },
//       mode: 'x'
//     },
//     pan: {
//       enabled: true,
//       mode: 'x'
//     }
//   }
// },

//   scales: {
//     x: {
//       grid: {
//         color: '#eef2f3'
//       },
//       border: {
//         dash: [4, 4]
//       },
//       title: {
//         display: true,
//         text: 'Time'
//       }
//     },
//     y: {
//       beginAtZero: false,
//       suggestedMin: 80,
//       suggestedMax: 160,
//       grid: {
//         color: '#eef2f3'
//       },
//       title: {
//         display: true,
//         text: 'Count'
//       }
//     }
//   }
// }

//   });

//   // 🔁 Auto-refresh LIVE marker every minute
//   setInterval(() => {
//     this.occupancyChart?.update('none');
//   }, 60000);
// }



 
//   loadDemographics() {
//     this.dashboardService.getDemographics().subscribe(res => {
//       if (!res) {
//         this.checkAllLoaded();
//         return;
//       }

//       const values = Object.values(res) as number[];

//       this.demographicsChart?.destroy();

//       this.demographicsChart = new Chart(
//         this.demographicsCanvas.nativeElement,
//         {
//           type: 'doughnut',
//           data: {
//             labels: ['Male', 'Female'],
//             datasets: [{
//               data: values,
//               backgroundColor: ['#7fb6b2', '#bfe5e1'],
//               borderWidth: 6,
//               borderColor: '#ffffff'
//             }]
//           },
//           options: {
//             cutout: '75%',
//             responsive: true,
//             plugins: {
//               legend: { display: false }
//             }
//           }
//         }
//       );
      
//       this.checkAllLoaded();
//     });
//   }


//   renderDemographicsLineChart() {
//     if (!this.demographicsLineCanvas) return;

//     this.demographicsLineChart?.destroy();

//     this.demographicsLineChart = new Chart(
//       this.demographicsLineCanvas.nativeElement,
//       {
//         type: 'line',
//         data: {
//           labels: [
//             '08:00','09:00','10:00','11:00','12:00',
//             '13:00','14:00','15:00','16:00','17:00','18:00'
//           ],
//           datasets: [
//             {
//               label: 'Male',
//               data: [180,182,185,188,195,198,192,200,205,202,210],
//               borderColor: '#7fb6b2',
//               backgroundColor: 'rgba(127,182,178,0.12)',
//               tension: 0.4,
//               fill: true
//             },
//             {
//               label: 'Female',
//               data: [135,138,140,142,147,149,145,150,152,150,158],
//               borderColor: '#bfe5e1',
//               backgroundColor: 'rgba(191,229,225,0.18)',
//               tension: 0.4,
//               fill: true
//             }
//           ]
//         },
// options: {
//   responsive: true,
//   plugins: {
//     legend: {
//       position: 'top',
//       align: 'end'
//     },
//     tooltip: {
//       enabled: true
//     },
//     zoom: {
//       zoom: {
//         wheel: { enabled: true },
//         pinch: { enabled: true },
//         mode: 'x'
//       },
//       pan: {
//         enabled: true,
//         mode: 'x'
//       }
//     }
//   },
//   scales: {
//     x: {
//       grid: { color: '#eef2f3' }
//     },
//     y: {
//       beginAtZero: true,
//       grid: { color: '#eef2f3' }
//     }
//   }
// },  // ✅ THIS COMMA IS MANDATORY

// plugins: [liveLinePlugin]

//       }
//     );
//   }

  
//   loadFootfallByHour() {
//     this.dashboardService.getFootfall().subscribe(res => {
//       if (!res?.buckets?.length) {
//         this.checkAllLoaded();
//         return;
//       }

//       const labels: string[] = [];
//       const values: number[] = [];

//       res.buckets.forEach((b: any) => {
//         labels.push(b.local.split(' ')[1].slice(0, 5));
//         values.push(b.count);
//       });

//       this.footfallChart?.destroy();

//       this.footfallChart = new Chart(
//         this.footfallCanvas.nativeElement,
//         {
//           type: 'bar',
//           data: {
//             labels,
//             datasets: [{
//               data: values,
//               backgroundColor: '#38bdf8',
//               borderRadius: 4
//             }]
//           },
//           options: {
//             responsive: true,
//             plugins: {
//               legend: { display: false }
//             },
//             scales: {
//               x: { grid: { display: false } },
//               y: { beginAtZero: true }
//             }
//           }
//         }
//       );
      
//       this.checkAllLoaded();
//     });
//   }

  
//   private loadCount = 0;
//   private checkAllLoaded() {
//     this.loadCount++;
   
//     if (this.loadCount >= 5) {
//       this.loading = false;
//       this.loadCount = 0;
//     }
//   }
// }











import {
  Component,
  OnInit,
  OnDestroy,
  ViewChild,
  ElementRef
} from '@angular/core';
import { Chart } from 'chart.js/auto';
import zoomPlugin from 'chartjs-plugin-zoom';

import { DashboardService } from '../../core/services/dashboard.service';
import { SiteService } from '../../core/services/site.service';
import { AnalyticsContextService } from '../../core/services/analytics-context.service';
import { getDayRangeUtc } from '../../core/services/utils/date-utils';


const liveLinePlugin = {
  id: 'liveLine',
  afterDatasetsDraw(chart: any) {

    // 🚫 DO NOT draw on non-line charts (pie / doughnut)
    if (chart.config.type !== 'line') return;

    const { ctx, chartArea } = chart;
    const meta = chart.getDatasetMeta(0);
    if (!meta?.data?.length) return;

    const lastPoint = meta.data[meta.data.length - 1];
    const x = lastPoint.x;

    ctx.save();

    // Vertical LIVE line
    ctx.strokeStyle = '#dc2626';
    ctx.setLineDash([6, 6]);
    ctx.lineWidth = 2;

    ctx.beginPath();
    ctx.moveTo(x, chartArea.top);
    ctx.lineTo(x, chartArea.bottom);
    ctx.stroke();

    // LIVE badge
    ctx.fillStyle = '#dc2626';
    ctx.fillRect(x - 18, chartArea.top - 26, 36, 20);

    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 11px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('LIVE', x, chartArea.top - 12);

    ctx.restore();
  }
};





const hoverLinePlugin = {
  id: 'hoverLine',
  afterEvent(chart: any, args: any) {
    const { event } = args;
    chart.$hoverX = event.x;
  },
  afterDraw(chart: any) {
    if (!chart.$hoverX) return;

    const ctx = chart.ctx;
    const yScale = chart.scales.y;

    ctx.save();
    ctx.strokeStyle = 'rgba(13,148,136,0.5)';
    ctx.lineWidth = 1;
    ctx.setLineDash([2, 2]);

    ctx.beginPath();
    ctx.moveTo(chart.$hoverX, yScale.top);
    ctx.lineTo(chart.$hoverX, yScale.bottom);
    ctx.stroke();

    ctx.restore();
  }
};




Chart.register(hoverLinePlugin);
Chart.register(liveLinePlugin);
Chart.register(zoomPlugin);

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit, OnDestroy {


  loading = false;

  
  liveOccupancy = 0;
  footfall = 0;
  avgDwellTime = '';


  @ViewChild('occupancyChart', { static: false })
  occupancyCanvas!: ElementRef<HTMLCanvasElement>;

  @ViewChild('demographicsChart', { static: false })
  demographicsCanvas!: ElementRef<HTMLCanvasElement>;

  @ViewChild('demographicsLineChart', { static: false })
  demographicsLineCanvas!: ElementRef<HTMLCanvasElement>;

  @ViewChild('footfallChart', { static: false })
  footfallCanvas!: ElementRef<HTMLCanvasElement>;

  
  private occupancyChart?: Chart;
  private demographicsChart?: Chart;
  private demographicsLineChart?: Chart;
  private footfallChart?: Chart;

  constructor(
    private dashboardService: DashboardService,
    private analyticsContext: AnalyticsContextService
  ) {}

  ngOnInit(): void {
    this.analyticsContext.context$.subscribe(() => {
      this.loading = true;
      
      this.loadKPIs();
      this.loadOccupancyTimeline();
      this.loadDemographics();
      this.loadFootfallByHour();


      setTimeout(() => {
        this.renderDemographicsLineChart();
      });
    });
    setInterval(() => {
  if (!this.occupancyChart) return;

  const dataset = this.occupancyChart.data.datasets[0].data as number[];
  const last = dataset[dataset.length - 1] || 110;

  const next = Math.max(100, Math.min(130, last + (Math.random() * 6 - 3)));

  dataset.push(Math.round(next));
  this.occupancyChart.data.labels!.push(
    new Date().getHours() + ':' + new Date().getMinutes().toString().padStart(2, '0')
  );

  if (dataset.length > 20) {
    dataset.shift();
    this.occupancyChart.data.labels!.shift();
  }

  this.occupancyChart.update('active');
}, 5000);

  }

  ngOnDestroy(): void {
    this.occupancyChart?.destroy();
    this.demographicsChart?.destroy();
    this.demographicsLineChart?.destroy();
    this.footfallChart?.destroy();
  }


  loadKPIs() {
    this.dashboardService.getFootfall().subscribe(res => {
      this.footfall = res.footfall ?? 0;
      this.checkAllLoaded();
    });

    this.dashboardService.getDwellTime().subscribe(res => {
      const mins = Math.floor(res.avgDwellMinutes || 0);
      const secs = Math.round(((res.avgDwellMinutes || 0) - mins) * 60);
      this.avgDwellTime = `${mins} min ${secs} sec`;
      this.checkAllLoaded();
    });
  }


  loadOccupancyTimeline() {
    this.dashboardService.getOccupancyTimeline().subscribe(res => {
      if (!res?.buckets?.length) {
        this.checkAllLoaded();
        return;
      }

      const labels: string[] = [];
      const values: (number | null)[] = [];

      res.buckets.forEach((b: any) => {
        labels.push(b.local.split(' ')[1].slice(0, 5));
        values.push(b.avg > 0 ? Math.round(b.avg) : null);
      });

      this.liveOccupancy =
        [...values].reverse().find(v => v !== null) ?? 0;

      this.renderOccupancyChart(labels, values);
      this.checkAllLoaded();
    });
  }

renderOccupancyChart(labels: string[], values: (number | null)[]) {
  this.occupancyChart?.destroy();

  const ctx = this.occupancyCanvas.nativeElement.getContext('2d');
  if (!ctx) return;

  // Smooth gradient
  const gradient = ctx.createLinearGradient(0, 0, 0, 300);
  gradient.addColorStop(0, 'rgba(13,148,136,0.22)');
  gradient.addColorStop(1, 'rgba(13,148,136,0)');

  this.occupancyChart = new Chart(ctx, {
    type: 'line',
    data: {
      labels,
      datasets: [
        {
          label: 'Occupancy',
          data: values,

          borderColor: '#0d9488',
          borderWidth: 3,
          backgroundColor: gradient,
          fill: true,

          // 🔥 SUPER SMOOTH CURVES
          tension: 0.6,
          cubicInterpolationMode: 'monotone',

          // Clean UI
          pointRadius: 0,
          pointHoverRadius: 6,
          pointHoverBackgroundColor: '#ffffff',
          pointHoverBorderColor: '#0d9488',
          pointHoverBorderWidth: 2,

          spanGaps: true
        }
      ]
    },

    options: {
      responsive: true,
      maintainAspectRatio: false,

      animation: {
        duration: 900,
        easing: 'easeOutQuart'
      },

      interaction: {
        mode: 'index',
        intersect: false
      },

      plugins: {
        legend: { display: false },

        tooltip: {
          enabled: true,
          mode: 'index',
          intersect: false
        },

        zoom: {
          zoom: {
            wheel: { enabled: true },
            pinch: { enabled: true },
            mode: 'x'
          },
          pan: {
            enabled: true,
            mode: 'x'
          }
        }
      },

      scales: {
        x: {
          grid: {
            color: '#e5e7eb'
          },
          border: {
            display: false,
            dash: [4, 4] // ✅ CORRECT PLACE
          },
          ticks: {
            color: '#6b7280'
          },
          title: {
            display: true,
            text: 'Time',
            color: '#111827',
            font: { weight: 600 } // ✅ NUMBER
          }
        },

        y: {
          suggestedMin: 110,
          suggestedMax: 125,

          grid: {
            color: '#e5e7eb'
          },
          border: {
            display: false,
            dash: [4, 4] // ✅ CORRECT PLACE
          },
          ticks: {
            color: '#6b7280'
          },
          title: {
            display: true,
            text: 'Count',
            color: '#111827',
            font: { weight: 600 } // ✅ NUMBER
          }
        }
      }
    },

    plugins: [liveLinePlugin, hoverLinePlugin]
  });
}






 
  loadDemographics() {
    this.dashboardService.getDemographics().subscribe(res => {
      if (!res) {
        this.checkAllLoaded();
        return;
      }

      const values = Object.values(res) as number[];

      this.demographicsChart?.destroy();

      this.demographicsChart = new Chart(
        this.demographicsCanvas.nativeElement,
        {
          type: 'doughnut',
          data: {
            labels: ['Male', 'Female'],
            datasets: [{
              data: values,
              backgroundColor: ['#7fb6b2', '#bfe5e1'],
              borderWidth: 6,
              borderColor: '#ffffff'
            }]
          },
          options: {
            cutout: '75%',
            responsive: true,
            plugins: {
              legend: { display: false }
            }
          }
        }
      );
      
      this.checkAllLoaded();
    });
  }


  renderDemographicsLineChart() {
    if (!this.demographicsLineCanvas) return;

    this.demographicsLineChart?.destroy();

    this.demographicsLineChart = new Chart(
      this.demographicsLineCanvas.nativeElement,
      {
        type: 'line',
        data: {
          labels: [
            '08:00','09:00','10:00','11:00','12:00',
            '13:00','14:00','15:00','16:00','17:00','18:00'
          ],
          datasets: [
            {
              label: 'Male',
              data: [180,182,185,188,195,198,192,200,205,202,210],
              borderColor: '#7fb6b2',
              backgroundColor: 'rgba(127,182,178,0.12)',
              tension: 0.4,
              fill: true
            },
            {
              label: 'Female',
              data: [135,138,140,142,147,149,145,150,152,150,158],
              borderColor: '#bfe5e1',
              backgroundColor: 'rgba(191,229,225,0.18)',
              tension: 0.4,
              fill: true
            }
          ]
        },
options: {
  responsive: true,
  plugins: {
    legend: {
      position: 'top',
      align: 'end'
    },
    tooltip: {
      enabled: true
    },
    zoom: {
      zoom: {
        wheel: { enabled: true },
        pinch: { enabled: true },
        mode: 'x'
      },
      pan: {
        enabled: true,
        mode: 'x'
      }
    }
  },
  scales: {
    x: {
      grid: { color: '#eef2f3' }
    },
    y: {
      beginAtZero: true,
      grid: { color: '#eef2f3' }
    }
  }
},  // ✅ THIS COMMA IS MANDATORY

plugins: [liveLinePlugin]

      }
    );
  }

  
  loadFootfallByHour() {
    this.dashboardService.getFootfall().subscribe(res => {
      if (!res?.buckets?.length) {
        this.checkAllLoaded();
        return;
      }

      const labels: string[] = [];
      const values: number[] = [];

      res.buckets.forEach((b: any) => {
        labels.push(b.local.split(' ')[1].slice(0, 5));
        values.push(b.count);
      });

      this.footfallChart?.destroy();

      this.footfallChart = new Chart(
        this.footfallCanvas.nativeElement,
        {
          type: 'bar',
          data: {
            labels,
            datasets: [{
              data: values,
              backgroundColor: '#38bdf8',
              borderRadius: 4
            }]
          },
          options: {
            responsive: true,
            plugins: {
              legend: { display: false }
            },
            scales: {
              x: { grid: { display: false } },
              y: { beginAtZero: true }
            }
          }
        }
      );
      
      this.checkAllLoaded();
    });
  }

  
  private loadCount = 0;
  private checkAllLoaded() {
    this.loadCount++;
   
    if (this.loadCount >= 5) {
      this.loading = false;
      this.loadCount = 0;
    }
  }
}









