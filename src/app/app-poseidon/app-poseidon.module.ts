import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AppPoseidonRoutingModule } from './app-poseidon-routing.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatDialogModule } from '@angular/material/dialog';
import { NgxBootstrapIconsModule } from 'ngx-bootstrap-icons';
import { GoogleMapsModule } from '@angular/google-maps';
import { NgChartsModule } from 'ng2-charts';
import { MatPaginatorModule } from '@angular/material/paginator';
import { NgApexchartsModule } from 'ng-apexcharts';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';
import { NgxMaterialTimepickerModule } from 'ngx-material-timepicker';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { SharedModule } from '../shared/shared.module';
import { HomeComponent } from './home/home.component';
import { HomeTrackingmapComponent } from './home/home-trackingmap/home-trackingmap.component';
import { HomeChartComponent } from './home/home-chart/home-chart.component';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { LogReportModule } from './log-report/log-report.module';
import {
  LucideAngularModule,
  Send,
  Map,
  MapPinned,
  Mail,
  Smartphone,
  Facebook,
  Twitter,
  Linkedin,
  Instagram,
  NotebookPen,
  Tags,
  BetweenHorizontalStart,
  PieChart,
  Cpu,
  Eye,
  ListTodo,
  HelpCircle,
  Download,
  ArrowBigLeftDash,
  FileDown,
  ChevronDown,
  CircleUserRound
} from 'lucide-angular';

// Factory function for TranslateHttpLoader
export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http);
}

@NgModule({
  declarations: [
    HomeComponent,
    HomeTrackingmapComponent,
    HomeChartComponent,
  ],
  imports: [
    CommonModule,
    AppPoseidonRoutingModule,
    ReactiveFormsModule,
    MatSnackBarModule,
    HttpClientModule,
    MatDialogModule,
    FormsModule,
    NgxBootstrapIconsModule,
    GoogleMapsModule,
    NgChartsModule,
    MatPaginatorModule,
    NgApexchartsModule,
    MatButtonModule,
    MatMenuModule,
    NgxMaterialTimepickerModule,
    MatExpansionModule,
    MatFormFieldModule,
    MatDatepickerModule,
    SharedModule,
    LogReportModule,
    LucideAngularModule.pick({
      Send,
      Map,
      MapPinned,
      Mail,
      Smartphone,
      Facebook,
      Twitter,
      Linkedin,
      Instagram,
      NotebookPen,
      Tags,
      BetweenHorizontalStart,
      PieChart,
      Cpu,
      Eye,
      ListTodo,
      HelpCircle,
      Download,
      ArrowBigLeftDash,
      FileDown,
      ChevronDown,
      CircleUserRound
    }),
    TranslateModule.forChild({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient]
      }
    }),
  ]
})
export class AppPoseidonModule { }
