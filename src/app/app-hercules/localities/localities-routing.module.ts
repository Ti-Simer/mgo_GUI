import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LocalitiesListComponent } from './localities-list/localities-list.component';
import { LocalitiesCreateComponent } from './localities-create/localities-create.component';
import { LocalitiesEditComponent } from './localities-edit/localities-edit.component';
import { AuthGuard } from 'src/app/guards/auth.guard';

const routes: Routes = [
  { path: 'list', component: LocalitiesListComponent, canActivate: [AuthGuard] },
  { path: 'create', component: LocalitiesCreateComponent, canActivate: [AuthGuard] },
  { path: 'edit', component: LocalitiesEditComponent,canActivate: [AuthGuard] },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class LocalitiesRoutingModule { }
