import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeHerculesComponent } from './home-hercules.component';
import { AuthGuard } from 'src/app/guards/auth.guard';

const routes: Routes = [
  { path: '', component: HomeHerculesComponent, canActivate: [AuthGuard] },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class HomeHerculesRoutingModule { }
