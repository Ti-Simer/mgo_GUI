import { Component } from '@angular/core';
import { flag } from 'ngx-bootstrap-icons';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from 'src/app/services/auth.service';
import { LogReportService } from 'src/app/services/poseidon-services/log-report.service';
import { TranslateService } from '@ngx-translate/core';
import { LanguageService } from 'src/app/services/language.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-log-report-list',
  templateUrl: './log-report-list.component.html',
  styleUrls: ['./log-report-list.component.scss']
})
export class LogReportListComponent {
  private languageSubscription!: Subscription;

  log_reports: any[] = [];

  constructor(
    private logReportService: LogReportService,
    private toastr: ToastrService,
    private authService: AuthService,
    private translate: TranslateService,
    private languageService: LanguageService
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
    this.logReportService.findByDay().subscribe((response: any) => {

      if (response.statusCode == 200) {
        this.log_reports = response.data.sort((a: any, b: any) => {
          let dateA = new Date(a.create); // o a.update dependiendo de qué fecha quieres usar
          let dateB = new Date(b.create); // o b.update dependiendo de qué fecha quieres usar
          return dateB.getTime() - dateA.getTime(); // Ordena en orden descendente
        });
      } else {
        this.log_reports = [];
      }
    });
  }

  fetchAllLogReports() {
    this.authService.readChecker().subscribe(flag => {
      if (flag) {
        this.logReportService.getAll().subscribe((response: any) => {

          if (response.statusCode == 200) {
            this.log_reports = response.data.sort((a: any, b: any) => {
              let dateA = new Date(a.create); // o a.update dependiendo de qué fecha quieres usar
              let dateB = new Date(b.create); // o b.update dependiendo de qué fecha quieres usar
              return dateB.getTime() - dateA.getTime(); // Ordena en orden descendente
            });
          }
          this.log_reports = response.data;
          console.log(this.log_reports);
          
          if (this.log_reports.length == 0) {
            this.toastr.info('No se encontraron informes de registros', 'Información');
          }
        });
      } else {
        this.log_reports = [];
        this.toastr.warning('No tienes permisos para leer esta información');
      }
    });
  }

  filterByCriticality(criticality: number) {
    const filteredLogs = this.log_reports.filter(log => log.route_event.criticality === criticality);
    if (filteredLogs.length > 0) {
      this.log_reports = filteredLogs;
    }
  }

  getCriticalityColor(criticality: number): string {
    switch (criticality) {
      case 2:
        return 'red';
      case 1:
        return 'orange';
      case 0:
        return 'yellow';
      default:
        return 'grey';
    }
  }
}
