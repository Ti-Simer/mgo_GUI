import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AppFenixIIIRoutingModule } from './app-fenix-iii-routing.module';
import { SharedModule } from '../shared/shared.module';
import { HomeFenixComponent } from './home-fenix/home-fenix.component';

@NgModule({
  declarations: [
    HomeFenixComponent
  ],
  imports: [
    CommonModule,
    AppFenixIIIRoutingModule,
    SharedModule
  ]
})
export class AppFenixIIIModule { }
