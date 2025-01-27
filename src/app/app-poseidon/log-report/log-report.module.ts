import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LogReportRoutingModule } from './log-report-routing.module';
import { LogReportListComponent } from './log-report-list/log-report-list.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';

// Factory function for TranslateHttpLoader
export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http);
}

@NgModule({
  declarations: [
    LogReportListComponent
  ],
  imports: [
    CommonModule,
    LogReportRoutingModule,
    SharedModule,
    TranslateModule.forChild({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient]
      }
    }),
  ],
  exports: [
    LogReportListComponent
  ]
})
export class LogReportModule { }
