import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UsersRoutingModule } from './users-routing.module';
import { LoginFenixComponent } from './login-fenix/login-fenix.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CreateUsersFenixComponent } from './create-users-fenix/create-users-fenix.component';
import { ListUsersFenixComponent } from './list-users-fenix/list-users-fenix.component';
import { MatPaginatorModule } from '@angular/material/paginator';
import {
  LucideAngularModule,
  Users,
  ArrowBigLeftDash,
  ArrowBigRightDash,
  Eye,
  EyeOff 
} from 'lucide-angular';
import { EditUsersFenixComponent } from './edit-users-fenix/edit-users-fenix.component';

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
    CommonModule,
    UsersRoutingModule,
    SharedModule,
    ReactiveFormsModule,
    FormsModule,
    MatPaginatorModule
  ]
})
export class UsersModule { }
