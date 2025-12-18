



import {
  Component,
  OnInit,
  OnDestroy,
  ViewChild,
  ElementRef
} from '@angular/core';
import { Chart } from 'chart.js/auto';

import { DashboardService } from '../../core/services/dashboard.service';
import { SiteService } from '../../core/services/site.service';
import { AnalyticsContextService } from '../../core/services/analytics-context.service';
import { getDayRangeUtc } from '../../core/services/utils/date-utils';

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

    this.occupancyChart = new Chart(this.occupancyCanvas.nativeElement, {
      type: 'line',
      data: {
        labels,
        datasets: [{
          data: values,
          borderColor: '#0d9488',
          borderWidth: 2,
          fill: false,
          tension: 0.35,
          spanGaps: true,
          pointRadius: 2
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: false }
        },
        scales: {
          x: { grid: { display: false } },
          y: {
            beginAtZero: false,
            suggestedMin: 80,
            suggestedMax: 150
          }
        }
      }
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
            }
          },
          scales: {
            x: {
              grid: { color: '#eef2f3' },
              title: { display: true, text: 'Time' }
            },
            y: {
              beginAtZero: true,
              grid: { color: '#eef2f3' },
              title: { display: true, text: 'Count' }
            }
          }
        }
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