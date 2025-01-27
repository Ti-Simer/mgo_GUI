import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PermissionsListComponent } from './permissions-list/permissions-list.component';
import { PermissionsCreateComponent } from './permissions-create/permissions-create.component';
import { PermissionsEditComponent } from './permissions-edit/permissions-edit.component';
import { AuthGuard } from 'src/app/guards/auth.guard';

const routes: Routes = [
  { path: 'list', component: PermissionsListComponent, canActivate: [AuthGuard] },
  { path: 'create', component: PermissionsCreateComponent, canActivate: [AuthGuard] },
  { path: 'edit/:id', component: PermissionsEditComponent, canActivate: [AuthGuard] },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PermissionsRoutingModule { }
