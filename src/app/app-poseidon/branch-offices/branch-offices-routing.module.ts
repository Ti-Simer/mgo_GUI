import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BranchOfficesListComponent } from './branch-offices-list/branch-offices-list.component';
import { BranchOfficesCreateComponent } from './branch-offices-create/branch-offices-create.component';
import { BranchOfficesEditComponent } from './branch-offices-edit/branch-offices-edit.component';
import { AuthGuard } from 'src/app/guards/auth.guard';
import { BranchOfficesImportComponent } from './branch-offices-import/branch-offices-import.component';

const routes: Routes = [
  { path: 'list', component: BranchOfficesListComponent, canActivate: [AuthGuard] },
  { path: 'create', component: BranchOfficesCreateComponent, canActivate: [AuthGuard] },
  { path: 'edit/:id', component: BranchOfficesEditComponent, canActivate: [AuthGuard] },
  { path: 'import', component: BranchOfficesImportComponent, canActivate: [AuthGuard] },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class BranchOfficesRoutingModule { }
