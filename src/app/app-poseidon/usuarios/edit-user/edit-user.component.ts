import { Component, Input } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from 'src/app/services/auth.service';
import { RolesService } from 'src/app/services/poseidon-services/roles.service';
import { UsuarioService } from 'src/app/services/poseidon-services/usuario.service';
import { TranslateService } from '@ngx-translate/core';
import { LanguageService } from 'src/app/services/language.service';
import { MatDialogRef } from '@angular/material/dialog';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-edit-user',
  templateUrl: './edit-user.component.html',
  styleUrls: ['./edit-user.component.scss']
})
export class EditUserComponent {
  private languageSubscription!: Subscription;
  @Input() userId!: string;

  updateForm: FormGroup;
  //userId: any;
  user: any;
  roles: any[] = [];

  constructor(
    private route: ActivatedRoute,
    private usuarioService: UsuarioService,
    private rolesService: RolesService,
    private formBuilder: FormBuilder,
    private toastr: ToastrService,
    private router: Router,
    private authService: AuthService,
    private translate: TranslateService,
    private languageService: LanguageService,
    public dialogRef: MatDialogRef<EditUserComponent>
  ) {
    translate.addLangs(['en', 'es', 'pt']);
    translate.setDefaultLang(this.languageService.getLanguage());

    this.updateForm = this.formBuilder.group({
      firstName: [null, Validators.required],
      lastName: [null, Validators.required],
      email: [null, Validators.email],
      role: [null, Validators.required],
      idNumber: [null, Validators.required],
      confirmIdNumber: [null, Validators.required],
      password: [null, [Validators.required, Validators.minLength(6)]],
      confirmPassword: [null, Validators.required],
    });

    this.authService.editChecker().subscribe(flag => {
      if (!flag) {
        this.toUsers();
        toastr.warning('No tienes permisos para editar');
      }
    });
  }

  ngOnInit(): void {
    this.fetchRoles();
    if (this.userId) {
      this.getUserById();
    }
  }

  fetchRoles(): void {
    this.rolesService.getAll().subscribe(
      response => {
        if (response.statusCode === 200) {
          this.roles = response.data;
        } else {
          console.error('Error al obtener roles:', response.message);
        }
      },
      error => {
        console.error('Error al obtener roles:', error);
      }
    );
  }

  getUserById() {
    this.usuarioService.getUserById(this.userId).subscribe(
      (response) => {
        if (response.statusCode == 200) {
          this.user = response.data;

          this.updateForm.patchValue({
            firstName: this.user.firstName,
            lastName: this.user.lastName,
            email: this.user.email,
            role: this.user.role.id,
            idNumber: this.user.idNumber,
          });

        } else {
          this.toastr.error('Error al obtener el usuario por ID', response.message);
        }
      },
      (error) => {
        console.error('Error al obtener el usuario por ID:', error);
      }
    );
  }

  onSubmit(): void {
    if (this.updateForm.value.idNumber !== this.updateForm.value.confirmIdNumber) {
      this.updateForm.setErrors({ mismatch: true });
      this.toastr.info('El numero de identificación no coincide, por favor verifique', 'Advertencia!');
    }

    if (this.updateForm.valid) {
      this.usuarioService.updateUser(this.userId, this.updateForm.value).subscribe(
        (response) => {
          if (response.statusCode === 200) {
            this.toastr.success(response.message, 'Éxito!');
            this.dialogRef.close(); // Cerrar el cuadro de diálogo
          } else {
            console.error('Error en la respuesta del servidor:', response.message);

            // Muestra una notificación de error
            this.toastr.error('Error en el registro', response.message);
          }
        },
        (error) => {
          console.error('Error al actualizar el usuario:', error);
        }
      );
    }
  }

  toUsers() {
    this.router.navigate(['/poseidon/usuarios/list']);
  }

}
