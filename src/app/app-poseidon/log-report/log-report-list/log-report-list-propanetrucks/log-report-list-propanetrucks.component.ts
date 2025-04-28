import { Component } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from 'src/app/services/auth.service';
import { LogReportService } from 'src/app/services/poseidon-services/log-report.service';
import { ShareService } from 'src/app/services/share.service';

@Component({
  selector: 'app-log-report-list-propanetrucks',
  templateUrl: './log-report-list-propanetrucks.component.html',
  styleUrls: ['./log-report-list-propanetrucks.component.scss']
})
export class LogReportListPropanetrucksComponent {

  data: any[] = [];

  constructor(
    private authService: AuthService,
    private toastr: ToastrService,
    private logreportService: LogReportService,
    private shareService: ShareService,
  ) {
  }

  ngOnInit(): void {
    this.fetchData();
  }

  fetchData() {
    try {
      this.logreportService.findTrucksOnCourseLog().subscribe(
        response => {
          if (response.statusCode === 200) {
            this.data = response.data;
            if (this.data.length > 0) {
              this.shareService.emit_second_data(this.data);
            }
          }
        }
      );
    } catch (error) {
      this.toastr.error('Error fetching data');
    }
  }

}
