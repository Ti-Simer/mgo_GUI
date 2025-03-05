import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeHerculesComponent } from './home-hercules/home-hercules.component';
import { AuthGuard } from '../guards/auth.guard';

const routes: Routes = [
  { path: 'home', component: HomeHerculesComponent, canActivate: [AuthGuard] },

  { path: '', loadChildren: () => import('./home-hercules/home-hercules.module').then(m => m.HomeHerculesModule) },
  { path: 'users', loadChildren: () => import('./users/users.module').then(m => m.UsersModule) },
  { path: 'localities', loadChildren: () => import('./localities/localities.module').then(m => m.LocalitiesModule) },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AppHerculesRoutingModule { }
