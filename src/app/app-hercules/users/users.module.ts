import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms'; // Asegúrate de importar FormsModule
import { UsersRoutingModule } from './users-routing.module';
import { LoginHerculesComponent } from './login-hercules/login-hercules.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import {
  LucideAngularModule,
  Users,
  ArrowBigLeftDash,
  ArrowBigRightDash,
  Eye,
  EyeOff,
  BadgeX
} from 'lucide-angular';
import { UsersListComponent } from './users-list/users-list.component';
import { MatPaginatorModule } from '@angular/material/paginator';
import { DialogEditUsersComponent } from './dialog-edit-users/dialog-edit-users.component';
import { DialogCreateUsersComponent } from './dialog-create-users/dialog-create-users.component';
import { UsersCreateComponent } from './users-create/users-create.component';
import { UsersEditComponent } from './users-edit/users-edit.component';

// Factory function for TranslateHttpLoader
export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http);
}

@NgModule({
  declarations: [
    LoginHerculesComponent,
    UsersListComponent,
    DialogEditUsersComponent,
    DialogCreateUsersComponent,
    UsersCreateComponent,
    UsersEditComponent
  ],
  imports: [
    CommonModule,
    UsersRoutingModule,
    SharedModule,
    FormsModule,
    ReactiveFormsModule,
    MatPaginatorModule,
    LucideAngularModule.pick({
      Users,
      ArrowBigLeftDash,
      ArrowBigRightDash,
      Eye,
      EyeOff,
      BadgeX
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
export class UsersModule { }
