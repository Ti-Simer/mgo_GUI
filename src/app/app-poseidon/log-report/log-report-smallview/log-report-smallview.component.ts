import { Component } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from 'src/app/services/auth.service';
import { LogReportService } from 'src/app/services/poseidon-services/log-report.service';
import { TranslateService } from '@ngx-translate/core';
import { LanguageService } from 'src/app/services/language.service';
import { Subscription } from 'rxjs';
import { ShareService } from 'src/app/services/share.service';

@Component({
  selector: 'app-log-report-smallview',
  templateUrl: './log-report-smallview.component.html',
  styleUrls: ['./log-report-smallview.component.scss']
})
export class LogReportSmallviewComponent {
  private languageSubscription!: Subscription;

  log_reports: any[] = [];
  criticalityCounts: any;

  constructor(
    private logReportService: LogReportService,
    private toastr: ToastrService,
    private authService: AuthService,
    private translate: TranslateService,
    private languageService: LanguageService,
    private shareService: ShareService
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
        this.emit(this.criticalityCounts);
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

  emit(data: any) {
    this.shareService.emit_data(data);
  }

}
