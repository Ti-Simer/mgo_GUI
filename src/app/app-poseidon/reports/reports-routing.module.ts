import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ReportsListComponent } from './reports-list/reports-list.component';
import { ReportsBillComponent } from './bills/reports-bill/reports-bill.component';
import { ReportsViewPerformanceComponent } from './operators/reports-view-performance/reports-view-performance.component';
import { ReportsGraphsComponent } from './reports-graphs-branch-offices/reports-graphs.component';
import { ReportsBillsComponent } from './bills/reports-bills/reports-bills.component';
import { ReportsGraphsPropaneTrucksComponent } from './reports-graphs-propane-trucks/reports-graphs-propane-trucks.component';
import { AuthGuard } from 'src/app/guards/auth.guard';

const routes: Routes = [
  { path: 'list', component: ReportsListComponent, canActivate: [AuthGuard] },
  { path: 'bills/:id', component: ReportsBillsComponent, canActivate: [AuthGuard] },
  { path: 'bill/:id', component: ReportsBillComponent, canActivate: [AuthGuard] },
  { path: 'graphs/:id', component: ReportsGraphsComponent, canActivate: [AuthGuard] },
  { path: 'propane-truck/graphs/:id', component: ReportsGraphsPropaneTrucksComponent, canActivate: [AuthGuard] },
  { path: 'performance/:id', component: ReportsViewPerformanceComponent, canActivate: [AuthGuard] },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ReportsRoutingModule { }
