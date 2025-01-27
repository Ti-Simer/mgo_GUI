import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HomeFenixRoutingModule } from './home-fenix-routing.module';
import { SharedModule } from 'src/app/shared/shared.module';
import { FenixGeneralReportComponent } from './fenix-general-report/fenix-general-report.component';
import { NgApexchartsModule } from 'ng-apexcharts';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';
import { NgxMaterialTimepickerModule } from 'ngx-material-timepicker';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatDialogModule } from '@angular/material/dialog';
import { MatNativeDateModule } from '@angular/material/core';
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
  ArrowBigRightDash,
  FileDown,
  ChevronDown
} from 'lucide-angular';

@NgModule({
  declarations: [
    FenixGeneralReportComponent
  ],
  imports: [
    CommonModule,
    HomeFenixRoutingModule,
    SharedModule,
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
      ArrowBigRightDash,
      FileDown,
      ChevronDown
    }),
    NgApexchartsModule,
    MatPaginatorModule,
    MatButtonModule,
    MatMenuModule,
    NgxMaterialTimepickerModule,
    MatExpansionModule,
    MatFormFieldModule,
    MatDatepickerModule,
    FormsModule,
    MatDialogModule,
    ReactiveFormsModule,
    MatNativeDateModule
  ]
})
export class HomeFenixModule { }
