import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { StationaryTankRoutingModule } from './stationary-tank-routing.module';
import { StationaryTankCreateComponent } from './stationary-tank-create/stationary-tank-create.component';
import { StationaryTankEditComponent } from './stationary-tank-edit/stationary-tank-edit.component';
import { StationaryTankListComponent } from './stationary-tank-list/stationary-tank-list.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatPaginatorModule } from '@angular/material/paginator';
import { SharedModule } from 'src/app/shared/shared.module';
import { StationaryTankImportComponent } from './stationary-tank-import/stationary-tank-import.component';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import {
  LucideAngularModule,
  Cylinder,
  ArrowBigLeftDash,
  ArrowBigRightDash,
  Sheet,
  PlusCircle,
  FileDown,
  HelpCircle
} from 'lucide-angular';
import { DialogCreateStationaryTankComponent } from './dialog-create-stationary-tank/dialog-create-stationary-tank.component';
import { DialogEditStationaryTankComponent } from './dialog-edit-stationary-tank/dialog-edit-stationary-tank.component';
import { DialogImportStationaryTankComponent } from './dialog-import-stationary-tank/dialog-import-stationary-tank.component';

// Factory function for TranslateHttpLoader
export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http);
}

@NgModule({
  declarations: [
    StationaryTankCreateComponent,
    StationaryTankEditComponent,
    StationaryTankListComponent,
    StationaryTankImportComponent,
    DialogCreateStationaryTankComponent,
    DialogEditStationaryTankComponent,
    DialogImportStationaryTankComponent
  ],
  imports: [
    CommonModule,
    StationaryTankRoutingModule,
    SharedModule,
    ReactiveFormsModule,
    FormsModule,
    MatPaginatorModule,
    LucideAngularModule.pick({
      Cylinder,
      ArrowBigLeftDash,
      ArrowBigRightDash,
      Sheet,
      PlusCircle,
      FileDown,
      HelpCircle
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
export class StationaryTankModule { }
