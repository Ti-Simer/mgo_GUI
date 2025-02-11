import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CityRoutingModule } from './city-routing.module';
import { ReactiveFormsModule } from '@angular/forms';
import { CityListComponent } from './city-list/city-list.component';
import { CityCreateComponent } from './city-create/city-create.component';
import { CityEditComponent } from './city-edit/city-edit.component';
import { MatPaginatorModule } from '@angular/material/paginator';
import { GoogleMapsModule } from '@angular/google-maps';
import { SharedModule } from 'src/app/shared/shared.module';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { DialogCreateCityComponent } from './dialog-create-city/dialog-create-city.component';
import { DialogEditCityComponent } from './dialog-edit-city/dialog-edit-city.component';

import {
  LucideAngularModule,
  Pin,
  ArrowBigLeftDash,
  ArrowBigRightDash
} from 'lucide-angular';


// Factory function for TranslateHttpLoader
export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http);
}

@NgModule({
  declarations: [
    CityListComponent,
    CityCreateComponent,
    CityEditComponent,
    DialogCreateCityComponent,
    DialogEditCityComponent
  ],
  imports: [
    CommonModule,
    CityRoutingModule,
    ReactiveFormsModule,
    SharedModule,
    MatPaginatorModule,
    GoogleMapsModule,
    LucideAngularModule.pick({
      Pin,
      ArrowBigLeftDash,
      ArrowBigRightDash
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
export class CityModule { }
