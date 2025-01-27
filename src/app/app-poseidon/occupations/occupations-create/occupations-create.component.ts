import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from 'src/app/services/auth.service';
import { OccupationService } from 'src/app/services/poseidon-services/occupation.service';
import { TranslateService } from '@ngx-translate/core';
import { LanguageService } from 'src/app/services/language.service';
import { Subscription } from 'rxjs';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-occupations-create',
  templateUrl: './occupations-create.component.html',
  styleUrls: ['./occupations-create.component.scss']
})
export class OccupationsCreateComponent {
  private languageSubscription!: Subscription;
  occupationsForm: FormGroup;

  constructor(
    private authService: AuthService,
    private formBuilder: FormBuilder,
    private occupationService: OccupationService,
    private router: Router,
    private toastr: ToastrService,
    private translate: TranslateService,
    private languageService: LanguageService,
    public dialogRef: MatDialogRef<OccupationsCreateComponent>
  ) {
    translate.addLangs(['en', 'es', 'pt']);
    translate.setDefaultLang(this.languageService.getLanguage());

    this.authService.writeChecker().subscribe(flag => {
      if (!flag) {
        this.toOccupations();
        toastr.warning('No tienes permisos para crear');
      }
    });

    this.occupationsForm = this.formBuilder.group({
      name: [null, Validators.required]
    });

  }

  ngOnInit(): void {

  }

  onSubmit() {
    if (this.occupationsForm.valid) {
      this.occupationService.create(this.occupationsForm.value).subscribe(
        response => {
          if (response.statusCode == 200) {
            this.toastr.success(`Cargo ${response.data.name} ha sido creado satisfactoriamente`, `Exito!`);
            this.dialogRef.close();
          } else {
            this.toastr.error('Ha ocurrido un problema al crear el Cargo');
          }
        }, (error) => {
          this.toastr.error(`Ha ocurrido un error al crear el Cargo: ${error}`);
        }
      );
    }
  }

  toOccupations() {
    this.router.navigate(['/poseidon/occupation/list']);
  }

}
