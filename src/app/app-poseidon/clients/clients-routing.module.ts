import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ClientsListComponent } from './clients-list/clients-list.component';
import { ClientsCreateComponent } from './clients-create/clients-create.component';
import { ClientsEditComponent } from './clients-edit/clients-edit.component';
import { AuthGuard } from 'src/app/guards/auth.guard';
import { ClientsImportComponent } from './clients-import/clients-import.component';

const routes: Routes = [
  { path: 'list', component: ClientsListComponent, canActivate: [AuthGuard] },
  { path: 'create', component: ClientsCreateComponent, canActivate: [AuthGuard] },
  { path: 'edit/:id', component: ClientsEditComponent, canActivate: [AuthGuard] },
  { path: 'import', component: ClientsImportComponent, canActivate: [AuthGuard] },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ClientsRoutingModule { }
