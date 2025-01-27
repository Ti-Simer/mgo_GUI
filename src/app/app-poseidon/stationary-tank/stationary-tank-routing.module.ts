import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { StationaryTankListComponent } from './stationary-tank-list/stationary-tank-list.component';
import { StationaryTankCreateComponent } from './stationary-tank-create/stationary-tank-create.component';
import { StationaryTankEditComponent } from './stationary-tank-edit/stationary-tank-edit.component';
import { AuthGuard } from 'src/app/guards/auth.guard';
import { StationaryTankImportComponent } from './stationary-tank-import/stationary-tank-import.component';

const routes: Routes = [
  { path: 'list', component: StationaryTankListComponent, canActivate: [AuthGuard] },
  { path: 'create', component: StationaryTankCreateComponent, canActivate: [AuthGuard] },
  { path: 'edit/:id', component: StationaryTankEditComponent, canActivate: [AuthGuard] },
  { path: 'import', component: StationaryTankImportComponent, canActivate: [AuthGuard] },

];

@NgModule({
  imports: [
    RouterModule.forChild(routes),
  ],
  exports: [RouterModule]
})
export class StationaryTankRoutingModule { }
