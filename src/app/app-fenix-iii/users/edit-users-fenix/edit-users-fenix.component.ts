import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from 'src/app/services/auth.service';
import { UserService } from 'src/app/services/fenix-services/user.service';

@Component({
  selector: 'app-edit-users-fenix',
  templateUrl: './edit-users-fenix.component.html',
  styleUrls: ['./edit-users-fenix.component.scss']
})
export class EditUsersFenixComponent {
  signupForm: FormGroup;
  userId: any;

  tipos_usuario: any = [
    { name: "Administrador Planta", value: 1 },
    { name: "Administrador General", value: 3 },
    { name: "Operario", value: 2 },
  ]

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private userService: UserService,
    private toastr: ToastrService,
    private route: ActivatedRoute,
    private authService: AuthService
  ) {
    this.signupForm = this.formBuilder.group({
      id_tipo_usuario: [Validators.required],
      usuario: [null, Validators.required],
      password: [null, Validators.required],
      confirmPassword: [null, Validators.required],
      nombre: [null, Validators.required],
      apellido: [null, Validators.required],
      identificacion: [null, Validators.required],
      confirmIdentificacion: [null, Validators.required],
    });

    this.route.params.subscribe(params => {
      this.userId = this.authService.decryptData(params['id']);
    });
  }

  ngOnInit(): void {
    this.findUserById();
  }

  findUserById() {
    this.userService.findUserById(this.userId).subscribe(
      response => {
        console.log(response);

        if (response.statusCode == 200) {
          this.signupForm.patchValue({
            id_tipo_usuario: response.data.id_tipo_usuario,
            usuario: response.data.usuario,
            nombre: response.data.nombre,
            apellido: response.data.apellido,
            identificacion: response.data.identificacion,
          });
        }
      }, (error) => {

      }
    );
  }

  onSubmit() {
    if (this.signupForm.value.password !== this.signupForm.value.confirmPassword) {
      this.signupForm.setErrors({ mismatch: true });
      this.toastr.info('La confirmación de la contraseña no es válida', 'Advertencia!');
    }

    if (this.signupForm.value.identificacion !== this.signupForm.value.confirmIdentificacion) {
      this.signupForm.setErrors({ mismatch: true });
      this.toastr.info('La identificación no coincide, por favor verifique', 'Advertencia!');
    }

    if (this.signupForm.valid) {
      console.log('Formulario válido:', this.signupForm.value);

      const userData = this.signupForm.value; // Obtiene los datos del formulario
      this.userService.updateUser(this.userId, userData).subscribe(
        response => {
          console.log('Respuesta del servidor:', response);

          if (response.statusCode === 200) {
            console.log('Usuario actualizado exitosamente:', response.data);

            //Muestra una notificación de éxito y redirige al inicio de sesión
            this.toastr.success(response.message, 'Éxito!');
            this.toUsers();
          } else {
            console.error('Error en la respuesta del servidor:', response.message);

            //Muestra una notificación de error
            this.toastr.error('Error en el registro', response.message);
          }
        },
        error => {
          console.error('Error al registrar usuario:', error);
        }
      );
    }
  }

  toUsers() {
    this.router.navigate(['/fenix/users/list-user-fenix']);
  }
}
