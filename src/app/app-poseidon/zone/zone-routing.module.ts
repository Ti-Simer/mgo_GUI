import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ZoneListComponent } from './zone-list/zone-list.component';
import { ZoneCreateComponent } from './zone-create/zone-create.component';
import { ZoneEditComponent } from './zone-edit/zone-edit.component';
import { AuthGuard } from 'src/app/guards/auth.guard';

const routes: Routes = [
  { path: 'list', component: ZoneListComponent, canActivate: [AuthGuard] },
  { path: 'create', component: ZoneCreateComponent, canActivate: [AuthGuard] },
  { path: 'edit/:id', component: ZoneEditComponent, canActivate: [AuthGuard] },

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ZoneRoutingModule { }
