import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeHerculesComponent } from './home-hercules.component';

const routes: Routes = [
  { path: '', component: HomeHerculesComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class HomeHerculesRoutingModule { }
