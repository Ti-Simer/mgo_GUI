import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { UserService } from 'src/app/services/fenix-services/user.service';

@Component({
  selector: 'app-create-users-fenix',
  templateUrl: './create-users-fenix.component.html',
  styleUrls: ['./create-users-fenix.component.scss']
})
export class CreateUsersFenixComponent {
  signupForm: FormGroup;

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
  }

  ngOnInit(): void {
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
      const userData = this.signupForm.value; // Obtiene los datos del formulario
      this.userService.createUser(userData).subscribe(
        response => {
          console.log('Respuesta del servidor:', response);

          if (response.statusCode === 200) {
            console.log('Usuario registrado exitosamente:', response.message);

            // Muestra una notificación de éxito y redirige al inicio de sesión
            this.toastr.success(response.message, 'Éxito!');
            this.toUsers();
          } else {
            console.error('Error en la respuesta del servidor:', response.message);

            // Muestra una notificación de error
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