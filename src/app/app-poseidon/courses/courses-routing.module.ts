import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CoursesOperatorComponent } from './courses-operator/courses-operator.component';
import { CoursesAdminComponent } from './courses-admin/courses-admin.component';
import { CoursesCreateComponent } from './courses-create/courses-create.component';
import { CoursesViewComponent } from './courses-view/courses-view.component';
import { AuthGuard } from 'src/app/guards/auth.guard';
import { CoursesEditComponent } from './courses-edit/courses-edit.component';

const routes: Routes = [
  { path: 'operator', component: CoursesOperatorComponent, canActivate: [AuthGuard] },
  { path: 'admin', component: CoursesAdminComponent, canActivate: [AuthGuard] },
  { path: 'create', component: CoursesCreateComponent, canActivate: [AuthGuard] },
  { path: 'view/:id', component: CoursesViewComponent, canActivate: [AuthGuard] },
  { path: 'edit/:id', component: CoursesEditComponent, canActivate: [AuthGuard] },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CoursesRoutingModule { }
