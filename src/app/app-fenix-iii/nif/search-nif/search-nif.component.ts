import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { NifService } from 'src/app/services/fenix-services/nif.service';

@Component({
  selector: 'app-search-nif',
  templateUrl: './search-nif.component.html',
  styleUrls: ['./search-nif.component.scss']
})
export class SearchNifComponent {

  nif: any;
  nifForm: FormGroup;

  constructor(
    private nifService: NifService,
    private router: Router,
    private toastr: ToastrService,
    private formBuilder: FormBuilder
  ) {
    this.nifForm = this.formBuilder.group({
      searchNif: ['', Validators.required],
      nif: ['', Validators.required],
      category: ['', Validators.required],
      tara: ['', Validators.required],
      fecha_mtto: ['', Validators.required],
    });
  }

  ngOnInit(): void {

  }

  searchNif() {
    this.nifService.findOne(this.nifForm.value.searchNif).subscribe(
      response => {        
        if (response.statusCode == 200) {
          this.nif = response.data;
          this.toastr.success('NIF encontrado!');

          this.nifForm.patchValue({
            nif: this.nif.nif,
            category: this.nif.category,
            tara: this.nif.tara,
            fecha_mtto: this.nif.fecha_mtto
          });
          
        } else {
          this.toastr.error('NIF no encontrado!');
        }
      }
    )
  }

  onSubmit() {
    if (this.nifForm.valid) {
      this.nifService.update(this.nif.id, this.nifForm.value).subscribe(
        response => {
          if (response.statusCode == 200) {
            this.toastr.success(`NIF ${response.data.nif} se actualizo satisfactoriamente`);
            this.toImportNifs();
          } else {
            this.toastr.warning('Ha ocurrido un problema al actualizar el NIF', response.message);
          }
        }, (error) => {
          console.log("Ha ocurrido un error al actualizar el NIF", error);
        }
      );
    }
  }

  toImportNifs() {
    this.router.navigate(['/fenix/nif/import']);
  }

}
