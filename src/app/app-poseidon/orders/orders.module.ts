import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { OrdersRoutingModule } from './orders-routing.module';
import { OrdersListComponent } from './orders-list/orders-list.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { MatPaginatorModule } from '@angular/material/paginator';
import { OrdersCreateComponent } from './orders-create/orders-create.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { OrdersReasignComponent } from './orders-reasign/orders-reasign.component';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { DialogViewOrdersComponent } from './dialog-view-orders/dialog-view-orders.component';
import { OrdersViewComponent } from './orders-view/orders-view.component';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatInputModule } from '@angular/material/input';
import { DialogCreateOrdersComponent } from './dialog-create-orders/dialog-create-orders.component';
import { DialogReasignOrdersComponent } from './dialog-reasign-orders/dialog-reasign-orders.component';
import { DialogListOrdersComponent } from './dialog-list-orders/dialog-list-orders.component';
import { OrdersListCourseComponent } from './orders-list-course/orders-list-course.component';
import {
  LucideAngularModule,
  ScrollText,
  ArrowBigLeftDash,
  ArrowBigRightDash
} from 'lucide-angular';

// Factory function for TranslateHttpLoader
export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http);
}

@NgModule({
  declarations: [
    OrdersListComponent,
    OrdersCreateComponent,
    OrdersReasignComponent,
    DialogViewOrdersComponent,
    OrdersViewComponent,
    DialogCreateOrdersComponent,
    DialogReasignOrdersComponent,
    DialogListOrdersComponent,
    OrdersListCourseComponent,
  ],
  imports: [
    CommonModule,
    OrdersRoutingModule,
    SharedModule,
    MatPaginatorModule,
    ReactiveFormsModule,
    FormsModule,
    DragDropModule,
    MatAutocompleteModule,
    MatInputModule,
    LucideAngularModule.pick({
      ScrollText,
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
export class OrdersModule { }
