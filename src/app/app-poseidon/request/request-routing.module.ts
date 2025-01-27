import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RequestListComponent } from './request-list/request-list.component';
import { AuthGuard } from 'src/app/guards/auth.guard';
import { RequestViewComponent } from './request-view/request-view.component';

const routes: Routes = [
  { path: 'list', component: RequestListComponent, canActivate: [AuthGuard] },
  { path: 'view/:id', component: RequestViewComponent, canActivate: [AuthGuard] },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class RequestRoutingModule { }
