import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeFenixComponent } from './home-fenix/home-fenix.component';

const routes: Routes = [
  { path: '', loadChildren: () => import('./home-fenix/home-fenix.module').then(m => m.HomeFenixModule) },
  { path: 'users', loadChildren: () => import('./users/users.module').then(m => m.UsersModule) },
  { path: 'nif', loadChildren: () => import('./nif/nif.module').then(m => m.NifModule) },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AppFenixIIIRoutingModule { }
