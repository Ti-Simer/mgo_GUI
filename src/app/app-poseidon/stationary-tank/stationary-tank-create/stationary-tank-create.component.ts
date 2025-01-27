import { Component, ElementRef, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from 'src/app/services/auth.service';
import { StationaryTankService } from 'src/app/services/poseidon-services/stationary-tank.service';
import { TranslateService } from '@ngx-translate/core';
import { LanguageService } from 'src/app/services/language.service';
import { Subscription } from 'rxjs';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-stationary-tank-create',
  templateUrl: './stationary-tank-create.component.html',
  styleUrls: ['./stationary-tank-create.component.scss']
})
export class StationaryTankCreateComponent {
  private languageSubscription!: Subscription;

  @ViewChild('plateInput') plateInput!: ElementRef;

  stationaryTankForm: FormGroup;

  operators: any;
  selectedOperator: any[] = [];

  constructor(
    private authService: AuthService,
    private stationaryTankService: StationaryTankService,
    private toastr: ToastrService,
    private formBuilder: FormBuilder,
    private router: Router,
    private translate: TranslateService,
    private languageService: LanguageService,
    public dialogRef: MatDialogRef<StationaryTankCreateComponent>
  ) {
    translate.addLangs(['en', 'es', 'pt']);
    translate.setDefaultLang(this.languageService.getLanguage());
    
    this.authService.writeChecker().subscribe(flag => {
      if (!flag) {
        this.toPropaneTrucks();
        toastr.warning('No tienes permisos para crear');
      }
    });
    
    this.stationaryTankForm = this.formBuilder.group({
      serial: [null, Validators.required],
      capacity: [null, Validators.required],
    });

  }

  ngOnInit(): void {
  }

  onSubmit() {
    if (this.stationaryTankForm.valid) {
      this.stationaryTankService.create(this.stationaryTankForm.value).subscribe(
        response => {
          if (response.statusCode == 200) {
            this.toastr.success(`El Tanque estacionario de serial ${response.data.plate} ha sido creado satisfactoriamente`, 'Éxito!');
            this.dialogRef.close()
          } else {
            this.toastr.warning('Ha ocurrido un problema al crear el Tanque estacionario', response.message);
          }
        }, (error) => {
          this.toastr.error(`Ha ocurrido un error al crear el Tanque estacionario`, error);
        }
      );
    }
  }

  toPropaneTrucks() {
    this.router.navigate(['/poseidon/stationary-tank/list']);
  }

}
