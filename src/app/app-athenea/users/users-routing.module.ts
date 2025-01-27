import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginAtheneaComponent } from './login-athenea/login-athenea.component';

const routes: Routes = [
  { path: 'login-athenea', component: LoginAtheneaComponent, },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UsersRoutingModule { }
