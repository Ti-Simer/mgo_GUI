import { Component, Input } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from 'src/app/services/auth.service';
import { ZoneService } from 'src/app/services/poseidon-services/zone.service';
import { TranslateService } from '@ngx-translate/core';
import { LanguageService } from 'src/app/services/language.service';
import { Subscription } from 'rxjs';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-zone-edit',
  templateUrl: './zone-edit.component.html',
  styleUrls: ['./zone-edit.component.scss']
})
export class ZoneEditComponent {
  private languageSubscription!: Subscription;
  @Input() zoneId!: any;

  updateForm: FormGroup;

  constructor(
    private authService: AuthService,
    private route: ActivatedRoute,
    private formBuilder: FormBuilder,
    private router: Router,
    private toastr: ToastrService,
    private zoneService: ZoneService,
    private translate: TranslateService,
    private languageService: LanguageService,
    public dialogRef: MatDialogRef<ZoneEditComponent>
  ) {
    translate.addLangs(['en', 'es', 'pt']);
    translate.setDefaultLang(this.languageService.getLanguage());

    this.authService.editChecker().subscribe(flag => {
      if (!flag) {
        this.toZones();
        toastr.warning('No tienes permisos para editar');
      }
    });

    this.updateForm = this.formBuilder.group({
      name: [null, Validators.required]
    });
  }

  ngOnInit(): void {
    this.getZone();
  }

  getZone() {
    this.zoneService.getById(this.zoneId).subscribe(
      response => {
        if (response.statusCode == 200) {
          this.updateForm.patchValue({
            name: response.data.name
          });
        } else {
          this.toastr.info('Ha ocurrido un problema al consultar la zona');
        }
      }, (error) => {
        this.toastr.error('Ha ocurrido un error al consultar la zona: ', error);
      }
    );
  }

  updateZone() {
    if (this.updateForm.valid) {
      this.zoneService.update(this.zoneId, this.updateForm.value).subscribe(
        response => {
          if (response.statusCode == 200) {
            this.toastr.success(`La zona ${response.data.name} se actualizo satisfactoriamente`);
            this.dialogRef.close();
          } else {
            this.toastr.error('Ha ocurrido un problema al actualizar la zona');
          }
        }, (error) => {
          this.toastr.error('Ha ocurrido un error al actualizar la zona', error)
        }
      );
    }
  }

  toZones() {
    this.router.navigate(['/poseidon/zone/list']);
  }
}
