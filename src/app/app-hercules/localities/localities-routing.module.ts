import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LocalitiesListComponent } from './localities-list/localities-list.component';
import { LocalitiesCreateComponent } from './localities-create/localities-create.component';

const routes: Routes = [
  { path: 'list', component: LocalitiesListComponent },
  { path: 'create', component: LocalitiesCreateComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class LocalitiesRoutingModule { }
