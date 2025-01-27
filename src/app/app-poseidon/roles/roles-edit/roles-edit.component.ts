import { Component, Input } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from 'src/app/services/auth.service';
import { PermissionsService } from 'src/app/services/poseidon-services/permissions.service';
import { RolesService } from 'src/app/services/poseidon-services/roles.service';
import { TranslateService } from '@ngx-translate/core';
import { LanguageService } from 'src/app/services/language.service';
import { Subscription } from 'rxjs';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-roles-edit',
  templateUrl: './roles-edit.component.html',
  styleUrls: ['./roles-edit.component.scss']
})
export class RolesEditComponent {
  private languageSubscription!: Subscription;
  @Input() roleId!: string;

  updateForm: FormGroup;
  role: any;
  permissions: any[] = [];
  selectedPermissions: string[] = [];
  previousSelectedPermissions: any[] = [];

  constructor(
    private route: ActivatedRoute,
    private rolesService: RolesService,
    private permissionsService: PermissionsService,
    private formBuilder: FormBuilder,
    private router: Router,
    private toastr: ToastrService,
    private authService: AuthService,
    private translate: TranslateService,
    private languageService: LanguageService,
    public dialogRef: MatDialogRef<RolesEditComponent>
  ) {
    translate.addLangs(['en', 'es', 'pt']);
    translate.setDefaultLang(this.languageService.getLanguage());

    this.updateForm = this.formBuilder.group({
      name: [null, Validators.required],
      permissions: [null, Validators.required]
    });
    
    this.authService.editChecker().subscribe(flag => {
      if (!flag) {
        this.toRoles();
        toastr.warning('No tienes permisos para editar');
      }
    });
  }

  ngOnInit(): void {
    if (this.roleId) {
      this.getRolById();
    }
    this.fetchPermissions();
  }

  getRolById() {
    this.rolesService.getRoleById(this.roleId).subscribe(
      response => {
        if (response.statusCode == 200) {
          this.role = response.data;
          this.patchUpdateForm(this.role);

        } else {
          this.toastr.warning(`Ha ocurrido un problema al consultar el Auto Tanque`, response.message);
        }
      }, (error) => {
        this.toastr.error(`Ha ocurrido un error al consultar el Auto Tanque ${error}`);
      }
    );
  }

  patchUpdateForm(data: any) {
    this.updateForm.patchValue({
      name: this.role.name,
      permissions: this.role.permissions
    });

    this.fetchPermissions();

    if (data.permissions.length > 0) {
      for (let i = 0; i < data.permissions.length; i++) {
        this.permissions.push(data.permissions[i]);
      }
    }

    console.log(this.updateForm.value);
    this.selectedPermissions = this.updateForm.value.permissions.map((permissions: { id: any; }) => permissions.id);
    this.previousSelectedPermissions = [...this.selectedPermissions];
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

  onPermissionChange(role: any) {
    const index = this.selectedPermissions.indexOf(role.id);

    if (index === -1) {
      // Si no se encuentra en la lista, agrégalo
      this.selectedPermissions.push(role.id);
    } else {
      // Si ya está en la lista, quítalo
      this.selectedPermissions.splice(index, 1);
    }

    this.updateForm.patchValue({ permissions: this.selectedPermissions });

    if (this.selectedPermissions.length > 0) {
      this.updateForm.get('permissions')?.setValidators(Validators.required);
      this.updateForm.get('permissions')?.updateValueAndValidity();
    } else {
      this.updateForm.get('permissions')?.clearValidators();
      this.updateForm.get('permissions')?.updateValueAndValidity();
    }
  }

  updateRole() {
    if (this.updateForm.valid) {
      this.rolesService.updateRole(this.roleId, this.updateForm.value).subscribe(
        (response) => {
          if (response.statusCode === 200) {
            this.toastr.success(response.message, 'Éxito!');
            this.dialogRef.close();
          } else {
            console.error('Error en la respuesta del servidor:', response.message);

            // Muestra una notificación de error
            this.toastr.error('Error en el registro', response.message);
          }
        },
        (error) => {
          console.error('Error al actualizar el rol:', error);
        }
      );
    }
  }

  toRoles() {
    this.router.navigate(['/poseidon/roles/list']);
  }
}
