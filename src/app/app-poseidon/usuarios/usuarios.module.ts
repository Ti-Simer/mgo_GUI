import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { UsuariosRoutingModule } from './usuarios-routing.module';
import { ReactiveFormsModule } from '@angular/forms';
import { LoginComponent } from './login/login.component';
import { CreateUserComponent } from './create-user/create-user.component';
import { ListUserComponent } from './list-user/list-user.component';
import { EditUserComponent } from './edit-user/edit-user.component';
import { FormsModule } from '@angular/forms'; // Asegúrate de importar FormsModule
import { MatPaginatorModule } from '@angular/material/paginator';
import { ProfileComponent } from './profile/profile.component';
import { ViewUserComponent } from './view-user/view-user.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { UsuarioService } from 'src/app/services/poseidon-services/usuario.service';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { DialogEditUserComponent } from './dialog-edit-user/dialog-edit-user.component';
import { DialogCreateUserComponent } from './dialog-create-user/dialog-create-user.component';
import {
  LucideAngularModule,
  Users,
  ArrowBigLeftDash,
  ArrowBigRightDash,
  Eye,
  EyeOff,
  BadgeX
} from 'lucide-angular';
import { DialogViewUserComponent } from './dialog-view-user/dialog-view-user.component';

// Factory function for TranslateHttpLoader
export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http);
}

@NgModule({
  declarations: [
    LoginComponent,
    CreateUserComponent,
    ListUserComponent,
    EditUserComponent,
    ProfileComponent,
    ViewUserComponent,
    DialogEditUserComponent,
    DialogCreateUserComponent,
    DialogViewUserComponent,
  ],
  imports: [
    CommonModule,
    UsuariosRoutingModule,
    SharedModule,
    ReactiveFormsModule,
    HttpClientModule,
    FormsModule,
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
  ],
  providers: [UsuarioService]
})
export class UsuariosModule { }
