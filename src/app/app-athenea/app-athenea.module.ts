import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AppAtheneaRoutingModule } from './app-athenea-routing.module';
import { HomeAtheneaComponent } from './home-athenea/home-athenea.component';
import { SharedModule } from '../shared/shared.module';


@NgModule({
  declarations: [
    HomeAtheneaComponent
  ],
  imports: [
    CommonModule,
    AppAtheneaRoutingModule,
    SharedModule
  ]
})
export class AppAtheneaModule { }
