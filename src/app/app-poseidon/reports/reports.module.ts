import { NgModule } from '@angular/core';
import { CommonModule, DatePipe, NgStyle } from '@angular/common';

import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatCardModule } from '@angular/material/card';
import { ReactiveFormsModule } from '@angular/forms';
import { MatExpansionModule } from '@angular/material/expansion';
import { NgChartsModule } from 'ng2-charts';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatTableModule } from '@angular/material/table';
import { ReportsListComponent } from './reports-list/reports-list.component';
import { ReportsViewComponent } from './bills/reports-view-bills/reports-view.component';
import { ReportsBillComponent } from './bills/reports-bill/reports-bill.component';
import { ReportsBranchOfficesComponent } from './branch-offices/reports-branch-offices/reports-branch-offices.component';
import { ReportsOperatorsComponent } from './operators/reports-operators/reports-operators.component';
import { ReportsViewPerformanceComponent } from './operators/reports-view-performance/reports-view-performance.component';
import { ReportsGraphsComponent } from './reports-graphs-branch-offices/reports-graphs.component';
import { ReportsRoutingModule } from './reports-routing.module';
import { ReportsLoadingStatusComponent } from './branch-offices/reports-loading-status/reports-loading-status.component';
import { ReportsBillsComponent } from './bills/reports-bills/reports-bills.component';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatNativeDateModule } from '@angular/material/core';
import { MatInputModule } from '@angular/material/input';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { ReportsTankRotationComponent } from './branch-offices/reports-tank-rotation/reports-tank-rotation.component';
import { NgApexchartsModule } from 'ng-apexcharts';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';
import { NgxMaterialTimepickerModule } from 'ngx-material-timepicker';
import { SharedModule } from 'src/app/shared/shared.module';
import { ReportsRangeComponent } from './branch-offices/reports-range/reports-range.component';
import { ReportsPropaneTrucksComponent } from './propane-trucks/reports-propane-trucks/reports-propane-trucks.component';
import { ReportsGraphsPropaneTrucksComponent } from './reports-graphs-propane-trucks/reports-graphs-propane-trucks.component';
import { ReportsLoadReportComponent } from './propane-trucks/reports-load-report/reports-load-report.component';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import {
  LucideAngularModule,
  FileText,
  Tags,
  PieChart,
  BetweenHorizontalStart,
  Filter,
  Building2,
  ArrowBigLeftDash,
  ArrowBigRightDash,
  FileDown,
  Download,
  User,
  Truck
} from 'lucide-angular';
import { DialogViewBillComponent } from './bills/dialog-view-bill/dialog-view-bill.component';

// Factory function for TranslateHttpLoader
export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http);
}

@NgModule({
  declarations: [
    ReportsListComponent,
    ReportsViewComponent,
    ReportsBillComponent,
    ReportsBranchOfficesComponent,
    ReportsOperatorsComponent,
    ReportsViewPerformanceComponent,
    ReportsGraphsComponent,
    ReportsLoadingStatusComponent,
    ReportsBillsComponent,
    ReportsTankRotationComponent,
    ReportsRangeComponent,
    ReportsLoadReportComponent,
    ReportsPropaneTrucksComponent,
    ReportsGraphsPropaneTrucksComponent,
    DialogViewBillComponent
  ],
  imports: [
    SharedModule,
    CommonModule,
    ReportsRoutingModule,
    MatSlideToggleModule,
    MatCardModule,
    NgStyle,
    ReactiveFormsModule,
    MatExpansionModule,
    NgChartsModule,
    MatPaginatorModule,
    MatTableModule,
    MatFormFieldModule,
    MatNativeDateModule,
    MatFormFieldModule,
    MatInputModule,
    MatDatepickerModule,
    NgxDatatableModule,
    NgApexchartsModule,
    LucideAngularModule.pick({
      FileText,
      Tags,
      BetweenHorizontalStart,
      PieChart,
      Filter,
      Building2,
      ArrowBigLeftDash,
      ArrowBigRightDash,
      FileDown,
      Download,
      User,
      Truck
    }),
    TranslateModule.forChild({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient]
      }
    }),
    MatButtonModule,
    MatMenuModule,
    NgxMaterialTimepickerModule
  ],
  exports: [
  ],
  providers: [
    DatePipe
  ]
})
export class ReportsModule { }
