import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RolesCreateComponent } from './roles-create/roles-create.component';
import { RolesListComponent } from './roles-list/roles-list.component';
import { RolesEditComponent } from './roles-edit/roles-edit.component';
import { AuthGuard } from 'src/app/guards/auth.guard';

const routes: Routes = [
  { path: 'create', component: RolesCreateComponent, canActivate: [AuthGuard] },
  { path: 'list', component: RolesListComponent, canActivate: [AuthGuard] },
  { path: 'edit/:id', component: RolesEditComponent, canActivate: [AuthGuard] },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class RolesRoutingModule { }
