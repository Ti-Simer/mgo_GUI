import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from 'src/app/services/auth.service';
import { PermissionsService } from 'src/app/services/poseidon-services/permissions.service';
import { RolesService } from 'src/app/services/poseidon-services/roles.service';
import { TranslateService } from '@ngx-translate/core';
import { LanguageService } from 'src/app/services/language.service';
import { Subscription } from 'rxjs';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-roles-create',
  templateUrl: './roles-create.component.html',
  styleUrls: ['./roles-create.component.scss']
})
export class RolesCreateComponent {
  private languageSubscription!: Subscription;

  roleForm: FormGroup;
  permissions: any;
  selectedPermissions: string[] = [];

  constructor(
    private formBuilder: FormBuilder,
    private rolesService: RolesService,
    private permissionsService: PermissionsService,
    private router: Router,
    private toastr: ToastrService,
    private authService: AuthService,
    private translate: TranslateService,
    private languageService: LanguageService,
    public dialogRef: MatDialogRef<RolesCreateComponent>

  ) {
    translate.addLangs(['en', 'es', 'pt']);
    translate.setDefaultLang(this.languageService.getLanguage());

    this.authService.writeChecker().subscribe(flag => {
      if (!flag) {
        this.toRoles();
        toastr.warning('No tienes permisos para crear');
      }
    });

    this.roleForm = this.formBuilder.group({
      name: [null, Validators.required],
      permissions: [null, Validators.required]
    });

  }

  ngOnInit(): void {

    this.fetchPermissions();
  }

  fetchPermissions(): void {
    this.permissionsService.getAll().subscribe(
      response => {
        if (response.statusCode === 200) {
          this.permissions = response.data;
        } else {
          console.error('Error al obtener permisos:', response.message);
        }
      },
      error => {
        console.error('Error al obtener permisos:', error);
      }
    );
  }

  onPermissionChange(permissionId: string) {
    const index = this.selectedPermissions.indexOf(permissionId);
    if (index === -1) {
      this.selectedPermissions.push(permissionId);
    } else {
      this.selectedPermissions.splice(index, 1);
    }

    // Actualizar el valor del campo 'permissions' en el formulario
    this.roleForm.patchValue({ permissions: this.selectedPermissions });

    // Marcar el formulario como válido si se han seleccionado permisos
    if (this.selectedPermissions.length > 0) {
      this.roleForm.get('permissions')?.setValidators(Validators.required);
      this.roleForm.get('permissions')?.updateValueAndValidity();
    } else {
      this.roleForm.get('permissions')?.clearValidators();
      this.roleForm.get('permissions')?.updateValueAndValidity();
    }
  }


  onSubmit() {
    if (this.roleForm.valid) {
      const roleData = this.roleForm.value;
      this.rolesService.create(roleData).subscribe(
        response => {
          if (response.statusCode === 200) {

            // Muestra una notificación de éxito
            this.toastr.success('Rol registrado exitosamente', 'Éxito');
            this.dialogRef.close();
          } else {
            console.error('Error en el registro de rol:', response.message);

            // Muestra una notificación de error
            this.toastr.error('Error en el registro de rol', response.message);
          }
        },
        error => {
          console.error('Error en el registro de rol:', error);

          // Muestra una notificación de error
          this.toastr.error('Error en el registro de rol', 'Ha ocurrido un error');
        }
      );
    }
  }

  toRoles() {
    this.router.navigate(['/poseidon/roles/list']);
  }

}
