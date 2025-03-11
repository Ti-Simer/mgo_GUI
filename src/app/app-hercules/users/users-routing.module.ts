import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from 'src/app/guards/auth.guard';
import { LoginHerculesComponent } from './login-hercules/login-hercules.component';
import { UsersListComponent } from './users-list/users-list.component';

const routes: Routes = [
  { path: 'login-hercules', component: LoginHerculesComponent, },
  { path: 'list', component: UsersListComponent, canActivate: [AuthGuard] },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UsersRoutingModule { }
