import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UsersRoutingModule } from './users-routing.module';
import { LoginFenixComponent } from './login-fenix/login-fenix.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CreateUsersFenixComponent } from './create-users-fenix/create-users-fenix.component';
import { ListUsersFenixComponent } from './list-users-fenix/list-users-fenix.component';
import { MatPaginatorModule } from '@angular/material/paginator';
import { EditUsersFenixComponent } from './edit-users-fenix/edit-users-fenix.component';
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
    LoginFenixComponent,
    CreateUsersFenixComponent,
    ListUsersFenixComponent,
    EditUsersFenixComponent
  ],
  imports: [
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
    CommonModule,
    UsersRoutingModule,
    SharedModule,
    ReactiveFormsModule,
    FormsModule,
    MatPaginatorModule
  ]
})
export class UsersModule { }
