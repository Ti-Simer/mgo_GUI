import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CoursesRoutingModule } from './courses-routing.module';
import { CoursesOperatorComponent } from './courses-operator/courses-operator.component';
import { CoursesAdminComponent } from './courses-admin/courses-admin.component';
import { CoursesCreateComponent } from './courses-create/courses-create.component';
import { ReactiveFormsModule } from '@angular/forms';
import { DatePipe } from '@angular/common';
import { CoursesViewComponent } from './courses-view/courses-view.component';
import { GoogleMapsModule } from '@angular/google-maps';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatCardModule } from '@angular/material/card';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatPaginatorModule } from '@angular/material/paginator';
import { SharedModule } from 'src/app/shared/shared.module';
import { CoursesEditComponent } from './courses-edit/courses-edit.component';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { MatFormFieldModule } from '@angular/material/form-field';
import { NgxMaterialTimepickerModule } from 'ngx-material-timepicker';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatInputModule } from '@angular/material/input';
import { DialogCreateCoursesComponent } from './dialog-create-courses/dialog-create-courses.component';
import { MatAutocompleteModule } from '@angular/material/autocomplete';

import {
  LucideAngularModule,
  MapPinned,
  ArrowBigLeftDash,
  ArrowBigRightDash,
  MapPin
} from 'lucide-angular';
import { DialogEditCoursesComponent } from './dialog-edit-courses/dialog-edit-courses.component';
import { DialogViewCoursesComponent } from './dialog-view-courses/dialog-view-courses.component';

// Factory function for TranslateHttpLoader
export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http);
}

@NgModule({
  declarations: [
    CoursesOperatorComponent,
    CoursesAdminComponent,
    CoursesCreateComponent,
    CoursesViewComponent,
    CoursesEditComponent,
    DialogCreateCoursesComponent,
    DialogEditCoursesComponent,
    DialogViewCoursesComponent
  ],
  imports: [
    CommonModule,
    CoursesRoutingModule,
    SharedModule,
    ReactiveFormsModule,
    GoogleMapsModule,
    MatSlideToggleModule,
    MatCardModule,
    MatExpansionModule,
    MatPaginatorModule,
    DragDropModule,
    MatFormFieldModule,
    NgxMaterialTimepickerModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatInputModule,
    MatAutocompleteModule,
    LucideAngularModule.pick({
      MapPinned,
      ArrowBigLeftDash,
      ArrowBigRightDash,
      MapPin 
    }),
    TranslateModule.forChild({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient]
      }
    }),
  ],
  providers: [
    DatePipe
  ],
})
export class CoursesModule { }
