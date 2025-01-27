import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BillCreateComponent } from './bill-create/bill-create.component';
import { AuthGuard } from 'src/app/guards/auth.guard';

const routes: Routes = [
  { path: 'create', component: BillCreateComponent, canActivate: [AuthGuard] },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class BillRoutingModule { }
