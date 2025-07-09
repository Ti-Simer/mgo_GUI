import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PropaneTruckRoutingModule } from './propane-truck-routing.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { PropaneTruckListComponent } from './propane-truck-list/propane-truck-list.component';
import { PropaneTruckCreateComponent } from './propane-truck-create/propane-truck-create.component';
import { PropaneTruckEditComponent } from './propane-truck-edit/propane-truck-edit.component';
import { MatPaginatorModule } from '@angular/material/paginator';
import { SharedModule } from 'src/app/shared/shared.module';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import {
  LucideAngularModule,
  Truck,
  ArrowBigLeftDash,
  ArrowBigRightDash
} from 'lucide-angular';
import { DialogCreatePropaneTruckComponent } from './dialog-create-propane-truck/dialog-create-propane-truck.component';
import { DialogEditPropaneTruckComponent } from './dialog-edit-propane-truck/dialog-edit-propane-truck.component';

// Factory function for TranslateHttpLoader
export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http);
}
@NgModule({
  declarations: [
    PropaneTruckListComponent,
    PropaneTruckCreateComponent,
    PropaneTruckEditComponent,
    DialogCreatePropaneTruckComponent,
    DialogEditPropaneTruckComponent
  ],
  imports: [
    CommonModule,
    PropaneTruckRoutingModule,
    SharedModule,
    ReactiveFormsModule,
    FormsModule,
    MatPaginatorModule,
    LucideAngularModule.pick({
      Truck,
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
export class PropaneTruckModule { }
