import { Component } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from 'src/app/services/auth.service';
import { LogReportService } from 'src/app/services/poseidon-services/log-report.service';
import { TranslateService } from '@ngx-translate/core';
import { LanguageService } from 'src/app/services/language.service';
import { Subscription } from 'rxjs';
import { Router } from '@angular/router';

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
    private router: Router
  ) {
    translate.addLangs(['en', 'es', 'pt']);
    translate.setDefaultLang(this.languageService.getLanguage());

    this.authService.readChecker().subscribe(flag => {
      if (flag) {
        this.fetchLogReports();
      } else {
        this.log_reports = [];
      }
    });
  }

  ngOnInit(): void {
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


  toggleViewMode() {
    this.viewMode = this.viewMode === 'grid' ? 'list' : 'grid';
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
}
