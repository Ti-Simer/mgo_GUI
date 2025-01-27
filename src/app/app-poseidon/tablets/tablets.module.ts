import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TabletsRoutingModule } from './tablets-routing.module';
import { TabletsListComponent } from './tablets-list/tablets-list.component';
import { ReactiveFormsModule } from '@angular/forms';
import { MatPaginatorModule } from '@angular/material/paginator';
import { TabletsCreateComponent } from './tablets-create/tablets-create.component';
import { TabletsEditComponent } from './tablets-edit/tablets-edit.component';
import { TabletsViewComponent } from './tablets-view/tablets-view.component';
import { GoogleMapsModule } from '@angular/google-maps';
import { SharedModule } from 'src/app/shared/shared.module';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import {
  LucideAngularModule,
  Tablet,
  ArrowBigLeftDash,
  ArrowBigRightDash
} from 'lucide-angular';
import { DialogCreateTabletsComponent } from './dialog-create-tablets/dialog-create-tablets.component';
import { DialogEditTabletsComponent } from './dialog-edit-tablets/dialog-edit-tablets.component';

// Factory function for TranslateHttpLoader
export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http);
}

@NgModule({
  declarations: [
    TabletsListComponent,
    TabletsCreateComponent,
    TabletsEditComponent,
    TabletsViewComponent,
    DialogCreateTabletsComponent,
    DialogEditTabletsComponent
  ],
  imports: [
    CommonModule,
    TabletsRoutingModule,
    SharedModule,
    ReactiveFormsModule,
    MatPaginatorModule,
    GoogleMapsModule,
    LucideAngularModule.pick({
      Tablet,
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
export class TabletsModule { }
