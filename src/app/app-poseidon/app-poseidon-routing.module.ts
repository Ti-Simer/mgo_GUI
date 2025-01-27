import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { AuthGuard } from '../guards/auth.guard';

const routes: Routes = [
  { path: 'home', component: HomeComponent, canActivate: [AuthGuard] },

  { path: 'usuarios', loadChildren: () => import('./usuarios/usuarios.module').then(m => m.UsuariosModule) },
  { path: 'roles', loadChildren: () => import('./roles/roles.module').then(m => m.RolesModule) },
  { path: 'permissions', loadChildren: () => import('./permissions/permissions.module').then(m => m.PermissionsModule) },
  { path: 'courses', loadChildren: () => import('./courses/courses.module').then(m => m.CoursesModule) },
  { path: 'branch-offices', loadChildren: () => import('./branch-offices/branch-offices.module').then(m => m.BranchOfficesModule) },
  { path: 'department', loadChildren: () => import('./department/department.module').then(m => m.DepartmentModule) },
  { path: 'city', loadChildren: () => import('./city/city.module').then(m => m.CityModule) },
  { path: 'zone', loadChildren: () => import('./zone/zone.module').then(m => m.ZoneModule) },
  { path: 'client', loadChildren: () => import('./clients/clients.module').then(m => m.ClientsModule) },
  { path: 'occupation', loadChildren: () => import('./occupations/occupations.module').then(m => m.OccupationsModule) },
  { path: 'reports', loadChildren: () => import('./reports/reports.module').then(m => m.ReportsModule) },
  { path: 'propane-trucks', loadChildren: () => import('./propane-truck/propane-truck.module').then(m => m.PropaneTruckModule) },
  { path: 'tablets', loadChildren: () => import('./tablets/tablets.module').then(m => m.TabletsModule) },
  { path: 'notifications', loadChildren: () => import('./notifications/notifications.module').then(m => m.NotificationsModule) },
  { path: 'stationary-tank', loadChildren: () => import('./stationary-tank/stationary-tank.module').then(m => m.StationaryTankModule) },
  { path: 'orders', loadChildren: () => import('./orders/orders.module').then(m => m.OrdersModule) },
  { path: 'request', loadChildren: () => import('./request/request.module').then(m => m.RequestModule) },
  { path: 'log-report', loadChildren: () => import('./log-report/log-report.module').then(m => m.LogReportModule) },
  { path: 'bill', loadChildren: () => import('./bill/bill.module').then(m => m.BillModule) },
  { path: 'configuration', loadChildren: () => import('./configuration/configuration.module').then(m => m.ConfigurationModule) },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AppPoseidonRoutingModule { }
