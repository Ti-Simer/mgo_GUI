import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ClientsRoutingModule } from './clients-routing.module';
import { ClientsListComponent } from './clients-list/clients-list.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ClientsCreateComponent } from './clients-create/clients-create.component';
import { ClientsEditComponent } from './clients-edit/clients-edit.component';
import { MatPaginatorModule } from '@angular/material/paginator';
import { SharedModule } from 'src/app/shared/shared.module';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { DialogCreateClientsComponent } from './dialog-create-clients/dialog-create-clients.component';
import { DialogEditClientsComponent } from './dialog-edit-clients/dialog-edit-clients.component';
import { DialogImportClientsComponent } from './dialog-import-clients/dialog-import-clients.component';
import { ClientsImportComponent } from './clients-import/clients-import.component';

import {
  LucideAngularModule,
  SquareUserRound,
  ArrowBigLeftDash,
  ArrowBigRightDash,
  Sheet,
  PlusCircle,
  FileDown,
  HelpCircle,
  Search,
  LucideUploadCloud
} from 'lucide-angular';

// Factory function for TranslateHttpLoader
export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http);
}

@NgModule({
  declarations: [
    ClientsListComponent,
    ClientsCreateComponent,
    ClientsEditComponent,
    ClientsImportComponent,
    DialogCreateClientsComponent,
    DialogEditClientsComponent,
    DialogImportClientsComponent
  ],
  imports: [
    CommonModule,
    ClientsRoutingModule,
    ReactiveFormsModule,
    FormsModule,
    SharedModule,
    MatPaginatorModule,
    LucideAngularModule.pick({
      SquareUserRound,
      ArrowBigLeftDash,
      ArrowBigRightDash,
      Sheet,
      PlusCircle,
      FileDown,
      HelpCircle,
      Search,
      LucideUploadCloud
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
export class ClientsModule { }
