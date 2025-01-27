import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TabletsListComponent } from './tablets-list/tablets-list.component';
import { TabletsCreateComponent } from './tablets-create/tablets-create.component';
import { TabletsEditComponent } from './tablets-edit/tablets-edit.component';
import { TabletsViewComponent } from './tablets-view/tablets-view.component';
import { AuthGuard } from 'src/app/guards/auth.guard';

const routes: Routes = [
  { path: 'list', component: TabletsListComponent, canActivate: [AuthGuard] },
  { path: 'create', component: TabletsCreateComponent, canActivate: [AuthGuard] },
  { path: 'edit/:id', component: TabletsEditComponent, canActivate: [AuthGuard] },
  { path: 'view/:id', component: TabletsViewComponent, canActivate: [AuthGuard] },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TabletsRoutingModule { }
