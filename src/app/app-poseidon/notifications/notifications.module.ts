import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NotificationsRoutingModule } from './notifications-routing.module';
import { NotificationsListComponent } from './notifications-list/notifications-list.component';
import { NotificationsDetailsComponent } from './notifications-details/notifications-details.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { MatPaginatorModule } from '@angular/material/paginator';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';

// Factory function for TranslateHttpLoader
export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http);
}

import {
  LucideAngularModule,
  Bell,
  Search,
  ArrowBigLeftDash,
  ArrowBigRightDash
} from 'lucide-angular';
import { FormsModule } from '@angular/forms';

@NgModule({
  declarations: [
    NotificationsListComponent,
    NotificationsDetailsComponent,
  ],
  imports: [
    CommonModule,
    NotificationsRoutingModule,
    SharedModule,
    FormsModule,
    MatPaginatorModule,
    LucideAngularModule.pick({
      Bell,
      Search,
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
  ],

})
export class NotificationsModule { }
