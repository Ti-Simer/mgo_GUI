import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from 'src/app/services/auth.service';
import { PermissionsService } from 'src/app/services/poseidon-services/permissions.service';
import { TranslateService } from '@ngx-translate/core';
import { LanguageService } from 'src/app/services/language.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-permissions-create',
  templateUrl: './permissions-create.component.html',
  styleUrls: ['./permissions-create.component.scss']
})
export class PermissionsCreateComponent {
  private languageSubscription!: Subscription;

  permissionForm: FormGroup;

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private toastr: ToastrService,
    private permissionsService: PermissionsService,
    private authService: AuthService,
    private translate: TranslateService,
    private languageService: LanguageService
  ) {
    translate.addLangs(['en', 'es', 'pt']);
    translate.setDefaultLang(this.languageService.getLanguage());

    this.authService.writeChecker().subscribe(flag => {
      if (!flag) {
        this.toPermissions();
        toastr.warning('No tienes permisos para crear');
      }
    });

    this.permissionForm = this.formBuilder.group({
      name: [null, [Validators.required]],
      accessCode: [null, [Validators.required]]
    });

  }

  ngOnInit(): void {

  }

  onSubmit() {
    if (this.permissionForm.valid) {
      const roleData = this.permissionForm.value;
      this.permissionsService.create(roleData).subscribe(
        response => {
          if (response.statusCode === 200) {
            console.log('Permiso registrado:', response.data);
            // Realiza acciones adicionales después del registro exitoso

            // Muestra una notificación de éxito
            this.toastr.success('Permiso registrado exitosamente', 'Éxito');
            this.toPermissions();
          } else {
            console.error('Error en el registro de permiso:', response.message);

            // Muestra una notificación de error
            this.toastr.error('Error en el registro de permiso', response.message);
          }
        },
        error => {
          console.error('Error en el registro de permiso:', error);

          // Muestra una notificación de error
          this.toastr.error('Error en el registro de permiso', 'Ha ocurrido un error');
        }
      );
    }
  }

  toPermissions() {
    this.router.navigate(['/poseidon/permissions/list']);
  }
}
