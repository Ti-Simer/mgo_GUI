import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PropaneTruckListComponent } from './propane-truck-list/propane-truck-list.component';
import { PropaneTruckCreateComponent } from './propane-truck-create/propane-truck-create.component';
import { PropaneTruckEditComponent } from './propane-truck-edit/propane-truck-edit.component';
import { AuthGuard } from 'src/app/guards/auth.guard';

const routes: Routes = [
  { path: 'list', component: PropaneTruckListComponent, canActivate: [AuthGuard] },
  { path: 'create', component: PropaneTruckCreateComponent, canActivate: [AuthGuard] },
  { path: 'edit/:id', component: PropaneTruckEditComponent, canActivate: [AuthGuard] },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PropaneTruckRoutingModule { }
