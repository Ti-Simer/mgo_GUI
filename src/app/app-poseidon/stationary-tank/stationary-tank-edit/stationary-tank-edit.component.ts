import { Component, Input } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from 'src/app/services/auth.service';
import { StationaryTankService } from 'src/app/services/poseidon-services/stationary-tank.service';
import { TranslateService } from '@ngx-translate/core';
import { LanguageService } from 'src/app/services/language.service';
import { Subscription } from 'rxjs';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-stationary-tank-edit',
  templateUrl: './stationary-tank-edit.component.html',
  styleUrls: ['./stationary-tank-edit.component.scss']
})
export class StationaryTankEditComponent {
  private languageSubscription!: Subscription;
  @Input() stationaryTankId: any;

  updateForm: FormGroup;

  stationaryTank: any;

  constructor(
    private route: ActivatedRoute,
    private stationaryTankService: StationaryTankService,
    private formBuilder: FormBuilder,
    private toastr: ToastrService,
    private authService: AuthService,
    private router: Router,
    private translate: TranslateService,
    private languageService: LanguageService,
    public dialogRef: MatDialogRef<StationaryTankEditComponent>
  ) {
    translate.addLangs(['en', 'es', 'pt']);
    translate.setDefaultLang(this.languageService.getLanguage());

    this.authService.editChecker().subscribe(flag => {
      if (!flag) {
        this.toPropaneTrucks();
        toastr.warning('No tienes permisos para editar');
      }
    });

    this.updateForm = this.formBuilder.group({
      serial: [null, Validators.required],
      capacity: [null, Validators.required],
    });
  }

  ngOnInit(): void {
    this.getPropaneTruck();

  }

  getPropaneTruck() {
    this.stationaryTankService.getById(this.stationaryTankId).subscribe(
      response => {
        if (response.statusCode == 200) {
          this.stationaryTank = response.data;

          this.updateForm.patchValue({
            serial: this.stationaryTank.serial,
            capacity: this.stationaryTank.capacity,
          });

        } else {
          this.toastr.warning(`Ha ocurrido un problema al consultar el Auto Tanque`, response.message);
        }
      }, (error) => {
        this.toastr.error(`Ha ocurrido un error al consultar el Auto Tanque ${error}`);
      }
    );
  }

  onSubmit() {
    if (this.updateForm.valid) {
      this.stationaryTankService.update(this.stationaryTankId, this.updateForm.value).subscribe(
        response => {
          if (response.statusCode == 200) {
            this.toastr.success(`El Auto Tanque ${response.data.plate} ha sido actualizado satisfactoriamente`, 'Exito!')
            this.dialogRef.close();
          } else {
            this.toastr.warning('Ha ocurrido un problema al editar el Auto Tanque', response.message);
          }
        }, (error) => {
          this.toastr.error(`Ha ocurrido un problema al editar el Auto Tanque ${error}`);
        }
      );
    }
  }

  toPropaneTrucks() {
    this.router.navigate(['/poseidon/stationary-tank/list']);
  }

}
