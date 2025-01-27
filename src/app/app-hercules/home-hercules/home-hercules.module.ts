import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HomeHerculesRoutingModule } from './home-hercules-routing.module';
import { HomeHerculesComponent } from './home-hercules.component';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
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
  SignalZero
} from 'lucide-angular';
import { SharedModule } from 'src/app/shared/shared.module';
import { ResumeDataComponent } from './resume-data/resume-data.component';
import { DialogResumeDataComponent } from './dialog-resume-data/dialog-resume-data.component';
import { NgApexchartsModule } from 'ng-apexcharts';
import { ReactiveFormsModule } from '@angular/forms';

// Factory function for TranslateHttpLoader
export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http);
}

@NgModule({
  declarations: [
    HomeHerculesComponent,
    ResumeDataComponent,
    DialogResumeDataComponent
  ],
  imports: [
    CommonModule,
    HomeHerculesRoutingModule,
    MatNativeDateModule,
    MatSidenavModule,
    MatToolbarModule,
    MatIconModule,
    MatListModule,
    MatTreeModule,
    MatButtonModule,
    SharedModule,
    NgApexchartsModule,
    ReactiveFormsModule,
    LucideAngularModule.pick({
      Map,
      MapPin,
      Building2,
      SignalHigh,
      SignalMedium,
      SignalLow,
      SignalZero
    }),
    TranslateModule.forChild({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient]
      }
    }),
  ]
})
export class HomeHerculesModule { }
