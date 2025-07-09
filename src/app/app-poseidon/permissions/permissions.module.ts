import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PermissionsRoutingModule } from './permissions-routing.module';
import { PermissionsListComponent } from './permissions-list/permissions-list.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { PermissionsCreateComponent } from './permissions-create/permissions-create.component';
import { PermissionsEditComponent } from './permissions-edit/permissions-edit.component';
import { MatPaginatorModule } from '@angular/material/paginator';
import { SharedModule } from 'src/app/shared/shared.module';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import {
  LucideAngularModule,
  ListTodo,
  ArrowBigLeftDash
} from 'lucide-angular';

// Factory function for TranslateHttpLoader
export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http);
}

@NgModule({
  declarations: [
    PermissionsListComponent,
    PermissionsCreateComponent,
    PermissionsEditComponent,
  ],
  imports: [
    CommonModule,
    PermissionsRoutingModule,
    SharedModule,
    ReactiveFormsModule,
    MatPaginatorModule,
    FormsModule,
    LucideAngularModule.pick({
      ListTodo,
      ArrowBigLeftDash
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
export class PermissionsModule { }
