import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { NotificationsListComponent } from './notifications-list/notifications-list.component';
import { NotificationsDetailsComponent } from './notifications-details/notifications-details.component';
import { AuthGuard } from 'src/app/guards/auth.guard';

const routes: Routes = [
  { path: 'list', component: NotificationsListComponent, canActivate: [AuthGuard] },
  { path: 'view/:id', component: NotificationsDetailsComponent, canActivate: [AuthGuard] },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class NotificationsRoutingModule { }
