import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RequestRoutingModule } from './request-routing.module';
import { SharedModule } from 'src/app/shared/shared.module';
import { RequestListComponent } from './request-list/request-list.component';
import { MatPaginatorModule } from '@angular/material/paginator';
import { RequestViewComponent } from './request-view/request-view.component';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { RequestStore } from './request-list/request.store';
import {
  LucideAngularModule,
  PackageCheck,
  ArrowBigLeftDash,
  ArrowBigRightDash,
  Sheet,
  Search,
  HelpCircle,
  RotateCw
} from 'lucide-angular';
import { ReactiveFormsModule } from '@angular/forms';

// Factory function for TranslateHttpLoader
export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http);
}

@NgModule({
  declarations: [
    RequestListComponent,
    RequestViewComponent
  ],
  imports: [
    CommonModule,
    RequestRoutingModule,
    SharedModule,
    MatPaginatorModule,
    ReactiveFormsModule,
    LucideAngularModule.pick({
      PackageCheck,
      ArrowBigLeftDash,
      ArrowBigRightDash,
      Sheet,
      Search,
      HelpCircle,
      RotateCw
    }),
    TranslateModule.forChild({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient]
      }
    }),
  ],
  providers: [RequestStore],
})
export class RequestModule { }
