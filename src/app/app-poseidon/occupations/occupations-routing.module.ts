import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { OccupationsListComponent } from './occupations-list/occupations-list.component';
import { OccupationsCreateComponent } from './occupations-create/occupations-create.component';
import { OccupationsEditComponent } from './occupations-edit/occupations-edit.component';
import { AuthGuard } from 'src/app/guards/auth.guard';

const routes: Routes = [
  { path: 'list', component: OccupationsListComponent, canActivate: [AuthGuard] },
  { path: 'create', component: OccupationsCreateComponent, canActivate: [AuthGuard] },
  { path: 'edit/:id', component: OccupationsEditComponent, canActivate: [AuthGuard] },

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class OccupationsRoutingModule { }
