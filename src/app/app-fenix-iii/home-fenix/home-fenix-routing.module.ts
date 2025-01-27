import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { FenixGeneralReportComponent } from './fenix-general-report/fenix-general-report.component';
import { HomeFenixComponent } from './home-fenix.component';

const routes: Routes = [
  { path: '', component: HomeFenixComponent },
  { path: 'general-report', component: FenixGeneralReportComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class HomeFenixRoutingModule { }
