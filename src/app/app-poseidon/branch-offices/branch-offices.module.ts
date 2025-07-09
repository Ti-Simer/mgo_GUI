import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GoogleMapsModule } from '@angular/google-maps';

import { BranchOfficesRoutingModule } from './branch-offices-routing.module';
import { BranchOfficesListComponent } from './branch-offices-list/branch-offices-list.component';
import { BranchOfficesCreateComponent } from './branch-offices-create/branch-offices-create.component';
import { ReactiveFormsModule } from '@angular/forms';
import { BranchOfficesEditComponent } from './branch-offices-edit/branch-offices-edit.component';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatCardModule } from '@angular/material/card';
import { NgStyle } from '@angular/common';
import { BranchOfficesImportComponent } from './branch-offices-import/branch-offices-import.component';
import { MatPaginatorModule } from '@angular/material/paginator';
import { FormsModule } from '@angular/forms';
import { SharedModule } from 'src/app/shared/shared.module';
import { HttpClient } from '@angular/common/http';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';

import {
  LucideAngularModule,
  Building2,
  ArrowBigLeftDash,
  ArrowBigRightDash,
  Sheet,
  PlusCircle,
  HelpCircle,
  FileDown,
  Search
} from 'lucide-angular';
import { DialogCreateBranchOfficeComponent } from './dialog-create-branch-office/dialog-create-branch-office.component';
import { DialogEditBranchOfficeComponent } from './dialog-edit-branch-office/dialog-edit-branch-office.component';

// Factory function for TranslateHttpLoader
export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http);
}

@NgModule({
  declarations: [
    BranchOfficesListComponent,
    BranchOfficesCreateComponent,
    BranchOfficesEditComponent,
    BranchOfficesImportComponent,
    DialogCreateBranchOfficeComponent,
    DialogEditBranchOfficeComponent,
  ],
  imports: [
    CommonModule,
    BranchOfficesRoutingModule,
    SharedModule,
    ReactiveFormsModule,
    GoogleMapsModule,
    MatSlideToggleModule,
    MatCardModule,
    NgStyle,
    MatPaginatorModule,
    FormsModule,
    LucideAngularModule.pick({
      Building2,
      ArrowBigLeftDash,
      ArrowBigRightDash,
      Sheet,
      PlusCircle,
      HelpCircle,
      FileDown,
      Search
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
export class BranchOfficesModule { }
