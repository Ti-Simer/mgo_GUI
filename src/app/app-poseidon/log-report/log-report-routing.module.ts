import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from 'src/app/guards/auth.guard';
import { LogReportListComponent } from './log-report-list/log-report-list.component';

const routes: Routes = [
  { path: 'list', component: LogReportListComponent, canActivate: [AuthGuard] },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class LogReportRoutingModule { }
