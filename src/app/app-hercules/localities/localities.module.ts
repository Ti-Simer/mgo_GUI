import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LocalitiesRoutingModule } from './localities-routing.module';
import { LocalitiesListComponent } from './localities-list/localities-list.component';
import { MatPaginatorModule } from '@angular/material/paginator';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { SharedModule } from 'src/app/shared/shared.module';
import { LocalitiesCreateComponent } from './localities-create/localities-create.component';
import { DialogCreateLocalitiesComponent } from './dialog-create-localities/dialog-create-localities.component';
import { ReactiveFormsModule } from '@angular/forms';
import {
  LucideAngularModule,
  Factory
} from 'lucide-angular';

// Factory function for TranslateHttpLoader
export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http);
}

@NgModule({
  declarations: [
    LocalitiesListComponent,
    LocalitiesCreateComponent,
    DialogCreateLocalitiesComponent
  ],
  imports: [
    CommonModule,
    LocalitiesRoutingModule,
    SharedModule,
    MatPaginatorModule,
    ReactiveFormsModule,
    LucideAngularModule.pick({
      Factory
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
export class LocalitiesModule { }
