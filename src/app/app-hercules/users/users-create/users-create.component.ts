import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { ToastrService } from 'ngx-toastr';
import { Subscription } from 'rxjs';
import { AuthService } from 'src/app/services/auth.service';
import { RolesService } from 'src/app/services/hercules-services/roles.service';
import { UserService } from 'src/app/services/hercules-services/user.service';
import { LanguageService } from 'src/app/services/language.service';

@Component({
  selector: 'app-users-create',
  templateUrl: './users-create.component.html',
  styleUrls: ['./users-create.component.scss']
})
export class UsersCreateComponent {
  private languageSubscription!: Subscription;

  signupForm: FormGroup;
  roles: any[] = [];
  selectedRoleId: any;

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private rolesService: RolesService,
    private userService: UserService,
    private toastr: ToastrService,
    private authService: AuthService,
    private translate: TranslateService,
    private languageService: LanguageService,
    public dialogRef: MatDialogRef<UsersCreateComponent>
  ) {
    translate.addLangs(['en', 'es', 'pt']);
    translate.setDefaultLang(this.languageService.getLanguage());

    this.authService.writeChecker().subscribe(flag => {
      if (!flag) {
        this.toUsers();
        toastr.warning('No tienes permisos para crear');
      }
    });

    this.signupForm = this.formBuilder.group({
      firstName: [null, Validators.required],
      lastName: [null, Validators.required],
      email: ['', Validators.email],
      password: [null, [Validators.required, Validators.minLength(6)]],
      confirmPassword: [null, Validators.required],
      role: [null, Validators.required],
      idNumber: [null, Validators.required],
      confirmIdNumber: [null, Validators.required],
    });
  }

  ngOnInit(): void {

    this.fetchRoles();
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

  onRoleSelectionChange(id: string): void {
    this.signupForm.value.role = id;
  }

  onSubmit() {
    if (this.signupForm.value.password !== this.signupForm.value.confirmPassword) {
      this.signupForm.setErrors({ mismatch: true });
      this.toastr.info('La confirmación de la contraseña no es válida', 'Advertencia!');
    }

    if (this.signupForm.value.idNumber !== this.signupForm.value.confirmIdNumber) {
      this.signupForm.setErrors({ mismatch: true });
      this.toastr.info('El numero de identificación no coincide, por favor verifique', 'Advertencia!');
    }

    if (this.signupForm.valid) {
      const userData = this.signupForm.value; // Obtiene los datos del formulario
      this.userService.create(userData).subscribe(
        response => {
          console.log('Respuesta del servidor:', response);

          if (response.statusCode === 200) {
            console.log('Usuario registrado exitosamente:', response.message);

            // Muestra una notificación de éxito y redirige al inicio de sesión
            this.toastr.success(response.message, 'Éxito!');
            this.dialogRef.close();
          } else {
            console.error('Error en el registro:', response.message);

            // Muestra una notificación de error
            this.toastr.warning('Error en el registro', response.message);
          }
        },
        error => {
          console.error('Error al registrar usuario:', error);
        }
      );
    }
  }

  toUsers() {
    this.router.navigate(['/poseidon/usuarios/list']);
  }
}
