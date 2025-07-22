import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LogReportRoutingModule } from './log-report-routing.module';
import { LogReportListComponent } from './log-report-list/log-report-list.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { LogReportSmallviewComponent } from './log-report-smallview/log-report-smallview.component';
import { GoogleMapsModule } from '@angular/google-maps';
import {
  LucideAngularModule,
  Flame,
  Truck
} from 'lucide-angular';
import { LogReportListMapComponent } from './log-report-list/log-report-list-map/log-report-list-map.component';
import { LogReportListPropanetrucksComponent } from './log-report-list/log-report-list-propanetrucks/log-report-list-propanetrucks.component';
import { LogReportAllComponent } from './log-report-all/log-report-all.component';
import { DialogAllLogReportComponent } from './dialog-all-log-report/dialog-all-log-report.component';

// Factory function for TranslateHttpLoader
export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http);
}

@NgModule({
  declarations: [
    LogReportListComponent,
    LogReportSmallviewComponent,
    LogReportListMapComponent,
    LogReportListPropanetrucksComponent,
    LogReportAllComponent,
    DialogAllLogReportComponent
  ],
  imports: [
    CommonModule,
    LogReportRoutingModule,
    SharedModule,
    GoogleMapsModule,
    LucideAngularModule.pick({
      Flame,
      Truck
    }),
    TranslateModule.forChild({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient]
      }
    }),
  ],
  exports: [
    LogReportListComponent,
    LogReportSmallviewComponent
  ]
})
export class LogReportModule { }
