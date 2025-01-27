import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeAtheneaComponent } from './home-athenea/home-athenea.component';

const routes: Routes = [
  { path: '', component: HomeAtheneaComponent },
  { path: 'users', loadChildren: () => import('./users/users.module').then(m => m.UsersModule) },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AppAtheneaRoutingModule { }
