import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ImportNifsComponent } from './import-nifs/import-nifs.component';
import { SearchNifComponent } from './search-nif/search-nif.component';

const routes: Routes = [
  { path: 'import', component: ImportNifsComponent, },
  { path: 'search', component: SearchNifComponent, },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class NifRoutingModule { }
