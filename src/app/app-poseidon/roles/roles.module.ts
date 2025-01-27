import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { RolesRoutingModule } from './roles-routing.module';
import { RolesCreateComponent } from './roles-create/roles-create.component';
import { RolesListComponent } from './roles-list/roles-list.component';
import { ReactiveFormsModule } from '@angular/forms';
import { RolesEditComponent } from './roles-edit/roles-edit.component';
import { MatPaginatorModule } from '@angular/material/paginator';
import { SharedModule } from 'src/app/shared/shared.module';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import {
  LucideAngularModule,
  Contact,
  ArrowBigLeftDash,
  ArrowBigRightDash
} from 'lucide-angular';
import { DialogCreateRolesComponent } from './dialog-create-roles/dialog-create-roles.component';
import { DialogEditRolesComponent } from './dialog-edit-roles/dialog-edit-roles.component';

// Factory function for TranslateHttpLoader
export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http);
}

@NgModule({
  declarations: [
    RolesCreateComponent,
    RolesListComponent,
    RolesEditComponent,
    DialogCreateRolesComponent,
    DialogEditRolesComponent
  ],
  imports: [
    CommonModule,
    RolesRoutingModule,
    SharedModule,
    ReactiveFormsModule,
    MatPaginatorModule,
    LucideAngularModule.pick({
      Contact,
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
export class RolesModule { }
