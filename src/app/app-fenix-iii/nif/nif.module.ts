import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { NifRoutingModule } from './nif-routing.module';
import { ImportNifsComponent } from './import-nifs/import-nifs.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { MatPaginatorModule } from '@angular/material/paginator';
import { SearchNifComponent } from './search-nif/search-nif.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';


@NgModule({
  declarations: [
    ImportNifsComponent,
    SearchNifComponent
  ],
  imports: [
    CommonModule,
    NifRoutingModule,
    SharedModule,
    MatPaginatorModule,
    ReactiveFormsModule,
    FormsModule,
  ]
})
export class NifModule { }
