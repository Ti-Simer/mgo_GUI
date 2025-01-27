import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from 'src/app/services/auth.service';
import { ZoneService } from 'src/app/services/poseidon-services/zone.service';
import { TranslateService } from '@ngx-translate/core';
import { LanguageService } from 'src/app/services/language.service';
import { Subscription } from 'rxjs';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-zone-create',
  templateUrl: './zone-create.component.html',
  styleUrls: ['./zone-create.component.scss']
})
export class ZoneCreateComponent {
  private languageSubscription!: Subscription;
  zoneForm: FormGroup;

  constructor(
    private authService: AuthService,
    private router: Router,
    private formBuilder: FormBuilder,
    private toastr: ToastrService,
    private zoneService: ZoneService,
    private translate: TranslateService,
    private languageService: LanguageService,
    public dialogRef: MatDialogRef<ZoneCreateComponent>
  ) {
    translate.addLangs(['en', 'es', 'pt']);
    translate.setDefaultLang(this.languageService.getLanguage());

    this.authService.writeChecker().subscribe(flag => {
      if (!flag) {
        this.toZones();
        toastr.warning('No tienes permisos para crear');
      }
    });

    this.zoneForm = this.formBuilder.group({
      name: [null, Validators.required]
    });

  }

  ngOnInit(): void {

  }

  onSubmit() {
    if (this.zoneForm.valid) {
      this.zoneService.create(this.zoneForm.value).subscribe(
        response => {
          if (response.statusCode == 200) {
            this.toastr.success(`La zona ${response.data.name} se ha creado satisfactoriamente`);
            this.dialogRef.close();
          } else {
            this.toastr.warning('Ha ocurrido un problema al crear la zona');
          }
        }, (error) => {
          console.error('Ha ocurrido un error al crear la zona', error);
        }
      );
    }
  }

  toZones() {
    this.router.navigate(['/poseidon/zone/list']);
  }

}
