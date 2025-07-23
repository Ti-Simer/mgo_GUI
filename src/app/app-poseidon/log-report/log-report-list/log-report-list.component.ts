import { Component } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from 'src/app/services/auth.service';
import { LogReportService } from 'src/app/services/poseidon-services/log-report.service';
import { TranslateService } from '@ngx-translate/core';
import { LanguageService } from 'src/app/services/language.service';
import { Subscription } from 'rxjs';
import { Router } from '@angular/router';
import { DialogAllLogReportComponent } from '../dialog-all-log-report/dialog-all-log-report.component';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-log-report-list',
  templateUrl: './log-report-list.component.html',
  styleUrls: ['./log-report-list.component.scss']
})

export class LogReportListComponent {
  private languageSubscription!: Subscription;
  log_reports: any[] = [];
  criticalityCounts: any;
  criticalityLow: any;
  criticalityMedium: any;
  criticalityHigh: any;
  viewMode: 'list' | 'grid' = 'list';
  selectedCriticality: number | null = null;
  pageIndex: number = 0;
  pageSize: number = 25;
  pageSizeOptions: number[] = [25, 50, 100];
  paginatedItems: any[] = [];


  dateToday: any = new Date().toLocaleDateString('es-GB', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  });

  constructor(
    private logReportService: LogReportService,
    private toastr: ToastrService,
    private authService: AuthService,
    private translate: TranslateService,
    private languageService: LanguageService,
    private router: Router,
    private dialog: MatDialog
  ) {
    translate.addLangs(['en', 'es', 'pt']);
    translate.setDefaultLang(this.languageService.getLanguage());
  }

  ngOnInit(): void {
    this.authService.readChecker().subscribe(flag => {
      if (flag) {
        this.fetchLogReports();
      } else {
        this.log_reports = [];
      }
    });
  }

  fetchLogReports() {
    const pageData = {
      pageData: {
        page: 1,
        limit: 50
      }
    };

    this.logReportService.findByDay(pageData).subscribe((response: any) => {
      if (response.statusCode == 200) {
        this.criticalityCounts = response.data.criticalityCounts;
        this.receiveCriticalityCounts(this.criticalityCounts);
        this.log_reports = response.data.logReports.sort((a: any, b: any) => {
          let dateA = new Date(a.create); // o a.update dependiendo de qué fecha quieres usar
          let dateB = new Date(b.create); // o b.update dependiendo de qué fecha quieres usar
          return dateB.getTime() - dateA.getTime(); // Ordena en orden descendente
        });
        this.paginatedItems = this.log_reports; // Asigna el valor rescatado por findByDay a paginatedItems
      } else {
        this.log_reports = [];
      }
    });
  }

  receiveCriticalityCounts(data: any) {
    if (data) {
      for (let item of data) {
        switch (item.criticality) {
          case 0:
            this.criticalityLow = item.count;
            break;
          case 1:
            this.criticalityMedium = item.count;
            break;
          case 2:
            this.criticalityHigh = item.count;
            break;
        }
      }
    }
  }

  filterByCriticality(level: number) {
    if (this.selectedCriticality === level) {
      // Si se vuelve a hacer clic en el mismo, desactiva el filtro
      this.selectedCriticality = null;
    } else {
      this.selectedCriticality = level;
    }
    this.pageIndex = 0;
    this.updatePaginatedItems();
  }

  updatePaginatedItems(): void {
    let filtered = this.log_reports;

    // Filtrado por criticidad
    if (this.selectedCriticality !== null) {
      filtered = filtered.filter(
        item => item.route_event.criticality === this.selectedCriticality
      );
    }

    const start = this.pageIndex * this.pageSize;
    const end = start + this.pageSize;
    this.paginatedItems = filtered.slice(start, end);
  }

  toggleViewMode() {
    this.viewMode = this.viewMode === 'grid' ? 'list' : 'grid';
  }

  toViewLogReports() {
    this.authService.writeChecker().subscribe(flag => {
      if (!flag) {
        this.toastr.warning('No tienes permisos para crear');
      } else {
        const dialogRef = this.dialog.open(DialogAllLogReportComponent, {
          width: '1200px',
        });

        dialogRef.afterClosed().subscribe(result => {
          this.fetchLogReports();
        });
      }
    });
  }

  toCourses() {
    this.authService.readChecker().subscribe(flag => {
      if (!flag) {
        this.toastr.warning('No tienes permisos para leer esta información');
      } else {
        this.router.navigate(['/poseidon/courses/admin']);
      }
    });
  }

  toOrders() {
    this.authService.readChecker().subscribe(flag => {
      if (!flag) {
        this.toastr.warning('No tienes permisos para leer esta información');
      } else {
        this.router.navigate(['/poseidon/orders/list']);
      }
    });
  }

  toReports() {
    this.authService.readChecker().subscribe(flag => {
      if (!flag) {
        this.toastr.warning('No tienes permisos para leer esta información');
      } else {
        this.router.navigate(['/poseidon/reports/list']);
      }
    });
  }

  toRequest() {
    this.authService.readChecker().subscribe(flag => {
      if (!flag) {
        this.toastr.warning('No tienes permisos para leer esta información');
      } else {
        this.router.navigate(['/poseidon/request/list']);
      }
    });
  }

  getCriticalityCount(level: number): number {
    return this.log_reports.filter(item => item.route_event.criticality === level).length;
  }
}
