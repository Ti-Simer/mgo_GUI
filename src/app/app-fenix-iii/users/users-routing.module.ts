import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginFenixComponent } from './login-fenix/login-fenix.component';
import { CreateUsersFenixComponent } from './create-users-fenix/create-users-fenix.component';
import { ListUsersFenixComponent } from './list-users-fenix/list-users-fenix.component';
import { EditUsersFenixComponent } from './edit-users-fenix/edit-users-fenix.component';

const routes: Routes = [
  { path: 'login-fenix', component: LoginFenixComponent, },
  { path: 'create-user-fenix', component: CreateUsersFenixComponent, },
  { path: 'list-user-fenix', component: ListUsersFenixComponent, },
  { path: 'edit-user-fenix/:id', component: EditUsersFenixComponent, },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UsersRoutingModule { }
