import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { OccupationsRoutingModule } from './occupations-routing.module';
import { OccupationsListComponent } from './occupations-list/occupations-list.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { OccupationsCreateComponent } from './occupations-create/occupations-create.component';
import { OccupationsEditComponent } from './occupations-edit/occupations-edit.component';
import { MatPaginatorModule } from '@angular/material/paginator';
import { SharedModule } from 'src/app/shared/shared.module';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';

import {
  LucideAngularModule,
  UserCheck,
  ArrowBigLeftDash,
  ArrowBigRightDash
} from 'lucide-angular';
import { DialogCreateOcupationsComponent } from './dialog-create-ocupations/dialog-create-ocupations.component';
import { DialogEditOccupationsComponent } from './dialog-edit-occupations/dialog-edit-occupations.component';

// Factory function for TranslateHttpLoader
export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http);
}

@NgModule({
  declarations: [
    OccupationsListComponent,
    OccupationsCreateComponent,
    OccupationsEditComponent,
    DialogCreateOcupationsComponent,
    DialogEditOccupationsComponent,
  ],
  imports: [
    CommonModule,
    OccupationsRoutingModule,
    ReactiveFormsModule,
    FormsModule,
    SharedModule,
    MatPaginatorModule,
    LucideAngularModule.pick({
      UserCheck,
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
export class OccupationsModule { }
