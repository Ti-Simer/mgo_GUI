import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from 'src/app/services/auth.service';
import { PermissionsService } from 'src/app/services/poseidon-services/permissions.service';
import { TranslateService } from '@ngx-translate/core';
import { LanguageService } from 'src/app/services/language.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-permissions-edit',
  templateUrl: './permissions-edit.component.html',
  styleUrls: ['./permissions-edit.component.scss']
})
export class PermissionsEditComponent {
  private languageSubscription!: Subscription;

  updateForm: FormGroup;
  permissionId: any;
  permission: any;

  constructor(
    private route: ActivatedRoute,
    private permissionsService: PermissionsService,
    private formBuilder: FormBuilder,
    private router: Router,
    private toastr: ToastrService,
    private authService: AuthService,
    private translate: TranslateService,
    private languageService: LanguageService
  ) {
    translate.addLangs(['en', 'es', 'pt']);
    translate.setDefaultLang(this.languageService.getLanguage());

    this.updateForm = this.formBuilder.group({
      name: [null, Validators.required],
      accessCode: [null, Validators.required]
    });

    this.authService.editChecker().subscribe(flag => {
      if (!flag) {
        this.toPermissions();
        toastr.warning('No tienes permisos para editar');
      }
    });
  }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.permissionId = params['id'];
    });
    this.getPermissionById();

  }


  getPermissionById() {
    this.permissionsService.getPermissionById(this.permissionId).subscribe(
      (response) => {
        this.permission = response.data;
        this.updateForm.patchValue({
          name: this.permission.name,
          accessCode: this.permission.accessCode
        });
      },
      (error) => {
        console.error('Error al obtener el permiso por ID:', error);
      }
    );
  }


  updatePermission() {
    if (this.updateForm.valid) {
      this.permissionsService.updatePermission(this.permissionId, this.updateForm.value).subscribe(
        (response) => {
          if (response.statusCode === 200) {
            this.toastr.success(response.message, 'Éxito!');
            this.router.navigate(['/permissions/list']);
          } else {
            console.error('Error en la respuesta del servidor:', response.message);

            // Muestra una notificación de error
            this.toastr.error('Error en el registro', response.message);
          }
        },
        (error) => {
          console.error('Error al actualizar el permiso:', error);
        }
      );
    }
  }

  toPermissions() {
    this.router.navigate(['/poseidon/permissions/list']);
  }
}
