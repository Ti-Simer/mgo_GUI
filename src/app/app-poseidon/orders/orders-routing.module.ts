import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { OrdersListComponent } from './orders-list/orders-list.component';
import { AuthGuard } from 'src/app/guards/auth.guard';
import { OrdersCreateComponent } from './orders-create/orders-create.component';
import { OrdersReasignComponent } from './orders-reasign/orders-reasign.component';

const routes: Routes = [
  { path: 'list', component: OrdersListComponent, canActivate: [AuthGuard] },
  { path: 'create', component: OrdersCreateComponent, canActivate: [AuthGuard] },
  { path: 'reasign', component: OrdersReasignComponent, canActivate: [AuthGuard] },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class OrdersRoutingModule { }
