import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginHerculesComponent } from './login-hercules/login-hercules.component';

const routes: Routes = [
  { path: 'login-hercules', component: LoginHerculesComponent, },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UsersRoutingModule { }
