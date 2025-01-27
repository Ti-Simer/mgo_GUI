import { Component, Input } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from 'src/app/services/auth.service';
import { OccupationService } from 'src/app/services/poseidon-services/occupation.service';
import { TranslateService } from '@ngx-translate/core';
import { LanguageService } from 'src/app/services/language.service';
import { Subscription } from 'rxjs';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-occupations-edit',
  templateUrl: './occupations-edit.component.html',
  styleUrls: ['./occupations-edit.component.scss']
})
export class OccupationsEditComponent {
  private languageSubscription!: Subscription;
  @Input() occupationId: any;

  updateForm: FormGroup;
  occupation: any

  constructor(
    private authService: AuthService,
    private formBuilder: FormBuilder,
    private occupationService: OccupationService,
    private route: ActivatedRoute,
    private router: Router,
    private toastr: ToastrService,
    private translate: TranslateService,
    private languageService: LanguageService,
    public dialogRef: MatDialogRef<OccupationsEditComponent>

  ) {
    translate.addLangs(['en', 'es', 'pt']);
    translate.setDefaultLang(this.languageService.getLanguage());

    this.authService.editChecker().subscribe(flag => {
      if (!flag) {
        this.toOccupations();
        toastr.warning('No tienes permisos para editar');
      }
    });

    this.updateForm = this.formBuilder.group({
      name: [null, Validators.required]
    });
  }

  ngOnInit(): void {

    this.getOccupation();
  }

  getOccupation() {
    this.occupationService.getById(this.occupationId).subscribe(
      response => {
        if (response.statusCode == 200) {
          this.occupation = response.data;

          this.updateForm.patchValue({
            name: this.occupation.name
          });
        } else {
          this.toastr.error('Ha ocurrido un problema al consultar el cargo');
        }
      }, (error) => {
        this.toastr.error(`Ha ocurrido un error al consultar el cargo: ${error}`);
      }
    );
  }

  onSubmit() {
    if (this.updateForm.valid) {
      this.occupationService.update(this.occupationId, this.updateForm.value).subscribe(
        response => {
          if (response.statusCode == 200) {
            this.toastr.success(`El cargo ${response.data.name} se ha actualizado satisfactoriamente`, `Exito!`);
            this.dialogRef.close();
          } else {
            this.toastr.error(`Ha ocurrido un problema al actualizar el cargo`);
          }
        }, (error) => {
          this.toastr.error(`Ha ocurrido un error al actualizar el cargo: ${error}`);
        }
      );
    }
  }

  toOccupations() {
    this.router.navigate(['/poseidon/occupation/list']);
  }
}
