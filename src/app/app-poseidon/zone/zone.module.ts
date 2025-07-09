import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ZoneRoutingModule } from './zone-routing.module';
import { ZoneListComponent } from './zone-list/zone-list.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ZoneCreateComponent } from './zone-create/zone-create.component';
import { ZoneEditComponent } from './zone-edit/zone-edit.component';
import { MatPaginatorModule } from '@angular/material/paginator';
import { SharedModule } from 'src/app/shared/shared.module';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import {
  LucideAngularModule,
  MapPin,
  ArrowBigLeftDash,
  ArrowBigRightDash
} from 'lucide-angular';
import { DialogCreateZoneComponent } from './dialog-create-zone/dialog-create-zone.component';
import { DialogEditZoneComponent } from './dialog-edit-zone/dialog-edit-zone.component';

// Factory function for TranslateHttpLoader
export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http);
}

@NgModule({
  declarations: [
    ZoneListComponent,
    ZoneCreateComponent,
    ZoneEditComponent,
    DialogCreateZoneComponent,
    DialogEditZoneComponent
  ],
  imports: [
    CommonModule,
    ZoneRoutingModule,
    ReactiveFormsModule,
    FormsModule,
    SharedModule,
    MatPaginatorModule,
    LucideAngularModule.pick({
      MapPin,
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
export class ZoneModule { }
