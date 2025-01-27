import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BillRoutingModule } from './bill-routing.module';
import { BillCreateComponent } from './bill-create/bill-create.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import {
  LucideAngularModule,
  Users,
  ArrowBigLeftDash,
  ArrowBigRightDash,
  Eye,
  EyeOff
} from 'lucide-angular';

// Factory function for TranslateHttpLoader
export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http);
}


@NgModule({
  declarations: [
    BillCreateComponent
  ],
  imports: [
    CommonModule,
    BillRoutingModule,
    SharedModule,
    FormsModule,
    ReactiveFormsModule,
    LucideAngularModule.pick({
      Users,
      ArrowBigLeftDash,
      ArrowBigRightDash,
      Eye,
      EyeOff
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
export class BillModule { }
