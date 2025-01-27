import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AppHerculesRoutingModule } from './app-hercules-routing.module';
import { SharedModule } from '../shared/shared.module';
import { MatNativeDateModule } from '@angular/material/core';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatTreeModule } from '@angular/material/tree';
import { MatButtonModule } from '@angular/material/button';

import {
  LucideAngularModule,
  Map,
  MapPin,
  Building2,
  SignalHigh,
  SignalMedium,
  SignalLow,
  Signal,
  SignalZero,
  Tally1,
  Tally2,
  Tally3,
  Tally4,
} from 'lucide-angular';

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    AppHerculesRoutingModule,
    SharedModule,
    MatNativeDateModule,
    MatSidenavModule,
    MatToolbarModule,
    MatIconModule,
    MatListModule,
    MatTreeModule,
    MatButtonModule,
    LucideAngularModule.pick({
      Map,
      MapPin,
      Building2,
      SignalHigh,
      SignalMedium,
      SignalLow,
      Signal,
      SignalZero,
      Tally1,
      Tally2,
      Tally3,
      Tally4,
    }),
  ]
})
export class AppHerculesModule { }
